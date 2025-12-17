import { TrendingUp, Home, Banknote } from "lucide-react";
import DynamicCompanyName from "@/components/DynamicCompanyName";

const MethodOverview = () => {
  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="bg-[#193D32] rounded-xl p-8 text-white relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-white mb-2">Método <DynamicCompanyName /></h2>
            <p className="text-[16px] font-light text-white/90">Estratégia inteligente para investimento imobiliário</p>
          </div>
          
          {/* Três colunas com setas */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* Você investe */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B78D4A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-8 h-8 text-[#B78D4A]" />
              </div>
              <h3 className="text-[18px] text-white font-bold">Você investe</h3>
            </div>

            {/* Seta */}
            <div className="hidden md:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#B78D4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Imóvel se paga */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B78D4A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-[#B78D4A]" />
              </div>
              <h3 className="text-[18px] text-white font-bold">Imóvel se paga sozinho</h3>
            </div>

            {/* Seta */}
            <div className="hidden md:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#B78D4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Renda vira lucro */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B78D4A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#B78D4A]" />
              </div>
              <h3 className="text-[18px] text-white font-bold">Renda Vitalícia</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MethodOverview;