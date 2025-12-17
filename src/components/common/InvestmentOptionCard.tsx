import { LucideIcon } from "lucide-react";

interface InvestmentOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const InvestmentOptionCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText,
  onClick 
}: InvestmentOptionCardProps) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" 
      onClick={onClick}
    >
      {/* Ícone */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-[#C8F4D1] rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-[#193D32]" />
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="text-center">
        <h3 className="text-[20px] font-semibold text-[#193D32] mb-4">{title}</h3>
        <p className="text-[14px] text-[#333333] leading-relaxed mb-6">
          {description}
        </p>
        
        {/* Botão de ação */}
        <div className="bg-[#F2E1C5] hover:bg-[#B78D4A]/20 rounded-lg px-4 py-2 transition-all duration-300 group-hover:bg-[#B78D4A]/20">
          <span className="text-[14px] font-bold text-[#B78D4A]">{buttonText}</span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentOptionCard;