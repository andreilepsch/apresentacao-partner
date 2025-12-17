import PageBadge from "@/components/common/PageBadge";
import DynamicCompanyName from "@/components/DynamicCompanyName";
import { Target } from "lucide-react";

const MethodHeader = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      {/* Badge */}
      <PageBadge 
        icon={Target} 
        text="ESTRATÉGIA INTELIGENTE" 
        className="mb-8"
      />

      <h1 className="text-[28px] font-bold text-[#193D32] mb-4 leading-tight">
        Como funciona o Método <DynamicCompanyName />?
      </h1>
      <p className="text-[16px] font-normal text-[#333333] mb-6 max-w-4xl mx-auto leading-relaxed">
        O imóvel se paga sozinho através da renda do aluguel
      </p>
      
      {/* Divider dourado */}
      <div className="flex items-center justify-center mb-12">
        <div className="w-[50px] h-[2px] bg-[#B78D4A]"></div>
      </div>
    </div>
  );
};

export default MethodHeader;