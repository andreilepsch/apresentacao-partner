import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ADMINISTRADORAS } from '@/types/gruposConsorcio';

interface FiltrosGruposProps {
  filtroAdmin: string;
  filtroPrazo: string;
  filtroMes: string;
  mesesDisponiveis: string[];
  onAdminChange: (value: string) => void;
  onPrazoChange: (value: string) => void;
  onMesChange: (value: string) => void;
  onLimpar: () => void;
}

const PRAZOS_OPCOES = ['120', '140', '160', '180', '200', '220', '240'];

export function FiltrosGrupos({
  filtroAdmin,
  filtroPrazo,
  filtroMes,
  mesesDisponiveis,
  onAdminChange,
  onPrazoChange,
  onMesChange,
  onLimpar
}: FiltrosGruposProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Administradora</Label>
            <Select value={filtroAdmin} onValueChange={onAdminChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {ADMINISTRADORAS.map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prazo (meses)</Label>
            <Select value={filtroPrazo} onValueChange={onPrazoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os prazos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os prazos</SelectItem>
                {PRAZOS_OPCOES.map((prazo) => (
                  <SelectItem key={prazo} value={prazo}>
                    {prazo} meses
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mês de Análise</Label>
            <Select value={filtroMes} onValueChange={onMesChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os meses</SelectItem>
                {mesesDisponiveis.map((mes) => (
                  <SelectItem key={mes} value={mes}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onLimpar}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
