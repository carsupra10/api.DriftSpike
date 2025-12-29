import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('Environment check:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        supabase_url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
        supabase_key: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Test connection by counting users
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (error) {
      return res.status(500).json({ 
        error: 'Supabase query failed',
        details: error.message,
        supabase_url: process.env.SUPABASE_URL,
        supabase_key_length: process.env.SUPABASE_ANON_KEY?.length
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Supabase connection working',
      user_count: count,
      users: data,
      env_check: {
        supabase_url: process.env.SUPABASE_URL,
        supabase_key_length: process.env.SUPABASE_ANON_KEY?.length
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Connection test failed',
      details: error.message,
      stack: error.stack
    });
  }
}