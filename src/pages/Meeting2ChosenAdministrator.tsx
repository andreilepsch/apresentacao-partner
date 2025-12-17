import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Crown, Star, Award, Badge, TrendingUp, ExternalLink, Handshake, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import ParceiraLink from "@/components/administradora/ParceiraLink";
import { toast } from "sonner";

interface AdminData {
  id: string;
  nome: string;
  contemplacoes_mes: number;
  anos_mercado: number;
  clientes_contemplados: string;
  descricao_adicional: string | null;
  link_reclame_aqui: string;
  parceira1_nome: string;
  parceira1_link: string | null;
  parceira2_nome: string;
  parceira2_link: string | null;
  parceira3_nome: string;
  parceira3_link: string | null;
}

export default function Meeting2ChosenAdministrator() {
  const navigate = useNavigate();
  useScrollToTop();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const administradora = localStorage.getItem('meeting2_administradora');
      
      if (!administradora) {
        toast.error('Nenhuma administradora selecionada');
        navigate('/meeting2');
        return;
      }

      const { data, error } = await supabase
        .from('administradoras_info')
        .select('*')
        .eq('nome', administradora)
        .single();

      if (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Erro ao carregar dados da administradora');
        // Fallback para dados da Canopus se houver erro
        const { data: fallbackData } = await supabase
          .from('administradoras_info')
          .select('*')
          .eq('nome', 'Canopus')
          .single();
        
        setAdminData(fallbackData);
      } else {
        setAdminData(data);
      }
      
      setLoading(false);
    };

    fetchAdminData();
  }, [navigate]);

  if (loading || !adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#163B36' }}>
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const whyAdmin = [
    {
      icon: Star,
      title: "Alto Volume de Contemplações",
      subtitle: (
        <span className="font-bold text-lg" style={{ color: '#C9A45C' }}>
          {adminData.contemplacoes_mes.toLocaleString('pt-BR')} contemplações por mês
        </span>
      ),
      description: "Mais oportunidades de ser contemplado rapidamente"
    },
    {
      icon: Handshake,
      title: "Parceira de Grandes Marcas",
      subtitle: (
        <>
          <ParceiraLink nome={adminData.parceira1_nome} link={adminData.parceira1_link} />
          <span className="text-[#C9A45C]">, </span>
          <ParceiraLink nome={adminData.parceira2_nome} link={adminData.parceira2_link} />
          <span className="text-[#C9A45C]"> e </span>
          <ParceiraLink nome={adminData.parceira3_nome} link={adminData.parceira3_link} />
        </>
      ),
      description: "Marcas premium reconhecidas mundialmente"
    },
    {
      icon: Badge,
      title: "Selo de Qualidade",
      subtitle: (
        <>
          <a 
            href="https://www3.bcb.gov.br/ranking/consorcio.do"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300 underline font-bold text-lg"
            style={{ color: '#C9A45C' }}
          >
            Banco Central
          </a>
          <span className="text-[#C9A45C]"> e </span>
          <a 
            href={adminData.link_reclame_aqui}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300 underline font-bold text-lg"
            style={{ color: '#C9A45C' }}
          >
            Reclame Aqui
          </a>
        </>
      ),
      description: "Reconhecimento oficial e avaliação positiva dos clientes"
    }
  ];

  const trustIndicators = [
    {
      icon: TrendingUp,
      number: adminData.clientes_contemplados,
      label: "Clientes Contemplados",
      highlight: "Histórico comprovado de sucesso"
    },
    {
      icon: Award,
      number: `+${adminData.anos_mercado} anos`,
      label: "No Mercado",
      highlight: "Experiência e tradição"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="relative flex items-center justify-center mb-12">
          <button
            onClick={() => navigate("/meeting2/consortium-selection")}
            className="absolute left-0 p-3 text-white hover:bg-white/10 transition-all rounded-xl group"
          >
            <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-xl animate-pulse"
               style={{ 
                 background: 'linear-gradient(135deg, #C9A45C, #E5C875)', 
                 color: '#163B36' 
               }}>
            <CheckCircle className="w-5 h-5" />
            Melhor Opção
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 pb-8 relative">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            A administradora escolhida é a<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {adminData.nome.toUpperCase()}
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed mb-4">
            Após análise criteriosa, a {adminData.nome} se destacou como a melhor opção para o seu perfil de investimento
          </p>
          {adminData.descricao_adicional && (
            <p className="text-md text-white/70 max-w-3xl mx-auto leading-relaxed mb-8 italic">
              {adminData.descricao_adicional}
            </p>
          )}
          {/* Golden line */}
          <div 
            className="w-32 h-0.5 mx-auto" 
            style={{ background: 'linear-gradient(90deg, #C9A45C, #E5C875, #C9A45C)' }}
          />
        </div>

        {/* Why Admin Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-white mb-4">Por que a {adminData.nome}?</h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Três motivos principais fizeram dela a escolha ideal para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyAdmin.map((item, index) => (
              <div 
                key={index} 
                className="group relative animate-fade-in hover:scale-105 transition-all duration-500"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  backgroundColor: '#163B36'
                }}
              >
                {/* Card */}
                <div className="relative h-full rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#C9A45C]/30">
                  {/* Icon */}
                  <div 
                    className="flex items-center justify-center w-16 h-16 rounded-xl mb-6 mx-auto group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: '#DFFFEF' }}
                  >
                    <item.icon 
                      className="w-8 h-8" 
                      style={{ color: '#C9A45C' }} 
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A45C] transition-colors">
                      {item.title}
                    </h3>
                    <div className="mb-3">{item.subtitle}</div>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(201, 164, 92, 0.04), rgba(223, 255, 239, 0.02))`,
                      boxShadow: `0 0 30px rgba(201, 164, 92, 0.08)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Números que Inspiram Confiança</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trustIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="group text-center animate-fade-in hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <indicator.icon 
                      className="w-10 h-10 group-hover:scale-110 transition-all duration-300" 
                      style={{ color: '#C9A45C' }}
                    />
                    <div 
                      className="text-4xl font-bold group-hover:scale-110 transition-transform duration-300"
                      style={{ color: '#FFFFFF' }}
                    >
                      {indicator.number}
                    </div>
                    <div 
                      className="text-base text-center group-hover:text-white transition-colors"
                      style={{ color: '#BFCAC7' }}
                    >
                      {indicator.label}
                    </div>
                    <div className="text-sm text-white/70">{indicator.highlight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "1s" }}>
          <button
            onClick={() => navigate("/meeting2/security")}
            className="group inline-flex items-center gap-3 px-12 py-6 rounded-3xl font-bold text-lg text-black shadow-2xl hover:scale-105 transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, #C9A45C, #E5C875)',
              boxShadow: '0 10px 30px rgba(201, 164, 92, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(201, 164, 92, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(201, 164, 92, 0.3)';
            }}
          >
            Seguranças e Garantias
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
