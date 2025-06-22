
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
          // User signed in with Google - try to link existing anonymous account
          await handleSecureSignIn(session);
        } else if (event === 'SIGNED_OUT') {
          // User signed out - revert to anonymous if they had one
          await handleSignOut();
        }
        
        setAuthState(prev => ({ ...prev, session }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for existing Supabase session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User has secure session - load their linked account
        await loadSecureUser(session);
      } else {
        // Check for anonymous session
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
          // Anonymous user data not found, clear localStorage
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

      // Store anonymous session
      localStorage.setItem('anonChatUserUuid', userUuid);
      localStorage.setItem('anonChatUser', username);
      
      const newUser = { ...data, isAnonymous: true };
      setAuthState({
        user: newUser,
        session: null,
        loading: false
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

      // Check if user already has a secure account
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (existingUser) {
        // User already has secure account
        setAuthState({
          user: { ...existingUser, isAnonymous: false },
          session,
          loading: false
        });
        toast({
          title: "Welcome back!",
          description: "Signed in successfully",
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
          // Upgrade anonymous account to secure
          const { data: upgradedUser, error } = await supabase
            .from('users')
            .update({ email: userEmail })
            .eq('id', anonUser.id)
            .select()
            .single();

          if (upgradedUser && !error) {
            // Clear anonymous session data
            localStorage.removeItem('anonChatUserUuid');
            localStorage.removeItem('anonChatUser');
            
            setAuthState({
              user: { ...upgradedUser, isAnonymous: false },
              session,
              loading: false
            });
            
            toast({
              title: "Account upgraded!",
              description: "Your anonymous account has been secured with Google",
            });
            return;
          }
        }
      }

      // Create new secure user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username: session.user.user_metadata.preferred_username || 
                   session.user.email?.split('@')[0] || 
                   `user_${Date.now()}`,
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
          title: "Account created!",
          description: "Welcome to AnonChat",
        });
      }
    } catch (error) {
      console.error('Error handling secure sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Check if user had anonymous session before
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
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
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
    signInWithGoogle,
    logout,
    refetchUser: initializeAuth
  };
};
