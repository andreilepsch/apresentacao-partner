import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GrupoConsorcio } from '@/types/gruposConsorcio';
import { Building2, Calendar, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GrupoCardProps {
  grupo: GrupoConsorcio;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GrupoCard({ grupo, onView, onEdit, onDelete }: GrupoCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-rc-primary" />
              {grupo.administradora}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Grupo {grupo.numero_grupo}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Prazo:</span>
            <span className="font-medium">{grupo.prazo_meses} meses</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Cotas:</span>
            <span className="font-medium">{grupo.capacidade_cotas}</span>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Período: </span>
          <span className="font-medium">
            {format(new Date(grupo.data_inicio), 'MMM/yyyy', { locale: ptBR })} - {format(new Date(grupo.data_fim), 'MMM/yyyy', { locale: ptBR })}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(grupo.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(grupo.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(grupo.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
