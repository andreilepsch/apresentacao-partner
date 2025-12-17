import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, CreditCard } from 'lucide-react';

interface PricingOption {
  nome: string;
  descricao: string;
  parcelaMensal: number;
  prazo: number;
  entrada: number;
  credito: number;
  contemplacao: string;
  lance: string;
  investimentoTotal: number;
  taxaAdmin: string;
  fundoReserva: string;
  recomendado?: boolean;
}

interface PricingOptionsSectionProps {
  options: PricingOption[];
  className?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function PricingOptionsSection({ options, className }: PricingOptionsSectionProps) {
  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-rc-primary mb-4">Opções de Investimento</h3>
        <p className="text-gray-600">Escolha a melhor estratégia para seu perfil</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option, index) => (
          <Card key={index} className={`relative ${option.recomendado ? 'ring-2 ring-rc-primary' : ''}`}>
            {option.recomendado && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-rc-primary text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-rc-primary" />
                <h4 className="text-xl font-bold text-rc-primary mb-2">{option.nome}</h4>
                <p className="text-sm text-gray-600">{option.descricao}</p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-rc-accent rounded-xl">
                  <div className="text-2xl font-bold text-rc-primary">
                    {formatCurrency(option.parcelaMensal)}
                  </div>
                  <div className="text-sm text-gray-600">Parcela Mensal</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prazo:</span>
                    <span className="font-semibold">{option.prazo} meses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entrada:</span>
                    <span className="font-semibold">{formatCurrency(option.entrada)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crédito:</span>
                    <span className="font-semibold">{formatCurrency(option.credito)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contemplação:</span>
                    <span className="font-semibold">{option.contemplacao}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    variant={option.recomendado ? "default" : "outline"}
                  >
                    Selecionar Plano
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}