import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Scale, Handshake, Search, FileText, Dice6, ScrollText, Check, Circle, ArrowLeft } from "lucide-react";
import Meeting2Button from "@/components/meeting2/Meeting2Button";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Meeting2Security() {
  const navigate = useNavigate();
  useScrollToTop();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);

  const securityCards = [
    {
      icon: Scale,
      title: "Proteção e Independência do Patrimônio",
      subtitle: "(Art. 3º)",
      description: "O patrimônio do grupo no fundo comum é separado da administradora. Em caso de falência, os recursos continuam protegidos para contemplações."
    },
    {
      icon: Handshake,
      title: "Igualdade de Acesso e Controle",
      subtitle: "(Arts. 2º, 5º e 12º)",
      description: "Todos os consorciados têm acesso igualitário às informações e às oportunidades de contemplação, sem qualquer favorecimento."
    },
    {
      icon: Search,
      title: "Fiscalização pelo Banco Central",
      subtitle: "(Arts. 6º e 7º)",
      description: "As administradoras de consórcio só podem atuar com autorização do Banco Central, que fiscaliza todas as operações."
    },
    {
      icon: FileText,
      title: "Direitos dos Consorciados",
      subtitle: "",
      description: "Garantia de informações claras, regras transparentes de contemplação e proibição de cobranças abusivas."
    },
    {
      icon: Dice6,
      title: "Contemplação por Sorteio ou Lance",
      subtitle: "(Arts. 22 e 24)",
      description: "A contemplação ocorre por sorteio ou por lances, assegurando oportunidades justas para todos os participantes."
    }
  ];

  const toggleCheck = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  const checkedCount = checkedItems.filter(Boolean).length;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#163B36' }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#163B36] via-[#163B36] to-[#0F2C24]"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="relative flex items-center justify-center mb-12">
          <button
            onClick={() => navigate("/meeting2/chosen-administrator")}
            className="absolute left-0 p-3 text-white hover:bg-white/10 transition-all rounded-xl group"
          >
            <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <Shield className="w-4 h-4 text-[#C9A45C]" />
            <span className="text-[#C9A45C] font-bold text-xs tracking-wide uppercase">
              Segurança & Garantias
            </span>
          </div>
        </header>

        {/* Hero Section - Simplified */}
        <div className="text-center mb-16">
          {/* Title and subtitle */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Sua segurança garantida
            </h1>
            <p className="text-xl text-[#C9A45C] font-medium">
              Lei 11795/2008
            </p>
          </div>
        </div>

        {/* Security Checklist - Simple Document Style */}
        <div className="max-w-4xl mx-auto">
          {/* Document Header */}
          <div className="bg-[#1F4A43]/30 backdrop-blur-sm border border-[#C9A45C]/20 rounded-t-[20px] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#C9A45C] rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Checklist</h3>
                  <p className="text-[#C4D5D2] text-sm">Artigos da Lei</p>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[#C9A45C] font-bold text-sm">{checkedCount}/{securityCards.length}</div>
                  <div className="text-[#C4D5D2] text-xs">Validados</div>
                </div>
                <div className="w-12 h-12 bg-[#163B36] rounded-full flex items-center justify-center relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
                    <circle 
                      cx="25" 
                      cy="25" 
                      r="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      className="text-[#C9A45C]/30"
                    />
                    <circle 
                      cx="25" 
                      cy="25" 
                      r="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-[#C9A45C] transition-all duration-500"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 20}`,
                        strokeDashoffset: `${2 * Math.PI * 20 * (1 - checkedCount / securityCards.length)}`
                      }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="bg-[#1F4A43]/50 backdrop-blur-sm border-x border-[#C9A45C]/20">
            {securityCards.map((card, index) => {
              const isChecked = checkedItems[index];
              return (
                <div 
                  key={index}
                  className={`relative border-b border-[#C9A45C]/10 transition-all duration-500 cursor-pointer group ${
                    index === securityCards.length - 1 ? 'border-b-0' : ''
                  }`}
                  onClick={() => toggleCheck(index)}
                >
                  <div className={`p-8 flex items-start gap-6 transition-all duration-500 ${
                    isChecked ? 'bg-[#DFFFEF]/5' : 'hover:bg-[#C9A45C]/5'
                  }`}>
                    
                    {/* Article Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isChecked 
                          ? 'bg-[#DFFFEF] text-[#163B36] shadow-[0_0_20px_rgba(223,255,239,0.4)]' 
                          : 'bg-[#C9A45C] text-white group-hover:shadow-[0_0_15px_rgba(201,164,92,0.3)]'
                      }`}>
                        <card.icon className={`w-8 h-8 transition-transform duration-300 ${
                          isChecked ? 'scale-110' : 'group-hover:scale-105'
                        }`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className={`text-lg font-bold transition-colors duration-300 ${
                            isChecked ? 'text-[#DFFFEF]' : 'text-white'
                          }`}>
                            {card.title}
                          </h4>
                          {card.subtitle && (
                            <p className="text-[#C9A45C] text-sm font-medium mt-1">
                              {card.subtitle}
                            </p>
                          )}
                        </div>
                        
                        {/* Status Badge - apenas quando não validado */}
                        {!isChecked && (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#C9A45C]/20 text-[#C9A45C] group-hover:bg-[#C9A45C]/30 transition-all duration-300">
                            <Circle className="w-3 h-3" />
                            PENDENTE
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isChecked ? 'text-[#DFFFEF]/90' : 'text-white/85'
                      }`}>
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Validation Stamp Effect */}
                  {isChecked && (
                    <div className="absolute top-4 right-4 opacity-60 z-10">
                      <div className="w-24 h-24 bg-[#DFFFEF] rounded-full flex items-center justify-center transform rotate-12 animate-scale-in shadow-lg">
                        <div className="text-center">
                          <Check className="w-8 h-8 text-[#163B36] mx-auto mb-1" />
                          <span className="text-[#163B36] text-xs font-bold">APROVADO</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Document Footer */}
          <div className="bg-[#1F4A43]/30 backdrop-blur-sm border border-[#C9A45C]/20 rounded-b-[20px] p-6 text-center">
            {checkedCount < securityCards.length ? (
              <div>
                <p className="text-[#C9A45C] font-semibold mb-1">Clique nos artigos para validá-los</p>
                <p className="text-[#C4D5D2] text-sm">Faltam {securityCards.length - checkedCount} artigos para completar a verificação</p>
              </div>
            ) : (
              <div>
                <p className="text-[#DFFFEF] font-semibold">Verificação completa</p>
              </div>
            )}
          </div>
        </div>

        {/* Elegant divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent my-16" />

        {/* Next Step */}
        <div className="relative p-12 bg-[#1F4A43] border border-[#1F4A43]/50 rounded-[24px] text-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-[#C9A45C] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#E5C875] rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-6">
              Amparado pela lei, protegido no futuro
            </h3>
            <p className="text-[#C4D5D2] text-lg mb-10 max-w-4xl mx-auto leading-relaxed">
              Com respaldo legal, cada passo do seu investimento é seguro e transparente.
            </p>
            
            <Meeting2Button
            onClick={() => navigate("/meeting2/pricing-options")}
              className="group px-12 py-6 text-black font-bold text-lg rounded-[24px] shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#C9A45C] to-[#E5C875] hover:from-[#E5C875] hover:to-[#C9A45C] hover:shadow-[0_0_30px_rgba(201,164,92,0.4)]"
              showArrow
            >
              Ver opções
            </Meeting2Button>
          </div>
        </div>
      </div>
    </div>
  );
}