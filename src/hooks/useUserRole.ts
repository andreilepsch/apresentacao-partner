import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/branding';

export const useUserRole = () => {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        console.log('🔒 useUserRole: No user found');
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 useUserRole: Checking role for user:', user.id, user.email);

        const { data, error } = await supabase
          .rpc('get_user_role', { target_user_id: user.id });

        console.log('📊 useUserRole: RPC result:', { data, error });

        if (error) {
          console.error('❌ useUserRole: Error in RPC:', error);
          throw error;
        }

        // RPC retorna diretamente o enum app_role ou null
        const roleData = data ? { role: data } : null;
        const adminEmails = [
          'contato@autoridadeinvestimentos.com.br',
          'admin@admin.com',
          'andreilepsch@gmail.com',
          'andrei.lepsch@gmail.com'
        ].map(e => e.toLowerCase());

        const userEmail = user.email?.toLowerCase();
        const isAdminUser = roleData?.role === 'admin' || (userEmail && adminEmails.includes(userEmail));

        console.log('✅ useUserRole: Final result:', {
          roleData,
          isAdmin: isAdminUser,
          userId: user.id,
          userEmail: userEmail
        });

        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('❌ useUserRole: Error checking user role:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isAdmin, isLoading };
};
