import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Target, Wallet, CreditCard, TrendingUp, ArrowLeft } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageNavigation from "@/components/common/PageNavigation";
import { Button } from "@/components/ui/button";
import PageBadge from "@/components/common/PageBadge";

interface ClientInfo {
  nomeCliente: string;
  valorParcela: string;
  objetivo: string;
  patrimonio: string;
  rendaMensal: string;
  creditoImobiliario: number;
  idade?: string;
  profissao?: string;
}

export default function Meeting2Hibrida() {
  const navigate = useNavigate();
  useScrollToTop();
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem("clienteInfo");
    if (savedInfo) {
      const parsedInfo = JSON.parse(savedInfo);
      
      if (parsedInfo.valorParcela) {
        const parcela = Number(parsedInfo.valorParcela.replace(/\D/g, '')) / 100;
        const creditoImobiliario = (parcela / 600) * 125000;
        const patrimonio = Math.ceil(creditoImobiliario * 5);
        const rendaMensal = Math.ceil(patrimonio * 0.01);
        
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
        
        parsedInfo.creditoImobiliario = creditoImobiliario;
        localStorage.setItem("clienteInfo", JSON.stringify(parsedInfo));
      }
      
      setClientInfo(parsedInfo);
    } else {
      navigate("/meeting2");
    }
  }, [navigate]);

  if (!clientInfo) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header with Badge and Back Button */}
        <header className="flex items-center justify-between pt-6 mb-12">
          <Button
            onClick={() => navigate("/meeting2/hibrida/form")}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-all rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
              color: '#000000'
            }}
          >
            <Target className="h-4 w-4" />
            O PLANO ESTRUTURADO
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Estratégia de Multiplicação Patrimonial
          </h1>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              Seu plano foi construído a partir de três pilares fundamentais{' '}
              <strong style={{ color: '#C9A45C' }}>o capital disponível</strong> para iniciar,{' '}
              <strong style={{ color: '#C9A45C' }}>a parcela mensal</strong> adequada ao seu orçamento,{' '}
              e <strong style={{ color: '#C9A45C' }}>a renda</strong> que você deseja gerar.
            </p>
          </div>
        </div>

        {/* Three Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 max-w-6xl mx-auto">
          {/* Pilar 1: Capital Disponível - Slate/Gray Accent */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-slate-300/10 via-transparent to-transparent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative h-full p-6 rounded-2xl backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(203, 213, 225, 0.1), rgba(148, 163, 184, 0.1))',
                border: '1px solid rgba(203, 213, 225, 0.3)',
                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.2)'
              }}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-200/20 to-slate-400/10 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-slate-50" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-slate-300/70 font-medium tracking-wider uppercase">Capital Disponível</p>
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {clientInfo.creditoImobiliario?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed pt-1">
                    Disponível para iniciar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 2: Parcela Confortável - Blue Accent */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400/20 via-cyan-400/10 to-transparent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative h-full p-6 rounded-2xl backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(56, 189, 248, 0.08))',
                border: '1px solid rgba(96, 165, 250, 0.25)',
                boxShadow: '0 8px 32px -8px rgba(59, 130, 246, 0.2)'
              }}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-300/30 to-cyan-400/15 flex items-center justify-center backdrop-blur-sm border border-blue-300/20 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-6 h-6 text-blue-50" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-blue-100/70 font-medium tracking-wider uppercase">Parcela Confortável</p>
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {clientInfo.valorParcela}
                  </p>
                  <p className="text-blue-100/50 text-xs leading-relaxed pt-1">
                    Investimento mensal confortável
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 3: Renda Almejada - Emerald/Teal Accent */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-400/20 via-teal-400/10 to-transparent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative h-full p-6 rounded-2xl backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.08))',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                boxShadow: '0 8px 32px -8px rgba(16, 185, 129, 0.2)'
              }}>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-300/30 to-teal-400/15 flex items-center justify-center backdrop-blur-sm border border-emerald-300/20 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-emerald-50" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-emerald-100/70 font-medium tracking-wider uppercase">Renda Almejada</p>
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {clientInfo.rendaMensal}
                  </p>
                  <p className="text-emerald-100/50 text-xs leading-relaxed pt-1">
                    Renda passiva mensal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mb-8 mt-16">
          <div 
            className="rounded-2xl p-5 max-w-4xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-base text-white/80 leading-relaxed">
              Esses três pilares formam a base da sua{' '}
              <strong style={{ color: '#C9A45C' }}>estratégia personalizada</strong>,{' '}
              garantindo que cada decisão seja alinhada com suas possibilidades e objetivos.
            </p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="space-y-2 group">
              <div className="text-4xl font-light group-hover:scale-105 transition-transform duration-300" style={{ color: '#C9A45C' }}>100%</div>
              <div className="text-xs text-slate-300/60 font-light tracking-wide">Personalizado</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-4xl font-light group-hover:scale-105 transition-transform duration-300" style={{ color: '#C9A45C' }}>3</div>
              <div className="text-xs text-slate-300/60 font-light tracking-wide">Pilares Estratégicos</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-4xl font-light group-hover:scale-105 transition-transform duration-300" style={{ color: '#C9A45C' }}>∞</div>
              <div className="text-xs text-slate-300/60 font-light tracking-wide">Potencial de Crescimento</div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Clean Design */}
        <div className="mt-20 pt-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/meeting2/hibrida/form')}
            className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-light flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <button
            onClick={() => navigate('/meeting2/hibrida/steps')}
            className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-light flex items-center gap-2"
          >
            Ver Estratégia Detalhada →
          </button>
        </div>
      </div>
    </div>
  );
}
