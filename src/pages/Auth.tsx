import { useEffect } from "react";
import { useBranding } from "@/contexts/BrandingContext";
import { PageContext } from "@/types/pageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  const { setPageContext } = useBranding();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";

  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.AUTHENTICATION);
    console.log('🔐 Auth: PageContext set to AUTHENTICATION');
  }, [setPageContext]);

  // Redireciona se já estiver logado
  useEffect(() => {
    if (isSignedIn) {
      navigate("/meeting-selection");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Background Image - Tela Inteira */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/images/auth-bg.png')`
        }}
      />

      {/* Overlays de Profundidade */}
      <div className="absolute inset-0 bg-[#1A4764]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A4764]/95 via-[#1A4764]/40 to-transparent lg:to-transparent" />

      {/* Conteúdo em Duas Colunas */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full h-full min-h-screen">

        {/* Coluna da Esquerda - Identidade e Marketing */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 xl:px-24 py-12 lg:py-0 animate-fade-in">
          <div className="max-w-xl">
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

        {/* Coluna da Direita - Login (Clerk) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative">
          <div className="w-full max-w-md relative z-10">
            <Card className="border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl animate-fade-in overflow-hidden">
              <CardHeader className="pb-4 pt-5">
                <CardTitle className="text-white text-center text-lg font-bold mb-1 tracking-widest uppercase">
                  {mode === 'signup' ? 'Criar Conta' : 'Acesso Restrito'}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex justify-center pb-6">
                {mode === 'signup' ? (
                  <SignUp 
                    routing="query" 
                    signInUrl="/auth?mode=login"
                    forceRedirectUrl="/meeting-selection"
                    appearance={{
                      elements: {
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
                        formButtonPrimary: "bg-gradient-to-r from-[#C9A45C] to-[#F5D285] text-black hover:opacity-90",
                        formFieldInput: "bg-white/10 border-white/20 text-white",
                        formFieldLabel: "text-white",
                        footerActionText: "text-white/70",
                        footerActionLink: "text-[#F5D285] hover:text-white",
                        identityPreviewText: "text-white",
                        identityPreviewEditButtonIcon: "text-white"
                      }
                    }}
                  />
                ) : (
                  <SignIn 
                    routing="query" 
                    signUpUrl="/auth?mode=signup"
                    forceRedirectUrl="/meeting-selection"
                    appearance={{
                      elements: {
                        card: "bg-transparent shadow-none border-none",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20",
                        formButtonPrimary: "bg-gradient-to-r from-[#C9A45C] to-[#F5D285] text-black hover:opacity-90",
                        formFieldInput: "bg-white/10 border-white/20 text-white",
                        formFieldLabel: "text-white",
                        footerActionText: "text-white/70",
                        footerActionLink: "text-[#F5D285] hover:text-white",
                        formResendCodeLink: "text-[#F5D285]",
                        otpCodeFieldInput: "bg-white/10 border-white/20 text-white"
                      }
                    }}
                  />
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