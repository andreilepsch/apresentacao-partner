import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAccountStatus } from '@/hooks/useAccountStatus';
import DynamicCompanyName from '@/components/DynamicCompanyName';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuthContext();
  const { status, isActive, loading: statusLoading } = useAccountStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!statusLoading && user) {
      const isAdmin = user.email?.toLowerCase() === 'contato@autoridadeinvestimentos.com.br';

      if (isAdmin) return; // Bypassa verificações de status para o admin principal

      if (status === 'pending') {
        navigate('/pending-approval');
      } else if (status === 'rejected') {
        navigate('/pending-approval');
      } else if (status === 'approved' && !isActive) {
        // Usuário aprovado mas inativo - bloquear acesso
        navigate('/pending-approval');
      }
    }
  }, [status, isActive, statusLoading, user, navigate]);

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

  // Permitir acesso se:
  // 1. Usuário sem status (null) = admins antigos ou primeiro admin
  // 2. Usuário aprovado E ativo
  if (!user) {
    return null;
  }

  if (status !== null && (status !== 'approved' || !isActive)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;