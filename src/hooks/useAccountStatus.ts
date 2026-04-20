import { useAuthContext } from '@/contexts/AuthContext';

export const useAccountStatus = () => {
  const { userProfile, loading } = useAuthContext();
  
  const status = userProfile?.status || null;
  const isActive = userProfile?.is_active ?? true;

  return { 
    status, 
    isActive,
    loading, 
    isApproved: status === 'approved',
    isPending: status === 'pending',
    isRejected: status === 'rejected'
  };
};
