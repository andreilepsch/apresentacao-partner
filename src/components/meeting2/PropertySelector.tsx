import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { PROPERTY_OPTIONS, PropertyOption } from '@/types/meeting2Form';
import { cn } from '@/lib/utils';

interface PropertySelectorProps {
  selectedProperty: string;
  onPropertySelect: (propertyId: string) => void;
  error?: string;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
  selectedProperty,
  onPropertySelect,
  error
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Selecione o Imóvel</h3>
        <p className="text-white/70">Escolha o empreendimento para sua estratégia híbrida</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROPERTY_OPTIONS.map((property: PropertyOption) => (
          <Card
            key={property.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden",
              "bg-white/5 backdrop-blur-lg border-2 rounded-3xl",
              selectedProperty === property.id 
                ? "border-[#C9A45C] bg-[#C9A45C]/10 shadow-lg shadow-[#C9A45C]/20" 
                : "border-white/20 hover:border-[#C9A45C]/50"
            )}
            onClick={() => onPropertySelect(property.id)}
          >
            {selectedProperty === property.id && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-[#C9A45C] rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
              </div>
            )}
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">{property.name}</h4>
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed">
                  {property.description}
                </p>
                
                <div className="space-y-2">
                  <span className="text-[#C9A45C] font-semibold text-sm">Principais características:</span>
                  <div className="flex flex-wrap gap-2">
                    {property.features.slice(0, 2).map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-white/30 text-white/80 text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 2 && (
                      <Badge
                        variant="outline"
                        className="border-[#C9A45C] text-[#C9A45C] text-xs"
                      >
                        +{property.features.length - 2} mais
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {error && (
        <div className="text-center">
          <span className="text-red-400 text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default PropertySelector;