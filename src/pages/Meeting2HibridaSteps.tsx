import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, TrendingUp, PlusCircle, Repeat, CheckCircle2, Eye } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageNavigation from "@/components/common/PageNavigation";
import Meeting2Layout from "@/components/meeting2/Meeting2Layout";

interface ClientInfo {
  nomeCliente: string;
  objetivo: string;
}

export default function Meeting2HibridaSteps() {
  const navigate = useNavigate();
  useScrollToTop();
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const activeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem("clienteInfo");
    if (savedInfo) {
      setClientInfo(JSON.parse(savedInfo));
    } else {
      navigate("/meeting2/hibrida");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeCardRef.current && !showAllSteps) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentStep, showAllSteps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      navigate("/meeting2/hibrida/ferramentas");
    }
  };

  const handlePrev = () => {
    if (currentStep === 0) {
      navigate("/meeting2/hibrida");
    } else {
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleShowAll = () => {
    setShowAllSteps(true);
    const allPreviousSteps = Array.from({ length: steps.length - 1 }, (_, i) => i);
    setCompletedSteps(allPreviousSteps);
    setCurrentStep(steps.length - 1);
  };

  const isStepCompleted = (stepIndex: number) => completedSteps.includes(stepIndex);
  const isStepVisible = (stepIndex: number) => showAllSteps ? true : stepIndex <= currentStep;

  const steps = [
    {
      id: 1,
      title: "Crédito Facilitado",
      icon: Home,
      description: "Identificamos as melhores oportunidades de crédito para você obter um imóvel com as condições mais vantajosas do mercado.",
      benefit: "Entregamos acesso ao crédito certo"
    },
    {
      id: 2,
      title: "Alugamos o seu Imóvel",
      icon: Users,
      description: "Colocamos seu imóvel no mercado de locação com gestão completa, inquilinos qualificados e garantia de recebimento.",
      benefit: "Com segurança e rentabilidade alta"
    },
    {
      id: 3,
      title: "Receba seus Lucros",
      icon: TrendingUp,
      description: "Você recebe renda mensal passiva constante enquanto o imóvel se valoriza e seu patrimônio cresce exponencialmente.",
      benefit: "Crescimento patrimonial automático"
    },
    {
      id: 4,
      title: "Compre outro Imóvel",
      icon: PlusCircle,
      description: "Com os lucros acumulados e o aumento da sua renda, reinvestimos em um novo imóvel para aumentar seus ganhos.",
      benefit: "Multiplicação do patrimônio"
    },
    {
      id: 5,
      title: "Repita o Processo e Aumente seus Lucros",
      icon: Repeat,
      description: "O ciclo se repete de forma acelerada, criando um efeito multiplicador que acelera exponencialmente seu crescimento patrimonial.",
      benefit: "Liberdade financeira"
    }
  ];

  if (!clientInfo) return null;

  return (
    <Meeting2Layout backTo="/meeting2/hibrida">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          <span style={{ color: '#C9A45C' }}>{clientInfo.nomeCliente}</span>, seus 5 passos para o sucesso
        </h1>
        <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#C4D5D2' }}>
          {(() => {
            switch(clientInfo.objetivo) {
              case 'renda-extra':
                return 'Uma consultoria completa para conquistar sua renda extra com imóveis';
              case 'moradia':
                return 'Uma consultoria completa para conquistar sua casa própria com imóveis';
              case 'aposentadoria':
              default:
                return 'Uma consultoria completa para conquistar sua aposentadoria com imóveis';
            }
          })()}
        </p>
      </div>

      <div className="flex justify-center items-center min-h-[400px] mb-16">
        <div className="relative max-w-7xl w-full px-4">
          <div aria-live="polite" className="sr-only">
            {currentStep < steps.length && `Passo ${currentStep + 1}: ${steps[currentStep].title}`}
          </div>

          <div className="flex justify-center items-center">
            <div className="flex justify-center gap-2 md:gap-4 lg:gap-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = isStepCompleted(index);
                const isVisible = isStepVisible(index);
                
                if (!isVisible) return null;
                
                return (
                  <div 
                    key={step.id}
                    ref={isActive ? activeCardRef : null}
                    className={`relative group w-[160px] md:w-[180px] lg:w-[200px] h-[280px] transition-all duration-300 ${
                      isActive 
                        ? 'animate-fade-in scale-100' 
                        : isCompleted 
                          ? 'opacity-70 scale-95' 
                          : 'opacity-0 scale-90'
                    }`}
                    style={{ 
                      animationDelay: isActive ? '0ms' : `${index * 150}ms`,
                    }}
                  >
                    <div 
                      className={`rounded-2xl p-6 shadow-2xl transition-all duration-500 relative overflow-hidden h-full flex flex-col items-center justify-center text-center ${
                        isActive 
                          ? 'hover:shadow-3xl hover:scale-105' 
                          : isCompleted 
                            ? 'shadow-lg' 
                            : ''
                      }`}
                      style={{ backgroundColor: '#1F4A43' }}
                      role="article"
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <div 
                        className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10 transition-all duration-200 ${
                          isCompleted ? 'animate-scale-in' : ''
                        }`}
                        style={{ 
                          backgroundColor: isCompleted ? '#C9A45C' : '#FFFFFF',
                          color: isCompleted ? '#FFFFFF' : '#163B36'
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>

                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl mb-4 transition-all duration-300 ${
                          isActive ? 'group-hover:scale-110' : ''
                        }`}
                        style={{ 
                          backgroundColor: '#C9A45C',
                          boxShadow: isActive 
                            ? '0 8px 32px rgba(201, 164, 92, 0.3)' 
                            : '0 4px 16px rgba(201, 164, 92, 0.2)'
                        }}
                      >
                        <StepIcon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight" id={`step-${step.id}-title`}>
                        {step.title}
                      </h3>

                      {isActive && (
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-all duration-500"
                          style={{ 
                            background: `radial-gradient(circle at center, #C9A45C, transparent 70%)`
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {!showAllSteps && (
        <div className="text-center mb-6">
          <button
            onClick={handleShowAll}
            className="text-xs sm:text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ color: '#C4D5D2' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C9A45C'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#C4D5D2'}
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            Ver todos os passos
          </button>
        </div>
      )}

      <PageNavigation 
        onBack={handlePrev}
        onNext={handleNext}
        nextText={currentStep === steps.length - 1 ? "Avançar →" : "Próximo Passo →"}
        className="mt-16"
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </Meeting2Layout>
  );
}
