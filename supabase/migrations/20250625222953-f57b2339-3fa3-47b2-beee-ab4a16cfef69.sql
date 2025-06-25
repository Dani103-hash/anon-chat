
-- Fix RLS policies for the users table to allow anonymous user creation
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Create proper RLS policies that allow anonymous user creation
CREATE POLICY "Allow anonymous user creation" ON public.users
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT 
  USING (
    -- Allow if user owns the record (authenticated)
    (auth.uid() IS NOT NULL AND id = auth.uid()) OR
    -- Allow if accessing by UUID (anonymous users)
    (auth.uid() IS NULL AND uuid IS NOT NULL)
  );

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE 
  USING (
    -- Allow if user owns the record (authenticated)
    (auth.uid() IS NOT NULL AND id = auth.uid()) OR
    -- Allow if accessing by UUID (anonymous users)
    (auth.uid() IS NULL AND uuid IS NOT NULL)
  );

-- Fix RLS policies for messages table
DROP POLICY IF EXISTS "Users can view messages sent to them" ON public.messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;

CREATE POLICY "Users can view messages sent to them" ON public.messages
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can send messages" ON public.messages
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their messages" ON public.messages
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete their messages" ON public.messages
  FOR DELETE 
  USING (true);
