
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  username: string;
  uuid: string;
  email?: string;
  isAnonymous?: boolean;
}

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
}

export const useUserSession = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleSecureSignIn(session);
        } else if (event === 'SIGNED_OUT') {
          await handleSignOut();
        }
        
        setAuthState(prev => ({ ...prev, session }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadSecureUser(session);
      } else {
        await loadAnonymousSession();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const loadSecureUser = async (session: Session) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (data && !error) {
        setAuthState({
          user: { ...data, isAnonymous: false },
          session,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading secure user:', error);
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
          setAuthState({
            user: { ...data, isAnonymous: true },
            session: null,
            loading: false
          });
        } else {
          localStorage.removeItem('anonChatUserUuid');
          localStorage.removeItem('anonChatUser');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading anonymous session:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
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
      setAuthState({
        user: newUser,
        session: null,
        loading: false
      });
      
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

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    try {
      if (!username.trim() || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        toast({
          title: "Invalid username",
          description: "Username must be 3+ characters, letters, numbers, and underscores only",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username.toLowerCase()
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            username: username.toLowerCase(),
            uuid: crypto.randomUUID(),
            email: email
          });

        if (userError && userError.code !== '23505') {
          console.error('Error creating user record:', userError);
        }

        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account",
        });
        return true;
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      return false;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully",
        });
        return true;
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Sign in failed",
        description: "Could not sign in with Google",
        variant: "destructive",
      });
    }
  };

  const handleSecureSignIn = async (session: Session) => {
    try {
      const userEmail = session.user.email;
      if (!userEmail) return;

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (existingUser) {
        setAuthState({
          user: { ...existingUser, isAnonymous: false },
          session,
          loading: false
        });
        return;
      }

      // Check if they have an anonymous account to upgrade
      const localUuid = localStorage.getItem('anonChatUserUuid');
      if (localUuid) {
        const { data: anonUser } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', localUuid)
          .single();

        if (anonUser) {
          const { data: upgradedUser, error } = await supabase
            .from('users')
            .update({ email: userEmail })
            .eq('id', anonUser.id)
            .select()
            .single();

          if (upgradedUser && !error) {
            localStorage.removeItem('anonChatUserUuid');
            localStorage.removeItem('anonChatUser');
            
            setAuthState({
              user: { ...upgradedUser, isAnonymous: false },
              session,
              loading: false
            });
            
            toast({
              title: "Account upgraded!",
              description: "Your anonymous account has been secured",
            });
            return;
          }
        }
      }

      // Create new secure user
      const username = session.user.user_metadata?.username || 
                     session.user.user_metadata?.preferred_username || 
                     session.user.email?.split('@')[0] || 
                     `user_${Date.now()}`;

      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username: username.toLowerCase(),
          uuid: crypto.randomUUID(),
          email: userEmail
        })
        .select()
        .single();

      if (newUser && !error) {
        setAuthState({
          user: { ...newUser, isAnonymous: false },
          session,
          loading: false
        });
        
        toast({
          title: "Welcome to AnonChat!",
          description: "Your secure account has been created",
        });
      }
    } catch (error) {
      console.error('Error handling secure sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      
      const localUuid = localStorage.getItem('anonChatUserUuid');
      if (localUuid) {
        await loadAnonymousSession();
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('anonChatUserUuid');
    localStorage.removeItem('anonChatUser');
    supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false
    });
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    createUser: createAnonymousUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
    refetchUser: initializeAuth
  };
};
