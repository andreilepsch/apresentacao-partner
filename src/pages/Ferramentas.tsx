import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Map, Search, ArrowRight, Sparkles, Users, ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DynamicLogo from "@/components/DynamicLogo";
const Ferramentas = () => {
  const navigate = useNavigate();
  const ferramentas = [{
    id: 'calculadora',
    title: 'Calculadora Inteligente',
    description: 'Simule, compare e entregue projeções profissionais em segundos. A ferramenta que coloca o corretor no topo do jogo.',
    icon: Calculator,
    status: 'available',
    route: '/calculadora-inteligente',
    gradient: 'from-primary/10 to-primary/5'
  }, {
    id: 'mapa',
    title: 'Mapa de Apresentação',
    description: 'Apresentações visuais interativas com mapas inteligentes para mostrar localização, pontos de interesse e análise geográfica.',
    icon: Map,
    status: 'available',
    route: '/mapa-apresentacao',
    gradient: 'from-secondary/10 to-secondary/5'
  }, {
    id: 'estudos-grupo',
    title: 'Estudos de Grupo',
    description: 'Crie e gerencie estudos personalizados para grupos de investidores, com análises colaborativas e projeções compartilhadas.',
    icon: Users,
    status: 'available',
    route: '/estudos-grupo',
    gradient: 'from-primary/10 to-accent/5'
  }, {
    id: 'finder',
    title: 'Finder',
    description: 'Ferramenta avançada de busca e filtros para encontrar rapidamente imóveis que atendem aos critérios específicos dos clientes.',
    icon: Search,
    status: 'available',
    route: 'https://finder.autoridadeinvestimentos.com.br',
    gradient: 'from-accent/10 to-accent/5',
    external: true
  }];
  const handleToolClick = (ferramenta: any) => {
    if (ferramenta.status === 'available' || ferramenta.status === 'production') {
      if (ferramenta.external && ferramenta.route) {
        window.open(ferramenta.route, '_blank', 'noopener,noreferrer');
      } else if (ferramenta.route) {
        navigate(ferramenta.route);
      }
    }
  };
  return <div className="min-h-screen relative overflow-hidden bg-[#0F2838]">
    {/* Background Image - Mesma do Login - FIXA */}
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[20%]"
      style={{
        backgroundImage: `url('/images/auth-bg.png')`
      }}
    />

    {/* Overlays para consistência - Também FIXOS */}
    <div className="fixed inset-0 bg-[#0F2838]/60 backdrop-blur-[2px]" />
    <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#0F2838]/40 to-[#0F2838]" />

    {/* Hero Section */}
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Navigation Bar with Logo */}
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" size="sm" onClick={() => navigate('/meeting-selection')} className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm transition-all duration-300 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para Início
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 animate-fade-in">
            <DynamicLogo size="lg" variant="dark" />
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm transition-all duration-300 group">
            <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            Configurações
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[20vh] text-center px-[15px]">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30 px-6 py-3 rounded-full backdrop-blur-sm shadow-lg shadow-[#C9A45C]/10">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold tracking-wider text-sm">SHOWROOM DE FERRAMENTAS</span>
            </div>
          </div>

          <p className="text-heading-4 text-white/80 max-w-4xl mx-auto leading-relaxed">
            Descubra o conjunto completo de ferramentas desenvolvidas para elevar seu nível profissional e conquistar mais vendas.
          </p>
        </div>
      </div>
    </div>

    {/* Tools Grid */}
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {ferramentas.map(ferramenta => {
          const IconComponent = ferramenta.icon;
          return <Card key={ferramenta.id} className={`group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:shadow-2xl hover:shadow-[#C9A45C]/20 hover:border-[#C9A45C]/40 transition-all duration-300 ${ferramenta.status === 'available' || ferramenta.status === 'production' ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-not-allowed opacity-75'}`} onClick={() => handleToolClick(ferramenta)}>
            <CardContent className="relative z-10 p-8">
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${ferramenta.status === 'available' || ferramenta.status === 'production' ? 'bg-[#C9A45C]/20 border-2 border-[#C9A45C] shadow-lg group-hover:scale-110 group-hover:shadow-[#C9A45C]/50' : 'bg-white/10 border-2 border-white/20'} transition-all duration-300`}>
                  <IconComponent className={`w-8 h-8 ${ferramenta.status === 'available' || ferramenta.status === 'production' ? 'text-[#C9A45C]' : 'text-white/50'}`} />
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${ferramenta.status === 'available' ? 'bg-green-100 text-green-700' : ferramenta.status === 'production' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {ferramenta.status === 'available' ? 'Disponível' : ferramenta.status === 'production' ? 'Em Produção' : 'Em breve'}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-heading-4 font-bold mb-4 text-white group-hover:text-[#C9A45C] transition-colors">
                {ferramenta.title}
              </h3>

              <p className="text-white/70 leading-relaxed mb-6">
                {ferramenta.description}
              </p>

              {/* Action */}
              {ferramenta.status === 'available' || ferramenta.status === 'production' ? <div className="flex items-center gap-2 text-[#C9A45C] font-semibold group-hover:gap-4 transition-all">
                <span>Acessar ferramenta</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div> : <div className="text-white/50 font-medium">
                Aguarde o lançamento
              </div>}
            </CardContent>
          </Card>;
        })}
      </div>
    </div>

    {/* CTA Section */}
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 py-16 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-heading-2 font-bold mb-4 text-white">
          Fique por dentro das novidades
        </h2>
        <p className="text-heading-4 text-white/70 mb-8 max-w-2xl mx-auto">Novas ferramentas são constantemente desenvolvidas para atender às necessidades dos parceiros da Autoridade Investimentos</p>
      </div>
    </div>
  </div>;
};
export default Ferramentas;