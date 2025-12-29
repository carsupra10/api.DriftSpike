import { getSupabaseClient } from '../lib/connection-manager.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabase = getSupabaseClient();
    
    // Get user statistics
    const { data: userStats } = await supabase
      .from('users')
      .select('plan_type, emails_sent_this_month, total_emails_sent')
      .order('total_emails_sent', { ascending: false });

    // Get recent email activity
    const { data: recentActivity } = await supabase
      .from('email_logs')
      .select('status, sent_at, response_time')
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('sent_at', { ascending: false })
      .limit(1000);

    // Calculate metrics
    const totalUsers = userStats?.length || 0;
    const premiumUsers = userStats?.filter(u => u.plan_type === 'premium').length || 0;
    const freeUsers = totalUsers - premiumUsers;
    const totalEmailsToday = recentActivity?.length || 0;
    const avgResponseTime = recentActivity?.reduce((acc, log) => acc + (log.response_time || 0), 0) / totalEmailsToday || 0;
    const successRate = recentActivity?.filter(log => log.status === 'sent').length / totalEmailsToday * 100 || 100;

    const metrics = {
      timestamp: new Date().toISOString(),
      users: {
        total: totalUsers,
        premium: premiumUsers,
        free: freeUsers,
        premiumPercentage: totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(2) : 0
      },
      emails: {
        last24Hours: totalEmailsToday,
        avgResponseTime: `${Math.round(avgResponseTime)}ms`,
        successRate: `${successRate.toFixed(2)}%`,
        totalSent: userStats?.reduce((acc, user) => acc + (user.total_emails_sent || 0), 0) || 0
      },
      performance: {
        avgResponseTime: `${Math.round(avgResponseTime)}ms`,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      },
      topUsers: userStats?.slice(0, 10).map(user => ({
        plan: user.plan_type,
        monthlyEmails: user.emails_sent_this_month,
        totalEmails: user.total_emails_sent
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