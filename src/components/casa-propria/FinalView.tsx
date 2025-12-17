
import RCButton from "@/components/RCButton";
import { Home, TrendingUp, CheckCircle, Target, Award } from "lucide-react";

interface FinalViewProps {
  monthlyRent: number;
  availableSavings: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  formatCurrency: (value: number) => string;
  formatPatrimonyCompact: (value: number) => string;
  cycle4Data: {
    totalInvested: number;
    patrimony: number;
    rentalIncome: number;
  };
  onRestart: () => void;
  onNext: () => void;
}

const CasaPropriaFinalView = ({ 
  monthlyRent, 
  availableSavings, 
  selectedPath, 
  formatCurrency, 
  formatPatrimonyCompact, 
  cycle4Data,
  onRestart, 
  onNext 
}: FinalViewProps) => {
  // Usar os dados reais do ciclo 4
  const { totalInvested, patrimony, rentalIncome } = cycle4Data;
  
  // Contexto baseado no caminho
  const getPropertyContext = () => {
    if (selectedPath === 'rent-and-credit') {
      return {
        ownProperty: 1, // Casa própria no ciclo 1
        rentalProperties: 3, // Ciclos 2, 3, 4 gerando renda
        contextText: "Você tem sua casa própria desde o 1º ciclo e 3 imóveis gerando renda passiva."
      };
    } else if (selectedPath === 'investment-first') {
      return {
        ownProperty: 1, // Casa própria no ciclo 3
        rentalProperties: 3, // Ciclos 1, 2, 4 gerando renda
        contextText: "Você construiu 3 imóveis para renda e conquistou sua casa própria no 3º ciclo."
      };
    }
    return { ownProperty: 1, rentalProperties: 3, contextText: "" };
  };

  const propertyContext = getPropertyContext();

  const getPathTitle = () => {
    if (selectedPath === 'rent-and-credit') {
      return 'Caminho: Sair do Aluguel + Construir Renda';
    } else if (selectedPath === 'investment-first') {
      return 'Caminho: Investimento Primeiro';
    }
    return 'Seu Caminho para a Casa Própria';
  };

  const getPathDescription = () => {
    if (selectedPath === 'rent-and-credit') {
      return 'Você escolheu a estratégia de comprar seu imóvel primeiro enquanto constrói renda com imóveis gradualmente.';
    } else if (selectedPath === 'investment-first') {
      return 'Você escolheu investir primeiro em imóveis para renda e depois usar os lucros para comprar sua casa dos sonhos.';
    }
    return 'Com base na sua situação, você tem excelentes opções para sair do aluguel';
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border border-[#B78D4A]/20 rounded-full px-6 py-3 mb-8">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-bold text-sm tracking-wide uppercase">CONCLUSÃO</span>
            </div>
            
            <h1 className="text-4xl font-bold text-[#193D32] mb-6 leading-tight">
              {getPathTitle()}
            </h1>
            <p className="text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed">
              {getPathDescription()}
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-[#355F4D]/10 to-[#B78D4A]/10 rounded-3xl p-12 mb-16 text-center border border-[#B78D4A]/20">
            <Award className="w-20 h-20 text-[#B78D4A] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#193D32] mb-4">
              Parabéns! Você completou os 4 ciclos
            </h2>
            <p className="text-lg text-[#333333] mb-6 max-w-2xl mx-auto">
              {propertyContext.contextText}
            </p>
            <div className="inline-flex items-center gap-3 bg-[#B78D4A] text-white px-8 py-4 rounded-full text-xl font-bold">
              🏡 Casa dos Sonhos Desbloqueada!
            </div>
          </div>

          {/* Main Financial Overview - Resultados Finais */}
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 mb-16">
            <div className="text-center mb-12">
              <Target className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#193D32] mb-4">
                O que você alcançou
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-[#F7F5F0] rounded-2xl">
                <div className="text-3xl font-bold text-[#B78D4A] mb-2">{formatCurrency(totalInvested)}</div>
                <div className="text-sm text-gray-600">Total Investido</div>
              </div>
              <div className="text-center p-6 bg-[#F7F5F0] rounded-2xl">
                <div className="text-3xl font-bold text-[#193D32] mb-2">{formatCurrency(patrimony)}</div>
                <div className="text-sm text-gray-600">Patrimônio Total</div>
              </div>
              <div className="text-center p-6 bg-[#F7F5F0] rounded-2xl">
                <div className="text-3xl font-bold text-[#355F4D] mb-2">{formatCurrency(rentalIncome)}</div>
                <div className="text-sm text-gray-600">Renda Mensal Passiva</div>
              </div>
            </div>

            {/* Property Summary */}
            <div className="bg-gradient-to-r from-[#B78D4A]/5 to-[#355F4D]/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#193D32] mb-6 text-center">
                Sua Situação Patrimonial Final
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-[#333333] font-medium">{propertyContext.ownProperty} Casa Própria Quitada</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-[#333333] font-medium">{propertyContext.rentalProperties} Imóveis Gerando Renda</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-[#333333] font-medium">Renda Passiva de {formatCurrency(rentalIncome)}/mês</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-[#333333] font-medium">Patrimônio de {formatCurrency(patrimony)}</span>
                </div>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <RCButton 
              variant="primary" 
              onClick={onNext}
              className="bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white text-xl px-12 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Ver caso real
            </RCButton>
            
            <RCButton 
              variant="auxiliary" 
              onClick={onRestart}
              className="border-2 border-[#355F4D] text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-8 py-3 rounded-full transition-all duration-300"
            >
              Refazer Análise
            </RCButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaFinalView;
