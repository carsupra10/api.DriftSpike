-- Disable Row Level Security on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow anon access to users" ON users;
DROP POLICY IF EXISTS "anon_users_policy" ON users;

-- Grant permissions to anon role
GRANT ALL ON users TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;