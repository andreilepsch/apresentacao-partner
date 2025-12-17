
import { Building2, DollarSign, TrendingUp } from "lucide-react";

interface RentalIncomeSectionProps {
  patrimony: string;
  income: string;
  installment: string;
  rentableProperties: number;
}

const RentalIncomeSection = ({ patrimony, income, installment, rentableProperties }: RentalIncomeSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-[#355F4D]/5 to-white rounded-2xl p-4 border border-[#355F4D]/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#B78D4A]/10 rounded-xl">
          <Building2 className="w-5 h-5 text-[#355F4D]" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#224239]">
            Rentabilização dos Imóveis
          </h4>
          <p className="text-gray-500 text-sm">
            Receita gerada por {rentableProperties} imóve{rentableProperties === 1 ? 'l' : 'is'}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Patrimony Overview */}
        <div className="p-3 border border-[#B78D4A]/20 rounded-xl bg-gradient-to-br from-[#B78D4A]/10 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#355F4D]" />
              <span className="font-medium text-[#224239] text-sm">Patrimônio Total</span>
            </div>
            <span className="text-lg font-bold text-[#224239]">{patrimony}</span>
          </div>
        </div>
        
        {/* Rental Income - MAIN HIGHLIGHT */}
        <div className="p-4 bg-gradient-to-r from-[#B78D4A] to-[#A67B3A] rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-white/90 text-xs font-medium uppercase tracking-wide mb-1">
                  Aluguel Líquido
                </span>
                <span className="block text-white font-medium text-sm">
                  {rentableProperties} Imóve{rentableProperties === 1 ? 'l' : 'is'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-white">
                {income}
              </span>
            </div>
          </div>
        </div>
        
        {/* Financial Commitment */}
        <div className="p-3 border border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 text-sm">Parcelas</span>
            <span className="text-lg font-bold text-red-600">-{installment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalIncomeSection;
