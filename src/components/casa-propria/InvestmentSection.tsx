
import { TrendingUp, DollarSign } from "lucide-react";

interface InvestmentSectionProps {
  monthlyRent: number;
  totalInvested: number;
  cycleNumber: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  formatCurrency: (value: number) => string;
}

const InvestmentSection = ({ 
  monthlyRent,
  totalInvested,
  cycleNumber,
  selectedPath,
  formatCurrency 
}: InvestmentSectionProps) => {
  const isPath1FirstCycle = selectedPath === 'rent-and-credit' && cycleNumber === 1;
  const isPath2ThirdCycle = selectedPath === 'investment-first' && cycleNumber === 3;

  const getSectionTitle = () => {
    if (isPath1FirstCycle) return 'Investimento para Casa Própria';
    if (isPath2ThirdCycle) return 'Investimento para Casa Própria';
    return 'Aporte de Investimento';
  };

  return (
    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#B78D4A]/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-[#B78D4A]" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#224239]">
            {getSectionTitle()}
          </h4>
          <p className="text-gray-500 text-sm">Valores mensais e acumulados</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Monthly Investment */}
        <div className="p-4 border border-gray-200 rounded-xl bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium text-sm">
              Parcela Mensal
            </span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-lg font-bold text-[#224239]">
            {formatCurrency(monthlyRent)}
          </span>
        </div>

        {/* Total Invested */}
        <div className="p-4 border border-[#355F4D]/20 rounded-xl bg-gradient-to-br from-[#355F4D]/5 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#355F4D] font-medium text-sm">
              Total Investido
            </span>
            <TrendingUp className="w-4 h-4 text-[#355F4D]" />
          </div>
          <span className="text-lg font-bold text-[#355F4D]">
            {formatCurrency(totalInvested)}
          </span>
          
          {/* Progress indicator */}
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#355F4D] to-[#B78D4A] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((cycleNumber / 4) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSection;
