import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    // Get all users to see what's in the database
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, plan_type, emails_sent_this_month')
      .limit(10);

    if (error) {
      return res.status(500).json({ 
        error: 'Database query failed',
        details: error.message 
      });
    }

    return res.status(200).json({ 
      success: true,
      users: users,
      count: users?.length || 0,
      test_user_id: '5e292193-54fc-49a4-9395-fa7667145400'
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to list users',
      details: error.message 
    });
  }
}