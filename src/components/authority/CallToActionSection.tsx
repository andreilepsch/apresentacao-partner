import RCButton from "@/components/RCButton";

interface CallToActionSectionProps {
  onNext: () => void;
}

const CallToActionSection = ({ onNext }: CallToActionSectionProps) => {
  return (
    <div className="text-center">
      <div className="bg-[#193D32] rounded-t-xl p-10 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            Pronto para transformar seu futuro financeiro?
          </h2>
          <p className="text-base text-[#F7F5F0] mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubra como nossa metodologia pode gerar renda passiva consistente e construir seu patrimônio de forma inteligente
          </p>
          
          <RCButton 
            variant="primary" 
            onClick={onNext}
            className="text-lg px-8 py-4 bg-[#B78D4A] hover:bg-[#355F4D] text-white border-0 transition-all duration-300"
          >
            Conhecer nosso ecossistema →
          </RCButton>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;