-- Create users table for email service (simplified - one SMTP config per user)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  emails_sent_this_month INTEGER DEFAULT 0,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_secure BOOLEAN DEFAULT false,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_pass VARCHAR(500) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample users for testing (using specific UUIDs as API keys)
INSERT INTO users (id, email, plan_type, emails_sent_this_month, smtp_host, smtp_port, smtp_secure, smtp_user, smtp_pass, from_name) VALUES
('5e292193-54fc-49a4-9395-fa7667145400', 'aathishpirate@gmail.com', 'free', 0, 'smtp.gmail.com', 587, false, 'tagverse.iio@gmail.com', 'axok nqva abmb zbnw', 'Company No-Reply'),
('6f3a2194-65gd-50b5-a406-gb8778256511', 'premium@example.com', 'premium', 5000, 'smtp.gmail.com', 587, false, 'premium@example.com', 'premium-app-password', 'Premium Service'),
('7g4b3295-76he-61c6-b517-hc9889367622', 'limit@example.com', 'free', 3000, 'smtp.gmail.com', 587, false, 'limit@example.com', 'limit-app-password', 'Limit Service')
ON CONFLICT (id) DO NOTHING;