import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Home, Wallet, PieChart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EvolutionDataPoint {
  year: number;
  valorImovel: number;
  saldoCaixa: number;
  patrimonioTotal: number;
}

interface EvolutionTabProps {
  valorCredito: number;
  duracaoCiclo: number;
  taxaRendimento: number;
  valorParcela: number;
  correcaoINCC: number;
}

export const EvolutionTab = ({
  valorCredito,
  duracaoCiclo,
  taxaRendimento,
  valorParcela,
  correcaoINCC
}: EvolutionTabProps) => {
  const [selectedYear, setSelectedYear] = useState(15);
  const [periodYears, setPeriodYears] = useState(5);

  const evolutionData = useMemo(() => {
    const data: EvolutionDataPoint[] = [];
    const anos = 20;
    const taxaMensal = taxaRendimento / 100 / 12;
    
    let saldoAcumulado = 0;
    
    for (let ano = 1; ano <= anos; ano++) {
      for (let mes = 1; mes <= 12; mes++) {
        const mesTotal = (ano - 1) * 12 + mes;
        
        if (mesTotal <= duracaoCiclo) {
          // Durante o ciclo do consórcio
          // 80% da parcela vai para investimento (20% são taxas administrativas)
          const parcelaInvestimento = valorParcela * 0.8;
          saldoAcumulado = saldoAcumulado * (1 + taxaMensal) + parcelaInvestimento;
        } else {
          // Após o fim do ciclo do consórcio
          // Continua investindo o valor total da parcela
          saldoAcumulado = saldoAcumulado * (1 + taxaMensal) + valorParcela;
        }
      }
      
      // O imóvel (carta de crédito) está disponível desde o ano 1
      data.push({
        year: ano,
        valorImovel: valorCredito,
        saldoCaixa: Math.round(saldoAcumulado),
        patrimonioTotal: Math.round(valorCredito + saldoAcumulado)
      });
    }
    
    return data;
  }, [valorCredito, duracaoCiclo, taxaRendimento, valorParcela]);

  const selectedYearData = evolutionData.find(d => d.year === selectedYear) || evolutionData[evolutionData.length - 1];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico */}
      <Card className="bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Evolução do Patrimônio
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acompanhe mês a mês como seu patrimônio cresce ao longo do tempo
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              valorImovel: {
                label: "Valor do Imóvel",
                color: "hsl(142, 76%, 36%)"
              },
              saldoCaixa: {
                label: "Saldo de Caixa",
                color: "hsl(38, 92%, 50%)"
              },
              patrimonioTotal: {
                label: "Patrimônio Total",
                color: "hsl(217, 91%, 60%)"
              }
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Anos', position: 'insideBottom', offset: -10, className: 'fill-foreground text-sm font-medium' }}
                  className="text-xs"
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  label={{ value: 'Valor', angle: -90, position: 'insideLeft', className: 'fill-foreground text-sm font-medium' }}
                  className="text-xs"
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">Ano {label}</p>
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-muted-foreground">{entry.name}:</span>
                              <span className="font-medium">{formatCurrency(entry.value)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valorImovel" 
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 2, r: 4 }}
                  name="Valor do Imóvel"
                  activeDot={{ r: 6, onClick: (e: any) => setSelectedYear(e.payload.year) }}
                />
                <Line 
                  type="monotone" 
                  dataKey="saldoCaixa" 
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(38, 92%, 50%)', strokeWidth: 2, r: 4 }}
                  name="Saldo de Caixa"
                  activeDot={{ r: 6, onClick: (e: any) => setSelectedYear(e.payload.year) }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patrimonioTotal" 
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 4 }}
                  name="Patrimônio Total"
                  activeDot={{ r: 6, onClick: (e: any) => setSelectedYear(e.payload.year) }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legenda customizada */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(142,76%,36%)]" />
              <span className="text-sm font-medium">Valor do Imóvel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(38,92%,50%)]" />
              <span className="text-sm font-medium">Saldo de Caixa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[hsl(217,91%,60%)]" />
              <span className="text-sm font-medium">Patrimônio Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escada de Evolução */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50/50 border border-gray-200/50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Evolução Anual do Patrimônio
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Crescimento progressivo ano a ano
          </p>
          
          {/* Seletor de Período */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <p className="text-sm font-medium text-muted-foreground mr-2">Período:</p>
            {[1, 5, 10, 15, 20].map((years) => (
              <button
                key={years}
                onClick={() => setPeriodYears(years)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                  ${periodYears === years 
                    ? 'bg-green-600 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {years} {years === 1 ? 'Ano' : 'Anos'}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-8">
            <div className="flex items-end justify-center gap-2 md:gap-4 min-w-max px-4 py-8">
              {evolutionData.slice(0, periodYears).map((yearData, index) => {
                const investimentoInicial = valorParcela * 12 * yearData.year;
                const crescimentoPercentual = ((yearData.patrimonioTotal - investimentoInicial) / investimentoInicial) * 100;
                
                // Ajustar altura e largura baseado no período
                const maxBarHeight = periodYears <= 5 ? 320 : periodYears <= 10 ? 280 : 240;
                const minBarHeight = periodYears <= 5 ? 80 : periodYears <= 10 ? 60 : 50;
                const barWidth = periodYears <= 5 ? 'w-28 md:w-40' : periodYears <= 10 ? 'w-24 md:w-32' : 'w-20 md:w-24';
                
                const heightIncrement = periodYears === 1 ? 0 : (maxBarHeight - minBarHeight) / (periodYears - 1);
                const barHeight = minBarHeight + index * heightIncrement;
                const isSelected = selectedYear === yearData.year;
                
                return (
                  <button
                    key={yearData.year}
                    onClick={() => setSelectedYear(yearData.year)}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    {/* Informações acima da barra */}
                    <div className="flex flex-col items-center gap-0.5 mb-1">
                      <p className={`font-semibold text-gray-700 ${periodYears > 10 ? 'text-xs' : 'text-sm'}`}>
                        Ano {yearData.year}
                      </p>
                      <p className={`font-bold text-gray-900 ${periodYears > 10 ? 'text-sm' : 'text-lg md:text-xl'}`}>
                        {formatCurrency(yearData.patrimonioTotal)}
                      </p>
                      <p className={`text-gray-600 ${periodYears > 10 ? 'text-[10px]' : 'text-xs'}`}>
                        Imóvel: {formatCurrency(yearData.valorImovel)}
                      </p>
                      <p className={`text-gray-600 ${periodYears > 10 ? 'text-[10px]' : 'text-xs'}`}>
                        Rendimento: {formatCurrency(yearData.saldoCaixa)}
                      </p>
                      <p className={`font-medium text-orange-600 ${periodYears > 10 ? 'text-xs' : 'text-sm'}`}>
                        +{crescimentoPercentual.toFixed(1)}%
                      </p>
                    </div>
                    
                    {/* Barra com gradiente */}
                    <div
                      className={`
                        relative ${barWidth} rounded-[32px] 
                        bg-gradient-to-b from-[#7C8B3B] via-[#4A5F3C] to-[#2F4538]
                        shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]
                        transition-all duration-300
                        group-hover:scale-105 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)]
                        ${isSelected ? 'ring-4 ring-green-400 scale-105' : ''}
                      `}
                      style={{ height: `${barHeight}px` }}
                    >
                      {/* Ícone de seta no centro da barra do meio */}
                      {index === Math.floor(periodYears / 2) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TrendingUp className={`text-white/80 ${periodYears > 10 ? 'w-4 h-4' : 'w-6 h-6'}`} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              💡 Clique em qualquer barra para visualizar os detalhes completos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento Anual */}
      <Card className="border-2 border-primary/20 shadow-lg max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Detalhamento por Ano</CardTitle>
          <div className="flex items-center justify-center gap-4 pt-4">
            <p className="text-sm text-muted-foreground">Ano Selecionado:</p>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {evolutionData.map((item) => (
                  <SelectItem key={item.year} value={item.year.toString()}>
                    Ano {item.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Saldo de Caixa */}
          <div className="flex flex-col items-center gap-3 p-6 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <Wallet className="w-8 h-8 text-orange-600" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Saldo de Caixa</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(selectedYearData.saldoCaixa)}
              </p>
            </div>
          </div>

          {/* Valor do Imóvel */}
          <div className="flex flex-col items-center gap-3 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <Home className="w-8 h-8 text-green-600" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Valor do Imóvel</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(selectedYearData.valorImovel)}
              </p>
            </div>
          </div>

          {/* Patrimônio Total */}
          <div className="flex flex-col items-center gap-3 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-400 dark:border-blue-600">
            <PieChart className="w-8 h-8 text-blue-600" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Patrimônio Total</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(selectedYearData.patrimonioTotal)}
              </p>
            </div>
          </div>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              💡 Clique nos pontos do gráfico para visualizar dados de outros anos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
