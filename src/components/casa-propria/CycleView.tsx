
import ProgressBar from "@/components/renda-extra/ProgressBar";
import CasaPropriaCycleCard from "@/components/casa-propria/CycleCard";
import RCButton from "@/components/RCButton";

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
  monthlyRent: number;
  availableSavings: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  formatCurrency: (value: number) => string;
  onAdvance: () => void;
  onBack: () => void;
}

const CasaPropriaCycleView = ({ 
  currentCycle, 
  cycleNumber, 
  monthlyRent, 
  availableSavings, 
  selectedPath,
  formatCurrency, 
  onAdvance, 
  onBack 
}: CycleViewProps) => {
  // Special moment logic (cycle 3 for investment-first path)
  const isSpecialMoment = selectedPath === 'investment-first' && cycleNumber === 3;

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <ProgressBar currentStep={cycleNumber} />

          {/* Main Cycle Card */}
          <div className="mb-8">
            <CasaPropriaCycleCard 
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
              monthlyRent={monthlyRent}
              availableSavings={availableSavings}
              selectedPath={selectedPath}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Action Button */}
          <div className="text-center mb-8">
            <RCButton 
              variant="primary" 
              onClick={onAdvance}
              className={`text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ${
                isSpecialMoment 
                  ? 'bg-gradient-to-r from-[#B78D4A] to-[#A67B3A] text-white hover:shadow-xl' 
                  : 'bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white'
              }`}
            >
              {isSpecialMoment && '🏆 '}
              {cycleNumber < 4 ? `Avançar para Ciclo ${cycleNumber + 1}` : 'Ver Resultado Final'}
              {isSpecialMoment && ' - Casa Própria Conquistada!'}
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

export default CasaPropriaCycleView;
