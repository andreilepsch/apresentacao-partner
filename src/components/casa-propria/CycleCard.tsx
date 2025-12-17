
import { Home } from "lucide-react";

interface CycleData {
  cycle: number;
  patrimony: string;
  installment: string;
  income: string;
  profit: string;
  color: string;
  iconColor: string;
}

interface CycleCardProps {
  cycle: CycleData;
  index: number;
  monthlyRent: number;
  availableSavings: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  formatCurrency: (value: number) => string;
}

const CasaPropriaCycleCard = ({ 
  cycle, 
  index, 
  monthlyRent, 
  availableSavings, 
  selectedPath, 
  formatCurrency 
}: CycleCardProps) => {
  const totalInvested = monthlyRent * 12 * 5 * cycle.cycle;

  const renderHouseIcons = (count: number) => {
    return (
      <div className="flex items-center justify-center gap-2 my-6">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="transform transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#355F4D] to-[#193D32] rounded-lg flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Special highlight for cycle 3 in investment-first path
  const isSpecialMoment = selectedPath === 'investment-first' && cycle.cycle === 3;

  return (
    <div 
      className="animate-fade-in"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 h-full max-w-md mx-auto border border-gray-100">
        {/* Cycle Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#193D32] mb-2">Ciclo {cycle.cycle}</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-[#B78D4A] to-[#355F4D] rounded-full mx-auto"></div>
          {isSpecialMoment && (
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B78D4A] to-[#A67B3A] rounded-full px-4 py-2 shadow-lg">
                <span className="text-white font-semibold text-sm tracking-wide uppercase">
                  🏆 Casa Própria
                </span>
              </div>
            </div>
          )}
        </div>

        {/* House Icons */}
        {renderHouseIcons(cycle.cycle)}

        {/* Antes de Receber o Imóvel - Valores menores */}
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-600 text-center mb-3 uppercase tracking-wide">
            Antes de Receber o Imóvel
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500 uppercase block mb-1">Parcela Mensal</span>
              <span className="text-sm font-semibold text-[#193D32]">{formatCurrency(monthlyRent)}</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-500 uppercase block mb-1">Valor Investido</span>
              <span className="text-sm font-semibold text-[#193D32]">{formatCurrency(totalInvested)}</span>
            </div>
          </div>
        </div>

        {/* Depois de Receber o Imóvel - Valores maiores */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#193D32] text-center mb-4 uppercase tracking-wide">
            Depois de Receber o Imóvel
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-2 border-[#B78D4A]">
              <span className="text-sm font-medium text-gray-700">Patrimônio</span>
              <span className="text-lg font-bold text-[#193D32]">{cycle.patrimony}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-2 border-green-400">
              <span className="text-sm font-medium text-gray-700">Aluguel Líquido</span>
              <span className="text-lg font-bold text-green-700">{cycle.income}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-2 border-red-400">
              <span className="text-sm font-medium text-gray-700">Parcela</span>
              <span className="text-lg font-bold text-red-700">{cycle.installment}</span>
            </div>
          </div>
        </div>

        {/* Lucro no Bolso - MAIOR DESTAQUE */}
        <div className="bg-gradient-to-br from-[#B78D4A] to-[#355F4D] rounded-xl p-6 text-center text-white shadow-lg">
          <span className="text-sm uppercase block mb-2 font-medium opacity-90">Lucro no Bolso</span>
          <span className="text-3xl font-bold">{cycle.profit}</span>
          <div className="w-12 h-0.5 bg-white/40 rounded-full mx-auto mt-3"></div>
        </div>

        {/* Valor Aportado - Menor destaque */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500">Aporte mensal: {formatCurrency(monthlyRent)}</span>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaCycleCard;
