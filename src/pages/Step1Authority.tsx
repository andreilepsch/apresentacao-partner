import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { useBranding } from "@/contexts/BrandingContext";
import { PageContext } from "@/types/pageContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import AuthorityHeader from "@/components/authority/AuthorityHeader";
import ImpactQuote from "@/components/authority/ImpactQuote";
import CallToActionSection from "@/components/authority/CallToActionSection";
import DynamicTeamPhoto from "@/components/DynamicTeamPhoto";
import DynamicMetrics from "@/components/DynamicMetrics";

const Step1Authority = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const { setPageContext } = useBranding();
  useScrollToTop();
  
  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.PRESENTATION);
    console.log('📊 Step1Authority: PageContext set to PRESENTATION');
  }, []);

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Botão Voltar */}
        <div className="mb-8">
          <Button 
            onClick={() => navigateWithPreview("/meeting-selection")}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-rc-secondary/50 hover:text-rc-primary transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <AuthorityHeader />
        <ImpactQuote />

        {/* Foto da Equipe */}
        <div className="mb-12">
          <DynamicTeamPhoto />
        </div>

        {/* Bloco de Métricas */}
        <div className="mb-12">
          <DynamicMetrics />
        </div>

        <CallToActionSection onNext={() => navigateWithPreview("/step2-presence")} />
      </div>
    </div>
  );
};

export default Step1Authority;
