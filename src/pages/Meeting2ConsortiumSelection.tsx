import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp, Shield, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Meeting2ConsortiumSelection() {
  const navigate = useNavigate();
  useScrollToTop();

  const pillars = [
    {
      id: 1,
      icon: Building2,
      title: "Administradora",
      description: "Análise completa da solidez",
      criteria: [
        "Reputação no mercado",
        "Histórico de contemplações",
        "Solidez financeira",
        "Tempo de atuação",
        "Avaliação de clientes"
      ]
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Índice de Contemplação",
      description: "Performance e estatísticas",
      criteria: [
        "Taxa de contemplação histórica",
        "Tempo médio para contemplação",
        "Estratégias de lance",
        "Performance do grupo",
        "Estatísticas atualizadas"
      ]
    },
    {
      id: 3,
      icon: Shield,
      title: "Perfil do Grupo",
      description: "Compatibilidade garantizada",
      criteria: [
        "Compatibilidade com seu perfil",
        "Faixa de renda dos participantes",
        "Objetivos similares",
        "Adimplência do grupo",
        "Estabilidade dos membros"
      ]
    }
  ];

  const stats = [
    { number: "20", label: "Administradoras Analisadas", icon: Building2 },
    { number: "200+", label: "Grupos Avaliados", icon: TrendingUp },
    { number: "3", label: "Pilares de Análise", icon: Shield }
  ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#163B36' }}>
        <div id="top" className="absolute top-0 left-0 w-1 h-1" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="relative flex items-center justify-center mb-12">
          <button
            onClick={() => navigate("/meeting2/contract")}
            className="absolute left-0 p-3 text-white hover:bg-white/10 transition-all rounded-xl group"
          >
            <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </header>

        {/* Main Header Section */}
        <div className="text-center mb-16 pb-8 relative">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Como escolhemos o consórcio ideal para você?
          </h1>
          <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
            Nossa metodologia é baseada em 3 pilares fundamentais que garantem a melhor escolha para o seu perfil e objetivos
          </p>
          {/* Golden line */}
          <div 
            className="w-32 h-0.5 mx-auto" 
            style={{ background: 'linear-gradient(90deg, #C9A45C, #E5C875, #C9A45C)' }}
          />
        </div>

        {/* Pillars Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.id}
              className="group relative animate-fade-in hover:scale-105 transition-all duration-500"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                backgroundColor: '#163B36'
              }}
            >
              {/* Card */}
              <div className="relative h-full rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#C9A45C]/30">
                {/* Pillar Number */}
                <div 
                  className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg border-2"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#C9A45C' 
                  }}
                >
                  <span style={{ color: '#163B36' }}>{pillar.id}</span>
                </div>

                {/* Icon */}
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#DFFFEF' }}
                >
                  <pillar.icon 
                    className="w-8 h-8" 
                    style={{ color: '#C9A45C' }} 
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A45C] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-base text-white/80 mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Criteria List */}
                  <div className="space-y-3">
                    {pillar.criteria.map((criterion, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
                      >
                        <CheckCircle 
                          className="w-5 h-5 mt-0.5 flex-shrink-0" 
                          style={{ color: '#C9A45C' }}
                        />
                        <span className="text-sm text-white/90 leading-relaxed">
                          {criterion}
                        </span>
                      </div>
                    ))}
                  </div>
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

        {/* Statistics Section */}
        <div className="mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group text-center animate-fade-in hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <stat.icon 
                      className="w-10 h-10 group-hover:scale-110 transition-all duration-300" 
                      style={{ color: '#C9A45C' }}
                    />
                    <div 
                      className="text-4xl font-bold group-hover:scale-110 transition-transform duration-300"
                      style={{ color: '#FFFFFF' }}
                    >
                      {stat.number}
                    </div>
                    <div 
                      className="text-base text-center group-hover:text-white transition-colors"
                      style={{ color: '#BFCAC7' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "1s" }}>
          <button
            onClick={() => navigate("/meeting2/chosen-administrator")}
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
            Ver Administradora Escolhida
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}