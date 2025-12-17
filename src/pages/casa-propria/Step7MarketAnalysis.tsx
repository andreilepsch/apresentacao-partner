
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target, Calendar, DollarSign } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const CasaPropriaStep7 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const marketData = [
    {
      title: "Pontuação de Mercado",
      value: "8.5/10",
      icon: Target,
      description: "Mercado muito atrativo"
    },
    {
      title: "Receita Anual Média", 
      value: "R$ 75.600",
      icon: DollarSign,
      description: "Por imóvel na região"
    },
    {
      title: "Taxa de Ocupação",
      value: "76%",
      icon: Calendar,
      description: "Média anual sustentável"
    }
  ];

  const demandData = [
    { type: "Executivos", percentage: "28%", color: "bg-[#193D32]" },
    { type: "Turistas", percentage: "22%", color: "bg-[#B78D4A]" },
    { type: "Eventos", percentage: "16%", color: "bg-[#355F4D]" },
    { type: "Saúde", percentage: "14%", color: "bg-[#4A7C59]" },
    { type: "Estudos", percentage: "12%", color: "bg-[#6B7280]" },
    { type: "Outros", percentage: "8%", color: "bg-gray-400" }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-6 py-3 mb-8">
            <Target className="w-5 h-5 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-sm tracking-wide uppercase">MERCADO</span>
          </div>

          <h1 className="text-[36px] font-bold text-[#193D32] mb-6 leading-tight">
            Estudo de mercado: São Paulo
          </h1>
          <p className="text-[18px] font-normal text-[#333333] mb-8 max-w-3xl mx-auto leading-relaxed">
            Dados reais que mostram o potencial de valorização e demanda
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center mb-16">
            <div className="w-[60px] h-[3px] bg-[#B78D4A] rounded-full"></div>
          </div>
        </div>

        {/* Market Heat Map */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Heat Map */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(25,61,50,0.12)] border border-[#B78D4A]/10">
                <img 
                  src="/lovable-uploads/761c375f-ab6d-433f-aec6-82478d070d8e.png"
                  alt="Mapa de Calor - São Paulo - Potencial de rentabilidade por região"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="text-center mt-6">
                <p className="text-base font-semibold text-[#193D32] mb-2">Mapa de Calor - São Paulo</p>
                <p className="text-sm text-[#333333]/70">Potencial de rentabilidade por região</p>
              </div>
            </div>

            {/* Market Stats */}
            <div className="order-1 lg:order-2 space-y-6">
              {marketData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_rgba(25,61,50,0.08)] border border-[#B78D4A]/10 hover:shadow-[0_12px_40px_rgba(25,61,50,0.12)] transition-all duration-300 hover:border-[#B78D4A]/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#193D32] to-[#355F4D] rounded-xl flex items-center justify-center shadow-lg">
                      <item.icon className="w-8 h-8 text-[#B78D4A]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-[#193D32] mb-1">{item.value}</div>
                      <div className="text-lg font-semibold text-[#193D32] mb-1">{item.title}</div>
                      <div className="text-sm text-[#333333]/70">{item.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demand Analysis */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-[#F7F5F0] to-[#F7F5F0]/80 rounded-2xl p-12 shadow-[0_8px_32px_rgba(25,61,50,0.08)] border border-[#B78D4A]/10">
            <div className="text-center mb-12">
              <h3 className="text-[28px] font-bold text-[#193D32] mb-4">
                Perfil da Demanda - Domingos de Moraes
              </h3>
              <p className="text-[16px] text-[#333333]/70 max-w-2xl mx-auto">
                Distribuição dos tipos de hóspedes que procuram imóveis na região
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {demandData.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-24 h-24 ${item.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">{item.percentage}</span>
                  </div>
                  <div className="font-semibold text-[#193D32] text-lg">{item.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Projections */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-[#193D32] to-[#355F4D] rounded-2xl p-12 text-white text-center shadow-[0_12px_40px_rgba(25,61,50,0.25)]">
            <h3 className="text-[32px] font-bold mb-8">Projeções para 2025-2027</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold text-[#B78D4A] mb-3">+12%</div>
                <div className="text-base font-medium">Crescimento anual médio</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold text-[#B78D4A] mb-3">R$ 320</div>
                <div className="text-base font-medium">Diária média projetada</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-4xl font-bold text-[#B78D4A] mb-3">80%</div>
                <div className="text-base font-medium">Taxa de ocupação esperada</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/casa-propria/step6")}
            className="px-8 py-4 border-2 border-[#193D32] text-[#193D32] hover:bg-[#193D32] hover:text-white transition-all duration-300 rounded-xl font-semibold"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/casa-propria/step8")}
            className="text-[16px] px-8 py-4 bg-gradient-to-r from-[#B78D4A] to-[#355F4D] hover:from-[#355F4D] hover:to-[#193D32] text-white border-0 shadow-lg rounded-xl font-semibold transition-all duration-300"
          >
            Maneiras de Comprar um Imóvel →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaStep7;
