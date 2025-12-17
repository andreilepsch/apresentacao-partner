import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreviewNavigation } from "@/hooks/usePreviewNavigation";
import RCButton from "@/components/RCButton";
import DynamicCompanyName from "@/components/DynamicCompanyName";
import { Home, TrendingUp, Settings, Check, ChevronRight } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// SVG customizado para Obtenção do Crédito
const CreditAnalysisIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="6" width="32" height="24" rx="3" stroke="#B78D4A" strokeWidth="2" fill="none"/>
    <rect x="6" y="8" width="28" height="20" rx="2" fill="#F7F5F0"/>
    <rect x="8" y="10" width="8" height="6" rx="1" fill="#B78D4A"/>
    <rect x="18" y="11" width="14" height="1" fill="#B78D4A"/>
    <rect x="18" y="13" width="10" height="1" fill="#B78D4A"/>
    <rect x="8" y="18" width="24" height="1" fill="#B78D4A"/>
    <rect x="8" y="20" width="20" height="1" fill="#B78D4A"/>
    <rect x="8" y="22" width="16" height="1" fill="#B78D4A"/>
    <rect x="8" y="24" width="12" height="1" fill="#B78D4A"/>
    <circle cx="32" cy="32" r="6" fill="#B78D4A"/>
    <path d="M29 32L31 34L35 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Step4WhatWeDo = () => {
  const navigate = useNavigate();
  const { navigateWithPreview } = usePreviewNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  useScrollToTop();

  const steps = [
    {
      id: 1,
      phase: "HOJE",
      title: "Obtenção do crédito",
      description: "Auxiliamos você a escolher o melhor caminho para comprar seu imóvel",
      icon: CreditAnalysisIcon,
      deliverables: [
        "Análise detalhada do seu perfil financeiro",
        "Seleção estratégica do crédito ideal",
        "Formalização e segurança na contratação",
        "Relatório de viabilidade personalizado",
        "Acompanhamento consultivo em cada passo"
      ],
      nextButton: "Avançar para Escolha do Imóvel"
    },
    {
      id: 2,
      phase: "COMPRA DO IMÓVEL",
      title: "Escolha do imóvel ideal",
      description: "Selecionamos imóveis com alto potencial de valorização e rentabilidade",
      icon: Home,
      deliverables: [
        "Liberação do crédito",
        "Estudo de rentabilidade",
        "Escolha do imóvel",
        "Compra do imóvel",
        "Decoração e mobília"
      ],
      nextButton: "Avançar para Rentabilização"
    },
    {
      id: 3,
      phase: "RENDA VITALÍCIA",
      title: "Locação com alta rentabilidade",
      description: "Gerenciamos a locação para garantir renda mensal acima da média do mercado",
      icon: TrendingUp,
      deliverables: [
        "Anúncio nas plataformas",
        "Gestão do preço dinâmico",
        "Check-in e checkout",
        "Limpeza e manutenção",
        "Gestão completa da locação"
      ],
      nextButton: "Entenda nosso Método"
    }
  ];

  const handleStepCompletion = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Scroll to top before navigating
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigateWithPreview("/step5-method");
      }, 100);
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="container mx-auto px-4 py-8 max-w-[1140px]">
        
        {/* Cabeçalho Fixo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full px-4 py-2 mb-6">
            <Settings className="w-4 h-4 text-[#B78D4A]" />
            <span className="text-[#B78D4A] font-bold text-xs tracking-wide uppercase">NOSSA METODOLOGIA</span>
          </div>

          <h1 className="text-[32px] font-bold text-[#193D32] mb-3 leading-tight">
            Como trabalhamos na <DynamicCompanyName />
          </h1>
          <p className="text-[16px] font-bold text-[#B78D4A] mb-3">
            Consultoria de ponta a ponta
          </p>
          <p className="text-[16px] font-normal text-[#232323] max-w-4xl mx-auto leading-relaxed mb-4">
            Acompanhamos toda sua jornada de investimento imobiliário, da análise inicial à rentabilidade mensal.
          </p>
          
          {/* Divider dourado */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="w-3 h-3 bg-[#B78D4A] rounded-full"></div>
            <div className="w-16 h-px bg-gray-300"></div>
          </div>
        </div>

        {/* Barra de Progresso Superior Melhorada */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            {/* Linha de fundo com gradiente */}
            <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full transform -translate-y-1/2 shadow-inner"></div>
            
            {/* Linha de progresso animada com gradiente */}
            <div 
              className="absolute top-1/2 left-0 h-[6px] bg-gradient-to-r from-[#B78D4A] via-[#D4A574] to-[#B78D4A] rounded-full transform -translate-y-1/2 transition-all duration-1000 ease-out shadow-lg"
              style={{ 
                width: `${((currentStep - 1) / 2) * 100}%`,
                boxShadow: '0 0 20px rgba(183, 141, 74, 0.4)'
              }}
            >
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
            </div>
            
            {/* Container dos pontos */}
            <div className="flex justify-between items-center relative z-10">
              {/* Pontos das etapas */}
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Ponto da etapa com animação */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 transform ${
                    completedSteps.includes(step.id) 
                      ? 'bg-gradient-to-br from-[#B78D4A] to-[#8B6B3A] text-white shadow-lg scale-110' 
                      : step.id === currentStep 
                        ? 'bg-gradient-to-br from-[#B78D4A] to-[#8B6B3A] text-white shadow-lg scale-105'
                        : 'bg-white border-4 border-gray-300 text-gray-400 shadow-md'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <Check className="w-4 h-4 animate-fade-in" />
                    ) : (
                      <span className="text-xs font-bold">{step.id}</span>
                    )}
                    
                    {/* Anel de brilho para etapa atual */}
                    {step.id === currentStep && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#B78D4A]/30 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Label da fase */}
                  <div className={`px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                    step.id <= currentStep 
                      ? 'bg-gradient-to-r from-[#B78D4A] to-[#8B6B3A] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.phase}
                  </div>
                  
                  {/* Indicador de progresso para etapa atual */}
                  {step.id === currentStep && (
                    <div className="absolute -bottom-2 w-2 h-2 bg-[#B78D4A] rounded-full animate-bounce"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card da Etapa Atual */}
        {currentStepData && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 border-2 transition-all duration-300 ${
              completedSteps.includes(currentStep) 
                ? 'border-[#B78D4A] bg-[#F7F5F0]/20' 
                : 'border-[#EAEAEA] hover:border-[#B78D4A]/50'
            }`}>
              
              {/* Badge da fase */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                  currentStepData.phase === 'HOJE' ? 'bg-[#D4FFE0] text-[#193D32]' :
                  currentStepData.phase === 'COMPRA DO IMÓVEL' ? 'bg-[#FFF4E6] text-[#B78D4A]' :
                  'bg-[#E8F5E8] text-[#355F4D]'
                }`}>
                  {currentStepData.phase}
                </div>
                
                {completedSteps.includes(currentStep) && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#B78D4A] text-white rounded-full text-[12px] font-bold">
                    <Check className="w-3 h-3" />
                    CONCLUÍDO
                  </div>
                )}
              </div>

              {/* Ícone e título */}
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F5F0] border border-[#B78D4A]/20 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="w-8 h-8 text-[#B78D4A]" />
                </div>
                <h2 className="text-[20px] font-bold text-[#224239] mb-2">
                  {currentStepData.title}
                </h2>
                <p className="text-[14px] font-normal text-[#232323] leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Lista de entregáveis */}
              <div className="mb-5">
                <h3 className="text-[16px] font-bold text-[#224239] mb-3">O suporte que torna sua jornada mais fácil:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {currentStepData.deliverables.map((deliverable, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-2 bg-[#F7F5F0]/30 rounded-lg hover:bg-[#F7F5F0]/50 transition-all duration-200"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: 'fade-in 0.3s ease-out forwards'
                      }}
                    >
                      <div className="w-4 h-4 bg-[#B78D4A] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[14px] font-medium text-[#232323]">
                        {deliverable}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de avançar */}
              <div className="text-center">
                <button
                  onClick={handleStepCompletion}
                  className="inline-flex items-center gap-2 bg-[#B78D4A] hover:bg-[#355F4D] text-white px-6 py-3 rounded-full font-semibold text-[14px] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {currentStepData.nextButton}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navegação Inferior Centralizada */}
        <div className="flex justify-center items-center">
          <RCButton 
            variant="auxiliary" 
            onClick={() => navigateWithPreview("/step3-media")}
            className="px-8 py-3 border-[#193D32] text-[#193D32] hover:bg-[#D4FFE0] hover:border-[#193D32]"
          >
            ← Voltar
          </RCButton>
        </div>
      </div>
    </div>
  );
};

export default Step4WhatWeDo;
