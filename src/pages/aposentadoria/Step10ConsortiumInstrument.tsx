import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Building2, Target, TrendingUp, Clock, DollarSign } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AposentadoriaStep10 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const consortiumBenefits = [
    {
      icon: DollarSign,
      title: "Parcelas menores",
      description: "Valores acessíveis que cabem no seu orçamento"
    },
    {
      icon: TrendingUp,
      title: "Sem juros bancários",
      description: "Apenas taxa de administração, muito menor que financiamentos"
    },
    {
      icon: Clock,
      title: "Construção gradual",
      description: "Você monta sua aposentadoria passo a passo"
    },
    {
      icon: Building2,
      title: "Imóvel se paga sozinho",
      description: "O aluguel cobre as parcelas e ainda gera lucro"
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
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">INSTRUMENTO</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            O instrumento: Consórcio imobiliário
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Usamos o consórcio como ferramenta para acessar imóveis de forma estratégica.
            Você paga parcelas menores, sem juros bancários, e o imóvel começa a se pagar sozinho quando é alugado.
            Assim, você vai montando sua aposentadoria de forma gradual e planejada.
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {consortiumBenefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#F7F5F0] rounded-full flex items-center justify-center mb-6">
                <benefit.icon className="w-8 h-8 text-[#B78D4A]" />
              </div>

              <h3 className="text-xl font-bold text-[#193D32] mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-[#333333] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Key Insight */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#193D32] rounded-xl p-8 text-center text-white">
            <Building2 className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">
              Estratégia inteligente para sua aposentadoria
            </h3>
            <p className="text-white/90 leading-relaxed text-lg">
              O consórcio permite que você construa um portfólio imobiliário sólido, 
              com imóveis que geram renda e se valorizam ao longo do tempo, 
              garantindo sua segurança financeira na aposentadoria.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/aposentadoria/step9")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step11")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Entender Mais →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep10;
