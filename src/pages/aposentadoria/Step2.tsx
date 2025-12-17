import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Home, MapPin, Users, Calendar, DollarSign, Percent } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AposentadoriaStep2 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  // Dados para o gráfico de crescimento do aluguel - baseado na imagem de referência
  const propertyValorization = [
    { year: "Out 2021", value: 9000 },
    { year: "Abr 2022", value: 12000 },
    { year: "Out 2022", value: 13000 },
    { year: "Abr 2023", value: 16000 },
    { year: "Out 2023", value: 18000 },
    { year: "Abr 2024", value: 27000 }
  ];

  // Dados para o gráfico de canais (baseado na imagem)
  const channels = [
    { name: "Airbnb", value: 65, color: "#B78D4A" },
    { name: "Booking", value: 25, color: "#193D32" },
    { name: "Direto", value: 10, color: "#D4B570" }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
            <Target className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">PILARES</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Como escolhemos os imóveis
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Nossa seleção segue três pilares fundamentais baseados em dados e análise estratégica de mercado
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Cards dos Pilares */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1 - Potencial de Valorização */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-[#193D32] to-[#193D32]/90 text-white p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#B78D4A]" />
                1 - Potencial de Valorização
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Top metrics section */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Total Listings */}
                  <div className="bg-gradient-to-br from-[#F7F5F0] to-[#F7F5F0]/80 rounded-lg p-4">
                    <div className="text-xs text-[#B78D4A] font-semibold mb-1">LISTAGENS ATIVAS</div>
                    <div className="text-2xl font-bold text-[#193D32] mb-1">24,640</div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">+41%</span>
                    </div>
                  </div>
                  
                  {/* Channel Distribution */}
                  <div className="bg-gradient-to-br from-[#F7F5F0] to-[#F7F5F0]/80 rounded-lg p-4">
                    <div className="text-xs text-[#B78D4A] font-semibold mb-2">CANAIS</div>
                    <div className="w-16 h-16 mx-auto mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channels}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={30}
                            dataKey="value"
                          >
                            {channels.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Channel legend */}
                <div className="flex flex-wrap gap-2 text-xs justify-center mb-4">
                  {channels.map((channel, index) => (
                    <div key={index} className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border border-gray-200">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channel.color }}></div>
                      <span className="text-[#666666]">{channel.name} {channel.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart title */}
              <div className="mb-4">
                <div className="bg-gradient-to-r from-[#193D32] to-[#193D32]/90 text-white rounded-lg px-4 py-2 text-center">
                  <div className="text-sm font-semibold">Crescimento do aluguel nos últimos 3 anos</div>
                  <div className="text-lg font-bold text-[#B78D4A]">+41%</div>
                </div>
              </div>

              {/* Main chart */}
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3">
                <ChartContainer
                  config={{
                    value: {
                      label: "Active Listings",
                      color: "#B78D4A"
                    }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={propertyValorization}>
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 9, fill: '#666666' }}
                        interval={1}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 9, fill: '#666666' }} 
                        tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
                        domain={['dataMin - 10000', 'dataMax + 10000']}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} listagens`, "Active Listings"]}
                        contentStyle={{
                          backgroundColor: '#193D32',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#B78D4A" 
                        strokeWidth={3}
                        dot={{ fill: '#B78D4A', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#193D32', stroke: '#B78D4A', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - Alta Demanda de Locação */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-[#193D32] to-[#193D32]/90 text-white p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <Home className="w-6 h-6 text-[#B78D4A]" />
                2 - Alta Demanda de Locação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Destaque para Taxa de Ocupação */}
              <div className="bg-gradient-to-r from-[#B78D4A] to-[#D4B570] text-white rounded-lg p-6 mb-6 text-center">
                <div className="text-sm text-white/90 mb-2">Taxa de Ocupação</div>
                <div className="text-4xl font-bold mb-2">70%</div>
                <div className="text-sm text-white/90">Principal indicador de demanda</div>
              </div>

             {/* Outras métricas */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#F7F5F0] rounded-lg">
                  <div>
                    <div className="text-sm text-[#333333]">Receita Anual</div>
                    <div className="text-xl font-bold text-[#193D32]">R$ 70,2 mil</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">+8%</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-[#F7F5F0] rounded-lg">
                  <div>
                    <div className="text-sm text-[#333333]">Taxa Média Diária</div>
                    <div className="text-xl font-bold text-[#193D32]">R$ 350</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">+2%</div>
                </div>
              </div>

              {/* Ícones de benefícios with updated theme */}
              <div className="flex justify-around mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-[#B78D4A] mx-auto mb-1" />
                  <div className="text-xs text-[#333333]">Fluxo<br />Contínuo</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-[#B78D4A] mx-auto mb-1" />
                  <div className="text-xs text-[#333333]">Sazonalidade<br />Favorável</div>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-[#B78D4A] mx-auto mb-1" />
                  <div className="text-xs text-[#333333]">Demanda<br />Garantida</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 - Comprar Abaixo do Valor */}
          <Card className="bg-white border border-gray-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-[#193D32] to-[#193D32]/90 text-white p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <MapPin className="w-6 h-6 text-[#B78D4A]" />
                3 - Comprar Abaixo do Valor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative">
              {/* Mapa simulado com pins na cor da paleta */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-48 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#193D32]/5 to-[#B78D4A]/5"></div>
                
                {/* Múltiplos pins distribuídos pelo mapa usando a cor da paleta */}
                <div className="absolute top-6 left-8">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-12 right-12">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-16 left-1/3">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-20 right-1/4">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute bottom-20 left-16">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute bottom-16 right-8">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-24 left-20">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute bottom-8 right-20">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute top-32 left-12">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div className="absolute bottom-24 left-1/4">
                  <div className="w-3 h-3 bg-[#B78D4A] rounded-full border-2 border-white shadow-lg"></div>
                </div>

                {/* Labels das regiões - apenas São Paulo */}
                <div className="absolute bottom-8 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-[#193D32]">
                  São Paulo
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#F7F5F0] rounded-lg">
                  <Percent className="w-5 h-5 text-[#B78D4A]" />
                  <span className="text-sm text-[#333333]">Oportunidades exclusivas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F7F5F0] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#B78D4A]" />
                  <span className="text-sm text-[#333333]">Localizações estratégicas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#B78D4A] to-[#D4B570] text-white rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm">Abaixo do valor de mercado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mensagem Final */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#193D32] rounded-xl p-8 text-center text-white">
            <Target className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">
              Estratégia baseada em dados
            </h3>
            <p className="text-white/90 leading-relaxed">
              Cada imóvel é criteriosamente selecionado através de análise técnica aprofundada, 
              garantindo que seu investimento tenha o máximo potencial de rentabilidade e valorização.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step1")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step3")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Caso Real →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep2;
