

import { useNavigate } from "react-router-dom";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import RCButton from "@/components/RCButton";
import { Check, Building2, Star, MapPin } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const Step2Presence = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const states = [
    { name: "São Paulo", region: "Sudeste" },
    { name: "Rio de Janeiro", region: "Sudeste" },
    { name: "Minas Gerais", region: "Sudeste" },
    { name: "Distrito Federal", region: "Centro-Oeste" },
    { name: "Goiás", region: "Centro-Oeste" },
    { name: "Paraná", region: "Sul" },
    { name: "Santa Catarina", region: "Sul" },
    { name: "Rio Grande do Sul", region: "Sul" },
    { name: "Bahia", region: "Nordeste" },
    { name: "Ceará", region: "Nordeste" },
    { name: "Paraíba", region: "Nordeste" },
    { name: "Rio Grande do Norte", region: "Nordeste" }
  ];

  const lastRowStates = [
    { name: "Pernambuco", region: "Nordeste" },
    { name: "Alagoas", region: "Nordeste" }
  ];

  const highlights = [
    {
      icon: Check,
      title: "Presença em mais de 14 estados brasileiros",
      subtitle: "Cobertura nacional estratégica"
    },
    {
      icon: Building2,
      title: "Suporte completo na locação",
      subtitle: "Gestão end-to-end dos seus investimentos"
    },
    {
      icon: Star,
      title: "Oportunidades selecionadas",
      subtitle: "Os melhores investimentos em cada região"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Badge Premium */}
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">PRESENÇA NACIONAL</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl md:text-4xl font-semibold text-[#193D32] mb-6 leading-tight">
            Onde estamos mudando o jogo no mercado imobiliário
          </h1>
          
          <p className="text-base md:text-lg text-[#355F4D] mb-8 max-w-4xl mx-auto leading-relaxed">
            Atuamos em mais de 14 estados e já ajudamos milhares de brasileiros a conquistar seus imóveis com inteligência financeira.
          </p>
          
          {/* Divisor dourado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Estados Container */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
            
            {/* Título da seção */}
            <div className="text-center mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-[#193D32] mb-8">
                Os melhores investimentos imobiliários em todo o Brasil
              </h2>
            </div>
            
            {/* Grid de Estados - primeiras 3 linhas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-4">
              {states.map((state, index) => (
                <div 
                  key={state.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#E9F7F2] border border-[#E9F7F2] hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#193D32]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#193D32]">{state.name}</p>
                    <p className="text-xs text-[#355F4D]">{state.region}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Última linha centralizada com apenas 2 estados */}
            <div className="flex justify-center gap-4">
              {lastRowStates.map((state, index) => (
                <div 
                  key={state.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#E9F7F2] border border-[#E9F7F2] hover:shadow-md transition-all duration-300 animate-fade-in w-full max-w-[240px]"
                  style={{ animationDelay: `${(states.length + index) * 0.05}s` }}
                >
                  <div className="flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#193D32]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#193D32]">{state.name}</p>
                    <p className="text-xs text-[#355F4D]">{state.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bloco de Diferenciais */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-[#B78D4A] rounded-full flex items-center justify-center">
                  <highlight.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-bold text-[#193D32] mb-2 leading-tight">
                  {highlight.title}
                </h3>
                <p className="text-sm text-[#355F4D]">{highlight.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <RCButton 
            variant="auxiliary" 
            onClick={() => navigateWithPreview("/step1-authority")}
            className="px-8 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </RCButton>
          <RCButton 
            variant="primary" 
            onClick={() => navigateWithPreview("/step3-media")}
            className="text-base px-10 py-4 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            O que estão falando sobre nós →
          </RCButton>
        </div>
      </div>
    </div>
  );
};

export default Step2Presence;

