import { LucideIcon } from "lucide-react";

interface PageBadgeProps {
  icon: LucideIcon;
  text: string;
  className?: string;
  variant?: "default" | "golden";
}

const PageBadge = ({ icon: Icon, text, className = "", variant = "default" }: PageBadgeProps) => {
  const isGolden = variant === "golden";
  
  return (
    <div className={`inline-flex items-center gap-2 ${
      isGolden 
        ? "bg-gradient-to-r from-[#C9A45C] to-[#B8934A] border border-[#C9A45C]/30" 
        : "bg-[#F7F5F0] border border-[#B78D4A]/20"
    } rounded-full px-4 py-2 ${className}`}>
      <Icon className={`w-4 h-4 ${isGolden ? "text-white" : "text-[#B78D4A]"}`} />
      <span className={`${isGolden ? "text-white" : "text-[#B78D4A]"} font-bold text-xs tracking-wide uppercase`}>{text}</span>
    </div>
  );
};

export default PageBadge;