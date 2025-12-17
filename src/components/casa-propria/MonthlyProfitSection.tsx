
import { Sparkles } from "lucide-react";

interface MonthlyProfitSectionProps {
  profit: string;
}

const MonthlyProfitSection = ({ profit }: MonthlyProfitSectionProps) => {
  return (
    <div className="p-6 bg-gradient-to-r from-[#355F4D] to-[#224239] rounded-xl text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-[#B78D4A]" />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-wide uppercase">
              Lucro Líquido
            </span>
            <span className="block text-white/80 font-medium text-sm">
              Valor mensal no seu bolso
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-2xl font-bold">
            {profit}
          </span>
        </div>
      </div>
      
      {/* Success indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-xs font-medium uppercase tracking-wide">
          Renda Passiva Conquistada
        </span>
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default MonthlyProfitSection;
