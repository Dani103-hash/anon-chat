
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  uuid: string;
  email?: string;
}

export const useUserSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const localUuid = localStorage.getItem('anonChatUserUuid');
      const localUsername = localStorage.getItem('anonChatUser');
      
      if (localUuid) {
        // Set the user UUID for RLS policies
        await supabase.rpc('set_config', {
          parameter: 'app.current_user_uuid',
          value: localUuid
        });

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', localUuid)
          .single();

        if (data && !error) {
          setUser(data);
        } else if (localUsername) {
          // Migrate from old system
          await createUser(localUsername, localUuid);
        }
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (username: string, existingUuid?: string) => {
    try {
      const userUuid = existingUuid || crypto.randomUUID();
      
      // Set the user UUID for RLS policies
      await supabase.rpc('set_config', {
        parameter: 'app.current_user_uuid',
        value: userUuid
      });

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
      setUser(data);
      
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
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
    createUser,
    logout,
    refetchUser: loadUserSession
  };
};
