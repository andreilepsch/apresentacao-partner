import { LucideIcon } from "lucide-react";

interface ComparisonCardProps {
  icon: LucideIcon;
  title: string;
  data: {
    valor: string;
    renda: string;
    parcela: string;
    total: string;
    totalLabel: string;
  };
  variant?: 'default' | 'active' | 'success';
}

const ComparisonCard = ({ icon: Icon, title, data, variant = 'default' }: ComparisonCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'active':
        return {
          container: "border border-[#C8F4D1]/50",
          iconBg: "bg-[#C8F4D1] border border-[#C8F4D1]",
          iconColor: "text-[#193D32]",
          titleColor: "text-[#193D32]",
          totalBg: "bg-[#C8F4D1]/20",
          totalColor: "text-[#193D32]"
        };
      case 'success':
        return {
          container: "border border-[#B78D4A]/30 relative overflow-hidden",
          iconBg: "bg-[#B78D4A]/20 border border-[#B78D4A]/40 shadow-sm",
          iconColor: "text-[#B78D4A]",
          titleColor: "text-[#B78D4A]",
          totalBg: "bg-[#B78D4A]/10",
          totalColor: "text-[#B78D4A]"
        };
      default:
        return {
          container: "",
          iconBg: "bg-[#F7F5F0] border border-gray-200",
          iconColor: "text-[#333333]",
          titleColor: "text-[#333333]",
          totalBg: "bg-gray-50",
          totalColor: "text-[#333333]"
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ${styles.container}`}>
      {variant === 'success' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B78D4A]/5 rounded-full -translate-y-16 translate-x-16"></div>
      )}
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className={`w-14 h-14 ${styles.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-7 h-7 ${styles.iconColor}`} />
          </div>
          <h3 className={`text-[18px] ${styles.titleColor} font-bold mb-2`}>{title}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-[12px] text-gray-500 font-medium">VALOR ATIVO</span>
            <span className="text-[16px] text-[#333333] font-bold">{data.valor}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-[12px] text-gray-500 font-medium">RENDA MENSAL</span>
            <span className="text-[16px] text-[#333333] font-bold">{data.renda}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-[12px] text-gray-500 font-medium">PARCELA MENSAL</span>
            <span className="text-[16px] text-[#333333] font-bold">{data.parcela}</span>
          </div>
          <div className={`flex justify-between items-center py-4 ${styles.totalBg} rounded-xl px-4 mt-6`}>
            <span className="text-[16px] text-[#333333] font-bold">{data.totalLabel}</span>
            <span className={`text-[18px] ${styles.totalColor} font-bold`}>{data.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;