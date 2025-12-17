
import { useState } from "react";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, Target } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const CasaPropriaStep8 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  useScrollToTop();

  const investmentOptions = [
    {
      title: "À vista",
      items: [
        { text: "Pagamento imediato, sem parcelas", type: "check" },
        { text: "Sem juros ou taxas adicionais", type: "check" },
        { text: "Maior poder de negociação", type: "check" },
        { text: "Alta necessidade de capital imediato", type: "x" },
        { text: "Alta descapitalização", type: "x" }
      ]
    },
    {
      title: "Financiamento",
      items: [
        { text: "Compra imediata", type: "check" },
        { text: "Juros médios de 12,25% a.a", type: "x" },
        { text: "Entrada alta (30% a 50%)", type: "x" },
        { text: "Renda comprovada via IRPF", type: "x" },
        { text: "Limite de financiamentos no CPF", type: "x" },
        { text: "Longo prazo (até 35 anos)", type: "x" }
      ]
    },
    {
      title: "Imóvel na planta",
      items: [
        { text: "Preço mais acessível", type: "check" },
        { text: "Entrada facilitada", type: "check" },
        { text: "Pagamentos anuais (balões)", type: "x" },
        { text: "Alta exposição financeira (descapitalização)", type: "x" },
        { text: "Prazo de entrega variável", type: "x" }
      ]
    },
    {
      title: "Consórcio",
      items: [
        { text: "Taxa média de 1,67% a.a", type: "check" },
        { text: "Entrada flexível (a partir de 1 parcela)", type: "check" },
        { text: "Possibilidade de lances e antecipação", type: "check" },
        { text: "Necessita-se escolher o grupo certo", type: "x" },
        { text: "Planejamento para contemplação", type: "warning" }
      ]
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "check":
        return <Check className="w-4 h-4 text-[#193D32]" />;
      case "x":
        return <X className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-[#B78D4A]" />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < investmentOptions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowComparison(true);
    }
  };

  const handlePrevious = () => {
    if (showComparison) {
      setShowComparison(false);
      setCurrentStep(investmentOptions.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigateWithPreview("/casa-propria/step7");
    }
  };

  const handleFinalize = () => {
    navigateWithPreview("/casa-propria/step9");
  };

  const currentOption = investmentOptions[currentStep];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
            <Target className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">POSSIBILIDADES</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Maneiras de investir em imóveis
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Comparativo entre as opções de investimento
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-[50px] h-[2px] bg-[#B78D4A]"></div>
          </div>
        </div>

        {/* Show comparison view with all 4 cards */}
        {showComparison ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {investmentOptions.map((option, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Ícone no topo */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#F7F5F0] rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#193D32] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{index + 1}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#193D32] mb-6 text-center">
                  {option.title}
                </h3>
                
                <div className="space-y-4">
                  {option.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(item.type)}
                      </div>
                      <span className="text-sm text-[#333333] leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single card view */
          <div className="flex justify-center mb-12">
            <div 
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full max-w-[400px] animate-fade-in hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500"
              key={currentStep}
            >
              {/* Ícone no topo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#193D32] rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">{currentStep + 1}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#193D32] mb-8 text-center">
                {currentOption.title}
              </h3>
              
              <div className="space-y-6">
                {currentOption.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <span className="text-base text-[#333333] leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-12">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          {showComparison ? (
            <Button
              onClick={handleFinalize}
              className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
            >
              Avançar →
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
            >
              {currentStep < investmentOptions.length - 1 ? "Avançar →" : "Avançar →"}
            </Button>
          )}
        </div>

        {/* Step Indicator - only show in single card view */}
        {!showComparison && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
              <div className="flex gap-2">
                {investmentOptions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-[#B78D4A] shadow-sm' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasaPropriaStep8;
