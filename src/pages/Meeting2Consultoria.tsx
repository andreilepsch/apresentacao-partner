import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Target, TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import RCButton from '@/components/RCButton';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import DynamicCompanyName from '@/components/DynamicCompanyName';

const Meeting2Consultoria = () => {
  const navigate = useNavigate();
  useScrollToTop();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleBack = () => {
    navigate('/meeting2/steps');
  };

  const handleNext = () => {
    navigate('/meeting2/contract');
  };

  const nextCard = () => {
    if (currentCard < roadmapSteps.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentCard(currentCard + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentCard(currentCard - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const roadmapSteps = [
    {
      id: 'hoje',
      title: 'HOJE',
      icon: Target,
      color: '#C9A45C',
      bgColor: '#1F4A43',
      items: [
        'Análise de crédito',
        'Escolha do grupo',
        'Contratação do crédito',
        'Envio dos boletos',
        'Alinhamento da Estratégia do Mês'
      ]
    },
    {
      id: 'amanha',
      title: 'AMANHÃ',
      icon: TrendingUp,
      color: '#DFFFEF',
      bgColor: '#1F4A43',
      items: [
        'Liberação do crédito',
        'Estudo de rentabilidade',
        'Seleção do imóvel',
        'Compra realizada',
        'Decoração e mobiliário'
      ]
    },
    {
      id: 'futuro',
      title: 'NO FUTURO',
      icon: Star,
      color: '#C9A45C',
      bgColor: '#1F4A43',
      items: [
        'Anúncio do imóvel nas plataformas',
        'Precificação dinâmica',
        'Gestão de check-in e checkout',
        'Limpeza e manutenção contínua',
        'Administração completa da locação'
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>

            {/* Premium Badge */}
            <div className="flex justify-center mb-6">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 backdrop-blur-sm"
                style={{ 
                  borderColor: '#C9A45C',
                  backgroundColor: 'rgba(201, 164, 92, 0.15)'
                }}
              >
                <svg className="w-4 h-4" style={{ color: '#C9A45C' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-bold" style={{ color: '#C9A45C' }}>
                  PREMIUM
                </span>
              </div>
            </div>

            {/* Header Content */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Consultoria
              </h1>
              <h2 className="text-2xl md:text-3xl text-white/80 mb-8">
                <DynamicCompanyName />
              </h2>
            </div>
          </div>
        </div>

        {/* Interactive Journey Section */}
        <div className="px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Card Display Area */}
            <div className="relative flex justify-center items-center min-h-[600px]">
              
              {/* Background Cards (Dimmed) */}
              <div className="absolute inset-0 flex justify-center items-center">
                {roadmapSteps.map((step, index) => {
                  if (index === currentCard) return null;
                  
                  const StepIcon = step.icon;
                  const isNext = index > currentCard;
                  const isPrev = index < currentCard;
                  
                  return (
                    <div
                      key={step.id}
                      className={`absolute transition-all duration-500 ${
                        isNext ? 'translate-x-32 scale-90' : isPrev ? '-translate-x-32 scale-90' : ''
                      }`}
                      style={{ 
                        opacity: 0.3,
                        zIndex: 1
                      }}
                    >
                      <div 
                        className="rounded-2xl p-8 w-96 h-auto shadow-xl"
                        style={{ backgroundColor: '#1F4A43' }}
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#C9A45C' }}
                          >
                            <StepIcon className="w-6 h-6 text-white" />
                          </div>
                          <div 
                            className="px-4 py-2 rounded-lg font-bold text-lg"
                            style={{ 
                              backgroundColor: step.color === '#DFFFEF' ? '#DFFFEF' : '#C9A45C',
                              color: '#163B36'
                            }}
                          >
                            {step.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Card */}
              <div 
                className={`relative z-10 transition-all duration-300 ${
                  isFlipping ? 'transform rotateY-180 scale-95' : 'transform rotateY-0 scale-100'
                }`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {(() => {
                  const step = roadmapSteps[currentCard];
                  const StepIcon = step.icon;
                  
                  return (
                    <div className="group">
                      <div 
                        className="rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden w-96 md:w-[500px]"
                        style={{ backgroundColor: step.bgColor }}
                      >
                        {/* Subtle glow effect */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"
                          style={{ backgroundColor: step.color }}
                        />

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: '#C9A45C' }}
                          >
                            <StepIcon className="w-6 h-6 text-white" />
                          </div>
                          <div 
                            className="px-4 py-2 rounded-lg font-bold text-lg group-hover:scale-105 transition-transform duration-300"
                            style={{ 
                              backgroundColor: step.color === '#DFFFEF' ? '#DFFFEF' : '#C9A45C',
                              color: step.color === '#DFFFEF' ? '#163B36' : '#163B36'
                            }}
                          >
                            {step.title}
                          </div>
                        </div>

                        {/* Content List */}
                        <div className="space-y-4 relative z-10">
                          {step.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <span 
                                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white text-center leading-none"
                                style={{ backgroundColor: '#C9A45C' }}
                              >
                                {currentCard * 5 + itemIndex + 1}
                              </span>
                              <p className="text-white/85 text-base leading-relaxed">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Navigation Arrows */}
              {currentCard > 0 && (
                <button
                  onClick={prevCard}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: '#C9A45C',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px'
                  }}
                >
                  <ChevronLeft className="w-6 h-6 text-white mx-auto" />
                </button>
              )}

              {currentCard < roadmapSteps.length - 1 && (
                <button
                  onClick={nextCard}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: '#C9A45C',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px'
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-white mx-auto" />
                </button>
              )}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {roadmapSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCard ? 'scale-125' : 'scale-100 opacity-50'
                  }`}
                  style={{ 
                    backgroundColor: index <= currentCard ? '#C9A45C' : '#FFFFFF'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section - Only show after viewing all cards */}
        {currentCard === roadmapSteps.length - 1 && (
          <div className="px-4 pb-12 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-xl md:text-2xl font-medium text-white mb-4">
                Agora vamos apresentar os detalhes do contrato da consultoria
              </h3>
              
              <div
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
                  borderRadius: '24px'
                }}
              >
                <RCButton 
                  onClick={handleNext}
                  className="text-lg px-10 py-4 font-bold transition-all duration-300 hover:scale-105 shadow-xl text-[#163B36] bg-transparent border-0"
                >
                  Continuar
                </RCButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dash {
          0% { background-position: 0px 0px; }
          100% { background-position: 40px 0px; }
        }
      `}</style>
    </div>
  );
};

export default Meeting2Consultoria;