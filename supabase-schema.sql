-- Optimized users table with performance indexes
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  emails_sent_this_month INTEGER DEFAULT 0,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER DEFAULT 587,
  smtp_secure BOOLEAN DEFAULT false,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_pass VARCHAR(500) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_email_sent TIMESTAMP WITH TIME ZONE,
  total_emails_sent BIGINT DEFAULT 0
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_id_hash ON users USING HASH (id);
CREATE INDEX IF NOT EXISTS idx_users_email_hash ON users USING HASH (email);
CREATE INDEX IF NOT EXISTS idx_users_plan_type ON users (plan_type);
CREATE INDEX IF NOT EXISTS idx_users_emails_sent ON users (emails_sent_this_month) WHERE plan_type = 'free';
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users (last_email_sent DESC);

-- Partial index for active free users (performance optimization)
CREATE INDEX IF NOT EXISTS idx_active_free_users ON users (id, emails_sent_this_month) 
WHERE plan_type = 'free' AND emails_sent_this_month < 3000;

-- Email logs table for analytics (optional)
CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(998),
  status VARCHAR(20) DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_time INTEGER, -- in milliseconds
  error_message TEXT
);

-- Index for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_sent ON email_logs (user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs (status, sent_at DESC);

-- Function to update user stats (atomic operation)
CREATE OR REPLACE FUNCTION increment_user_email_count(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    emails_sent_this_month = emails_sent_this_month + 1,
    total_emails_sent = total_emails_sent + 1,
    last_email_sent = NOW(),
    updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Monthly reset function (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_email_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET emails_sent_this_month = 0, updated_at = NOW()
  WHERE emails_sent_this_month > 0;
END;
$$ LANGUAGE plpgsql;

-- Disable RLS for performance
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON users TO anon, authenticated, service_role;
GRANT ALL ON email_logs TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Insert optimized test data
INSERT INTO users (id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, from_name) VALUES
('5e292193-54fc-49a4-9395-fa7667145400', 'aathishpirate@gmail.com', 'free', 0, 'smtp.gmail.com', 587, false, 'tagverse.iio@gmail.com', 'axok nqva abmb zbnw', 'Company No-Reply'),
('6f3a2194-65fd-50b5-a406-fb8778256511', 'premium@example.com', 'premium', 5000, 'smtp.gmail.com', 587, false, 'premium@example.com', 'premium-app-password', 'Premium Service'),
('7f4b3295-76ae-61c6-b517-ac9889367622', 'limit@example.com', 'free', 2999, 'smtp.gmail.com', 587, false, 'limit@example.com', 'limit-app-password', 'Limit Service')
ON CONFLICT (id) DO NOTHING;