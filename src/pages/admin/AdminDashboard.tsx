import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBranding } from '@/contexts/BrandingContext';
import { PageContext } from '@/types/pageContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, ArrowLeft, ArrowRight, Settings, Loader2 } from 'lucide-react';
import DynamicLogo from '@/components/DynamicLogo';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  pendingUsers: number;
  totalCompanies: number;
  activePartners: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userProfile, isAdmin, loading: authLoading } = useAuthContext();
  const { setPageContext, refetchBranding } = useBranding();

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingUsers: 0,
    totalCompanies: 0,
    activePartners: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      console.log('🚫 AdminDashboard: Access denied');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    setPageContext(PageContext.NAVIGATION);
    refetchBranding(PageContext.NAVIGATION);
  }, [setPageContext, refetchBranding]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [users, companies] = await Promise.all([
        api.get('/admin/users'),
        api.get('/companies')
      ]);

      const totalUsers = users.filter((u: any) => u.status === 'approved').length;
      const pendingUsers = users.filter((u: any) => u.status === 'pending').length;
      const activePartners = users.filter((u: any) => u.status === 'approved' && u.is_active && u.role === 'partner').length;

      setStats({
        totalUsers,
        pendingUsers,
        totalCompanies: companies.length,
        activePartners,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1A3A52 0%, #0F2838 100%)'
    }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 164, 92, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(201, 164, 92, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)`
        }} />
      </div>

      <div className="container mx-auto p-8 max-w-7xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm"
            onClick={() => navigate('/meeting-selection')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Início
          </Button>
          <DynamicLogo className="h-8 w-auto" variant="dark" />
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Settings className="w-10 h-10 text-[#C9A45C]" />
            Painel Administrativo
          </h1>
          <p className="text-white/70 text-lg">
            Gerencie usuários, empresas e configurações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A45C] mb-1">
                  {loadingStats ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : stats.totalUsers}
                </div>
                <div className="text-sm text-white/70">Usuários Ativos</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A45C] mb-1">
                  {loadingStats ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : stats.pendingUsers}
                </div>
                <div className="text-sm text-white/70">Pendentes</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A45C] mb-1">
                  {loadingStats ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : stats.totalCompanies}
                </div>
                <div className="text-sm text-white/70">Empresas</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#C9A45C] mb-1">
                  {loadingStats ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : stats.activePartners}
                </div>
                <div className="text-sm text-white/70">Parceiros</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#C9A45C] transition-all cursor-pointer group"
            onClick={() => navigate('/admin/users')}
          >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-white group-hover:text-[#C9A45C] transition-colors">
                <div className="p-3 bg-[#C9A45C]/20 rounded-lg group-hover:bg-[#C9A45C]/30 transition-colors">
                  <Users className="w-8 h-8 text-[#C9A45C]" />
                </div>
                Gestão de Usuários
              </CardTitle>
              <CardDescription className="text-white/70 text-base">
                Aprove novos usuários e gerencie perfis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#C9A45C] hover:bg-[#B78D4A] text-white">
                Gerenciar Usuários
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#C9A45C] transition-all cursor-pointer group"
            onClick={() => navigate('/admin/companies')}
          >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-white group-hover:text-[#C9A45C] transition-colors">
                <div className="p-3 bg-[#C9A45C]/20 rounded-lg group-hover:bg-[#C9A45C]/30 transition-colors">
                  <Building2 className="w-8 h-8 text-[#C9A45C]" />
                </div>
                Gestão de Empresas
              </CardTitle>
              <CardDescription className="text-white/70 text-base">
                Configure branding e vincule usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#C9A45C] hover:bg-[#B78D4A] text-white">
                Gerenciar Empresas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
