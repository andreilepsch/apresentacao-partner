
interface CycleHeaderProps {
  title: string;
  subtitle: string;
  highlight: boolean;
}

const CycleHeader = ({ title, subtitle, highlight }: CycleHeaderProps) => {
  return (
    <div className="text-center mb-12">
      {/* Special Badge for Premium Home */}
      {highlight && (
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#B78D4A] to-[#A67B3A] rounded-full px-8 py-3 shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-semibold text-sm tracking-wide uppercase">
              Casa Própria
            </span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Cycle Header */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-[#224239] tracking-tight leading-tight">
          {title}
        </h3>
        
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#B78D4A] rounded-full"></div>
          <div className="w-3 h-3 bg-[#355F4D] rounded-full"></div>
          <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-[#355F4D] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CycleHeader;
