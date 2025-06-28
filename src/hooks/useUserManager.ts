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
        // Clear any anonymous session data when secure user logs in
        localStorage.removeItem('anonChatUserUuid');
        localStorage.removeItem('anonChatUser');
        localStorage.removeItem('anonChatUserExpiry');
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
      const localExpiry = localStorage.getItem('anonChatUserExpiry');
      
      // Check if the anonymous session has expired (90 days)
      if (localExpiry && new Date().getTime() > parseInt(localExpiry)) {
        clearAnonymousSession();
        setLoading(false);
        return;
      }
      
      if (localUuid && localUsername) {
        // Optimistically set the user first
        const optimisticUser = {
          id: localUuid,
          username: localUsername,
          uuid: localUuid,
          isAnonymous: true
        };
        setUser(optimisticUser);
        setLoading(false);
        
        // Then verify in background
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('uuid', localUuid)
          .single();

        if (data && !error) {
          setUser({ ...data, isAnonymous: true });
          extendAnonymousSession();
        } else {
          // User no longer exists in database, clear local storage
          clearAnonymousSession();
          setUser(null);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading anonymous session:', error);
      clearAnonymousSession();
      setLoading(false);
    }
  };

  const clearAnonymousSession = () => {
    localStorage.removeItem('anonChatUserUuid');
    localStorage.removeItem('anonChatUser');
    localStorage.removeItem('anonChatUserExpiry');
  };

  const extendAnonymousSession = () => {
    const expiryTime = new Date().getTime() + (90 * 24 * 60 * 60 * 1000); // 90 days
    localStorage.setItem('anonChatUserExpiry', expiryTime.toString());
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

      const normalizedUsername = username.toLowerCase();

      // First, check if this username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('username', normalizedUsername)
        .single();

      if (existingUser && !checkError) {
        // Username exists - check for device recovery
        const deviceFingerprint = generateDeviceFingerprint();
        const storedFingerprint = localStorage.getItem(`device_${normalizedUsername}`);
        
        if (storedFingerprint === deviceFingerprint) {
          // This is the same device - recover the account optimistically
          const expiryTime = new Date().getTime() + (90 * 24 * 60 * 60 * 1000); // 90 days
          localStorage.setItem('anonChatUserUuid', existingUser.uuid);
          localStorage.setItem('anonChatUser', normalizedUsername);
          localStorage.setItem('anonChatUserExpiry', expiryTime.toString());
          
          const recoveredUser = { ...existingUser, isAnonymous: true };
          setUser(recoveredUser);
          
          toast({
            title: "Welcome back! 🎉",
            description: "We've restored your anonymous account on this device.",
          });
          
          return recoveredUser;
        } else {
          // Different device - username is taken
          toast({
            title: "Username taken",
            description: "This username is already in use. If this is your account, try accessing it from your original device.",
            variant: "destructive",
          });
          return null;
        }
      }

      // Username doesn't exist - create new account
      const userUuid = crypto.randomUUID();
      const deviceFingerprint = generateDeviceFingerprint();
      
      // Optimistically set user first
      const optimisticUser = {
        id: userUuid,
        username: normalizedUsername,
        uuid: userUuid,
        isAnonymous: true
      };
      setUser(optimisticUser);
      
      // Store session data immediately
      const expiryTime = new Date().getTime() + (90 * 24 * 60 * 60 * 1000); // 90 days
      localStorage.setItem('anonChatUserUuid', userUuid);
      localStorage.setItem('anonChatUser', normalizedUsername);
      localStorage.setItem('anonChatUserExpiry', expiryTime.toString());
      localStorage.setItem(`device_${normalizedUsername}`, deviceFingerprint);
      
      // Then create in database in background
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: normalizedUsername,
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
          // Rollback optimistic update
          setUser(null);
          clearAnonymousSession();
          return null;
        }
        throw error;
      }

      // Update with real data from database
      const newUser = { ...data, isAnonymous: true };
      setUser(newUser);
      
      toast({
        title: "Welcome to AnonChat! 🎉",
        description: `Your anonymous inbox is ready! Session expires in 90 days.`,
      });
      
      return newUser;
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      toast({
        title: "Error",
        description: "Failed to create user account",
        variant: "destructive",
      });
      // Rollback optimistic update
      setUser(null);
      clearAnonymousSession();
      return null;
    }
  };

  const generateDeviceFingerprint = () => {
    // Create a simple device fingerprint based on available browser data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    const canvasFingerprint = canvas.toDataURL();
    
    const fingerprint = btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvasFingerprint.slice(0, 50) // First 50 chars of canvas data
    }));
    
    return fingerprint;
  };

  const logout = () => {
    if (user?.isAnonymous) {
      // For anonymous users, show a confirmation dialog before clearing session
      const shouldClearSession = window.confirm(
        "Are you sure you want to logout? You will lose access to your anonymous account unless you remember your username and can find your way back."
      );
      
      if (shouldClearSession) {
        clearAnonymousSession();
        setUser(null);
        toast({
          title: "Logged out",
          description: "Your anonymous session has been cleared.",
        });
      }
    } else {
      // For authenticated users, just clear the user state
      setUser(null);
    }
  };

  const switchToAnonymous = () => {
    // Helper function to switch from authenticated to anonymous mode
    setUser(null);
    loadAnonymousSession();
  };

  return {
    user,
    loading,
    createUser: createAnonymousUser,
    logout,
    switchToAnonymous,
    clearAnonymousSession
  };
};
