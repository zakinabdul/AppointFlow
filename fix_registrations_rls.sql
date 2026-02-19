-- Enable RLS on registrations table (ensure it is on)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can register." ON registrations;
DROP POLICY IF EXISTS "Anyone can register" ON registrations;

-- Create permissive INSERT policy
CREATE POLICY "Anyone can register"
ON registrations
FOR INSERT
WITH CHECK (true);

-- Ensure anon and authenticated roles can insert
GRANT INSERT ON registrations TO postgres, anon, authenticated, service_role;
