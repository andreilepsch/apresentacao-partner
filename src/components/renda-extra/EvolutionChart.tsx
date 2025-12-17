import { TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface SimulationData {
  year: number;
  invested: number;
  patrimony: number;
  properties: number;
}

interface EvolutionChartProps {
  chartData: SimulationData[];
  formatCurrency: (value: number) => string;
  showAlternative: boolean;
}

const EvolutionChart = ({ chartData, formatCurrency, showAlternative }: EvolutionChartProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/50 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rc-primary to-rc-primary/95 p-8">
        <CardTitle className="text-white text-3xl font-bold flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-rc-secondary" />
          Evolução do Seu Patrimônio {showAlternative ? "(Cenário Ideal)" : "(Cenário Atual)"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ChartContainer
          config={{
            invested: {
              label: "Valor Investido",
              color: "#224239"
            },
            patrimony: {
              label: "Patrimônio Acumulado",
              color: "#BA9356"
            }
          }}
          className="h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="year" 
                label={{ value: 'Anos', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <YAxis 
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Total', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' } }}
                tick={{ fontSize: 12, fontWeight: 'bold' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "invested" ? "Valor Investido" : "Patrimônio Acumulado"
                ]}
                labelFormatter={(label) => `Ano ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="invested" 
                stroke="#224239" 
                strokeWidth={4}
                dot={{ fill: '#224239', strokeWidth: 2, r: 6 }}
                name="Valor Investido"
              />
              <Line 
                type="monotone" 
                dataKey="patrimony" 
                stroke="#BA9356" 
                strokeWidth={4}
                dot={{ fill: '#BA9356', strokeWidth: 2, r: 6 }}
                name="Patrimônio Acumulado"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EvolutionChart;