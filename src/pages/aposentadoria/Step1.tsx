
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, DollarSign, Home, Percent, Users, Target } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AposentadoriaStep1 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const benefits = [
    {
      icon: DollarSign,
      title: "Renda mensal previsível vinda do aluguel",
      description: "Fluxo de caixa constante e previsível"
    },
    {
      icon: TrendingUp,
      title: "Valorização do patrimônio ao longo do tempo",
      description: "Imóveis tendem a se valorizar historicamente"
    },
    {
      icon: Shield,
      title: "Proteção contra inflação",
      description: "Imóveis acompanham a inflação naturalmente"
    }
  ];

  const centeredBenefits = [
    {
      icon: Users,
      title: "Possibilidade de deixar herança",
      description: "Patrimônio tangível para suas gerações futuras"
    },
    {
      icon: Home,
      title: "Mais autonomia sobre seu dinheiro",
      description: "Você controla diretamente seus investimentos"
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
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">APOSENTADORIA</span>
          </div>

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Previdência tradicional e outros investimentos x Imóveis
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Investimentos tradicionais dependem muito do mercado, de juros e de regras do governo.
            Já os imóveis oferecem vantagens únicas:
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* First 3 Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[#F7F5F0] rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-[#B78D4A]" />
              </div>

              <h3 className="text-lg font-bold text-[#193D32] mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-[#333333] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Centered 2 Benefits */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {centeredBenefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#F7F5F0] rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#B78D4A]" />
                </div>

                <h3 className="text-lg font-bold text-[#193D32] mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-sm text-[#333333] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Message */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#193D32] rounded-xl p-8 text-center text-white">
            <Percent className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">
              Com imóveis, você não fica refém das mudanças do mercado
            </h3>
            <p className="text-white/90 leading-relaxed">
              Enquanto outros investimentos dependem de variáveis externas, 
              o mercado imobiliário oferece estabilidade e previsibilidade para sua aposentadoria.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/step6-investment-options")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar às opções
          </Button>
          <Button
            onClick={() => navigateWithPreview("/aposentadoria/step2")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            E como escolher um bom imóvel? →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaStep1;
