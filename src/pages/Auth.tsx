import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/contexts/BrandingContext";
import { PageContext } from "@/types/pageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DynamicLogo from "@/components/DynamicLogo";
import DynamicCompanyName from "@/components/DynamicCompanyName";
import { RegistrationSuccessDialog } from "@/components/RegistrationSuccessDialog";
import { Loader2, Mail, Lock, User, Building2 } from "lucide-react";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const {
    signIn,
    signUp,
    resetPassword
  } = useAuth();
  const navigate = useNavigate();
  const { setPageContext } = useBranding();

  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.AUTHENTICATION);
    console.log('🔐 Auth: PageContext set to AUTHENTICATION');
  }, []);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      error
    } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      // Check if user has branding setup
      try {
        const { data: { user } } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getUser());

        if (user) {
          const { data: userCompany } = await import("@/integrations/supabase/client").then(m => m.supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id)
            .maybeSingle());

          if (userCompany?.company_id) {
            const { data: company } = await import("@/integrations/supabase/client").then(m => m.supabase
              .from('companies')
              .select('logo_url')
              .eq('id', userCompany.company_id)
              .single());

            if (!company?.logo_url) {
              navigate("/settings/branding");
              setLoading(false);
              return;
            }
          }
        }
        navigate("/meeting-selection");
      } catch (err) {
        console.error("Error checking branding:", err);
        navigate("/meeting-selection");
      }
    }
    setLoading(false);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      error
    } = await signUp(email, password, fullName, companyName);
    if (error) {
      setError(error.message);
    } else {
      setError("");
      setShowSuccessDialog(true);
      setCompanyName("");
      setFullName("");
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    setActiveTab("login");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    const {
      error
    } = await resetPassword(resetEmail);
    if (error) {
      setError(error.message);
    } else {
      setResetSuccess(true);
      setError("");
    }
    setResetLoading(false);
  };
  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetSuccess(false);
    setResetEmail("");
    setError("");
  };
  return (
    <div className="min-h-screen relative flex overflow-hidden">
      <RegistrationSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onConfirm={handleSuccessConfirm}
      />
      {/* Background Image - Tela Inteira */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/auth-bg.png')`
        }}
      />

      {/* Overlays de Profundidade - Visibilidade Máxima à Direita */}
      <div className="absolute inset-0 bg-[#1A4764]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A4764]/95 via-[#1A4764]/40 to-transparent lg:to-transparent" />

      {/* Conteúdo em Duas Colunas */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full min-h-screen">

        {/* Coluna da Esquerda - Identidade e Marketing */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 xl:px-24 py-12 lg:py-0 animate-fade-in">
          <div className="max-w-xl">
            {/* NOVO: Título Partner e Subtítulo movidos para cá */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#C9A45C] via-[#F5D285] to-[#C9A45C] bg-clip-text text-transparent mb-2 tracking-tighter uppercase italic drop-shadow-2xl">
                Partner
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-bold tracking-[0.2em] uppercase drop-shadow-md">
                Sistema de Apresentações
              </p>
            </div>

            <div className="w-24 h-1.5 bg-[#C9A45C] mb-8" />

            <h2 className="text-2xl xl:text-4xl font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
              Ferramentas de elite para parceiros de <span className="text-[#C9A45C] italic">alta performance</span>.
            </h2>
            <p className="text-white/80 text-sm xl:text-base leading-relaxed font-light drop-shadow-md">
              Sua jornada para o domínio do mercado de investimentos começa com a melhor apresentação.
            </p>
          </div>
        </div>

        {/* Coluna da Direita - Login (Centralizado em sua coluna) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative">
          <div className="w-full max-w-sm relative z-10">
            {/* Card Principal */}
            <Card className="border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl animate-fade-in" style={{
              animationDelay: '300ms'
            }}>
              <CardHeader className="pb-4 pt-5">
                <CardTitle className="text-white text-center text-lg font-bold mb-1 tracking-widest uppercase">
                  Acesso Restrito
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5">
                {showResetForm ? (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-white text-base font-semibold mb-1">
                        Redefinir Senha
                      </h3>
                      <p className="text-white/70 text-xs text-balance px-4">
                        Informe seu email para receber as instruções de redefinição
                      </p>
                    </div>

                    {resetSuccess ? (
                      <div className="text-center space-y-3">
                        <Alert className="border-green-400/30 bg-green-500/10 text-green-200 py-2">
                          <AlertDescription className="text-xs">
                            Email enviado com sucesso! Verifique sua caixa de entrada.
                          </AlertDescription>
                        </Alert>
                        <Button onClick={handleBackToLogin} variant="outline" className="w-full h-10 bg-black/20 border-white/30 text-xs text-white hover:bg-white/10">
                          Voltar ao Login
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="text-white font-medium text-xs">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="reset-email" type="email" placeholder="E-mail da sua empresa" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>

                        {error && (
                          <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200">
                            <AlertDescription className="text-sm">{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Button type="submit" className="w-full text-black font-semibold text-sm h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                            background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                          }} disabled={resetLoading}>
                            {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {resetLoading ? "Enviando..." : "Enviar Email"}
                          </Button>

                          <Button type="button" onClick={handleBackToLogin} variant="outline" className="w-full h-10 bg-transparent border-white/30 text-xs text-white hover:bg-white/10">
                            Voltar ao Login
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 p-1 rounded-lg">
                      <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-[#1A4764] text-white text-xs font-medium transition-all duration-200">
                        Entrar
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-[#1A4764] text-white text-xs font-medium transition-all duration-200">
                        Criar Conta
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-white font-medium text-xs">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="login-email" type="email" placeholder="Seu e-mail corporativo" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-white font-medium text-xs">
                            Senha
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="login-password" type="password" placeholder="Sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>

                        {error && (
                          <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200">
                            <AlertDescription className="text-sm">{error}</AlertDescription>
                          </Alert>
                        )}

                        <Button type="submit" className="w-full text-black font-semibold text-sm h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                          background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                        }} disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <div className="text-center pt-1">
                          <button type="button" onClick={() => setShowResetForm(true)} className="text-white/70 hover:text-white text-xs font-medium transition-colors underline">
                            Esqueci minha senha
                          </button>
                        </div>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-white font-medium text-xs">
                            Nome Completo
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="signup-name" type="text" placeholder="Seu nome completo" value={fullName} onChange={e => setFullName(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-white font-medium text-xs">
                            Email Corporativo
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="signup-email" type="email" placeholder="E-mail da sua empresa" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-company" className="text-white font-medium text-xs">
                            Nome da Empresa
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="signup-company" type="text" placeholder="Nome da sua empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-white font-medium text-xs">
                            Senha
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F5D285] focus:bg-white/20 transition-all duration-200 h-10 text-sm pl-9" />
                          </div>
                        </div>

                        {error && (
                          <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200 py-2">
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                          </Alert>
                        )}

                        <Button type="submit" className="w-full text-black font-semibold text-sm h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                          background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                        }} disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {loading ? "Criando conta..." : "Criar Conta"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Auth;