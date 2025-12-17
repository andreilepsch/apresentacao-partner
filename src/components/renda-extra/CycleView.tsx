
import RCButton from "@/components/RCButton";
import CycleCard from "@/components/renda-extra/CycleCard";
import ProgressBar from "@/components/renda-extra/ProgressBar";

interface CycleData {
  cycle: number;
  patrimony: string;
  installment: string;
  income: string;
  profit: string;
}

interface CycleViewProps {
  currentCycle: CycleData;
  cycleNumber: number;
  monthlyInvestment: number;
  formatCurrency: (value: number) => string;
  onAdvance: () => void;
  onBack: () => void;
}

const CycleView = ({ currentCycle, cycleNumber, monthlyInvestment, formatCurrency, onAdvance, onBack }: CycleViewProps) => {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <ProgressBar currentStep={cycleNumber} />

          {/* Main Cycle Card - Now using the CycleCard component */}
          <div className="mb-8">
            <CycleCard 
              cycle={{
                cycle: cycleNumber,
                patrimony: currentCycle?.patrimony || "",
                installment: currentCycle?.installment || "",
                income: currentCycle?.income || "",
                profit: currentCycle?.profit || "",
                color: "#B78D4A",
                iconColor: "#193D32"
              }} 
              index={0}
              monthlyInvestment={monthlyInvestment}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <RCButton 
              variant="primary" 
              onClick={onAdvance}
              className="bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {cycleNumber < 4 ? `Avançar para Ciclo ${cycleNumber + 1}` : 'Ver Resultado Final'}
            </RCButton>
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

export default CycleView;
