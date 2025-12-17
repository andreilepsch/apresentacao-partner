
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Trophy, Gavel, Hand, Target, Zap } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AposentadoriaStep11 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const contemplationForms = [
    {
      title: "SORTEIO",
      description: "Número da cota sorteado com base na Loteria Federal",
      icon: Trophy,
      details: [
        "Baseado na Loteria Federal",
        "Contemplação aleatória",
        "Não há estratégia específica",
        "Depende apenas da sorte"
      ]
    },
    {
      title: "LANCE LIVRE",
      description: "Quem antecipar mais parcelas vence o leilão dos lances",
      icon: Gavel,
      details: [
        "Leilão entre participantes",
        "Quem oferece mais parcelas ganha",
        "Estratégia de antecipação",
        "Competição entre consorciados"
      ]
    },
    {
      title: "LANCE FIXO",
      description: "Todos dão o mesmo lance e vence quem tiver a cota mais perto do número sorteado",
      icon: Hand,
      badge: "Acelerador de Contemplação",
      details: [
        "Lance único igual para todos",
        "Critério de desempate por sorteio",
        "Mais democrático",
        "Menor competição financeira"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
            <Target className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">CONSÓRCIO</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Formas de contemplação
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Entenda as diferentes maneiras de ser contemplado no consórcio
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Contemplation Forms Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contemplationForms.map((form, index) => (
            <div 
              key={index}
              className="bg-[#193D32] rounded-xl p-8 text-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 relative flex flex-col"
            >
              {/* Badge - Acelerador de Contemplação */}
              {form.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#B78D4A] to-[#D4B570] text-white px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-lg border-2 border-white flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    {form.badge}
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 mt-2">
                <form.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-4">
                {form.title}
              </h3>
              
              {/* Description */}
              <p className="text-white/90 text-center mb-6 leading-relaxed">
                {form.description}
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6 flex-grow">
                {form.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#B78D4A] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-white/80 leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step10")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step12")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Avançar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep11;
