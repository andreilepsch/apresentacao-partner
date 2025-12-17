import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { GrupoConsorcio } from '@/types/gruposConsorcio';

interface SeletorGruposProps {
  grupos: GrupoConsorcio[];
  gruposSelecionados: string[];
  administradorasFiltradas: string[];
  onChange: (grupoIds: string[]) => void;
}

export function SeletorGrupos({
  grupos,
  gruposSelecionados,
  administradorasFiltradas,
  onChange
}: SeletorGruposProps) {
  const gruposPorAdmin = useMemo(() => {
    const filtered = administradorasFiltradas.length > 0
      ? grupos.filter(g => administradorasFiltradas.includes(g.administradora))
      : grupos;
    
    return filtered.reduce((acc, grupo) => {
      if (!acc[grupo.administradora]) acc[grupo.administradora] = [];
      acc[grupo.administradora].push(grupo);
      return acc;
    }, {} as Record<string, GrupoConsorcio[]>);
  }, [grupos, administradorasFiltradas]);

  if (Object.keys(gruposPorAdmin).length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum grupo disponível para os filtros selecionados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(gruposPorAdmin).map(([admin, gruposAdmin]) => (
        <Card key={admin}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{admin}</span>
              <Badge variant="secondary">{gruposAdmin.length} grupos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gruposAdmin.map(grupo => (
              <div 
                key={grupo.id} 
                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <Checkbox
                  id={grupo.id}
                  checked={gruposSelecionados.includes(grupo.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...gruposSelecionados, grupo.id]);
                    } else {
                      onChange(gruposSelecionados.filter(id => id !== grupo.id));
                    }
                  }}
                />
                <label 
                  htmlFor={grupo.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">Grupo {grupo.numero_grupo}</div>
                  <div className="text-sm text-muted-foreground">
                    {grupo.prazo_meses} meses • {grupo.capacidade_cotas} cotas
                  </div>
                </label>
                <Badge variant="outline">
                  {grupo.analises?.length || 0} análises
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
