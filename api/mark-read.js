import { getFirestoreUser, cacheGet } from '../lib/connection-manager.js';
import { getImapConnection, connectImap, markAsRead, clearMessageCache } from '../lib/imap-manager.js';
import { checkRateLimit, releaseRequest } from '../lib/rate-limiter.js';
import { transformFirebaseUser } from '../lib/firebase-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.headers['x-api-key'];
  const startTime = Date.now();

  try {
    if (!userId) {
      return res.status(401).json({ error: 'Missing API key' });
    }

    const { messageId } = req.body;
    if (!messageId) {
      return res.status(400).json({ error: 'Missing messageId' });
    }

    // Get user data
    const cacheKey = `user_${userId}`;
    let user = cacheGet(cacheKey);
    
    if (!user) {
      const firebaseUser = await getFirestoreUser(userId);

      if (!firebaseUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      user = transformFirebaseUser(firebaseUser);
    }

    // Rate limiting
    const rateCheck = checkRateLimit(userId, user.plan_type);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        error: rateCheck.error,
        retryAfter: rateCheck.retryAfter
      });
    }

    // Get IMAP connection
    const imap = getImapConnection({
      imap_host: user.imap_host,
      imap_port: user.imap_port,
      imap_secure: user.imap_secure,
      imap_user: user.imap_user,
      imap_pass: user.imap_pass
    });

    await connectImap(imap);
    await markAsRead(imap, messageId);

    // Clear message cache
    clearMessageCache(`messages_${userId}_INBOX_*`);

    releaseRequest(userId);

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      messageId: messageId,
      performance: {
        responseTime: `${Date.now() - startTime}ms`
      }
    });

  } catch (error) {
    releaseRequest(userId);
    
    return res.status(500).json({
      error: 'Failed to mark message as read',
      details: error.message
    });
  }
}