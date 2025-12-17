
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface CycleNavigationProps {
  cycleNumber: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  onAdvance: () => void;
  onBack: () => void;
}

const CycleNavigation = ({ cycleNumber, selectedPath, onAdvance, onBack }: CycleNavigationProps) => {
  const getAdvanceButtonText = () => {
    return cycleNumber < 4 ? `Avançar para o Ciclo ${cycleNumber + 1}` : 'Ver Resultado Final';
  };

  const getAdvanceButtonStyle = () => {
    const isSpecialMoment = (selectedPath === 'investment-first' && cycleNumber === 3);
    
    if (isSpecialMoment) {
      return "flex items-center gap-2 bg-gradient-to-r from-[#B78D4A] to-[#A67B3A] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";
    }
    
    return "flex items-center gap-2 bg-gradient-to-r from-[#355F4D] to-[#224239] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300";
  };

  const isSpecialMoment = (selectedPath === 'investment-first' && cycleNumber === 3);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Action Button */}
      <button 
        onClick={onAdvance}
        className={getAdvanceButtonStyle()}
      >
        {isSpecialMoment && <Sparkles className="w-5 h-5" />}
        <span>{getAdvanceButtonText()}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
      
      {isSpecialMoment && (
        <p className="text-[#B78D4A] font-medium text-sm">
          🏆 Momento especial: Casa própria conquistada!
        </p>
      )}

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 border border-[#355F4D]/30 text-[#355F4D] hover:bg-[#355F4D] hover:text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>
    </div>
  );
};

export default CycleNavigation;
