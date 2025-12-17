
import { Building2, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useInvestmentSimulation } from "@/hooks/useInvestmentSimulation";

interface RetirementProjectionProps {
  monthlyInvestment: number;
  targetRetirement: number;
  currentAge: number;
  retirementAge: number;
  formatCurrency: (value: number) => string;
}

const RetirementProjection = ({ 
  monthlyInvestment, 
  targetRetirement, 
  currentAge, 
  retirementAge,
  formatCurrency 
}: RetirementProjectionProps) => {
  const { getRetirementCycleData, getAppreciatedTotalPatrimony } = useInvestmentSimulation();
  const yearsToRetirement = retirementAge - currentAge;
  const totalInvested = monthlyInvestment * 12 * yearsToRetirement;
  
  const cycles = getRetirementCycleData(monthlyInvestment, currentAge, retirementAge);
  const totalCycles = cycles.length;
  
  // Cálculos com valorização
  const basePropertyValue = (monthlyInvestment / 500) * 100000;
  const achievableProperties = totalCycles;
  
  // Usar cálculos diretos com valorização
  const totalPatrimonyNum = totalCycles > 0 ? getAppreciatedTotalPatrimony(basePropertyValue, totalCycles) : 0;
  const achievableIncomeNum = totalPatrimonyNum * 0.01;
  
  // Strings formatadas para exibição
  const achievableIncomeStr = formatCurrency(achievableIncomeNum);
  const totalPatrimonyStr = formatCurrency(totalPatrimonyNum);

  return (
    <div className="space-y-8">
      {/* Header com dados principais */}
      <div className="text-center bg-gradient-to-r from-[#193D32] to-[#193D32]/90 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Sua meta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-[#B78D4A] mb-2">{yearsToRetirement} anos</div>
            <div className="text-sm opacity-90">Para aposentar</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-[#B78D4A] mb-2">{formatCurrency(monthlyInvestment)}</div>
            <div className="text-sm opacity-90">Investimento mensal</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-[#B78D4A] mb-2">{formatCurrency(targetRetirement)}</div>
            <div className="text-sm opacity-90">Renda desejada</div>
          </div>
        </div>
      </div>

      {/* Cards de resultados principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-white to-[#F7F5F0] border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#193D32] to-[#193D32]/90 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-[#193D32] mb-3">{achievableProperties}</div>
            <div className="text-lg text-[#333333] font-semibold mb-2">Imóveis Conquistados</div>
            <div className="text-sm text-[#333333]/70">Em {yearsToRetirement} anos de investimento</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-[#F7F5F0] border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B78D4A] to-[#B78D4A]/90 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#193D32] mb-3">{achievableIncomeStr}</div>
            <div className="text-lg text-[#333333] font-semibold mb-2">Renda Mensal Alcançável</div>
            <div className="text-sm text-[#333333]/70">Através dos aluguéis</div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo financeiro com design aprimorado */}
      <div className="bg-gradient-to-r from-[#F7F5F0] to-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-bold text-[#193D32] text-center mb-6">Resumo do Investimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-xl font-bold text-[#193D32] mb-2">{formatCurrency(totalInvested)}</div>
            <div className="text-sm text-[#333333] font-medium">Total Investido</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-xl font-bold text-[#193D32] mb-2">{totalPatrimonyStr}</div>
            <div className="text-sm text-[#333333] font-medium">Patrimônio Total</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="text-xl font-bold text-green-600 mb-2">
              {formatCurrency(totalPatrimonyNum - totalInvested)}
            </div>
            <div className="text-sm text-[#333333] font-medium">Valorização</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementProjection;
