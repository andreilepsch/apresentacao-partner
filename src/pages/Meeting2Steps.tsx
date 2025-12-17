import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, Users, TrendingUp, PlusCircle, Repeat, CheckCircle2, Play, Target, Eye } from "lucide-react";
import meetingBg from "@/assets/meeting-steps-bg.jpg";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface ClientInfo {
  nomeCliente: string;
  valorParcela: string;
  objetivo: string;
  patrimonio: string;
  rendaMensal: string;
  creditoImobiliario: number;
}

export default function Meeting2Steps() {
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
      const parsedInfo = JSON.parse(savedInfo);
      
      // Sempre recalcular para garantir valores corretos
      if (parsedInfo.valorParcela) {
        const parcela = Number(parsedInfo.valorParcela.replace(/\D/g, '')) / 100;
        
        const creditoImobiliario = (parcela / 600) * 125000;
        
        const patrimonio = Math.ceil(creditoImobiliario * 5);
        const rendaMensal = Math.ceil(patrimonio * 0.01);
        
        // Arredondar para múltiplos de 100,000 para patrimônio e 1,000 para renda
        const patrimonioArredondado = Math.ceil(patrimonio / 100000) * 100000;
        const rendaArredondada = Math.ceil(rendaMensal / 1000) * 1000;
        
        parsedInfo.patrimonio = patrimonioArredondado.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        
        parsedInfo.rendaMensal = rendaArredondada.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        
        // Atualizar localStorage com valores corretos
        localStorage.setItem("clienteInfo", JSON.stringify(parsedInfo));
      }
      
      setClientInfo(parsedInfo);
    } else {
      navigate("/meeting2");
    }
  }, [navigate]);

  // Auto-scroll to active card
  useEffect(() => {
    if (activeCardRef.current && !showAllSteps) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentStep, showAllSteps]);

  const handleAdvance = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => [...prev, currentStep]);
      // Move to next step
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step - continue to next page
      navigate("/meeting2/consultoria");
    }
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      // Remove current step from completed
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
      // Go back one step
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleShowAll = () => {
    setShowAllSteps(true);
    // Mark all previous steps as completed when showing all
    const allPreviousSteps = Array.from({ length: steps.length - 1 }, (_, i) => i);
    setCompletedSteps(allPreviousSteps);
    setCurrentStep(steps.length - 1);
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  const isStepVisible = (stepIndex: number) => {
    if (showAllSteps) return true;
    return stepIndex <= currentStep;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAdvance();
    }
  };

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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 min-h-[100svh] flex flex-col">
        {/* Header */}
        <header className="flex items-start justify-start mb-8">
          <Button
            onClick={() => navigate("/meeting2")}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </header>

        {/* Header Section */}
        <div className="flex-1 animate-fade-in">
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

          {/* Sequential Steps Layout */}
          <div className="flex justify-center items-center min-h-[400px] mb-16" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="relative max-w-7xl w-full px-4">
              {/* Active Step Announcement for Screen Readers */}
              <div aria-live="polite" className="sr-only">
                {currentStep < steps.length && `Passo ${currentStep + 1}: ${steps[currentStep].title}`}
              </div>

              {/* Steps Container */}
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
                          {/* Step Number Badge */}
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

                          {/* Golden Circle with Icon */}
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

                          {/* Title */}
                          <h3 className="text-base font-bold text-white leading-tight" id={`step-${step.id}-title`}>
                            {step.title}
                          </h3>

                          {/* Premium glow effect on hover - only for active */}
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

          {/* Navigation Controls - Fixed at bottom */}
          <div className="sticky bottom-0 left-0 right-0 z-20 pb-4 pt-6">
            {/* Background gradient for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#163B36] via-[#163B36]/95 to-transparent"></div>
            
            <div className="relative text-center space-y-4">
              {/* Main Action Buttons */}
              <div className="flex justify-center items-center gap-4 mb-4">
                {/* Back Button - Show always for better UX */}
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  disabled={currentStep === 0}
                  className="px-4 sm:px-6 py-3 rounded-2xl border-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: '#C9A45C',
                    color: currentStep === 0 ? '#666' : '#C9A45C',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (currentStep > 0) {
                      e.currentTarget.style.backgroundColor = '#C9A45C';
                      e.currentTarget.style.color = '#163B36';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStep > 0) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#C9A45C';
                    }
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Voltar um passo</span>
                  <span className="sm:hidden">Voltar</span>
                </Button>

                {/* Main Advance Button */}
                <button
                  onClick={handleAdvance}
                  className="premium-cta-button text-base sm:text-lg font-bold px-6 sm:px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                  style={{
                    background: 'linear-gradient(135deg, #C9A45C 0%, #E5C875 100%)',
                    color: '#163B36'
                  }}
                  aria-describedby={`step-${steps[currentStep]?.id}-title`}
                >
                  {currentStep === steps.length - 1 ? 'Continuar' : 'Avançar'}
                  {currentStep < steps.length - 1 && <ArrowRight className="w-5 h-5 ml-2 inline" />}
                </button>
              </div>

              {/* Show All Link */}
              {!showAllSteps && (
                <button
                  onClick={handleShowAll}
                  className="text-xs sm:text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{ 
                    color: '#C4D5D2',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#C9A45C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#C4D5D2';
                  }}
                >
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Ver todos os passos
                </button>
              )}

              {/* Progress Indicator */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: index <= currentStep ? '#C9A45C' : '#C4D5D2',
                      opacity: index <= currentStep ? 1 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes scale-in {
          from { 
            transform: scale(0.9); 
            opacity: 0.8; 
          }
          to { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.12s ease-out;
        }

        .hover\\:scale-103:hover {
          transform: scale(1.03);
        }

        .premium-cta-button:hover {
          box-shadow: 0 20px 60px rgba(201, 164, 92, 0.4);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .grid-cols-1.md\\:grid-cols-5 {
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
}