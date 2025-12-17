
import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AlternativeScenarioProps {
  desiredIncome: string;
  requiredMonthlyInvestment: number;
  formatCurrency: (value: number) => string;
  onHideAlternative: () => void;
}

const AlternativeScenario = ({ 
  desiredIncome, 
  requiredMonthlyInvestment, 
  formatCurrency, 
  onHideAlternative 
}: AlternativeScenarioProps) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl text-blue-800 mb-4 font-bold">Simulação Alternativa</h3>
        <p className="text-lg text-blue-700 mb-6 leading-relaxed">
          Para alcançar sua meta de renda de <strong>{desiredIncome}</strong>, você precisaria investir <strong>{formatCurrency(requiredMonthlyInvestment)}</strong> por mês.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onHideAlternative}
            className="px-6 py-3 border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 rounded-2xl font-semibold transition-all"
          >
            Ver Cenário Atual
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold">
            Cenário Ideal (Atual)
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeScenario;
