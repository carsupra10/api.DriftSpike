import { firestore } from '../lib/connection-manager.js';
import { collection, getDocs, query, where, orderBy, limit as firestoreLimit } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get user statistics
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const userStats = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get recent email activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const emailLogsRef = collection(firestore, 'email_logs');
    const emailQuery = query(
      emailLogsRef,
      where('sent_at', '>=', yesterday),
      orderBy('sent_at', 'desc'),
      firestoreLimit(1000)
    );
    
    let recentActivity = [];
    try {
      const emailLogsSnapshot = await getDocs(emailQuery);
      recentActivity = emailLogsSnapshot.docs.map(doc => doc.data());
    } catch (err) {
      // email_logs collection might not exist yet
      console.log('No email logs found:', err.message);
    }

    // Calculate metrics
    const totalUsers = userStats?.length || 0;
    const productionUsers = userStats?.filter(u => u.planType === 'production').length || 0;
    const premiumUsers = userStats?.filter(u => u.planType === 'premium').length || 0;
    const starterUsers = totalUsers - productionUsers - premiumUsers;
    const totalEmailsToday = recentActivity?.length || 0;
    const avgResponseTime = recentActivity?.reduce((acc, log) => acc + (log.response_time || 0), 0) / totalEmailsToday || 0;
    const successRate = recentActivity?.filter(log => log.status === 'sent').length / totalEmailsToday * 100 || 100;

    const metrics = {
      timestamp: new Date().toISOString(),
      users: {
        total: totalUsers,
        production: productionUsers,
        premium: premiumUsers,
        starter: starterUsers,
        productionPercentage: totalUsers > 0 ? ((productionUsers + premiumUsers) / totalUsers * 100).toFixed(2) : 0
      },
      emails: {
        last24Hours: totalEmailsToday,
        avgResponseTime: `${Math.round(avgResponseTime)}ms`,
        successRate: `${successRate.toFixed(2)}%`,
        totalSent: userStats?.reduce((acc, user) => acc + (user.totalEmailsSent || 0), 0) || 0
      },
      performance: {
        avgResponseTime: `${Math.round(avgResponseTime)}ms`,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      },
      topUsers: userStats
        ?.sort((a, b) => (b.totalEmailsSent || 0) - (a.totalEmailsSent || 0))
        ?.slice(0, 10)
        ?.map(user => ({
          plan: user.planType,
          monthlyEmails: user.emailsSentThisMonth,
          totalEmails: user.totalEmailsSent
        })) || []
    };

    res.setHeader('Cache-Control', 'private, max-age=60');
    return res.status(200).json(metrics);

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch metrics',
      details: error.message
    });
  }
}