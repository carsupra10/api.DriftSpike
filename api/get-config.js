import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Only GET is supported.' });
  }

  try {
    // Get user ID from API key header
    const userId = req.headers['x-api-key'];
    if (!userId) {
      return res.status(401).json({ error: 'Missing x-api-key header (user ID required)' });
    }

    // Get user's SMTP configuration
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, from_name, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found with provided API key' });
    }

    // Return user info and SMTP config (without password for security)
    return res.status(200).json({ 
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
        // smtp_pass is intentionally excluded for security
      }
    });

  } catch (error) {
    console.error('SMTP config API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}