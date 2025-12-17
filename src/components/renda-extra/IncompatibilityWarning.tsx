
import { AlertTriangle, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface IncompatibilityWarningProps {
  monthlyInvestment: string;
  currentIncome: number;
  desiredIncome: string;
  formatCurrency: (value: number) => string;
  onShowAlternative: () => void;
}

const IncompatibilityWarning = ({ 
  monthlyInvestment, 
  currentIncome, 
  desiredIncome, 
  formatCurrency, 
  onShowAlternative 
}: IncompatibilityWarningProps) => {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl text-orange-800 mb-4 font-bold">Atenção!</h3>
        <p className="text-lg text-orange-700 mb-6 leading-relaxed">
          Com seu investimento atual de <strong>{monthlyInvestment}</strong>, você gerará uma renda de <strong>{formatCurrency(currentIncome)}</strong>, 
          que é menor que sua meta de <strong>{desiredIncome}</strong>.
        </p>
        <button
          onClick={onShowAlternative}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          <Calculator className="w-5 h-5" />
          Ver Quanto Preciso Investir
        </button>
      </CardContent>
    </Card>
  );
};

export default IncompatibilityWarning;
