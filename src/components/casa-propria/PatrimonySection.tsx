
import { Building2, TrendingUp } from "lucide-react";

interface PatrimonySectionProps {
  patrimony: string;
  installment: string;
}

const PatrimonySection = ({ patrimony, installment }: PatrimonySectionProps) => {
  return (
    <div className="bg-gradient-to-br from-[#B78D4A]/5 to-white rounded-2xl p-4 border border-[#B78D4A]/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#B78D4A]/10 rounded-xl">
          <Building2 className="w-5 h-5 text-[#355F4D]" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#224239]">
            Situação Patrimonial
          </h4>
          <p className="text-gray-500 text-sm">Patrimônio construído vs. compromisso mensal</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Patrimony Card */}
        <div className="p-4 border border-[#B78D4A]/20 rounded-xl bg-gradient-to-br from-[#B78D4A]/10 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B78D4A] font-medium text-sm">
              Patrimônio
            </span>
            <TrendingUp className="w-4 h-4 text-[#B78D4A]" />
          </div>
          <span className="text-lg font-bold text-[#224239]">
            {patrimony}
          </span>
        </div>

        {/* Installment Card */}
        <div className="p-4 border border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-600 font-medium text-sm">
              Parcela
            </span>
            <div className="w-4 h-4 border-2 border-red-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            </div>
          </div>
          <span className="text-lg font-bold text-red-600">
            -{installment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatrimonySection;
