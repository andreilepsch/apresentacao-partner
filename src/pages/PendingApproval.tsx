import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Mail, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAccountStatus } from '@/hooks/useAccountStatus';
import DynamicCompanyName from '@/components/DynamicCompanyName';
import DynamicLogo from '@/components/DynamicLogo';

const PendingApproval = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const { status, isActive, loading } = useAccountStatus();

  useEffect(() => {
    // Se for aprovado E ativo, redirecionar para home
    if (status === 'approved' && isActive) {
      navigate('/');
    }
  }, [status, isActive, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1A4764" }}>
        <div className="text-center">
          <DynamicLogo className="h-12 mb-4" variant="dark" />
          <p className="text-body text-white/80">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#1A4764" }}>
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <DynamicLogo className="h-16" variant="light" />
          </div>
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-500/10 p-4">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {status === 'rejected' 
              ? 'Acesso Negado' 
              : status === 'approved' && !isActive 
                ? 'Conta Inativa' 
                : 'Conta Aguardando Aprovação'}
          </CardTitle>
          <CardDescription className="text-base">
            {status === 'rejected' 
              ? 'Infelizmente sua solicitação de acesso foi negada.'
              : status === 'approved' && !isActive
                ? 'Sua conta foi temporariamente inativada.'
                : <>Bem-vindo à <DynamicCompanyName /></>
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === 'rejected' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Acesso não autorizado</p>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com o administrador para mais informações.
                  </p>
                </div>
              </div>
            </div>
          ) : status === 'approved' && !isActive ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Conta Temporariamente Inativa</p>
                  <p className="text-sm text-muted-foreground">
                    Sua conta foi temporariamente inativada por um administrador. 
                    Entre em contato para solicitar a reativação.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">O que fazer?</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Entre em contato com o administrador do sistema</li>
                  <li>Verifique se há pendências em sua conta</li>
                  <li>Aguarde a reativação para ter acesso novamente</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Conta criada com sucesso!</p>
                  <p className="text-sm text-muted-foreground">
                    Sua conta foi registrada em <strong>{user?.email}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Aguardando aprovação</p>
                  <p className="text-sm text-muted-foreground">
                    Um administrador revisará seu acesso em breve. Você receberá uma notificação quando sua conta for aprovada.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <h4 className="text-sm font-medium">Próximos passos:</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Aguarde a aprovação do administrador</li>
                  <li>Você pode fechar esta página e retornar mais tarde</li>
                  <li>Após aprovação, você terá acesso completo ao sistema</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Status
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="w-full"
            >
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
