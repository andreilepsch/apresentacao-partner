import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Home, Building } from 'lucide-react';

const casosExemplo = [
  {
    tipo: 'Apartamento 2 Quartos',
    icone: Home,
    valorInicial: 'R$ 250.000',
    valorizacao: '12% ao ano',
    localizacao: 'Zona Sul - SP',
    tempo: '5 anos',
    resultado: 'R$ 441.000',
    cor: 'text-blue-600',
  },
  {
    tipo: 'Apartamento 3 Quartos',
    icone: Building,
    valorInicial: 'R$ 500.000',
    valorizacao: '15% ao ano',
    localizacao: 'Barra - RJ',
    tempo: '7 anos',
    resultado: 'R$ 1.327.000',
    cor: 'text-emerald-600',
  },
  {
    tipo: 'Casa em Condomínio',
    icone: Home,
    valorInicial: 'R$ 800.000',
    valorizacao: '10% ao ano',
    localizacao: 'Alphaville - SP',
    tempo: '10 anos',
    resultado: 'R$ 2.074.000',
    cor: 'text-purple-600',
  },
];

export const ExampleCasesModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          📊 Ver Casos Similares no Mercado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Casos Reais do Mercado</DialogTitle>
          <DialogDescription>
            Exemplos de valorização imobiliária baseados em dados reais do mercado brasileiro
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {casosExemplo.map((caso, index) => {
            const Icon = caso.icone;
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-slate-100 ${caso.cor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{caso.tipo}</h3>
                        <p className="text-sm text-muted-foreground">{caso.localizacao}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Valor Inicial</p>
                          <p className="font-semibold">{caso.valorInicial}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Período</p>
                          <p className="font-semibold">{caso.tempo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-600">
                            {caso.valorizacao}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Valor Final</p>
                          <p className="text-xl font-bold text-emerald-600">{caso.resultado}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Nota:</strong> Os valores apresentados são baseados em médias históricas do mercado imobiliário brasileiro. 
            Valorizações passadas não garantem resultados futuros. Consulte um especialista para análises personalizadas.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
