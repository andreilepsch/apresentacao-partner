import { useState, useEffect } from 'react';
import { SimulacaoParams, TipoLance, TIPOS_LANCE_OPTIONS } from '@/types/simulador';
import { useAdministradoras, useGruposPorAdministradora } from '@/hooks/useSimuladorContemplacao';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InputPanelProps {
  onSimulate: (params: SimulacaoParams) => void;
  isSimulating: boolean;
}

export function InputPanel({ onSimulate, isSimulating }: InputPanelProps) {
  const [administradora, setAdministradora] = useState<string>('');
  const [grupoId, setGrupoId] = useState<string>('');
  const [tipoLance, setTipoLance] = useState<TipoLance>('lance_livre');
  const [valorCarta, setValorCarta] = useState<number>(300000);
  const [percentualLance, setPercentualLance] = useState<number>(65);
  const [mesEntrada, setMesEntrada] = useState<number>(1);
  const [janelaHistorica, setJanelaHistorica] = useState<6 | 12 | 24>(12);
  const [considerarApenasContemplacao, setConsiderarApenasContemplacao] = useState(true);

  // Determinar quais campos mostrar baseado no tipo de lance
  const mostrarPercentual = tipoLance === 'lance_livre' || tipoLance === 'lance_limitado';
  const mostrarMesEntrada = tipoLance === 'lance_fixo_i' || tipoLance === 'lance_fixo_ii';
  const ehSorteio = tipoLance === 'sorteio';

  const { data: administradoras, isLoading: loadingAdmins } = useAdministradoras();
  const { data: grupos, isLoading: loadingGrupos } = useGruposPorAdministradora(administradora);

  // Reset grupo quando mudar administradora
  useEffect(() => {
    setGrupoId('');
  }, [administradora]);

  const handleSimulate = () => {
    if (!administradora || !grupoId || valorCarta <= 0) {
      return;
    }

    if (mostrarPercentual && (percentualLance < 0 || percentualLance > 100)) {
      return;
    }

    if (mostrarMesEntrada && (!mesEntrada || mesEntrada <= 0)) {
      return;
    }

    onSimulate({
      administradora,
      grupoId,
      tipoLance,
      valorCarta,
      percentualLance: mostrarPercentual ? percentualLance : 0,
      mesEntrada: mostrarMesEntrada ? mesEntrada : null,
      janelaHistorica,
      considerarApenasContemplacao,
    });
  };

  const isFormValid = 
    administradora && 
    grupoId && 
    valorCarta > 0 && 
    (ehSorteio || 
     (mostrarPercentual && percentualLance >= 0 && percentualLance <= 100) ||
     (mostrarMesEntrada && mesEntrada > 0));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Parâmetros da Simulação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Administradora */}
        <div className="space-y-2">
          <Label>Administradora</Label>
          {loadingAdmins ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={administradora} onValueChange={setAdministradora}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a administradora" />
              </SelectTrigger>
              <SelectContent>
                {administradoras?.map((admin) => (
                  <SelectItem key={admin} value={admin}>
                    {admin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Grupo */}
        <div className="space-y-2">
          <Label>Grupo</Label>
          {loadingGrupos ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={grupoId} onValueChange={setGrupoId} disabled={!administradora}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {grupos?.map((grupo) => (
                  <SelectItem key={grupo.id} value={grupo.id}>
                    {grupo.numero_grupo} ({grupo.prazo_meses} meses)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Tipo de Lance */}
        <div className="space-y-3">
          <Label>Tipo de Lance</Label>
          <RadioGroup value={tipoLance} onValueChange={(v) => setTipoLance(v as TipoLance)}>
            {TIPOS_LANCE_OPTIONS.map((tipo) => (
              <div key={tipo.value} className="flex items-center space-x-2">
                <RadioGroupItem value={tipo.value} id={tipo.value} />
                <Label htmlFor={tipo.value} className="font-normal cursor-pointer">
                  {tipo.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Valor da Carta */}
        <div className="space-y-2">
          <Label>Valor da Carta (R$)</Label>
          <Input
            type="number"
            value={valorCarta}
            onChange={(e) => setValorCarta(Number(e.target.value))}
            min={0}
            step={1000}
          />
        </div>

        {/* Percentual de Lance (apenas Lance Livre/Limitado) */}
        {mostrarPercentual && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Percentual de Lance (%)</Label>
              <Input
                type="number"
                value={percentualLance}
                onChange={(e) => setPercentualLance(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                className="w-20"
              />
            </div>
            <Slider
              value={[percentualLance]}
              onValueChange={([value]) => setPercentualLance(value)}
              min={0}
              max={100}
              step={0.5}
              className="w-full"
            />
          </div>
        )}

        {/* Mês de Entrada (apenas Lance Fixo I/II) */}
        {mostrarMesEntrada && (
          <div className="space-y-2">
            <Label>Mês de Entrada no Grupo</Label>
            <Input
              type="number"
              value={mesEntrada}
              onChange={(e) => setMesEntrada(Number(e.target.value))}
              min={1}
              step={1}
              placeholder="Ex: 1, 10, 24..."
            />
            <p className="text-xs text-muted-foreground">
              Informe em qual mês você entrou no grupo (1 = início)
            </p>
          </div>
        )}

        {/* Informativo para Sorteio */}
        {ehSorteio && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
              Contemplação por Sorteio
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              No sorteio, todos os participantes têm a mesma chance. A contemplação é aleatória como uma loteria.
            </p>
          </div>
        )}

        {/* Janela Histórica */}
        <div className="space-y-2">
          <Label>Janela Histórica</Label>
          <Select 
            value={String(janelaHistorica)} 
            onValueChange={(v) => setJanelaHistorica(Number(v) as 6 | 12 | 24)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Últimos 12 meses</SelectItem>
              <SelectItem value="24">Últimos 24 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="apenas-contemplacao"
            checked={considerarApenasContemplacao}
            onCheckedChange={(checked) => setConsiderarApenasContemplacao(checked as boolean)}
          />
          <Label htmlFor="apenas-contemplacao" className="text-sm font-normal cursor-pointer">
            Considerar apenas meses com contemplação {'>'} 0
          </Label>
        </div>

        {/* Botão Simular */}
        <Button
          onClick={handleSimulate}
          disabled={!isFormValid || isSimulating}
          className="w-full"
          size="lg"
        >
          {isSimulating ? 'Calculando...' : 'Simular'}
        </Button>
      </CardContent>
    </Card>
  );
}
