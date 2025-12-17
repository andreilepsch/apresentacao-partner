import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Wifi, Star, Dumbbell, Wine, Target } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PropertyAmenities from "@/components/renda-extra/PropertyAmenities";
import PageBadge from "@/components/common/PageBadge";
import OptimizedPropertyCarousel from "@/components/renda-extra/OptimizedPropertyCarousel";

const AposentadoriaStep3 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const propertyImages = [
    "/lovable-uploads/e3f04207-43ab-43b7-82a0-c03ee2988b3a.png", // Sala de estar - primeira
    "/lovable-uploads/00408826-ff1b-460b-96d4-3d2a970a742d.png", // Área externa/terraço - segunda
    "/lovable-uploads/62a7a9db-06ba-4add-a9d7-8d21df4468fb.png", // Estante/biblioteca
    "/lovable-uploads/a336a331-ff81-4531-a443-42c9a28a8432.png", // Dispensa/área de armazenamento
    "/lovable-uploads/01a88087-31cd-4fc8-a994-50236e500c66.png", // Academia
    "/lovable-uploads/2de5e635-ae26-4e5e-906f-b7e8428a3ee7.png",
    "/lovable-uploads/6697b1fa-8de1-4d54-bd6a-39905388e262.png",
    "/lovable-uploads/8e8884b1-56a8-422f-bb9f-514964d64661.png",
    "/lovable-uploads/db1b39d5-dd16-46e9-bc32-a051a095a6aa.png",
    "/lovable-uploads/73e1f660-a214-447c-afbe-e877f5df5b32.png",
    "/lovable-uploads/afa983c2-1460-4e8b-9938-cb433247b0df.png",
    "/lovable-uploads/ba651066-e2cc-4311-baee-a1b98f249ad8.png",
    "/lovable-uploads/6e240df9-ad4a-436f-b9c6-7376125b7dc6.png",
    "/lovable-uploads/ed1700dc-11d9-4497-9454-720d2862bf4a.png"
  ];

  const amenities = [
    { icon: Wifi, name: "Bike Sharing", color: "text-blue-600" },
    { icon: Star, name: "Fire Place", color: "text-orange-600" },
    { icon: Dumbbell, name: "Game Space", color: "text-green-600" },
    { icon: Wine, name: "Wine Bar", color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={Target} text="CASO REAL" />
          
          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Caso Real
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Analisamos localização, padrão de acabamento e apelo para locação por temporada
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-[50px] h-[2px] bg-[#B78D4A]"></div>
          </div>
        </div>

        {/* Property Images Carousel Otimizado */}
        <OptimizedPropertyCarousel images={propertyImages} />
      
        <PropertyAmenities amenities={amenities} />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step2")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step4")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Avançar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep3;