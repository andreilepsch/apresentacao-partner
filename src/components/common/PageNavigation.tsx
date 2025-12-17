import RCButton from "@/components/RCButton";

interface PageNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backText?: string;
  nextText?: string;
  showBackOnly?: boolean;
  className?: string;
}

const PageNavigation = ({ 
  onBack, 
  onNext, 
  backText = "← Voltar", 
  nextText = "Avançar →",
  showBackOnly = false,
  className = ""
}: PageNavigationProps) => {
  if (showBackOnly) {
    return (
      <div className={`text-center ${className}`}>
        <RCButton 
          variant="auxiliary" 
          onClick={onBack}
          className="px-8 py-3 border-[#193D32] text-[#193D32] hover:bg-[#F7F5F0] hover:border-[#193D32]"
        >
          {backText}
        </RCButton>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-6 justify-between items-center ${className}`}>
      {onBack && (
        <RCButton 
          variant="auxiliary" 
          onClick={onBack}
          className="px-6 py-3 border-[#193D32] text-[#193D32] hover:bg-[#E9F7F2] hover:border-[#193D32]"
        >
          {backText}
        </RCButton>
      )}
      {onNext && (
        <RCButton 
          variant="primary" 
          onClick={onNext}
          className="text-[16px] px-6 py-3 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 shadow-lg"
        >
          {nextText}
        </RCButton>
      )}
    </div>
  );
};

export default PageNavigation;