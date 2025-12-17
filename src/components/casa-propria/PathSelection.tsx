
import RCButton from "@/components/RCButton";
import { Home, TrendingUp, Target, ArrowRight } from "lucide-react";

interface PathSelectionProps {
  monthlyRent: number;
  availableSavings: number;
  formatCurrency: (value: number) => string;
  onSelectPath: (path: 'rent-and-credit' | 'investment-first') => void;
  onBack: () => void;
}

const CasaPropriaPathSelection = ({ 
  monthlyRent, 
  availableSavings, 
  formatCurrency, 
  onSelectPath, 
  onBack 
}: PathSelectionProps) => {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-[32px] font-bold text-[#193D32] mb-4 leading-tight">
              Escolha Seu Caminho para a Casa Própria
            </h1>
            <p className="text-[18px] text-[#333333] max-w-2xl mx-auto leading-relaxed">
              Com base no seu perfil, você tem duas estratégias eficazes para conquistar sua casa própria
            </p>
          </div>

          {/* Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Caminho 1: Pagar aluguel e crédito */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#B78D4A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#193D32] mb-2">Caminho 1</h3>
                <h4 className="text-lg font-semibold text-[#B78D4A] mb-4">Sair do aluguel 1º e construir uma renda</h4>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#B78D4A] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#333333]">Continue pagando aluguel enquanto investe</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#B78D4A] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#333333]">Construa crédito imobiliário gradualmente</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#B78D4A] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#333333]">Estratégia focada em sair do aluguel primeiro</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#B78D4A] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#333333]">Aprovação de crédito facilitada</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Aluguel atual:</span>
                  <span className="font-semibold text-[#193D32]">{formatCurrency(monthlyRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Entrada disponível:</span>
                  <span className="font-semibold text-[#193D32]">{formatCurrency(availableSavings)}</span>
                </div>
              </div>

              <RCButton 
                variant="primary" 
                onClick={() => onSelectPath('rent-and-credit')}
                className="w-full bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                Escolher este Caminho
                <ArrowRight className="w-4 h-4" />
              </RCButton>
            </div>

            {/* Caminho 2: Investimento primeiro */}
            <div className="relative">
              {/* Badge outside the card */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-[#355F4D] text-white text-xs px-4 py-2 rounded-full font-semibold">
                  MAIS ESCOLHIDO
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#355F4D] hover:shadow-xl transition-all duration-300 flex flex-col pt-10">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#355F4D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#193D32] mb-2">Caminho 2</h3>
                  <h4 className="text-lg font-semibold text-[#355F4D] mb-4">Gerar renda e comprar um imóvel melhor</h4>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#355F4D] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#333333]">Invista primeiro em imóveis para renda</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#355F4D] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#333333]">Use os lucros para comprar sua casa dos sonhos</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#355F4D] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#333333]">Maximize seu potencial de retorno</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#355F4D] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#333333]">Foco em conquistar uma moradia sem descapitalizar</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#355F4D]/10 to-[#193D32]/10 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#355F4D]" />
                    <span className="text-sm font-semibold text-[#355F4D]">Meta Final:</span>
                  </div>
                  <span className="text-sm text-[#333333]">No 3º ciclo, compre um imóvel de alto padrão para morar</span>
                </div>

                <RCButton 
                  variant="primary" 
                  onClick={() => onSelectPath('investment-first')}
                  className="w-full bg-[#355F4D] hover:bg-[#355F4D]/90 text-white py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Escolher este Caminho
                  <ArrowRight className="w-4 h-4" />
                </RCButton>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <RCButton 
              variant="auxiliary" 
              onClick={onBack}
              className="border border-[#355F4D] text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-6 py-2 rounded-full transition-all duration-300"
            >
              Voltar
            </RCButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaPathSelection;
