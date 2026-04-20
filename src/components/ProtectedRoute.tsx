import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAccountStatus } from '@/hooks/useAccountStatus';
import DynamicCompanyName from '@/components/DynamicCompanyName';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userProfile, clerkUserId, loading: authLoading, isAdmin } = useAuthContext();
  const { status, isActive, loading: statusLoading } = useAccountStatus();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não está mais carregando e não tem ID do Clerk, redireciona para login
    if (!authLoading && !clerkUserId) {
      navigate('/auth');
    }
  }, [clerkUserId, authLoading, navigate]);

  useEffect(() => {
    // Se logado, verifica restrições de aprovação (exceto para admins)
    if (!statusLoading && clerkUserId && !isAdmin) {
      if (status === 'pending' || status === 'rejected' || !isActive) {
        navigate('/pending-approval');
      }
    }
  }, [status, isActive, statusLoading, clerkUserId, isAdmin, navigate]);

  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1A4764" }}>
        <div className="text-center">
          <h1 className="text-h1 font-manrope text-white mb-4"><DynamicCompanyName /></h1>
          <p className="text-body font-manrope text-white/80">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem usuário ou não está aprovado (e não é admin), não renderiza nada (o useEffect cuida do redirect)
  if (!clerkUserId) {
    return null;
  }

  if (!isAdmin && (status === 'pending' || status === 'rejected' || !isActive)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;