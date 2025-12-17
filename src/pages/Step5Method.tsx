import { useNavigate } from "react-router-dom";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { TrendingUp, Home, Banknote } from "lucide-react";
import MethodHeader from "@/components/method/MethodHeader";
import MethodOverview from "@/components/method/MethodOverview";
import TimelineSection from "@/components/method/TimelineSection";
import ComparisonCard from "@/components/method/ComparisonCard";
import PageNavigation from "@/components/common/PageNavigation";

const Step5Method = () => {
  const { navigateWithPreview } = usePreviewNavigation();

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        <MethodHeader />
        <MethodOverview />
        <TimelineSection />

        {/* Cards de Comparação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <ComparisonCard 
            icon={Banknote}
            title="Compra do imóvel"
            data={{
              valor: "R$ 500.000,00",
              renda: "R$ 0,00",
              parcela: "R$ 2.400,00",
              total: "R$ 2.400,00",
              totalLabel: "TOTAL"
            }}
          />
          
          <ComparisonCard 
            icon={Home}
            title="Recebe o imóvel"
            variant="active"
            data={{
              valor: "R$ 550.000,00",
              renda: "R$ 5.500,00",
              parcela: "R$ 2.550,00",
              total: "R$ 2.950,00",
              totalLabel: "LUCRO"
            }}
          />
          
          <ComparisonCard 
            icon={TrendingUp}
            title="Quita o imóvel"
            variant="success"
            data={{
              valor: "R$ 1.000.000,00",
              renda: "R$ 10.000,00",
              parcela: "R$ 0,00",
              total: "R$ 10.000,00",
              totalLabel: "LUCRO"
            }}
          />
        </div>

        {/* Botões de Navegação */}
        <PageNavigation 
          onBack={() => navigateWithPreview("/step4-what-we-do")}
          onNext={() => navigateWithPreview("/step6-investment-options")}
          nextText="Escolha sua Jornada"
        />
      </div>
    </div>
  );
};

export default Step5Method;