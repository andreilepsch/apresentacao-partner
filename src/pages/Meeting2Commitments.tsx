import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Target, HandHeart, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import paymentImage from '@/assets/commitment-payment.jpg';
import strategyImage from '@/assets/commitment-strategy.jpg';
import propertiesImage from '@/assets/commitment-properties.jpg';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useMeeting2PDFGenerator } from '@/hooks/useMeeting2PDFGenerator';
import { toast } from 'sonner';

const Meeting2Commitments = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { generateMeeting2PDF } = useMeeting2PDFGenerator();
  useScrollToTop();
  
  React.useEffect(() => {
    const clienteInfo = localStorage.getItem("clienteInfo");
    if (!clienteInfo) {
      navigate("/meeting2/pricing-options");
    }
  }, [navigate]);

  const handleContinue = async () => {
    setIsGeneratingPDF(true);
    toast.loading('Gerando relatório da consultoria...');
    
    try {
      // Recuperar dados do localStorage
      const clienteInfoStr = localStorage.getItem("clienteInfo");
      if (!clienteInfoStr) {
        toast.error('Dados não encontrados');
        return;
      }
      
      const clienteInfo = JSON.parse(clienteInfoStr);
      
      // Calcular ciclos para obter dados do 4º ciclo
      const getMeeting2CycleData = (totalCredito: number, totalParcela: number) => {
        const cycles = [];
        const monthlyInstallment = totalParcela;
        
        for (let cycle = 1; cycle <= 4; cycle++) {
          let patrimony = 0;
          
          for (let propertyIndex = 1; propertyIndex <= cycle; propertyIndex++) {
            const cyclesElapsed = cycle - propertyIndex;
            const yearsElapsed = cyclesElapsed * 5;
            const propertyValue = totalCredito * Math.pow(1.04, yearsElapsed);
            patrimony += propertyValue;
          }
          
          const monthlyIncome = patrimony * 0.01;
          const monthlyProfit = monthlyIncome - monthlyInstallment;
          
          cycles.push({
            cycle,
            patrimony: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(patrimony),
            installment: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyInstallment),
            income: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyIncome),
            profit: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyProfit)
          });
        }
        
        return cycles;
      };

      // Calcular dados dos ciclos
      const creditValue = parseFloat(clienteInfo.selectedPricing?.credit_brl?.replace(/[^\d,-]/g, '').replace(',', '.') || '0');
      const installmentValue = parseFloat(clienteInfo.selectedPricing?.installment_brl?.replace(/[^\d,-]/g, '').replace(',', '.') || '0');
      const cyclesData = getMeeting2CycleData(creditValue, installmentValue);
      
      // Usar dados do 4º ciclo (índice 3)
      const fourthCycle = cyclesData[3] || { patrimony: 'N/A', income: 'N/A' };
      
      // Estruturar dados para o relatório
      const reportData = {
        clientName: clienteInfo.nomeCliente || 'Cliente',
        selectedCredit: {
          creditValue: clienteInfo.selectedPricing?.credit_brl || 'N/A',
          installment: clienteInfo.selectedPricing?.installment_brl || 'N/A',
          estimatedIncome: fourthCycle.income,
          patrimony: fourthCycle.patrimony
        },
        administrator: {
          name: 'CANOPUS',
          highlights: [
            '1.200 contemplações por mês',
            'Parceira BMW, Mini Cooper e Havan',
            'Selo Banco Central e Reclame Aqui'
          ],
          trustIndicators: [
            { number: '+178 mil', label: 'Clientes Contemplados' },
            { number: '+50 anos', label: 'No Mercado' }
          ]
        },
        commitments: commitments.map(c => ({
          title: c.title,
          description: c.description,
          icon: c.icon.name || 'icon'
        })),
        cycles: cyclesData
      };
      
      // Gerar PDF
      await generateMeeting2PDF(reportData);
      toast.success('Relatório gerado com sucesso!');
      
      // Navegar para próxima página
      navigate("/meeting2/contract-form");
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório');
      // Continuar navegação mesmo em caso de erro
      navigate("/meeting2/contract-form");
    } finally {
      setIsGeneratingPDF(false);
      toast.dismiss();
    }
  };

  const commitments = [
    {
      title: "HOJE",
      description: "Mantenha suas parcelas em dia",
      icon: Calendar,
      image: paymentImage
    },
    {
      title: "AMANHÃ", 
      description: "Siga a estratégia mensal",
      icon: Target,
      image: strategyImage
    },
    {
      title: "SEU FUTURO",
      description: "Tenha renda e patrimônio com imóveis", 
      icon: HandHeart,
      image: propertiesImage
    }
  ];

  const progress = ((currentStep + 1) / commitments.length) * 100;

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: "#163B36" }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-center mb-8 relative">
          <Button
            onClick={() => navigate("/meeting2/pricing-options")}
            variant="ghost"
            size="icon"
            className="absolute left-0 text-white hover:bg-white/10 rounded-full w-12 h-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold text-black bg-gradient-to-r from-[#C9A45C] to-[#E5C875] shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>SEUS COMPROMISSOS</span>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-white/60 text-sm font-medium">
              {currentStep + 1} de {commitments.length}
            </span>
          </div>
          <Progress 
            value={progress} 
            className="max-w-md mx-auto h-2 bg-white/10"
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent animate-fade-in">
            Seu compromisso hoje,
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-[#C9A45C] via-[#E5C875] to-[#F5D285] bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '200ms' }}>
            sua liberdade amanhã
          </h1>
        </div>

        {/* Layered Cards Animation */}
        <div className="relative min-h-[600px] flex items-center justify-center mb-12">
          {commitments.map((commitment, index) => {
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            const isFuture = index > currentStep;
            
            // Show only the active card to avoid any visual overlap
            if (!isActive) return null;
            
            return (
              <div
                key={index}
                className={`absolute transition-all duration-500 ease-out ${
                  isActive ? 'z-20' : 'z-10'
                } ${
                  isPast ? 'opacity-20 -translate-x-40 scale-75 pointer-events-none' : 
                  'opacity-100 translate-x-0 scale-100'
                }`}
                style={{
                  transform: `
                    translateX(${isPast ? -160 : 0}px) 
                    scale(${isActive ? 1 : 0.75}) 
                    rotateY(${isPast ? -15 : 0}deg)
                  `,
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                  transitionDelay: isPast ? '0ms' : '100ms'
                }}
              >
                <div className="w-80 max-w-sm">
                  <Card className={`group bg-white/8 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
                    isActive ? 
                      'hover:shadow-[0_30px_60px_-15px_rgba(201,164,92,0.4)] hover:scale-[1.02] border-[#C9A45C]/30' : 
                      'hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]'
                  }`}>
                    <CardContent className="p-0 relative">
                      {/* Enhanced Glow Effect for Active Card */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C9A45C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}
                      
                      {/* Icon and Title Section */}
                      <div className="relative p-8 text-center">
                        <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-xl shadow-lg transition-all duration-300 ${
                          isActive ? 'hover:shadow-xl hover:scale-110' : ''
                        }`} style={{ backgroundColor: isActive ? '#DFFFEF' : '#DFFFEF80' }}>
                          <commitment.icon className="w-8 h-8" style={{ color: isActive ? '#C9A45C' : '#C9A45C80' }} />
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-4 tracking-wide transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-white/70'
                        }`}>
                          {commitment.title}
                        </h3>
                      </div>
                      
                      {/* Professional Image */}
                      <div className="h-44 overflow-hidden relative mx-6 rounded-2xl shadow-xl border border-white/10">
                        <img 
                          src={commitment.image}
                          alt={`Ilustração ${commitment.title}`}
                          className={`w-full h-full object-cover transition-transform duration-700 ${
                            isActive ? 'group-hover:scale-110' : 'scale-105'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                      </div>
                      
                      {/* Description */}
                      <div className="relative p-8 pt-6 text-center">
                        <p className={`font-medium text-lg leading-relaxed transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-white/60'
                        }`}>
                          {commitment.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {currentStep > 0 && (
          <Button
            onClick={() => setCurrentStep(prev => prev - 1)}
            variant="ghost"
            size="icon"
            className="fixed left-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-14 h-14 z-30 backdrop-blur-sm border border-white/20"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Button>
        )}
        
        {currentStep < commitments.length - 1 && (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            variant="ghost"
            size="icon"
            className="fixed right-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-14 h-14 z-30 backdrop-blur-sm border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            {commitments.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-[#C9A45C] scale-125 shadow-lg' 
                    : index < currentStep 
                      ? 'bg-[#C9A45C]/60 hover:bg-[#C9A45C]/80' 
                      : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        {currentStep === commitments.length - 1 && (
          <div className="flex justify-center mb-8 animate-fade-in">
            <Button
              onClick={handleContinue}
              disabled={isGeneratingPDF}
              className="px-8 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#C9A45C] to-[#E5C875] hover:from-[#E5C875] to-[#C9A45C] shadow-xl disabled:opacity-50"
            >
              <span>{isGeneratingPDF ? 'Gerando Relatório...' : 'Avançar'}</span>
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting2Commitments;