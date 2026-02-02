import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
  index?: number;
}

const StatsCard = ({ icon: Icon, value, label, description, index = 0 }: StatsCardProps) => {
  return (
    <div
      className="text-center p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="w-16 h-16 mx-auto mb-6 bg-[#B78D4A] rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-semibold text-[#193D32] mb-2">{value}</h3>
      <p className="text-sm font-medium text-[#333333] mb-1">{label}</p>
      <p className="text-xs text-[#355F4D]">{description}</p>
    </div>
  );
};

export default StatsCard;