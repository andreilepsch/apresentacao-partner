import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, TrendingUp, Shield, Users } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PageNavigation from "@/components/common/PageNavigation";
import Meeting2Layout from "@/components/meeting2/Meeting2Layout";
import { Card } from "@/components/ui/card";

interface ClientInfo {
  nomeCliente: string;
  objetivo: string;
}

export default function Meeting2HibridaConclusao() {
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

  return (
    <Meeting2Layout backTo="/meeting2/hibrida/ferramentas">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          style={{ backgroundColor: '#C9A45C' }}
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          <span style={{ color: '#C9A45C' }}>{clientInfo.nomeCliente}</span>, sua estratégia<br />
          está estruturada
        </h1>

        <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
          Você agora tem um plano completo e personalizado para alcançar{' '}
          {(() => {
            switch(clientInfo.objetivo) {
              case 'renda-extra':
                return 'sua renda extra através dos imóveis';
              case 'moradia':
                return 'sua casa própria de forma inteligente';
              case 'aposentadoria':
              default:
                return 'sua aposentadoria com segurança e rentabilidade';
            }
          })()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
        {/* Card 1: Estratégia Personalizada */}
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/30 transition-all duration-300 group">
          <div className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: '#4A90A4' }}
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              Estratégia Personalizada
            </h3>
            
            <p className="text-white/70 leading-relaxed text-sm">
              Plano estruturado baseado no seu perfil, objetivos e capacidade de investimento
            </p>
          </div>
        </Card>

        {/* Card 2: Ferramentas Definidas */}
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/30 transition-all duration-300 group">
          <div className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: '#6B7280' }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              Ferramentas Definidas
            </h3>
            
            <p className="text-white/70 leading-relaxed text-sm">
              Consórcio e imóveis na planta trabalhando juntos para maximizar seus resultados
            </p>
          </div>
        </Card>

        {/* Card 3: Acompanhamento Completo */}
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-white/30 transition-all duration-300 group">
          <div className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: '#4F9A94' }}
            >
              <Users className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              Acompanhamento Completo
            </h3>
            
            <p className="text-white/70 leading-relaxed text-sm">
              Suporte contínuo em todas as etapas da sua jornada de investimento imobiliário
            </p>
          </div>
        </Card>
      </div>

      {/* Golden Divider */}
      <div className="flex items-center justify-center gap-4 my-16">
        <div className="h-px flex-1 max-w-md" style={{ backgroundColor: '#C9A45C' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C9A45C' }}></div>
        <div className="h-px flex-1 max-w-md" style={{ backgroundColor: '#C9A45C' }}></div>
      </div>

      {/* Next Steps Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Próximos Passos
        </h2>

        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <p className="text-lg text-white/90 leading-relaxed mb-6">
            Agora que você conhece sua estratégia personalizada, vamos detalhar como<br />
            <strong style={{ color: '#C9A45C' }}>colocar este plano em prática</strong> e começar a construir<br />
            o seu patrimônio imobiliário.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#C9A45C' }}>
                <span className="text-white font-bold">1</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Vamos explorar as <strong style={{ color: '#C9A45C' }}>opções de consultoria</strong> disponíveis para você
              </p>
            </div>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#C9A45C' }}>
                <span className="text-white font-bold">2</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Escolha o <strong style={{ color: '#C9A45C' }}>modelo de acompanhamento</strong> ideal para o seu perfil
              </p>
            </div>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#C9A45C' }}>
                <span className="text-white font-bold">3</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Comece a <strong style={{ color: '#C9A45C' }}>construir seu patrimônio</strong> com segurança e inteligência
              </p>
            </div>
          </div>
        </div>
      </div>

      <PageNavigation 
        onBack={() => navigate("/meeting2/hibrida/ferramentas")}
        onNext={() => navigate("/meeting2/consultoria")}
        nextText="Ver Opções de Consultoria →"
        className="mt-16"
      />
    </Meeting2Layout>
  );
}
