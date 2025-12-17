import { TrendingUp, Home, Banknote } from "lucide-react";

const TimelineSection = () => {
  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="text-center mb-8">
        <h2 className="text-[22px] font-semibold text-[#193D32] mb-6">Como o imóvel se paga sozinho?</h2>
        
        {/* Timeline com ícones */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7F5F0] rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-[#333333]" />
            </div>
            <span className="text-[16px] text-[#333333] font-medium">Compra do imóvel</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8F4D1] rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-[#193D32]" />
            </div>
            <span className="text-[16px] text-[#333333] font-medium">Recebe o imóvel</span>
          </div>
          <div className="w-12 h-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B78D4A]/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#B78D4A]" />
            </div>
            <span className="text-[16px] text-[#333333] font-medium">Quita o imóvel</span>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F7F5F0] to-[#355F4D] rounded-full"></div>
          </div>
        </div>
        
        {/* Indicadores de porcentagem */}
        <div className="flex justify-between max-w-2xl mx-auto text-sm">
          <div className="text-center">
            <span className="font-bold text-[#333333]">25%</span>
            <p className="text-[#333333]">De Investimento</p>
          </div>
          <div className="text-center">
            <span className="font-bold text-[#333333]">75%</span>
            <p className="text-[#333333]">Aluguel paga o investimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;