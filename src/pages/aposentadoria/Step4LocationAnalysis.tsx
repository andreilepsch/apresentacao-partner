import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Train, ShoppingBag, GraduationCap, Building2, Target, Hospital, Plane } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import NearbyPoints from "@/components/renda-extra/NearbyPoints";
import LocationBenefits from "@/components/renda-extra/LocationBenefits";
import PageBadge from "@/components/common/PageBadge";
import OptimizedImage from "@/components/common/OptimizedImage";

const AposentadoriaStep4 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const nearbyPoints = [
    { 
      icon: Hospital, 
      name: "Hospital São Paulo", 
      distance: "850 metros",
      color: "text-red-600"
    },
    { 
      icon: Hospital, 
      name: "Hospital Japonês Santa Cruz", 
      distance: "1.2 km",
      color: "text-red-500"
    },
    { 
      icon: GraduationCap, 
      name: "UNIFAI", 
      distance: "900 metros",
      color: "text-indigo-600"
    },
    { 
      icon: GraduationCap, 
      name: "ESPM", 
      distance: "1.1 km",
      color: "text-purple-600"
    },
    { 
      icon: Building2, 
      name: "Parque Ibirapuera", 
      distance: "1.5 km",
      color: "text-green-600"
    },
    { 
      icon: ShoppingBag, 
      name: "Shopping Ibirapuera", 
      distance: "1.8 km",
      color: "text-orange-600"
    },
    { 
      icon: Train, 
      name: "Estação Santa Cruz", 
      distance: "650 metros",
      color: "text-blue-600"
    },
    { 
      icon: Plane, 
      name: "Aeroporto de Congonhas", 
      distance: "3.2 km",
      color: "text-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={Target} text="LOCALIZAÇÃO" />

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            O que há ao redor que gera demanda?
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            A região do Domingos de Moraes atrai hóspedes por causa da sua proximidade com pontos estratégicos
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-[50px] h-[2px] bg-[#B78D4A]"></div>
          </div>
        </div>

        {/* Map Section Otimizado */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <OptimizedImage
                src="/lovable-uploads/ff2e05c7-4fcc-4474-a624-a6b16cbc2fd9.png"
                alt="Mapa de Domingos de Moraes com pontos de interesse"
                className="w-full h-auto"
                priority={true}
                placeholder="Carregando mapa..."
              />
            </div>
          </div>
          
          <NearbyPoints points={nearbyPoints} />
        </div>

        <LocationBenefits />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step3")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step5")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Avançar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep4;