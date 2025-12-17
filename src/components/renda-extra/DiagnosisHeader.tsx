
import { TrendingUp } from "lucide-react";

const DiagnosisHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-block p-3 bg-gradient-to-r from-[#193D32] to-[#355F4D] rounded-2xl mb-6">
        <TrendingUp className="w-8 h-8 text-[#B78D4A]" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-[#193D32] mb-4">
        Planejamento de{" "}
        <span className="text-[#B78D4A]">Renda Extra</span>
      </h1>
      
      <p className="text-lg text-[#333333] max-w-2xl mx-auto leading-relaxed">
        Descubra como construir um patrimônio sólido e gerar renda passiva com inteligência e planejamento
      </p>
    </div>
  );
};

export default DiagnosisHeader;
