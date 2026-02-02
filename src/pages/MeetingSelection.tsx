import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useBranding } from "@/contexts/BrandingContext";
import { PageContext } from "@/types/pageContext";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicLogo from "@/components/DynamicLogo";
import { Calendar, Users, LogOut, Settings } from "lucide-react";

const MeetingSelection = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const { user, signOut } = useAuthContext();
  const { isAdmin: roleAdmin } = useUserRole();
  const { setPageContext } = useBranding();
  const navigate = useNavigate();

  // Forçar detecção de admin para o e-mail do usuário em caso de falha no hook
  const isAdmin = roleAdmin || user?.email?.toLowerCase() === 'contato@autoridadeinvestimentos.com.br';

  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.NAVIGATION);
    console.log('🧭 MeetingSelection: PageContext set to NAVIGATION');
    console.log('👑 MeetingSelection: isAdmin status ->', isAdmin, 'Email:', user?.email);
  }, [isAdmin, user, setPageContext]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0F2838]">
      {/* Background Image - Mesma do Login - FIXA */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[20%]"
        style={{
          backgroundImage: `url('/images/auth-bg.png')`
        }}
      />

      {/* Overlays para consistência - Também FIXOS */}
      <div className="fixed inset-0 bg-[#0F2838]/60 backdrop-blur-[2px]" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0F2838]/40 to-[#0F2838]" />

      <div className="relative z-20 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-6xl animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <DynamicLogo size="lg" variant="dark" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-wide">
              Bem-vindo, <span className="text-[#C9A45C] font-semibold">{user?.user_metadata?.full_name || user?.email}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Selecione qual apresentação deseja acessar
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/15 hover:border-[#C9A45C]/40 hover:shadow-[#C9A45C]/20 transition-all duration-300 h-full flex flex-col animate-fade-in relative z-30 cursor-pointer hover:scale-[1.02]"
              style={{ animationDelay: '0ms' }}
              onClick={() => navigateWithPreview("/step1-authority")}
            >
              <CardHeader className="relative text-center p-8">
                <div className="mx-auto mb-6 p-4 rounded-xl w-16 h-16 flex items-center justify-center bg-[#C9A45C]/20 border-2 border-[#C9A45C] group-hover:bg-[#C9A45C]/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#C9A45C]/50 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-[#C9A45C]" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">1ª Reunião</CardTitle>
                <CardDescription className="text-white/70 text-base">
                  Apresentação principal da Autoridade Investimentos
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-8 pt-4 relative z-40">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateWithPreview("/step1-authority");
                  }}
                  className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-[#C9A45C] hover:bg-[#B78D4A] text-white transition-all duration-300 shadow-lg shadow-[#C9A45C]/30 hover:shadow-xl hover:shadow-[#C9A45C]/50 hover:scale-105"
                >
                  Acessar 1ª Reunião
                </Button>
              </CardContent>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/15 hover:border-[#C9A45C]/40 hover:shadow-[#C9A45C]/20 transition-all duration-300 h-full flex flex-col animate-fade-in relative z-30 hover:scale-[1.02]" style={{ animationDelay: '150ms' }}>
              <CardHeader className="relative text-center p-8">
                <div className="mx-auto mb-6 p-4 rounded-xl w-16 h-16 flex items-center justify-center bg-[#C9A45C]/20 border-2 border-[#C9A45C] group-hover:bg-[#C9A45C]/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#C9A45C]/50 transition-all duration-300">
                  <Users className="h-8 w-8 text-[#C9A45C]" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">2ª Reunião</CardTitle>
                <CardDescription className="text-white/70 text-base">
                  Apresentação de acompanhamento e resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-8 pt-4 relative z-40">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateWithPreview("/meeting2-selection");
                  }}
                  className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-[#C9A45C] hover:bg-[#B78D4A] text-white transition-all duration-300 shadow-lg shadow-[#C9A45C]/30 hover:shadow-xl hover:shadow-[#C9A45C]/50 hover:scale-105"
                >
                  Acessar 2ª Reunião
                </Button>
              </CardContent>
            </Card>

            <Card className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/15 hover:border-[#C9A45C]/40 hover:shadow-[#C9A45C]/20 transition-all duration-300 h-full flex flex-col animate-fade-in relative z-30 hover:scale-[1.02]" style={{ animationDelay: '300ms' }}>
              <CardHeader className="relative text-center p-8">
                <div className="mx-auto mb-6 p-4 rounded-xl w-16 h-16 flex items-center justify-center bg-[#C9A45C]/20 border-2 border-[#C9A45C] group-hover:bg-[#C9A45C]/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#C9A45C]/50 transition-all duration-300">
                  <Settings className="h-8 w-8 text-[#C9A45C]" />
                </div>
                <CardTitle className="text-xl font-bold text-white mb-3">Ferramentas</CardTitle>
                <CardDescription className="text-white/70 text-base">
                  Acesso a ferramentas e utilitários
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-8 pt-4 relative z-40">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateWithPreview("/ferramentas");
                  }}
                  className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-[#C9A45C] hover:bg-[#B78D4A] text-white transition-all duration-300 shadow-lg shadow-[#C9A45C]/30 hover:shadow-xl hover:shadow-[#C9A45C]/50 hover:scale-105"
                >
                  Acessar Ferramentas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-in relative z-30">
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                variant="ghost"
                className="w-full sm:w-auto px-8 py-3 text-base bg-[#C9A45C]/20 border-2 border-[#C9A45C] text-white hover:bg-[#C9A45C] transition-all duration-300 rounded-xl cursor-pointer relative z-40 shadow-lg shadow-[#C9A45C]/20"
              >
                <Settings className="mr-2 h-4 w-4 text-[#C9A45C] group-hover:text-white" />
                Painel Administrativo
              </Button>
            )}

            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              variant="ghost"
              className="w-full sm:w-auto px-8 py-3 text-base bg-white/5 border-2 border-white/20 text-white hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm transition-all duration-300 rounded-xl cursor-pointer relative z-40"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MeetingSelection;