import { useMemo } from 'react';
import { GrupoConsorcio, AnalyseMensal } from '@/types/gruposConsorcio';

interface MetricasTipoLance {
  taxa: number;
  lanceMedio: number;
  totalOfertados: number;
  mediaContemplacoes: number;
  totalContemplacoesHistorico: number;
  mediaOfertados: number;
}

export interface MetricasGrupo {
  grupoId: string;
  administradora: string;
  numeroGrupo: string;
  prazoMeses: number;
  taxaGeral: number;
  totalOfertados: number;
  totalContemplacoes: number;
  totalContemplacoesHistorico: number;
  mediaContemplacoesMensal: number;
  sorteio: MetricasTipoLance;
  lancefixoi: MetricasTipoLance;
  lancefixoii: MetricasTipoLance;
  lancelivre: MetricasTipoLance & { tendencia: number };
  lancelimitado: MetricasTipoLance;
  evolucao: { mes: string; taxa: number }[];
  mesesAnalisados: number;
}

// Calcula taxa, lance médio e total de ofertados para um tipo de lance
function calcularTaxaLance(
  analises: AnalyseMensal[],
  tipo: 'sorteio' | 'lance_fixo_i' | 'lance_fixo_ii' | 'lance_livre' | 'lance_limitado'
): MetricasTipoLance {
  // Ordenar por data (mais recente primeiro)
  const analisesOrdenadas = [...analises].sort(
    (a, b) => new Date(b.data_analise).getTime() - new Date(a.data_analise).getTime()
  );
  
  // Total ofertados: apenas do último mês
  const ultimaAnalise = analisesOrdenadas[0];
  const totalOfertados = ultimaAnalise?.[`${tipo}_ofertados`] || 0;
  
  // Taxa e lance médio: média dos últimos 6 meses
  const ultimos6Meses = analisesOrdenadas.slice(0, 6);
  let totalOfertadosHistorico = 0;
  let totalContemplacoesHistorico = 0;
  let somaPercentuais = 0;
  let countComDados = 0;

  ultimos6Meses.forEach(analise => {
    const ofertados = analise[`${tipo}_ofertados`];
    const contemplacoes = analise[`${tipo}_contemplacoes`];
    const percentual = analise[`${tipo}_percentual`];

    if (ofertados > 0) {
      totalOfertadosHistorico += ofertados;
      totalContemplacoesHistorico += contemplacoes;
      somaPercentuais += Number(percentual);
      countComDados++;
    }
  });

  const taxa = totalOfertadosHistorico > 0 ? (totalContemplacoesHistorico / totalOfertadosHistorico) * 100 : 0;
  const lanceMedio = countComDados > 0 ? somaPercentuais / countComDados : 0;
  const mediaContemplacoes = countComDados > 0 ? totalContemplacoesHistorico / countComDados : 0;
  const mediaOfertados = countComDados > 0 ? totalOfertadosHistorico / countComDados : 0;

  return { taxa, lanceMedio, totalOfertados, mediaContemplacoes, totalContemplacoesHistorico, mediaOfertados };
}

// Calcula a tendência do lance livre (crescimento nos últimos 3 meses vs primeiros 3)
function calcularTendenciaLanceLivre(analises: AnalyseMensal[]): number {
  const analisesComDados = analises.filter(a => a.lance_livre_percentual > 0);
  
  if (analisesComDados.length < 3) return 0;

  const ultimos3 = analisesComDados.slice(-3);
  const primeiros3 = analisesComDados.slice(0, Math.min(3, analisesComDados.length));

  const mediaRecente = ultimos3.reduce((sum, a) => sum + Number(a.lance_livre_percentual), 0) / ultimos3.length;
  const mediaAnterior = primeiros3.reduce((sum, a) => sum + Number(a.lance_livre_percentual), 0) / primeiros3.length;

  if (mediaAnterior === 0) return 0;
  return ((mediaRecente - mediaAnterior) / mediaAnterior) * 100;
}

// Calcula a evolução temporal dos últimos 6 meses
function calcularEvolucao(analises: AnalyseMensal[]): { mes: string; taxa: number }[] {
  // Pegar todos os meses únicos
  const mesesUnicos = [...new Set(analises.map(a => a.mes_ano))];
  
  // Ordenar cronologicamente usando data_analise
  const mesesOrdenados = mesesUnicos
    .map(mes => ({
      mes,
      data: analises.find(a => a.mes_ano === mes)?.data_analise
    }))
    .filter(m => m.data)
    .sort((a, b) => new Date(b.data!).getTime() - new Date(a.data!).getTime())
    .slice(0, 6) // Pegar últimos 6 meses
    .map(m => m.mes);
  
  return mesesOrdenados.map(mes => {
    const analisesMes = analises.filter(a => a.mes_ano === mes);
    let totalOfertados = 0;
    let totalContemplacoes = 0;

    analisesMes.forEach(a => {
      totalOfertados += a.sorteio_ofertados + a.lance_fixo_i_ofertados + 
                       a.lance_fixo_ii_ofertados + a.lance_livre_ofertados + 
                       a.lance_limitado_ofertados;
      totalContemplacoes += a.sorteio_contemplacoes + a.lance_fixo_i_contemplacoes + 
                           a.lance_fixo_ii_contemplacoes + a.lance_livre_contemplacoes + 
                           a.lance_limitado_contemplacoes;
    });

    const taxa = totalOfertados > 0 ? (totalContemplacoes / totalOfertados) * 100 : 0;
    return { mes, taxa };
  });
}

export function useComparativoGrupos(
  grupos: GrupoConsorcio[],
  gruposSelecionados: string[]
) {
  const metricas = useMemo<MetricasGrupo[]>(() => {
    const resultado: MetricasGrupo[] = [];

    gruposSelecionados.forEach(grupoId => {
      const grupo = grupos.find(g => g.id === grupoId);
      if (!grupo) return;

      const analises = grupo.analises || [];

      if (analises.length === 0) {
        resultado.push({
          grupoId: grupo.id,
          administradora: grupo.administradora,
          numeroGrupo: grupo.numero_grupo,
          prazoMeses: grupo.prazo_meses,
          taxaGeral: 0,
          totalOfertados: 0,
          totalContemplacoes: 0,
          totalContemplacoesHistorico: 0,
          mediaContemplacoesMensal: 0,
        sorteio: { taxa: 0, lanceMedio: 0, totalOfertados: 0, mediaContemplacoes: 0, totalContemplacoesHistorico: 0, mediaOfertados: 0 },
        lancefixoi: { taxa: 0, lanceMedio: 0, totalOfertados: 0, mediaContemplacoes: 0, totalContemplacoesHistorico: 0, mediaOfertados: 0 },
        lancefixoii: { taxa: 0, lanceMedio: 0, totalOfertados: 0, mediaContemplacoes: 0, totalContemplacoesHistorico: 0, mediaOfertados: 0 },
        lancelivre: { taxa: 0, lanceMedio: 0, totalOfertados: 0, mediaContemplacoes: 0, totalContemplacoesHistorico: 0, tendencia: 0, mediaOfertados: 0 },
        lancelimitado: { taxa: 0, lanceMedio: 0, totalOfertados: 0, mediaContemplacoes: 0, totalContemplacoesHistorico: 0, mediaOfertados: 0 },
          evolucao: [],
          mesesAnalisados: 0
        });
        return;
      }

      // Ordenar análises por data (mais recente primeiro)
      const analisesOrdenadas = [...analises].sort(
        (a, b) => new Date(b.data_analise).getTime() - new Date(a.data_analise).getTime()
      );

      // Total ofertados e contemplações: apenas do último mês
      const ultimaAnalise = analisesOrdenadas[0];
      const totalOfertados = 
        ultimaAnalise.sorteio_ofertados + 
        ultimaAnalise.lance_fixo_i_ofertados + 
        ultimaAnalise.lance_fixo_ii_ofertados + 
        ultimaAnalise.lance_livre_ofertados + 
        ultimaAnalise.lance_limitado_ofertados;
      
      const totalContemplacoes = 
        ultimaAnalise.sorteio_contemplacoes + 
        ultimaAnalise.lance_fixo_i_contemplacoes + 
        ultimaAnalise.lance_fixo_ii_contemplacoes + 
        ultimaAnalise.lance_livre_contemplacoes + 
        ultimaAnalise.lance_limitado_contemplacoes;

      // Taxa geral: média dos últimos 6 meses
      const ultimos6 = analisesOrdenadas.slice(0, 6);
      const totalOfertados6Meses = ultimos6.reduce((sum, a) => 
        sum + a.sorteio_ofertados + a.lance_fixo_i_ofertados + 
        a.lance_fixo_ii_ofertados + a.lance_livre_ofertados + 
        a.lance_limitado_ofertados, 0
      );
      const totalContemplacoes6Meses = ultimos6.reduce((sum, a) => 
        sum + a.sorteio_contemplacoes + a.lance_fixo_i_contemplacoes + 
        a.lance_fixo_ii_contemplacoes + a.lance_livre_contemplacoes + 
        a.lance_limitado_contemplacoes, 0
      );
      
      const taxaGeral = totalOfertados6Meses > 0 ? (totalContemplacoes6Meses / totalOfertados6Meses) * 100 : 0;

      const lanceLivreBase = calcularTaxaLance(analises, 'lance_livre');
      const tendenciaLanceLivre = calcularTendenciaLanceLivre(analises);

      const mediaContemplacoesMensal = ultimos6.length > 0 ? totalContemplacoes6Meses / ultimos6.length : 0;

      const metrica: MetricasGrupo = {
        grupoId: grupo.id,
        administradora: grupo.administradora,
        numeroGrupo: grupo.numero_grupo,
        prazoMeses: grupo.prazo_meses,
        taxaGeral,
        totalOfertados,
        totalContemplacoes,
        totalContemplacoesHistorico: totalContemplacoes6Meses,
        mediaContemplacoesMensal,
        sorteio: calcularTaxaLance(analises, 'sorteio'),
        lancefixoi: calcularTaxaLance(analises, 'lance_fixo_i'),
        lancefixoii: calcularTaxaLance(analises, 'lance_fixo_ii'),
        lancelivre: { ...lanceLivreBase, tendencia: tendenciaLanceLivre },
        lancelimitado: calcularTaxaLance(analises, 'lance_limitado'),
        evolucao: calcularEvolucao(analises),
        mesesAnalisados: analises.length
      };

      // Validar consistência dos totais
      const somaCalculada = 
        metrica.sorteio.totalOfertados +
        metrica.lancefixoi.totalOfertados +
        metrica.lancefixoii.totalOfertados +
        metrica.lancelivre.totalOfertados +
        metrica.lancelimitado.totalOfertados;
      
      const diferenca = Math.abs(metrica.totalOfertados - somaCalculada);
      
      if (diferenca > 1) {
        console.warn('⚠️ Divergência nos totais do grupo:', {
          grupo: metrica.numeroGrupo,
          administradora: metrica.administradora,
          totalGeral: metrica.totalOfertados,
          somaCalculada,
          diferenca
        });
      }

      resultado.push(metrica);
    });

    return resultado.sort((a, b) => b.taxaGeral - a.taxaGeral);
  }, [grupos, gruposSelecionados]);

  return { metricas };
}
