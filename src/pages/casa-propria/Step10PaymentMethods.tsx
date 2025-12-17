import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import PaymentMethodSection from "@/components/renda-extra/PaymentMethodSection";
import PaymentComparison from "@/components/renda-extra/PaymentComparison";

const CasaPropriaStep10 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const paymentMethods = [
    {
      type: "DINHEIRO",
      cards: [
        {
          title: "Valor da Carta",
          value: "R$ 500.000,00",
          bgColor: "bg-[#193D32]"
        },
        {
          title: "Lance (Dinheiro transferido da sua conta)",
          value: "R$ 150.000,00",
          bgColor: "bg-[#193D32]"
        },
        {
          title: "Valor do Crédito",
          value: "R$ 500.000,00",
          bgColor: "bg-[#193D32]",
          border: true
        }
      ]
    },
    {
      type: "PRÓPRIO CRÉDITO",
      subtitle: "ATÉ 30% DO VALOR DO CRÉDITO",
      cards: [
        {
          title: "Valor da Carta",
          value: "R$ 500.000,00",
          bgColor: "bg-[#193D32]"
        },
        {
          title: "Lance (Descontado do Crédito)",
          value: "R$ 150.000,00",
          bgColor: "bg-[#193D32]"
        },
        {
          title: "Valor do Crédito",
          value: "R$ 350.000,00",
          bgColor: "bg-[#193D32]",
          border: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={Target} text="EXEMPLO" className="mb-8" />

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Formas de pagar o lance
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Entenda as diferentes modalidades de pagamento do lance no consórcio
          </p>
          
          <SectionDivider className="mb-12" />
        </div>

        <PaymentMethodSection paymentMethods={paymentMethods} />
        <PaymentComparison />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/casa-propria/step9")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/casa-propria/step11")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Avançar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaStep10;