
import { Home, Target } from "lucide-react";

const CasaPropriaHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-8">
        <Home className="w-4 h-4 text-[#B78D4A]" />
        <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">CASA PRÓPRIA</span>
      </div>

      <h1 className="text-[32px] font-bold text-[#193D32] mb-4 leading-tight">
        Planejamento para Sair do Aluguel
      </h1>
      <p className="text-[18px] font-normal text-[#333333] mb-8 max-w-3xl mx-auto leading-relaxed">
        Vamos criar um planejamento personalizado para você conquistar sua casa própria
      </p>
      
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="w-16 h-px bg-gray-300"></div>
        <Target className="w-6 h-6 text-[#B78D4A]" />
        <div className="w-16 h-px bg-gray-300"></div>
      </div>
    </div>
  );
};

export default CasaPropriaHeader;
