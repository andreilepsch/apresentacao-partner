import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

type AccountStatus = 'pending' | 'approved' | 'rejected' | null;

export const useAccountStatus = () => {
  const { user } = useAuthContext();
  const [status, setStatus] = useState<AccountStatus>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setIsActive(true);
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_account_status')
          .select('status, is_active')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        setStatus(data?.status as AccountStatus || null);
        setIsActive(data?.is_active ?? true);
      } catch (error) {
        console.error('Error fetching account status:', error);
        setStatus(null);
        setIsActive(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('account_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_account_status',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && 'status' in payload.new) {
            setStatus(payload.new.status as AccountStatus);
            setIsActive((payload.new as any).is_active ?? true);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return { 
    status, 
    isActive,
    loading, 
    isApproved: status === 'approved',
    isPending: status === 'pending',
    isRejected: status === 'rejected'
  };
};
