import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    console.log('Testing service key...');
    console.log('Service key length:', process.env.SUPABASE_SERVICE_KEY?.length);
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Test with service key
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);

    if (error) {
      return res.status(500).json({ 
        error: 'Service key test failed',
        details: error.message,
        service_key_length: process.env.SUPABASE_SERVICE_KEY?.length
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Service key working!',
      data: data,
      service_key_length: process.env.SUPABASE_SERVICE_KEY?.length
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
}