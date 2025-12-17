import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Settings2, Info, Filter, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ADMINISTRADORAS } from '@/types/gruposConsorcio';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FiltroInteligenteProps {
  modoComparacao: 'administradoras' | 'grupos';
  onModoChange: (modo: 'administradoras' | 'grupos') => void;
  selectedAdms: string[];
  onAdmsChange: (adms: string[]) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function FiltroInteligente({
  modoComparacao,
  onModoChange,
  selectedAdms,
  onAdmsChange,
  isExpanded = true,
  onExpandedChange
}: FiltroInteligenteProps) {
  const toggleAdministradora = (adm: string) => {
    onAdmsChange(
      selectedAdms.includes(adm) 
        ? selectedAdms.filter(a => a !== adm)
        : [...selectedAdms, adm]
    );
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={onExpandedChange}
    >
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-muted/30 pb-3 cursor-pointer hover:bg-muted/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {isExpanded ? (
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Configurar Comparação
                  </CardTitle>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedAdms.length > 0 
                      ? `${selectedAdms.length} administradora${selectedAdms.length > 1 ? 's' : ''} selecionada${selectedAdms.length > 1 ? 's' : ''}`
                      : 'Clique para configurar filtros'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedAdms.length > 0 && !isExpanded && (
                  <div className="flex gap-1">
                    {selectedAdms.slice(0, 3).map(adm => (
                      <Badge key={adm} variant="secondary" className="text-xs">
                        {adm}
                      </Badge>
                    ))}
                    {selectedAdms.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedAdms.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                <ChevronDown 
                  className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-4 space-y-4">
            {/* Modo de Comparação - Layout horizontal compacto */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Label className="text-sm font-semibold min-w-fit">Modo de Comparação</Label>
              <RadioGroup
                value={modoComparacao}
                onValueChange={(value) => onModoChange(value as 'administradoras' | 'grupos')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="administradoras" id="modo-adm" />
                  <Label htmlFor="modo-adm" className="cursor-pointer text-sm">
                    Entre Administradoras
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grupos" id="modo-grupos" />
                  <Label htmlFor="modo-grupos" className="cursor-pointer text-sm">
                    Entre Grupos Específicos
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Seleção de Administradoras */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                {modoComparacao === 'administradoras' 
                  ? 'Selecione as Administradoras para Comparar' 
                  : 'Filtrar por Administradora (opcional)'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {ADMINISTRADORAS.map((adm) => (
                  <Badge
                    key={adm}
                    variant={selectedAdms.includes(adm) ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1.5 text-sm hover:scale-105 transition-all hover:shadow-sm"
                    onClick={() => toggleAdministradora(adm)}
                  >
                    {selectedAdms.includes(adm) && (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {adm}
                  </Badge>
                ))}
              </div>
              {modoComparacao === 'grupos' && selectedAdms.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Deixe vazio para ver todos os grupos disponíveis
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
