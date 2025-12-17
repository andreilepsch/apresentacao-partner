import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, FolderOpen, TrendingUp, Calendar, ChevronLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const EstudosDeGrupo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/ferramentas')}
            className="mb-6 hover:bg-white/50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para Ferramentas
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-heading-1 font-bold text-foreground">
                Estudos de Grupo
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie estudos colaborativos para grupos de investidores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Novo Estudo</h3>
                  <p className="text-sm text-muted-foreground">Criar grupo de análise</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Meus Estudos</h3>
                  <p className="text-sm text-muted-foreground">Ver estudos salvos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Relatórios</h3>
                  <p className="text-sm text-muted-foreground">Análises e projeções</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Studies */}
        <div className="mb-8">
          <h2 className="text-heading-3 font-bold mb-6 text-foreground">Estudos Recentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">Grupo Investidores ABC</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Criado em 15/03/2024</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participantes</span>
                    <span className="font-semibold text-foreground">12 investidores</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Imóveis analisados</span>
                    <span className="font-semibold text-foreground">8 propriedades</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor total</span>
                    <span className="font-semibold text-primary">R$ 2.400.000</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">Consórcio Premium 2024</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Criado em 22/02/2024</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participantes</span>
                    <span className="font-semibold text-foreground">8 investidores</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Imóveis analisados</span>
                    <span className="font-semibold text-foreground">5 propriedades</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor total</span>
                    <span className="font-semibold text-primary">R$ 1.800.000</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty State for New Users */}
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-heading-3 font-bold mb-3 text-foreground">
              Comece seu primeiro estudo de grupo
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Reúna investidores, analise oportunidades em conjunto e tome decisões baseadas em dados compartilhados.
            </p>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Criar Novo Estudo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstudosDeGrupo;