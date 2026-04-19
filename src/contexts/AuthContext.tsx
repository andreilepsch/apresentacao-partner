import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { authApi, UserProfile } from '@/lib/api';
import { clearAppData } from '@/utils/clearAppData';

interface AuthContextType {
  // Clerk user ID (substitui o UUID do Supabase)
  clerkUserId: string | null;
  // Dados do usuário do nosso banco
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isApproved: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const { signOut: clerkSignOut } = useClerk();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const clerkUserId = user?.id || null;

  const syncAndLoadProfile = async () => {
    if (!user || !clerkUserId) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      // Sincronizar usuário com o banco (cria perfil se não existir)
      await authApi.sync(
        clerkUserId,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || ''
      );

      // Carregar perfil completo
      const { user: profile } = await authApi.me(clerkUserId);
      setUserProfile(profile);
    } catch (err) {
      console.error('Erro ao sincronizar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoaded) return;

    if (!isSignedIn) {
      clearAppData();
      setUserProfile(null);
      setLoading(false);
      return;
    }

    syncAndLoadProfile();
  }, [isUserLoaded, isSignedIn, user?.id]);

  const signOut = async () => {
    clearAppData();
    setUserProfile(null);
    await clerkSignOut();
  };

  const refreshProfile = async () => {
    if (clerkUserId) {
      const { user: profile } = await authApi.me(clerkUserId);
      setUserProfile(profile);
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isApproved = userProfile?.is_active === true;

  return (
    <AuthContext.Provider value={{
      clerkUserId,
      userProfile,
      loading,
      isAdmin,
      isApproved,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
