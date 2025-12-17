
import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SimulationResults {
  totalProperties: number;
  totalPatrimony: number;
  monthlyIncome: number;
}

interface FinalMessageProps {
  results: SimulationResults;
  formData: { timeframe: string };
  formatCurrency: (value: number) => string;
  showAlternative: boolean;
  alternativeResults?: { requiredMonthlyInvestment: number };
}

const FinalMessage = ({ 
  results, 
  formData, 
  formatCurrency, 
  showAlternative, 
  alternativeResults 
}: FinalMessageProps) => {
  return (
    <Card className="bg-gradient-to-br from-rc-accent/20 to-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardContent className="p-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-rc-secondary to-rc-secondary/90 rounded-full flex items-center justify-center mx-auto mb-8">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-3xl text-rc-primary mb-8 font-bold">
          {showAlternative ? "Cenário Ideal - O que você pode alcançar" : "O que você pode alcançar se iniciasse hoje"}
        </h3>
        <div className="space-y-6 text-lg text-rc-type leading-relaxed max-w-3xl mx-auto">
          <p className="bg-white p-6 rounded-2xl border border-rc-accent shadow-sm">
            {showAlternative && alternativeResults ? (
              <>Investindo <strong className="text-rc-primary">{formatCurrency(alternativeResults.requiredMonthlyInvestment)}</strong> por mês, em <strong className="text-rc-primary">{formData.timeframe} anos</strong> você conquistará <strong className="text-rc-primary">{results.totalProperties} imóveis</strong>.</>
            ) : (
              <>Com o que você pode investir hoje, em <strong className="text-rc-primary">{formData.timeframe} anos</strong> você pode conquistar até <strong className="text-rc-primary">{results.totalProperties} imóveis</strong>.</>
            )}
          </p>
          <p className="bg-white p-6 rounded-2xl border border-rc-accent shadow-sm">
            🏠 Seu patrimônio estimado será de <strong className="text-rc-secondary">{formatCurrency(results.totalPatrimony)}</strong>.
          </p>
          <p className="bg-white p-6 rounded-2xl border border-rc-accent shadow-sm">
            💰 Seus imóveis gerarão <strong className="text-rc-primary">{formatCurrency(results.monthlyIncome)}</strong> de renda mensal.
          </p>
          <p className="bg-gradient-to-r from-rc-primary to-rc-primary/95 text-white p-8 rounded-2xl font-semibold text-xl">
            E o melhor: <strong>sem juros e com os próprios imóveis se pagando no caminho.</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalMessage;
