
import { FC } from "react";

interface ComparisonItem {
  type: string;
  monthlyIncome: string;
  costs: string;
  netIncome: string;
  yearlyReturn: string;
  color: string;
}

interface ComparisonCardsProps {
  data: ComparisonItem[];
}

const ComparisonCards: FC<ComparisonCardsProps> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto mb-16">
      <h3 className="text-[22px] font-semibold text-[#193D32] text-center mb-8">
        Comparativo: Locação tradicional vs Estratégica
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="text-center mb-6">
              <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-3`}></div>
              <h4 className="text-lg font-bold text-[#193D32]">{item.type}</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#333333]">Receita mensal:</span>
                <span className="font-semibold">{item.monthlyIncome}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-[#333333]">Custos mensais:</span>
                <span className="font-semibold text-red-600">{item.costs}</span>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <span className="text-sm font-medium text-[#333333]">Lucro líquido:</span>
                <span className="font-bold text-[#193D32]">{item.netIncome}</span>
              </div>
              
              <div className="text-center pt-4">
                <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${item.color}`}>
                  {item.yearlyReturn} ao ano
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonCards;
