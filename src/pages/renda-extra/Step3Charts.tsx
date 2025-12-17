import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import RCButton from "@/components/RCButton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const RendaExtraStep3 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  // Data for patrimony accumulation (based on R$ 500k per property)
  const patrimonyData = [
    { cycle: 1, value: 500000 },
    { cycle: 2, value: 1000000 },
    { cycle: 3, value: 1500000 },
    { cycle: 4, value: 2000000 },
  ];

  // Data for monthly income evolution (R$ 5k per property)
  const incomeData = [
    { cycle: 1, income: 5000 },
    { cycle: 2, income: 10000 },
    { cycle: 3, income: 15000 },
    { cycle: 4, income: 20000 },
  ];

  // Data for reinvestment comparison over years
  const reinvestmentData = [
    { year: 0, withReinvestment: 0, withoutReinvestment: 0 },
    { year: 5, withReinvestment: 500000, withoutReinvestment: 500000 },
    { year: 10, withReinvestment: 1000000, withoutReinvestment: 500000 },
    { year: 15, withReinvestment: 1500000, withoutReinvestment: 500000 },
    { year: 20, withReinvestment: 2000000, withoutReinvestment: 500000 },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-manrope">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-[#193D32] mb-4">
            Comparativo Gráfico
          </h1>
          <p className="text-2xl text-[#B78D4A] font-semibold mb-4">
            Análise de Performance
          </p>
          <p className="text-lg text-[#333333]/70 max-w-3xl mx-auto leading-relaxed">
            Visualize a evolução do seu patrimônio e renda com e sem reinvestimento
          </p>
        </div>

        {/* Patrimônio Acumulado Chart */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9F7F2] overflow-hidden">
            <div className="flex items-center p-8 pb-0">
              <BarChart3 className="w-8 h-8 text-[#193D32] mr-4" />
              <h3 className="text-2xl font-bold text-[#193D32]">Patrimônio Acumulado</h3>
            </div>
            <div className="p-8 pt-6">
              <ChartContainer
                config={{
                  value: {
                    label: "Patrimônio",
                    color: "#193D32"
                  }
                }}
                className="h-96 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patrimonyData} margin={{ top: 20, right: 40, left: 40, bottom: 60 }}>
                    <defs>
                      <linearGradient id="patrimonyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#193D32" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#E9F7F2" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="cycle" 
                      label={{ value: 'Ciclos', position: 'insideBottom', offset: -20, style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#333333' } }}
                      tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333333' }}
                      tickFormatter={(value) => `Ciclo ${value}`}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tickFormatter={formatCurrency}
                      label={{ value: 'Patrimônio Total', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#333333' } }}
                      tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333333' }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      width={80}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [formatCurrency(value), "Patrimônio"]}
                      labelFormatter={(label) => `Ciclo ${label}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #B78D4A',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#333333',
                        fontWeight: '500'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#193D32" 
                      strokeWidth={3}
                      fill="url(#patrimonyGradient)"
                      dot={{ fill: '#193D32', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#B78D4A', strokeWidth: 2, stroke: '#FFFFFF' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Evolução da Renda Mensal Chart */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E9F7F2] overflow-hidden">
            <div className="flex items-center p-8 pb-0">
              <TrendingUp className="w-8 h-8 text-[#193D32] mr-4" />
              <h3 className="text-2xl font-bold text-[#193D32]">Evolução da Renda Mensal</h3>
            </div>
            <div className="p-8 pt-6">
              <ChartContainer
                config={{
                  income: {
                    label: "Renda Mensal",
                    color: "#B78D4A"
                  }
                }}
                className="h-96 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeData} margin={{ top: 20, right: 40, left: 40, bottom: 60 }}>
                    <XAxis 
                      dataKey="cycle" 
                      label={{ value: 'Ciclos', position: 'insideBottom', offset: -20, style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#333333' } }}
                      tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333333' }}
                      tickFormatter={(value) => `Ciclo ${value}`}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                      label={{ value: 'Renda Mensal', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold', fill: '#333333' } }}
                      tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333333' }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      width={80}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Renda Mensal"]}
                      labelFormatter={(label) => `Ciclo ${label}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #B78D4A',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#333333',
                        fontWeight: '500'
                      }}
                    />
                    <Bar 
                      dataKey="income" 
                      fill="#B78D4A" 
                      radius={[12, 12, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Crescimento Exponencial com Reinvestimento */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#E9F7F2]">
            <div className="flex items-center mb-8">
              <PieChart className="w-8 h-8 text-[#193D32] mr-4" />
              <h3 className="text-2xl font-bold text-[#193D32]">Crescimento Exponencial com Reinvestimento</h3>
            </div>
            
            <div className="bg-[#C8F4D1] rounded-2xl p-8 border-2 border-[#355F4D]/20">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#193D32] rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#193D32] mb-3">Crescimento Exponencial com Reinvestimento</h4>
                <p className="text-[#355F4D] text-sm leading-relaxed">Reinvestimento dos lucros acelera crescimento patrimonial</p>
              </div>
              <ChartContainer
                config={{
                  withReinvestment: {
                    label: "Com Reinvestimento",
                    color: "#193D32"
                  }
                }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reinvestmentData} margin={{ top: 20, right: 20, left: 40, bottom: 40 }}>
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 12, fill: '#333333', fontWeight: 'bold' }}
                      label={{ value: 'Anos', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold', fill: '#333333' } }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tickFormatter={formatCurrency} 
                      tick={{ fontSize: 12, fill: '#333333', fontWeight: 'bold' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      width={60}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [formatCurrency(value), "Patrimônio"]}
                      labelFormatter={(label) => `Ano ${label}`}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #193D32',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#333333'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withReinvestment" 
                      stroke="#193D32" 
                      strokeWidth={3}
                      dot={{ fill: '#193D32', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 7, fill: '#B78D4A', strokeWidth: 2, stroke: '#FFFFFF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-[#B78D4A] transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-[#193D32] mb-4">300%</div>
              <p className="text-[#355F4D] font-semibold text-lg leading-tight">Maior retorno com reinvestimento</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-[#B78D4A] transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-[#193D32] mb-4">5 anos</div>
              <p className="text-[#355F4D] font-semibold text-lg leading-tight">Para atingir independência financeira</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-[#B78D4A] transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold text-[#193D32] mb-4">15%</div>
              <p className="text-[#355F4D] font-semibold text-lg leading-tight">Rentabilidade média anual</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <RCButton 
            variant="auxiliary" 
            onClick={() => navigateWithPreview("/renda-extra/step2")}
            className="border-2 border-[#193D32] text-[#193D32] hover:bg-[#193D32] hover:text-white px-8 py-3 rounded-full transition-all duration-300 font-semibold"
          >
            Voltar
          </RCButton>
          <RCButton 
            variant="primary" 
            onClick={() => navigateWithPreview("/renda-extra/step4")}
            className="bg-[#B78D4A] hover:bg-[#B78D4A]/90 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            Avançar
          </RCButton>
        </div>
      </div>
    </div>
  );
};

export default RendaExtraStep3;
