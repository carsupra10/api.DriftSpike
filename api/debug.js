export default function handler(req, res) {
  return res.status(200).json({
    message: 'Debug info',
    env_check: {
      supabase_url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabase_key: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      supabase_url_value: process.env.SUPABASE_URL || 'undefined',
      supabase_key_length: process.env.SUPABASE_ANON_KEY?.length || 0,
      all_env_keys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    },
    timestamp: new Date().toISOString()
  });
}