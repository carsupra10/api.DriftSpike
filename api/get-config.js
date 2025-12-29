import { getSupabaseClient, cacheGet, cacheSet } from '../lib/connection-manager.js';

export default async function handler(req, res) {
  // Set performance headers
  res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.headers['x-api-key'];
  const startTime = Date.now();

  try {
    // Fast validation
    if (!userId || typeof userId !== 'string' || userId.length !== 36) {
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // Check cache first
    const cacheKey = `config_${userId}`;
    let cachedConfig = cacheGet(cacheKey);
    
    if (cachedConfig) {
      return res.status(200).json({
        ...cachedConfig,
        performance: {
          responseTime: `${Date.now() - startTime}ms`,
          cached: true
        }
      });
    }

    // Fetch from database
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, from_name, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      user: {
        id: user.id,
        email: user.email,
        plan_type: user.plan_type,
        emails_sent_this_month: user.emails_sent_this_month,
        created_at: user.created_at
      },
      smtp_config: {
        smtp_host: user.smtp_host,
        smtp_port: user.smtp_port,
        smtp_secure: user.smtp_secure,
        smtp_user: user.smtp_user,
        from_name: user.from_name
      },
      limits: {
        monthly_emails: user.plan_type === 'premium' ? 'unlimited' : 3000,
        remaining_emails: user.plan_type === 'premium' ? 'unlimited' : Math.max(0, 3000 - user.emails_sent_this_month),
        requests_per_hour: user.plan_type === 'premium' ? 1000 : 100
      }
    };

    // Cache the response for 5 minutes
    cacheSet(cacheKey, response, 300);

    return res.status(200).json({
      ...response,
      performance: {
        responseTime: `${Date.now() - startTime}ms`,
        cached: false
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      performance: {
        responseTime: `${Date.now() - startTime}ms`
      }
    });
  }
}