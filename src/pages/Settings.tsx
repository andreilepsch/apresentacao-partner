import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Palette, User, Bell, LayoutDashboard, LogOut } from 'lucide-react';
import DynamicLogo from '@/components/DynamicLogo';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuthContext();
  const { isAdmin } = useUserRole();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 mb-10 border-b border-border/40">
          <Button
            variant="ghost"
            onClick={() => navigate('/meeting-selection')}
            className="self-start"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Painel Admin
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>


          </div>
        </header>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Configurações</h1>
          <p className="text-muted-foreground text-lg">
            Personalize sua experiência e gerencie suas preferências
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identidade Visual */}
          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary"
            onClick={() => navigate('/settings/branding')}
          >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 group-hover:text-primary transition-colors">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                Identidade Visual
              </CardTitle>
              <CardDescription className="text-base">
                Personalize completamente sua marca para apresentações aos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Logo e cores da empresa
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Fotos da equipe e mentor
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Métricas e informações de contato
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Configurações de PDF
                </li>
              </ul>
              <Button className="w-full" variant="default">
                Configurar Branding
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Perfil */}
          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary"
            onClick={() => navigate('/settings/personal')}
          >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 group-hover:text-primary transition-colors">
                <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/20 transition-colors">
                  <User className="w-8 h-8 group-hover:text-primary" />
                </div>
                Dados Pessoais
              </CardTitle>
              <CardDescription className="text-base">
                Gerencie suas informações pessoais e de conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Nome e email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Senha e segurança
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Configurações básicas da empresa
                </li>
              </ul>
              <Button className="w-full" variant="secondary">
                Editar Perfil
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>


          {/* Preferências (Futuro) */}
          < Card className="opacity-60 border-dashed" >
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-muted-foreground">
                <div className="p-3 bg-muted rounded-lg">
                  <Bell className="w-8 h-8" />
                </div>
                Preferências
              </CardTitle>
              <CardDescription className="text-base">
                Configure notificações e preferências do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Notificações por email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Idioma e região
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Preferências de apresentação
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card >
        </div >
      </div >
    </div >
  );
};

export default Settings;
