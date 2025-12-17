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
import { Loader2 } from "lucide-react";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
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
      navigate("/meeting-selection");
    }
    setLoading(false);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      error
    } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message);
    } else {
      setError("");
      alert("Conta criada com sucesso! Verifique seu email para ativar a conta.");
      setActiveTab("login");
    }
    setLoading(false);
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
  return <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
    backgroundColor: "#1A4764"
  }}>
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A4764] via-[#2A5672] to-[#0F2838] opacity-90" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C9A45C]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E5C875]/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header Section - Centralizada */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <DynamicLogo size="lg" variant="dark" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-3 tracking-tight">
            
          </h1>
          <p className="text-lg text-white/80 font-medium">
            Sistema de Apresentações
          </p>
        </div>

        {/* Card Principal */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl animate-fade-in" style={{
        animationDelay: '200ms'
      }}>
          <CardHeader className="pb-6">
            <CardTitle className="text-white text-center text-xl font-semibold mb-2">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-white/70 text-center text-base">
              Apenas parceiros da <DynamicCompanyName />
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            {showResetForm ? <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Redefinir Senha
                  </h3>
                  <p className="text-white/70 text-sm">
                    Informe seu email para receber as instruções de redefinição
                  </p>
                </div>

                {resetSuccess ? <div className="text-center space-y-4">
                    <Alert className="border-green-400/30 bg-green-500/10 text-green-200">
                      <AlertDescription className="text-sm">
                        Email enviado com sucesso! Verifique sua caixa de entrada para continuar.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={handleBackToLogin} variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10">
                      Voltar ao Login
                    </Button>
                  </div> : <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="reset-email" className="text-white font-medium text-sm">
                        Email
                      </Label>
                      <Input id="reset-email" type="email" placeholder="seu.email@gruporeferencia.com" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    
                    {error && <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200">
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>}
                    
                    <div className="space-y-3">
                    <Button type="submit" className="w-full text-black font-semibold text-base h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                  background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                }} disabled={resetLoading}>
                        {resetLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {resetLoading ? "Enviando..." : "Enviar Email"}
                      </Button>
                      
                      <Button type="button" onClick={handleBackToLogin} variant="outline" className="w-full bg-transparent border-white/30 text-white hover:bg-white/10">
                        Voltar ao Login
                      </Button>
                    </div>
                  </form>}
              </div> : <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Tabs com melhor styling */}
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/10 p-1 rounded-lg">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-rc-primary text-white font-medium transition-all duration-200">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-rc-primary text-white font-medium transition-all duration-200">
                    Criar Conta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-white font-medium text-sm">
                        Email
                      </Label>
                      <Input id="login-email" type="email" placeholder="seu.email@gruporeferencia.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="login-password" className="text-white font-medium text-sm">
                        Senha
                      </Label>
                      <Input id="login-password" type="password" placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)} required className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    
                    {error && <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200">
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>}
                    
                    <Button type="submit" className="w-full text-black font-semibold text-base h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                  background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                }} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>

                    <div className="text-center">
                      <button type="button" onClick={() => setShowResetForm(true)} className="text-white/70 hover:text-white text-sm font-medium transition-colors underline">
                        Esqueci minha senha
                      </button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="signup-name" className="text-white font-medium text-sm">
                        Nome Completo
                      </Label>
                      <Input id="signup-name" type="text" placeholder="Seu nome completo" value={fullName} onChange={e => setFullName(e.target.value)} required className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-white font-medium text-sm">
                        Email Corporativo
                      </Label>
                      <Input id="signup-email" type="email" placeholder="seu.email@gruporeferencia.com" value={email} onChange={e => setEmail(e.target.value)} required className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signup-password" className="text-white font-medium text-sm">
                        Senha
                      </Label>
                      <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="bg-white/15 border-white/30 text-white placeholder:text-white/50 focus:border-rc-accent focus:bg-white/20 transition-all duration-200 h-12" />
                    </div>
                    
                    {error && <Alert variant="destructive" className="border-red-400/30 bg-red-500/10 text-red-200">
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>}
                    
                    <Button type="submit" className="w-full text-black font-semibold text-base h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" style={{
                  background: "linear-gradient(135deg, #C9A45C 0%, #E5C875 50%, #F5D285 100%)"
                }} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>}
          </CardContent>
        </Card>

        {/* Footer com melhor typography */}
        <div className="text-center mt-8 animate-fade-in" style={{
        animationDelay: '400ms'
      }}>
          <p className="text-white/60 text-sm font-medium leading-relaxed">
            Apenas parceiros da Autoridade Investimentos podem acessar
          </p>
        </div>
      </div>
    </div>;
};
export default Auth;