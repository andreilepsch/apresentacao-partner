
import { useNavigate } from "react-router-dom";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Award } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import PageNavigation from "@/components/common/PageNavigation";
import OptimizedNewsCarousel from "@/components/media/OptimizedNewsCarousel";
import DynamicAuthorityQuote from "@/components/DynamicAuthorityQuote";

const Step3Media = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Badge */}
          <PageBadge icon={Award} text="NA MÍDIA" className="mb-8" />

          <h1 className="text-3xl md:text-4xl font-semibold text-[#193D32] mb-6 leading-tight">
            Reconhecimento
          </h1>
          <p className="text-base md:text-lg text-[#333333] mb-8 max-w-4xl mx-auto leading-relaxed">
            Nossa expertise é reconhecida pelos principais veículos do mercado financeiro
          </p>
          
          <SectionDivider className="mb-12" />
        </div>

        {/* News Carousel Otimizado */}
        <div className="mb-12">
          <OptimizedNewsCarousel />
        </div>

        {/* Quote Section */}
        <div className="mb-12">
          <DynamicAuthorityQuote />
        </div>

        {/* Navigation */}
        <PageNavigation 
          onBack={() => navigateWithPreview("/step2-presence")}
          onNext={() => navigateWithPreview("/step4-what-we-do")}
          backText="← Voltar"
          nextText="O que fazemos? →"
        />
      </div>
    </div>
  );
};

export default Step3Media;
