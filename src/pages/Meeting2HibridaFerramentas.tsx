import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Home, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageNavigation from "@/components/common/PageNavigation";
import Meeting2Layout from "@/components/meeting2/Meeting2Layout";
import { Card } from "@/components/ui/card";

interface ClientInfo {
  nomeCliente: string;
  estrategiaInvestimento?: string;
}

export default function Meeting2HibridaFerramentas() {
  const navigate = useNavigate();
  useScrollToTop();
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem("clienteInfo");
    if (savedInfo) {
      setClientInfo(JSON.parse(savedInfo));
    } else {
      navigate("/meeting2/hibrida");
    }
  }, [navigate]);

  if (!clientInfo) return null;

  const showCDI = clientInfo.estrategiaInvestimento === 'guardar' || 
                  clientInfo.estrategiaInvestimento === 'aplicar-cdi' ||
                  clientInfo.estrategiaInvestimento === 'ambos';

  return (
    <Meeting2Layout backTo="/meeting2/hibrida/steps" badgeIcon={Wrench} badgeText="AS FERRAMENTAS" badgeVariant="golden">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Quais ferramentas utilizaremos para<br />alcançar o seu objetivo
        </h1>

        <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          O plano combina dois elementos principais que trabalham juntos<br />
          para maximizar seus resultados
        </p>
      </div>

      {/* Main Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
        {/* Consórcio Card */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#C9A45C]/40 transition-all duration-300 group overflow-hidden">
          <div className="p-10">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: '#C9A45C' }}
            >
              <Home className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Consórcio
            </h3>
            
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Garante <strong className="text-[#C9A45C]">crédito parcelado sem juros bancários</strong>,
              permitindo que você adquira imóveis de forma planejada e sustentável.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Sem juros bancários tradicionais</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Parcelas que cabem no seu orçamento</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Acesso facilitado ao crédito imobiliário</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Imóvel na Planta Card */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#C9A45C]/40 transition-all duration-300 group overflow-hidden">
          <div className="p-10">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundColor: '#C9A45C' }}
            >
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">
              Imóvel na Planta
            </h3>
            
            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              <strong className="text-[#C9A45C]">Valoriza durante a obra</strong> e depois gera renda,
              criando um efeito multiplicador no seu patrimônio.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Valorização durante a construção</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Geração de renda após entrega</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-white/70">Preço de lançamento mais vantajoso</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Optional CDI Section */}
      {showCDI && (
        <div className="mb-16 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border border-[#C9A45C]/30 hover:border-[#C9A45C]/50 transition-all duration-300">
            <div className="p-10">
              <div className="flex items-start gap-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: '#C9A45C' }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      Reserva Estratégica
                    </h3>
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ 
                        backgroundColor: 'rgba(201, 164, 92, 0.15)',
                        color: '#C9A45C',
                        border: '1px solid rgba(201, 164, 92, 0.3)'
                      }}
                    >
                      OPCIONAL
                    </span>
                  </div>
                  
                  <p className="text-white/70 leading-relaxed mb-6 text-lg">
                    De forma opcional, parte do valor pode ser mantida no <strong className="text-[#C9A45C]">CDI como reserva estratégica</strong>.
                    Essa decisão é definida de acordo com seu perfil e preferências.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-white/70">Liquidez imediata quando necessário</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#C9A45C' }}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-white/70">Rentabilidade atrelada à Selic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}


      {/* Bottom Benefits Section */}
      <div className="text-center mb-16 mt-20">
        <p className="text-2xl font-bold text-white mb-12">
          Essa união garante três pilares fundamentais:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#C9A45C]/30 transition-all duration-300">
            <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A45C' }} />
            <h4 className="text-xl font-bold text-white mb-3">Segurança</h4>
            <p className="text-white/70">Investimento sólido e protegido</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#C9A45C]/30 transition-all duration-300">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A45C' }} />
            <h4 className="text-xl font-bold text-white mb-3">Previsibilidade</h4>
            <p className="text-white/70">Planejamento claro e definido</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#C9A45C]/30 transition-all duration-300">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A45C' }} />
            <h4 className="text-xl font-bold text-white mb-3">Crescimento</h4>
            <p className="text-white/70">Patrimônio planejado e sustentável</p>
          </div>
        </div>
      </div>

      <PageNavigation 
        onBack={() => navigate("/meeting2/hibrida/steps")}
        onNext={() => navigate("/meeting2/hibrida/conclusao")}
        nextText="Continuar →"
        className="mt-16"
      />
    </Meeting2Layout>
  );
}
