import { getFirestoreUser, cacheGet, cacheSet } from '../lib/connection-manager.js';
import { getImapConnection, connectImap, fetchMessages, getCachedMessages, setCachedMessages } from '../lib/imap-manager.js';
import { checkRateLimit, releaseRequest } from '../lib/rate-limiter.js';
import { transformFirebaseUser } from '../lib/firebase-utils.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.headers['x-api-key'];
  const startTime = Date.now();

  try {
    if (!userId || typeof userId !== 'string' || userId.length !== 36) {
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // Get query parameters
    const { limit = 50, unreadOnly = 'false', mailbox = 'INBOX' } = req.query;

    // Check cache first
    const cacheKey = `user_${userId}`;
    let user = cacheGet(cacheKey);
    
    if (!user) {
      const firebaseUser = await getFirestoreUser(userId);

      if (!firebaseUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      user = transformFirebaseUser(firebaseUser);
      cacheSet(cacheKey, user, 300);
    }

    // Check if user has IMAP configured
    if (!user.imap_host || !user.imap_user || !user.imap_pass) {
      return res.status(400).json({ 
        error: 'IMAP not configured for this user. Please configure IMAP settings first.' 
      });
    }

    // Rate limiting
    const rateCheck = checkRateLimit(userId, user.plan_type);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        error: rateCheck.error,
        retryAfter: rateCheck.retryAfter
      });
    }

    // Check message cache
    const messageCacheKey = `messages_${userId}_${mailbox}_${limit}_${unreadOnly}`;
    let messages = getCachedMessages(messageCacheKey);

    if (!messages) {
      // Get IMAP connection
      const imap = getImapConnection({
        imap_host: user.imap_host,
        imap_port: user.imap_port,
        imap_secure: user.imap_secure,
        imap_user: user.imap_user,
        imap_pass: user.imap_pass
      });

      // Connect and fetch messages
      await connectImap(imap);
      
      messages = await fetchMessages(imap, {
        mailbox,
        limit: parseInt(limit),
        unreadOnly: unreadOnly === 'true'
      });

      // Cache messages for 5 minutes
      setCachedMessages(messageCacheKey, messages, 300);
    }

    releaseRequest(userId);

    return res.status(200).json({
      success: true,
      messages: messages,
      count: messages.length,
      mailbox: mailbox,
      performance: {
        responseTime: `${Date.now() - startTime}ms`,
        cached: !!getCachedMessages(messageCacheKey)
      }
    });

  } catch (error) {
    releaseRequest(userId);
    
    return res.status(500).json({
      error: 'Failed to fetch messages',
      details: error.message,
      performance: {
        responseTime: `${Date.now() - startTime}ms`
      }
    });
  }
}