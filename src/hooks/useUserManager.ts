
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  username: string;
  uuid: string;
  email?: string;
  isAnonymous?: boolean;
}

export const useUserManager = (session: Session | null) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      loadSecureUser(session);
    } else {
      loadAnonymousSession();
    }
  }, [session]);

  const loadSecureUser = async (session: Session) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (data && !error) {
        setUser({ ...data, isAnonymous: false });
      }
    } catch (error) {
      console.error('Error loading secure user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnonymousSession = async () => {
    try {
      const localUuid = localStorage.getItem('anonChatUserUuid');
      const localUsername = localStorage.getItem('anonChatUser');
      
      if (localUuid && localUsername) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', localUuid)
          .single();

        if (data && !error) {
          setUser({ ...data, isAnonymous: true });
        } else {
          localStorage.removeItem('anonChatUserUuid');
          localStorage.removeItem('anonChatUser');
        }
      }
    } catch (error) {
      console.error('Error loading anonymous session:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAnonymousUser = async (username: string) => {
    try {
      if (!username.trim() || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        toast({
          title: "Invalid username",
          description: "Username must be 3+ characters, letters, numbers, and underscores only",
          variant: "destructive",
        });
        return null;
      }

      const userUuid = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: username.toLowerCase(),
          uuid: userUuid
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Username taken",
            description: "This username is already in use. Please choose another.",
            variant: "destructive",
          });
          return null;
        }
        throw error;
      }

      localStorage.setItem('anonChatUserUuid', userUuid);
      localStorage.setItem('anonChatUser', username);
      
      const newUser = { ...data, isAnonymous: true };
      setUser(newUser);
      
      toast({
        title: "Welcome to AnonChat! 🎉",
        description: `Your anonymous inbox is ready at /${username}`,
      });
      
      return newUser;
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      toast({
        title: "Error",
        description: "Failed to create user account",
        variant: "destructive",
      });
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('anonChatUserUuid');
    localStorage.removeItem('anonChatUser');
    setUser(null);
  };

  return {
    user,
    loading,
    createUser: createAnonymousUser,
    logout
  };
};
