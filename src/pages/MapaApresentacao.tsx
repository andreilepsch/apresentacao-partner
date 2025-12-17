import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Building2, DollarSign, TrendingUp, FileText, Map, Crown, Globe, Megaphone, Eye, Target, PieChart } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const MapaApresentacao = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("primeira");

  // Estrutura das páginas da primeira reunião
  const primeiraReuniaoEtapas = [
    {
      id: 'step1-authority',
      title: 'Autoridade',
      description: 'Estabelecimento de credibilidade e expertise',
      icon: Crown,
      route: '/step1-authority',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step2-ecosystem',
      title: 'Ecossistema',
      description: 'Apresentação do ecossistema de negócios',
      icon: Globe,
      route: '/step2-ecosystem',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step2-presence',
      title: 'Presença',
      description: 'Demonstração de presença no mercado',
      icon: Eye,
      route: '/step2-presence',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step3-media',
      title: 'Mídia',
      description: 'Cobertura midiática e reconhecimento',
      icon: Megaphone,
      route: '/step3-media',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step4-what-we-do',
      title: 'O Que Fazemos',
      description: 'Apresentação dos serviços e soluções',
      icon: Target,
      route: '/step4-what-we-do',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step5-method',
      title: 'Método',
      description: 'Explicação da metodologia utilizada',
      icon: FileText,
      route: '/step5-method',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    },
    {
      id: 'step6-investment-options',
      title: 'Opções de Investimento',
      description: 'Apresentação das alternativas de investimento',
      icon: PieChart,
      route: '/step6-investment-options',
      color: 'from-rc-accent/30 to-rc-accent/10',
      iconColor: 'text-rc-primary'
    }
  ];

  // Caminhos específicos da primeira reunião
  const caminhosPrimeira = [
    {
      nome: 'Renda Extra',
      icon: DollarSign,
      color: 'from-rc-secondary/20 to-rc-secondary/10',
      iconColor: 'text-rc-primary',
      etapas: [
        { id: 'renda-extra-step1', title: 'Diagnóstico', route: '/renda-extra/step1' },
        { id: 'renda-extra-step2', title: 'Ciclos', route: '/renda-extra/step2' },
        { id: 'renda-extra-step4', title: 'Apresentação do Imóvel', route: '/renda-extra/step4' },
        { id: 'renda-extra-step5', title: 'Análise de Localização', route: '/renda-extra/step5' },
        { id: 'renda-extra-step6', title: 'Caso Real', route: '/renda-extra/step6' },
        { id: 'renda-extra-step7', title: 'Análise de Mercado', route: '/renda-extra/step7' },
        { id: 'renda-extra-step8', title: 'Formas de Investimento', route: '/renda-extra/step8' },
        { id: 'renda-extra-step9', title: 'Formas de Contemplação', route: '/renda-extra/step9' },
        { id: 'renda-extra-step10', title: 'Formas de Pagamento', route: '/renda-extra/step10' },
        { id: 'renda-extra-step11', title: 'Compromissos do Cliente', route: '/renda-extra/step11' },
        { id: 'renda-extra-step12', title: 'Feedback', route: '/renda-extra/step12' }
      ]
    },
    {
      nome: 'Casa Própria',
      icon: Building2,
      color: 'from-rc-secondary/20 to-rc-secondary/10',
      iconColor: 'text-rc-primary',
      etapas: [
        { id: 'casa-propria-step1', title: 'Introdução', route: '/casa-propria/step1' },
        { id: 'casa-propria-step2', title: 'Ciclos', route: '/casa-propria/step2' },
        { id: 'casa-propria-step4', title: 'Apresentação do Imóvel', route: '/casa-propria/step4' },
        { id: 'casa-propria-step5', title: 'Análise de Localização', route: '/casa-propria/step5' },
        { id: 'casa-propria-step6', title: 'Caso Real', route: '/casa-propria/step6' },
        { id: 'casa-propria-step7', title: 'Análise de Mercado', route: '/casa-propria/step7' },
        { id: 'casa-propria-step8', title: 'Formas de Investimento', route: '/casa-propria/step8' },
        { id: 'casa-propria-step9', title: 'Formas de Contemplação', route: '/casa-propria/step9' },
        { id: 'casa-propria-step10', title: 'Formas de Pagamento', route: '/casa-propria/step10' },
        { id: 'casa-propria-step11', title: 'Compromissos do Cliente', route: '/casa-propria/step11' },
        { id: 'casa-propria-step12', title: 'Feedback', route: '/casa-propria/step12' }
      ]
    },
    {
      nome: 'Aposentadoria',
      icon: TrendingUp,
      color: 'from-rc-secondary/20 to-rc-secondary/10',
      iconColor: 'text-rc-primary',
      etapas: [
        { id: 'aposentadoria-step1', title: 'Introdução', route: '/aposentadoria/step1' },
        { id: 'aposentadoria-step2', title: 'Ciclos', route: '/aposentadoria/step2' },
        { id: 'aposentadoria-step3', title: 'Apresentação do Imóvel', route: '/aposentadoria/step3' },
        { id: 'aposentadoria-step4', title: 'Análise de Localização', route: '/aposentadoria/step4' },
        { id: 'aposentadoria-step5', title: 'Caso Real', route: '/aposentadoria/step5' },
        { id: 'aposentadoria-step6', title: 'Análise de Mercado', route: '/aposentadoria/step6' },
        { id: 'aposentadoria-step7', title: 'Formulário de Diagnóstico', route: '/aposentadoria/step7' },
        { id: 'aposentadoria-step8', title: 'Ciclos', route: '/aposentadoria/step8' },
        { id: 'aposentadoria-step9', title: 'Formas de Investimento', route: '/aposentadoria/step9' },
        { id: 'aposentadoria-step10', title: 'Instrumento Consórcio', route: '/aposentadoria/step10' },
        { id: 'aposentadoria-step11', title: 'Formas de Contemplação', route: '/aposentadoria/step11' },
        { id: 'aposentadoria-step12', title: 'Formas de Pagamento', route: '/aposentadoria/step12' },
        { id: 'aposentadoria-step13', title: 'Compromissos do Cliente', route: '/aposentadoria/step13' },
        { id: 'aposentadoria-step14', title: 'Feedback', route: '/aposentadoria/step14' }
      ]
    }
  ];

  // Páginas da segunda reunião
  const segundaReuniao = [
    { id: 'meeting2', title: 'Início da Reunião 2', route: '/meeting2', icon: Users },
    { id: 'meeting2-steps', title: 'Etapas da Reunião', route: '/meeting2/steps', icon: Target },
    { id: 'meeting2-contract', title: 'Contrato', route: '/meeting2/contract', icon: FileText },
    { id: 'meeting2-consortium', title: 'Seleção de Consórcio', route: '/meeting2/consortium-selection', icon: Building2 },
    { id: 'meeting2-administrator', title: 'Administradora Escolhida', route: '/meeting2/chosen-administrator', icon: Crown },
    { id: 'meeting2-about-canopus', title: 'Sobre a Canopus', route: '/meeting2/about-canopus', icon: Globe },
    { id: 'meeting2-group', title: 'Seleção de Grupo', route: '/meeting2/group-selection', icon: Users },
    { id: 'meeting2-presentation', title: 'Apresentação Canopus', route: '/meeting2/canopus-presentation', icon: Eye },
    { id: 'meeting2-canopus-contract', title: 'Contrato Canopus', route: '/meeting2/canopus-contract', icon: FileText },
    { id: 'meeting2-pricing', title: 'Opções de Preço', route: '/meeting2/pricing-options', icon: DollarSign }
  ];

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rc-accent/30 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-rc-primary via-rc-primary/95 to-rc-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rc-secondary/10 via-transparent to-rc-accent/10"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rc-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rc-accent rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/ferramentas')}
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Ferramentas
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Map className="w-4 h-4" />
              NAVEGAÇÃO RÁPIDA
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Mapa de <span className="bg-gradient-to-r from-rc-secondary to-rc-accent bg-clip-text text-transparent">Apresentação</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Navegue rapidamente entre as páginas das apresentações. Acesse diretamente qualquer etapa sem precisar navegar sequencialmente.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-2 bg-white shadow-lg border border-rc-primary/20 p-1 rounded-xl w-auto">
              <TabsTrigger 
                value="primeira" 
                className="data-[state=active]:bg-rc-primary data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 rounded-lg font-medium transition-all text-rc-primary/70 hover:text-rc-primary"
              >
                1ª Reunião
              </TabsTrigger>
              <TabsTrigger 
                value="segunda"
                className="data-[state=active]:bg-rc-primary data-[state=active]:text-white data-[state=active]:shadow-md px-8 py-3 rounded-lg font-medium transition-all text-rc-primary/70 hover:text-rc-primary"
              >
                2ª Reunião
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Primeira Reunião */}
          <TabsContent value="primeira" className="space-y-12">
            {/* Etapas Principais */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-rc-primary mb-4">Etapas Principais</h2>
                <p className="text-rc-primary/70 max-w-2xl mx-auto">
                  Fundamentos essenciais para uma apresentação bem-estruturada e convincente
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {primeiraReuniaoEtapas.map((etapa) => {
                  const IconComponent = etapa.icon;
                  return (
                    <Card 
                      key={etapa.id}
                      className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-rc-accent/30 hover:-translate-y-2 border-0 bg-white relative overflow-hidden"
                      onClick={() => handleNavigation(etapa.route)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rc-accent/30 to-rc-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rc-accent/20 to-transparent opacity-50 rounded-bl-full"></div>
                      <CardContent className="relative z-10 p-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-white to-rc-accent/10 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-rc-accent/30">
                            <IconComponent className={`w-7 h-7 ${etapa.iconColor}`} />
                          </div>
                          <h3 className="font-bold text-lg text-rc-primary">{etapa.title}</h3>
                          <p className="text-sm text-rc-primary/70 leading-relaxed">
                            {etapa.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Caminhos Específicos */}
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-rc-primary mb-4">Caminhos Específicos</h2>
                <p className="text-rc-primary/70 max-w-2xl mx-auto">
                  Jornadas personalizadas para diferentes objetivos de investimento
                </p>
              </div>
              
              {caminhosPrimeira.map((caminho) => {
                const IconComponent = caminho.icon;
                return (
                  <Card key={caminho.nome} className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="pb-6 bg-gradient-to-r from-rc-accent/20 to-white border-b border-rc-accent/30">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${caminho.color} flex items-center justify-center shadow-lg`}>
                          <IconComponent className={`w-8 h-8 ${caminho.iconColor}`} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-rc-primary">{caminho.nome}</CardTitle>
                          <Badge variant="secondary" className="mt-2 bg-rc-accent/50 text-rc-primary px-3 py-1">
                            {caminho.etapas.length} etapas
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {caminho.etapas.map((etapa, index) => (
                          <Button
                            key={etapa.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigation(etapa.route)}
                            className="justify-start h-auto py-4 px-5 text-left hover:bg-rc-primary hover:text-white hover:border-rc-primary transition-all duration-300 border-rc-primary/30 bg-white shadow-sm"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className="text-xs bg-rc-accent text-rc-primary rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium truncate">{etapa.title}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Segunda Reunião */}
          <TabsContent value="segunda" className="space-y-12">
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-rc-primary mb-4">Etapas da 2ª Reunião</h2>
                <p className="text-rc-primary/70 max-w-2xl mx-auto">
                  Processo estruturado para fechamento e formalização da proposta
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {segundaReuniao.map((pagina, index) => {
                  const IconComponent = pagina.icon;
                  return (
                    <Card 
                      key={pagina.id}
                      className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-rc-accent/30 hover:-translate-y-2 border-0 bg-white relative overflow-hidden"
                      onClick={() => handleNavigation(pagina.route)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rc-secondary/20 to-rc-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rc-secondary/10 to-transparent opacity-50 rounded-bl-full"></div>
                      <CardContent className="relative z-10 p-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-white to-rc-accent/10 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-rc-accent/30">
                            <IconComponent className="w-7 h-7 text-rc-primary" />
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-rc-primary bg-rc-secondary/20 px-3 py-1 rounded-full">
                              Etapa {index + 1}
                            </div>
                            <h3 className="font-bold text-lg text-rc-primary">{pagina.title}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapaApresentacao;