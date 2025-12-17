import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatrimonyProjection as PatrimonyData } from '@/types/hybridPresentation';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PatrimonyProjectionProps {
  projections: PatrimonyData[];
  className?: string;
}

export function PatrimonyProjection({ projections, className }: PatrimonyProjectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalPatrimony2035 = projections[projections.length - 1]?.valor || 0;
  const totalRenda2035 = projections[projections.length - 1]?.rendaAcumulada || 0;
  const initialValue = projections[0]?.valor || 0;
  const appreciation = ((totalPatrimony2035 - initialValue) / initialValue) * 100;

  return (
    <div className={className}>
      <Card className="bg-white/95 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-rc-primary flex items-center gap-3">
            <TrendingUp className="h-8 w-8" />
            Projeção Patrimonial até 2035
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Métricas destacadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6" />
                <span className="font-semibold">Patrimônio Final</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalPatrimony2035)}</div>
              <div className="text-emerald-100 text-sm">Valorização de {appreciation.toFixed(1)}%</div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6" />
                <span className="font-semibold">Renda Acumulada</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalRenda2035)}</div>
              <div className="text-blue-100 text-sm">Em 9 anos de operação</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-6 w-6" />
                <span className="font-semibold">Total Consolidado</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(totalPatrimony2035 + totalRenda2035)}</div>
              <div className="text-purple-100 text-sm">Patrimônio + Renda</div>
            </div>
          </div>

          {/* Gráfico de linha - Valorização do Imóvel */}
          <div>
            <h4 className="text-lg font-semibold text-rc-primary mb-4">Valorização do Imóvel</h4>
            <div className="h-64 bg-gray-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ano" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Valor do Imóvel']}
                    labelFormatter={(label) => `Ano ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#2E7D32" 
                    strokeWidth={3}
                    dot={{ fill: '#2E7D32', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de barras - Renda Acumulada */}
          <div>
            <h4 className="text-lg font-semibold text-rc-primary mb-4">Renda Acumulada por Período</h4>
            <div className="h-64 bg-gray-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="ano" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Renda Acumulada']}
                    labelFormatter={(label) => `Até ${label}`}
                  />
                  <Bar 
                    dataKey="rendaAcumulada" 
                    fill="#1565C0" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline detalhada */}
          <div>
            <h4 className="text-lg font-semibold text-rc-primary mb-4">Timeline Detalhada</h4>
            <div className="space-y-3">
              {projections.map((projection, index) => (
                <div key={projection.ano} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rc-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {projection.ano}
                    </div>
                    <div>
                      <div className="font-semibold text-rc-primary">
                        Valor: {formatCurrency(projection.valor)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Renda acumulada: {formatCurrency(projection.rendaAcumulada)}
                      </div>
                    </div>
                  </div>
                  {index > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-600">
                        +{((projection.valor / projections[0].valor - 1) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">valorização</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}