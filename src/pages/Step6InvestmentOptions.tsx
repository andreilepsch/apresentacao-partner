import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Home, TrendingUp, CircleDollarSign, MapPin } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import InvestmentOptionCard from "@/components/common/InvestmentOptionCard";
import PageNavigation from "@/components/common/PageNavigation";

const Step6InvestmentOptions = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Badge e Título da Seção */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={MapPin} text="OPÇÕES DE INVESTIMENTO" className="mb-8" />

          <h1 className="text-[28px] font-semibold text-[#193D32] mb-4 leading-tight">
            Escolha sua jornada de investimento
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Selecione a estratégia que melhor se alinha aos seus objetivos financeiros e comece a construir seu patrimônio hoje mesmo
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center mb-12">
            <div className="w-[50px] h-[2px] bg-[#B78D4A]"></div>
          </div>
        </div>

        {/* Cards com as três opções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <InvestmentOptionCard 
            icon={CircleDollarSign}
            title="Renda Extra"
            description="Tenha uma renda mensal consistente com imóveis inteligentes que se pagam sozinhos através de aluguéis estratégicos."
            buttonText="Começar agora"
            onClick={() => navigateWithPreview("/renda-extra/step1")}
          />
          
          <InvestmentOptionCard 
            icon={TrendingUp}
            title="Aposentadoria com Imóveis"
            description="Construa uma aposentadoria sólida e segura com portfólio de imóveis que geram renda vitalícia crescente."
            buttonText="Planejar futuro"
            onClick={() => navigateWithPreview("/aposentadoria/step1")}
          />
          
          <InvestmentOptionCard 
            icon={Home}
            title="Comprar Minha Casa"
            description="Use uma estratégia inteligente para conquistar sua casa própria sem juros abusivos e com parcelas que cabem no seu orçamento."
            buttonText="Descobrir estratégia"
            onClick={() => navigateWithPreview("/casa-propria/step1")}
          />
        </div>

        {/* Bloco de Prova Social */}
        <div className="bg-white rounded-xl shadow-lg border border-[#EEE] p-6 mb-12 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-[24px] font-bold text-[#193D32] mb-2">+500MM</div>
              <div className="text-[14px] text-[#333333]">Em investimentos</div>
            </div>
            <div>
              <div className="text-[24px] font-bold text-[#193D32] mb-2">+1.200</div>
              <div className="text-[14px] text-[#333333]">Investidores ativos</div>
            </div>
          </div>
        </div>

        {/* Botão de navegação */}
        <PageNavigation 
          onBack={() => navigateWithPreview("/step5-method")}
          backText="← Voltar para etapa anterior"
          showBackOnly={true}
        />
      </div>
    </div>
  );
};

export default Step6InvestmentOptions;
