
import { FC } from "react";
import { Calculator } from "lucide-react";

interface FinancialData {
  propertyValue: string;
  occupancy: string;
  dailyRate: string;
  monthlyCosts: string;
  grossReturn: string;
  netReturn: string;
}

interface FinancialAnalysisProps {
  data: FinancialData;
}

const FinancialAnalysis: FC<FinancialAnalysisProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#F7F5F0] rounded-xl p-6">
        <h3 className="text-xl font-bold text-[#193D32] mb-6 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-[#B78D4A]" />
          Análise Financeira
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#333333]">Valor do imóvel</span>
            <span className="font-bold text-[#193D32]">{data.propertyValue}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#333333]">Taxa de ocupação</span>
            <span className="font-bold text-[#193D32]">{data.occupancy}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#333333]">Diária média</span>
            <span className="font-bold text-[#193D32]">{data.dailyRate}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#333333]">Custos mensais</span>
            <span className="font-bold text-red-600">{data.monthlyCosts}</span>
          </div>
          
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#333333]">Receita bruta/mês</span>
              <span className="font-bold text-[#193D32]">{data.grossReturn}</span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-[#333333]">Rentabilidade líquida/mês</span>
              <span className="font-bold text-[#B78D4A] text-lg">{data.netReturn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
