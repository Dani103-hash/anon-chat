
-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  uuid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_answered BOOLEAN NOT NULL DEFAULT false,
  is_reported BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies - allow users to read/update their own data
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (uuid = current_setting('app.current_user_uuid', true) OR auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (uuid = current_setting('app.current_user_uuid', true) OR auth.uid()::text = id::text);

-- Messages policies - users can read messages sent to them
CREATE POLICY "Users can view messages sent to them" 
  ON public.messages 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM public.users 
    WHERE uuid = current_setting('app.current_user_uuid', true) 
    OR auth.uid()::text = id::text
  ));

CREATE POLICY "Anyone can insert messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update messages sent to them" 
  ON public.messages 
  FOR UPDATE 
  USING (user_id IN (
    SELECT id FROM public.users 
    WHERE uuid = current_setting('app.current_user_uuid', true) 
    OR auth.uid()::text = id::text
  ));

CREATE POLICY "Users can delete messages sent to them" 
  ON public.messages 
  FOR DELETE 
  USING (user_id IN (
    SELECT id FROM public.users 
    WHERE uuid = current_setting('app.current_user_uuid', true) 
    OR auth.uid()::text = id::text
  ));

-- Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_uuid ON public.users(uuid);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
