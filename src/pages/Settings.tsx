import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Palette, User, Bell } from 'lucide-react';
import DynamicLogo from '@/components/DynamicLogo';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/meeting-selection')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>
          <DynamicLogo className="h-8 w-auto" />
        </div>

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

          {/* Perfil (Futuro) */}
          <Card className="opacity-60 border-dashed">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3 text-muted-foreground">
                <div className="p-3 bg-muted rounded-lg">
                  <User className="w-8 h-8" />
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
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Nome e email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Senha e segurança
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                  Preferências de conta
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>

          {/* Preferências (Futuro) */}
          <Card className="opacity-60 border-dashed">
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
