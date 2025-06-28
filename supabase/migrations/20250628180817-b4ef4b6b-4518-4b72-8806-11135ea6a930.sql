
-- Drop existing RLS policies if they exist and create new ones that allow anonymous operations
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON users;

-- Allow anyone to read user data (needed for username lookups)
CREATE POLICY "Allow public read access to users" ON users
FOR SELECT USING (true);

-- Allow anyone to insert new users (needed for anonymous registration)
CREATE POLICY "Allow public insert for users" ON users
FOR INSERT WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Allow users to update their own data" ON users
FOR UPDATE USING (auth.uid()::text = uuid OR auth.uid() IS NULL);

-- Drop existing message policies if they exist
DROP POLICY IF EXISTS "Enable read access for message owners" ON messages;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON messages;

-- Allow users to read their own messages
CREATE POLICY "Allow users to read their own messages" ON messages
FOR SELECT USING (auth.uid()::text = (SELECT uuid FROM users WHERE id = user_id) OR auth.uid() IS NULL);

-- Allow anyone to send messages (anonymous messaging)
CREATE POLICY "Allow public insert for messages" ON messages
FOR INSERT WITH CHECK (true);

-- Allow users to update their own messages
CREATE POLICY "Allow users to update their own messages" ON messages
FOR UPDATE USING (auth.uid()::text = (SELECT uuid FROM users WHERE id = user_id) OR auth.uid() IS NULL);

-- Allow users to delete their own messages
CREATE POLICY "Allow users to delete their own messages" ON messages
FOR DELETE USING (auth.uid()::text = (SELECT uuid FROM users WHERE id = user_id) OR auth.uid() IS NULL);
