import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyData } from '@/types/hybridPresentation';
import { Building2, Bed, Bath, Car, Calendar, MapPin, Star } from 'lucide-react';

interface PropertyPresentationProps {
  property: PropertyData;
  className?: string;
}

export function PropertyPresentation({ property, className }: PropertyPresentationProps) {
  return (
    <div className={className}>
      <Card className="bg-white/95 backdrop-blur-sm border border-white/20 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-rc-primary flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              {property.nome}
            </CardTitle>
            <Badge variant="secondary" className="bg-rc-secondary text-white px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Premium
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-rc-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(property.valor)}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-rc-primary flex items-center justify-center gap-1">
                <Bed className="h-5 w-5" />
                {property.quartos}
              </div>
              <div className="text-sm text-gray-600">Quartos</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-rc-primary flex items-center justify-center gap-1">
                <Bath className="h-5 w-5" />
                {property.banheiros}
              </div>
              <div className="text-sm text-gray-600">Banheiros</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-rc-primary flex items-center justify-center gap-1">
                {property.vaga ? <Car className="h-5 w-5" /> : '-'}
                {property.vaga ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600">Vaga</div>
            </div>
          </div>

          {/* Área e entrega */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-rc-accent rounded-xl p-4">
              <div className="flex items-center gap-2 text-rc-primary font-semibold mb-1">
                <MapPin className="h-4 w-4" />
                Área Privativa
              </div>
              <div className="text-xl font-bold text-rc-primary">{property.area}m²</div>
            </div>

            <div className="bg-rc-accent rounded-xl p-4">
              <div className="flex items-center gap-2 text-rc-primary font-semibold mb-1">
                <Calendar className="h-4 w-4" />
                Entrega Prevista
              </div>
              <div className="text-xl font-bold text-rc-primary">{property.entrega}</div>
            </div>
          </div>

          {/* Diferenciais */}
          <div>
            <h4 className="text-lg font-semibold text-rc-primary mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Diferenciais Exclusivos
            </h4>
            <div className="grid md:grid-cols-2 gap-2">
              {property.diferenciais.map((diferencial, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                  <span className="text-emerald-800 font-medium">{diferencial}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}