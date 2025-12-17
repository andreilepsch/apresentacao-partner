interface SectionDividerProps {
  className?: string;
}

const SectionDivider = ({ className = "" }: SectionDividerProps) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="w-16 h-px bg-gray-300"></div>
      <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
      <div className="w-16 h-px bg-gray-300"></div>
    </div>
  );
};

export default SectionDivider;