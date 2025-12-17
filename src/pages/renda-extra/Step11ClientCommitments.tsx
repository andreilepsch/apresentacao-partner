
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageBadge from "@/components/common/PageBadge";
import SectionDivider from "@/components/common/SectionDivider";
import CommitmentCard from "@/components/renda-extra/CommitmentCard";

const RendaExtraStep11 = () => {
  const { navigateWithPreview } = usePreviewNavigation();
  useScrollToTop();

  const commitments = [
    {
      number: "1",
      title: "Pagar as parcelas em dia",
      description: "Manter o pagamento das parcelas mensais sempre em dia para não comprometer o grupo e sua contemplação",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      number: "2", 
      title: "Seguir a estratégia exata dos lances",
      description: "Implementar rigorosamente a estratégia de lances definida para maximizar as chances de contemplação",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      number: "3",
      title: "Fazer a contratação na janela certa do grupo",
      description: "Respeitar o timing ideal para entrada no grupo, garantindo a melhor oportunidade de contemplação",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-12 max-w-[1140px]">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <PageBadge icon={Target} text="ESTRATÉGIA" className="mb-8" />

          <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
            Compromissos do cliente para a estratégia ter sucesso
          </h1>
          <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
            Para que a estratégia de consórcio funcione perfeitamente, é essencial seguir alguns compromissos fundamentais
          </p>
          
          <SectionDivider className="mb-12" />
        </div>

        {/* Commitments */}
        <div className="space-y-12 mb-16">
          {commitments.map((commitment, index) => (
            <CommitmentCard 
              key={index}
              commitment={commitment}
              index={index}
            />
          ))}
        </div>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#193D32] rounded-xl p-8 text-center text-white">
            <CheckCircle className="w-16 h-16 text-[#B78D4A] mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">
              Com disciplina, o sucesso é garantido
            </h3>
            <p className="text-white/90 leading-relaxed">
              Seguindo estes três compromissos fundamentais, você terá todas as ferramentas 
              necessárias para uma estratégia de consórcio bem-sucedida e contemplação no prazo esperado.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateWithPreview("/renda-extra/step10")}
            className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => navigateWithPreview("/renda-extra/step12")}
            className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
          >
            Continuar →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RendaExtraStep11;
