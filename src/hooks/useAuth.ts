/**
 * useAuth.ts — substituição do hook Supabase por Clerk
 * Compatível com código legado que chama useAuth()
 */
import { useUser, useClerk } from '@clerk/clerk-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { clearAppData } from '@/utils/clearAppData';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { userProfile, loading } = useAuthContext();

  // Adaptar interface Supabase → Clerk
  const adaptedUser = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    user_metadata: {
      full_name: user.fullName,
    }
  } : null;

  const signUp = async (email: string, _password: string, fullName: string, _companyName?: string) => {
    // Clerk faz o signup via tela própria — redirecionar para /auth
    console.warn('signUp: usa o ClerkProvider SignUp page');
    return { error: null };
  };

  const signIn = async (_email: string, _password: string) => {
    // Clerk faz o signin via tela própria — redirecionar para /auth
    console.warn('signIn: usa o ClerkProvider SignIn page');
    return { error: null };
  };

  const signOut = async () => {
    clearAppData();
    await clerkSignOut();
    return { error: null };
  };

  const resetPassword = async (_email: string) => {
    console.warn('resetPassword: usa o Clerk UserProfile');
    return { error: null };
  };

  return {
    user: adaptedUser,
    session: user ? { user: adaptedUser } : null,
    loading: !isLoaded || loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};