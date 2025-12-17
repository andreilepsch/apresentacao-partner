
import { Home, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SimulationResults {
  totalProperties: number;
  totalPatrimony: number;
  totalInvested: number;
  monthlyIncome: number;
}

interface ResultsCardsProps {
  results: SimulationResults;
  formatCurrency: (value: number) => string;
}

const ResultsCards = ({ results, formatCurrency }: ResultsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-gradient-to-br from-white to-rc-accent/20 border-0 shadow-2xl hover:shadow-3xl transition-all rounded-3xl overflow-hidden group">
        <CardContent className="p-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rc-primary to-rc-primary/90 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Home className="w-10 h-10 text-white" />
          </div>
          <div className="text-5xl font-bold text-rc-primary mb-3">{results.totalProperties}</div>
          <div className="text-xl text-rc-type font-semibold mb-2">Imóveis Conquistados</div>
          <div className="text-sm text-rc-type/70">Patrimônio construído com inteligência</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-white to-rc-secondary/10 border-0 shadow-2xl hover:shadow-3xl transition-all rounded-3xl overflow-hidden group">
        <CardContent className="p-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rc-secondary to-rc-secondary/90 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="text-3xl font-bold text-rc-primary mb-3">{formatCurrency(results.totalPatrimony)}</div>
          <div className="text-xl text-rc-type font-semibold mb-2">Patrimônio Acumulado</div>
          <div className="text-sm text-rc-type/70">Valor total em imóveis</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCards;
