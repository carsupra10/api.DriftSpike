export default function handler(req, res) {
  return res.status(200).json({
    message: 'Debug info',
    env_check: {
      supabase_url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabase_anon_key: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      supabase_service_key: process.env.SUPABASE_SERVICE_KEY ? 'Set' : 'Missing',
      supabase_url_value: process.env.SUPABASE_URL || 'undefined',
      anon_key_length: process.env.SUPABASE_ANON_KEY?.length || 0,
      service_key_length: process.env.SUPABASE_SERVICE_KEY?.length || 0,
      all_env_keys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    },
    timestamp: new Date().toISOString()
  });
}// Service role key added Mon Dec 29 18:07:36 IST 2025
