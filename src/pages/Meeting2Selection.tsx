import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/contexts/BrandingContext";
import { PageContext } from "@/types/pageContext";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicLogo from "@/components/DynamicLogo";
import { ArrowLeft, HandCoins, Users, LogOut } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Meeting2Selection = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();
  const { user, signOut } = useAuth();
  const { setPageContext } = useBranding();
  
  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.NAVIGATION);
    console.log('🧭 Meeting2Selection: PageContext set to NAVIGATION');
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigateWithPreview("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
      <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23224239' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-5xl animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <DynamicLogo size="lg" variant="light" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-rc-primary mb-4 leading-tight">
              2ª Reunião
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Selecione o tipo de apresentação da 2ª reunião
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <Card className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col animate-fade-in" style={{ animationDelay: '0ms' }}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rc-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative text-center p-8">
                <div className="mx-auto mb-6 p-4 rounded-xl w-16 h-16 flex items-center justify-center bg-rc-accent border border-rc-secondary/20 group-hover:border-rc-secondary/40 transition-all duration-300">
                  <HandCoins className="h-8 w-8 text-rc-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-rc-primary mb-3">2ª Reunião - Consórcio</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Apresentação focada exclusivamente em consórcio
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-8 pt-4 relative">
                <Button 
                  onClick={() => navigateWithPreview("/meeting2")}
                  className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-rc-secondary hover:bg-rc-secondary/90 text-white transition-all duration-300 hover:scale-[1.02] shadow-md"
                >
                  Acessar Consórcio
                </Button>
              </CardContent>
            </Card>

            <Card className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rc-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              {/* Production Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg border border-red-500">
                  Em Produção
                </div>
              </div>
              <CardHeader className="relative text-center p-8">
                <div className="mx-auto mb-6 p-4 rounded-xl w-16 h-16 flex items-center justify-center bg-rc-accent border border-rc-secondary/20 group-hover:border-rc-secondary/40 transition-all duration-300">
                  <Users className="h-8 w-8 text-rc-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-rc-primary mb-3">2ª Reunião - Híbrida</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  Apresentação com abordagem híbrida e personalizada
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto p-8 pt-4 relative">
                <Button 
                  onClick={() => navigateWithPreview("/meeting2/hibrida/form")}
                  className="w-full px-6 py-3 text-base font-semibold rounded-xl bg-rc-secondary hover:bg-rc-secondary/90 text-white transition-all duration-300 hover:scale-[1.02] shadow-md"
                >
                  Acessar Híbrida
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Button 
              onClick={() => navigateWithPreview("/meeting-selection")}
              variant="ghost"
              className="px-8 py-3 text-base bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-rc-secondary/50 hover:text-rc-primary transition-all duration-300 rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="px-8 py-3 text-base bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-rc-secondary/50 hover:text-rc-primary transition-all duration-300 rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
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

export default Meeting2Selection;