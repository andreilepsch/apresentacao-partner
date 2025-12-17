import { IndicadorCompetitividade } from '@/types/simulador';
import { Badge } from '@/components/ui/badge';

interface CompetitividadeIndicatorProps {
  competitividade: IndicadorCompetitividade;
}

export function CompetitividadeIndicator({ competitividade }: CompetitividadeIndicatorProps) {
  const getVariant = () => {
    switch (competitividade.nivel) {
      case 'Alta':
        return 'default';
      case 'Média':
        return 'secondary';
      case 'Baixa':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getColor = () => {
    switch (competitividade.nivel) {
      case 'Alta':
        return 'text-green-600';
      case 'Média':
        return 'text-yellow-600';
      case 'Baixa':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-2">
      <Badge variant={getVariant()} className="text-base">
        {competitividade.nivel}
      </Badge>
      <p className={`text-sm ${getColor()}`}>
        {competitividade.descricao}
      </p>
    </div>
  );
}
