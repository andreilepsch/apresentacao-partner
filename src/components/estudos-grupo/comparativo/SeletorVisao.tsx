import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, Target, TrendingUp, Eye } from 'lucide-react';

export type Visao = 'completa' | 'lancefixo' | 'lancelivre';

interface SeletorVisaoProps {
  visao: Visao;
  onChange: (visao: Visao) => void;
}

export function SeletorVisao({ visao, onChange }: SeletorVisaoProps) {
  return (
    <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-5 border border-border/50 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Label com descrição */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Visão da Análise</span>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            Foque nos dados que importam para você
          </p>
        </div>
        
        {/* Toggle Group redesenhado */}
        <ToggleGroup 
          type="single" 
          value={visao} 
          onValueChange={(v) => v && onChange(v as Visao)}
          className="bg-background rounded-lg p-1 shadow-inner"
        >
          <ToggleGroupItem 
            value="completa" 
            className="gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Completa</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="lancefixo" 
            className="gap-2 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Lance Fixo</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="lancelivre" 
            className="gap-2 data-[state=on]:bg-green-600 data-[state=on]:text-white"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Lance Livre</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
