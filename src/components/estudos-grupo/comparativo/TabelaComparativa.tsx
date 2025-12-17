import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Calendar, TrendingUp, Star } from 'lucide-react';
import { MetricasAdministradora } from '@/hooks/useComparativoAdministradoras';
import { MetricasGrupo } from '@/hooks/useComparativoGrupos';
import { Visao } from './SeletorVisao';

type Metricas = MetricasAdministradora | MetricasGrupo;

interface TabelaComparativaProps {
  metricas: Metricas[];
  modo: 'administradoras' | 'grupos';
  visao: Visao;
}

export function TabelaComparativa({ metricas, modo, visao }: TabelaComparativaProps) {
  if (metricas.length === 0) return null;

  const getNome = (m: Metricas) => {
    if ('numeroGrupo' in m) {
      return `${m.administradora} - Grupo ${m.numeroGrupo}`;
    }
    return m.administradora;
  };

  const todasLinhas = [
    { label: 'Sorteio', getValue: () => '', isHeader: true, section: 'sorteio' },
    { label: 'Taxa Contemplação', getValue: (m: Metricas) => m.sorteio.taxa > 0 ? `${m.sorteio.taxa.toFixed(2)}%` : 'N/A', highlight: true, section: 'sorteio' },
    { label: 'Média Contemplação (qtd)', getValue: (m: Metricas) => m.sorteio.mediaContemplacoes > 0 ? m.sorteio.mediaContemplacoes.toFixed(1) : 'N/A', section: 'sorteio' },
    { label: 'Média Participantes', getValue: (m: Metricas) => m.sorteio.mediaOfertados > 0 ? Math.round(m.sorteio.mediaOfertados).toLocaleString('pt-BR') : 'N/A', section: 'sorteio' },
    
    { label: 'Lance Fixo I', getValue: () => '', isHeader: true, section: 'fixoi' },
    { label: 'Taxa Contemplação', getValue: (m: Metricas) => m.lancefixoi.taxa > 0 ? `${m.lancefixoi.taxa.toFixed(2)}%` : 'N/A', highlight: true, section: 'fixoi' },
    { label: 'Média Contemplação (qtd)', getValue: (m: Metricas) => m.lancefixoi.mediaContemplacoes > 0 ? m.lancefixoi.mediaContemplacoes.toFixed(1) : 'N/A', section: 'fixoi' },
    { label: 'Lance Médio', getValue: (m: Metricas) => m.lancefixoi.lanceMedio > 0 ? `${m.lancefixoi.lanceMedio.toFixed(1)}%` : 'N/A', section: 'fixoi' },
    { label: 'Média Participantes', getValue: (m: Metricas) => m.lancefixoi.mediaOfertados > 0 ? Math.round(m.lancefixoi.mediaOfertados).toLocaleString('pt-BR') : 'N/A', section: 'fixoi' },
    
    { label: 'Lance Fixo II', getValue: () => '', isHeader: true, section: 'fixoii' },
    { label: 'Taxa Contemplação', getValue: (m: Metricas) => m.lancefixoii.taxa > 0 ? `${m.lancefixoii.taxa.toFixed(2)}%` : 'N/A', highlight: true, section: 'fixoii' },
    { label: 'Média Contemplação (qtd)', getValue: (m: Metricas) => m.lancefixoii.mediaContemplacoes > 0 ? m.lancefixoii.mediaContemplacoes.toFixed(1) : 'N/A', section: 'fixoii' },
    { label: 'Lance Médio', getValue: (m: Metricas) => m.lancefixoii.lanceMedio > 0 ? `${m.lancefixoii.lanceMedio.toFixed(1)}%` : 'N/A', section: 'fixoii' },
    { label: 'Média Participantes', getValue: (m: Metricas) => m.lancefixoii.mediaOfertados > 0 ? Math.round(m.lancefixoii.mediaOfertados).toLocaleString('pt-BR') : 'N/A', section: 'fixoii' },
    
    { label: 'Lance Livre', getValue: () => '', isHeader: true, section: 'livre' },
    { label: 'Taxa Contemplação', getValue: (m: Metricas) => m.lancelivre.taxa > 0 ? `${m.lancelivre.taxa.toFixed(2)}%` : 'N/A', highlight: true, section: 'livre' },
    { label: 'Média Contemplação (qtd)', getValue: (m: Metricas) => m.lancelivre.mediaContemplacoes > 0 ? m.lancelivre.mediaContemplacoes.toFixed(1) : 'N/A', section: 'livre' },
    { label: 'Lance Médio', getValue: (m: Metricas) => m.lancelivre.lanceMedio > 0 ? `${m.lancelivre.lanceMedio.toFixed(1)}%` : 'N/A', section: 'livre' },
    { label: 'Média Participantes', getValue: (m: Metricas) => m.lancelivre.mediaOfertados > 0 ? Math.round(m.lancelivre.mediaOfertados).toLocaleString('pt-BR') : 'N/A', section: 'livre' },
    
    { label: 'Lance Limitado', getValue: () => '', isHeader: true, section: 'limitado' },
    { label: 'Taxa Contemplação', getValue: (m: Metricas) => m.lancelimitado.taxa > 0 ? `${m.lancelimitado.taxa.toFixed(2)}%` : 'N/A', highlight: true, section: 'limitado' },
    { label: 'Média Contemplação (qtd)', getValue: (m: Metricas) => m.lancelimitado.mediaContemplacoes > 0 ? m.lancelimitado.mediaContemplacoes.toFixed(1) : 'N/A', section: 'limitado' },
    { label: 'Lance Médio', getValue: (m: Metricas) => m.lancelimitado.lanceMedio > 0 ? `${m.lancelimitado.lanceMedio.toFixed(1)}%` : 'N/A', section: 'limitado' },
    { label: 'Média Participantes', getValue: (m: Metricas) => m.lancelimitado.mediaOfertados > 0 ? Math.round(m.lancelimitado.mediaOfertados).toLocaleString('pt-BR') : 'N/A', section: 'limitado' }
  ];

  // Aplicar filtro de visão
  const linhas = visao === 'lancefixo'
    ? todasLinhas.filter(l => ['sorteio', 'fixoi', 'fixoii'].includes(l.section || ''))
    : visao === 'lancelivre'
    ? todasLinhas.filter(l => ['livre', 'limitado'].includes(l.section || ''))
    : todasLinhas;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Tabela Comparativa Detalhada
          {visao !== 'completa' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Mostrando: {visao === 'lancefixo' ? 'Lance Fixo' : 'Lance Livre'}
            </Badge>
          )}
        </CardTitle>
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <p>
              <strong>Taxa de Contemplação e Média de Contemplações:</strong> calculadas com base nos <Badge variant="outline" className="mx-1">últimos 6 meses</Badge> de histórico
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <p>
              <strong>Média Participantes:</strong> média mensal de cotas ofertadas nos <Badge variant="outline" className="mx-1">últimos 6 meses</Badge>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Métrica</TableHead>
                {metricas.map((m) => (
                  <TableHead key={'numeroGrupo' in m ? m.grupoId : m.administradora} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge variant="outline" className="font-medium">
                        {getNome(m)}
                      </Badge>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.map((linha, idx) => {
                const valores = linha.highlight 
                  ? metricas.map(m => {
                      const val = linha.getValue(m);
                      return typeof val === 'string' && val !== 'N/A' ? parseFloat(val) : 0;
                    })
                  : [];

                const melhorValor = valores.length > 0 ? Math.max(...valores) : null;

                return (
                  <TableRow 
                    key={idx} 
                    className={`
                      ${linha.isHeader ? 'bg-muted/50 border-t-2' : idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} 
                      hover:bg-muted/40 transition-colors duration-200
                    `}
                  >
                    <TableCell className={`font-medium py-4 px-4 ${linha.highlight ? 'text-primary font-bold' : ''} ${linha.isHeader ? 'font-bold' : ''}`}>
                      {linha.label}
                    </TableCell>
                    {metricas.map((m) => {
                      const valorAtual = parseFloat(linha.getValue(m));
                      const isMelhor = linha.highlight && melhorValor !== null && valorAtual === melhorValor;
                      
                      return (
                        <TableCell 
                          key={m.administradora} 
                          className={`
                            text-center py-4 px-4 transition-colors
                            ${linha.highlight ? 'font-bold' : ''}
                            ${isMelhor ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : ''}
                          `}
                        >
                          {linha.isHeader ? '' : (
                            <span className={isMelhor ? 'inline-flex items-center gap-1' : ''}>
                              {linha.getValue(m)}
                              {isMelhor && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
