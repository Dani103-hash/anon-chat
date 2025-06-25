
import { useAuth } from './useAuth';
import { useUserManager } from './useUserManager';
import { useMessageSender } from './useMessageSender';

export const useUserSession = () => {
  const { session, loading: authLoading, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const { user, loading: userLoading, createUser, logout: logoutUser } = useUserManager(session);
  const { sendMessage } = useMessageSender();

  const logout = () => {
    logoutUser();
    signOut();
  };

  return {
    user,
    session,
    loading: authLoading || userLoading,
    createUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
    sendMessage,
    refetchUser: () => {} // Placeholder for compatibility
  };
};
