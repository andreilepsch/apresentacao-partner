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

export interface MetricasAdministradora {
  administradora: string;
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
  totalGrupos: number;
  mesesAnalisados: number;
}

// Calcula taxa, lance médio e total de ofertados para um tipo de lance
function calcularTaxaLance(
  analises: AnalyseMensal[],
  tipo: 'sorteio' | 'lance_fixo_i' | 'lance_fixo_ii' | 'lance_livre' | 'lance_limitado'
): MetricasTipoLance {
  // Agrupar análises por mês
  const analisesPorMes = new Map<string, AnalyseMensal[]>();
  analises.forEach(analise => {
    const mes = analise.mes_ano;
    if (!analisesPorMes.has(mes)) {
      analisesPorMes.set(mes, []);
    }
    analisesPorMes.get(mes)!.push(analise);
  });

  // Agregar dados por mês
  const dadosMensais = Array.from(analisesPorMes.entries()).map(([mes, analisesDoMes]) => {
    const somaOfertados = analisesDoMes.reduce((sum, a) => sum + (a[`${tipo}_ofertados`] || 0), 0);
    const somaContemplacoes = analisesDoMes.reduce((sum, a) => sum + (a[`${tipo}_contemplacoes`] || 0), 0);
    const somaPercentuais = analisesDoMes.reduce((sum, a) => sum + Number(a[`${tipo}_percentual`] || 0), 0);
    const count = analisesDoMes.filter(a => a[`${tipo}_ofertados`] > 0).length;
    
    return {
      mes,
      data: analisesDoMes[0].data_analise,
      ofertados: somaOfertados,
      contemplacoes: somaContemplacoes,
      percentualMedio: count > 0 ? somaPercentuais / count : 0
    };
  });

  // Identificar o mês mais recente globalmente
  dadosMensais.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  const mesMaisRecente = dadosMensais[0]?.mes;
  
  // Somar todos os valores do mês mais recente
  const totalOfertados = dadosMensais
    .filter(d => d.mes === mesMaisRecente)
    .reduce((sum, d) => sum + d.ofertados, 0);
  
  // Taxa e lance médio: média dos últimos 6 meses
  const ultimos6Meses = dadosMensais.slice(0, 6);
  const totalOfertadosHistorico = ultimos6Meses.reduce((sum, m) => sum + m.ofertados, 0);
  const totalContemplacoesHistorico = ultimos6Meses.reduce((sum, m) => sum + m.contemplacoes, 0);
  const somaPercentuais = ultimos6Meses.reduce((sum, m) => sum + m.percentualMedio, 0);
  const countComDados = ultimos6Meses.filter(m => m.ofertados > 0).length;

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

export function useComparativoAdministradoras(
  grupos: GrupoConsorcio[],
  administradorasSelecionadas: string[]
) {
  const metricas = useMemo<MetricasAdministradora[]>(() => {
    const resultado: MetricasAdministradora[] = [];

    administradorasSelecionadas.forEach(adm => {
      const gruposAdm = grupos.filter(g => g.administradora === adm);
      const todasAnalises = gruposAdm.flatMap(g => g.analises || []);

      if (todasAnalises.length === 0) {
        resultado.push({
          administradora: adm,
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
          totalGrupos: 0,
          mesesAnalisados: 0
        });
        return;
      }

      // Agrupar análises por mês
      const analisesPorMes = new Map<string, AnalyseMensal[]>();
      todasAnalises.forEach(analise => {
        const mes = analise.mes_ano;
        if (!analisesPorMes.has(mes)) {
          analisesPorMes.set(mes, []);
        }
        analisesPorMes.get(mes)!.push(analise);
      });

      // Agregar dados por mês
      const dadosMensais = Array.from(analisesPorMes.entries()).map(([mes, analisesDoMes]) => {
        const sorteioOfertados = analisesDoMes.reduce((sum, a) => sum + a.sorteio_ofertados, 0);
        const lanceFixoIOfertados = analisesDoMes.reduce((sum, a) => sum + a.lance_fixo_i_ofertados, 0);
        const lanceFixoIIOfertados = analisesDoMes.reduce((sum, a) => sum + a.lance_fixo_ii_ofertados, 0);
        const lanceLivreOfertados = analisesDoMes.reduce((sum, a) => sum + a.lance_livre_ofertados, 0);
        const lanceLimitadoOfertados = analisesDoMes.reduce((sum, a) => sum + a.lance_limitado_ofertados, 0);
        
        const sorteioContemplacoes = analisesDoMes.reduce((sum, a) => sum + a.sorteio_contemplacoes, 0);
        const lanceFixoIContemplacoes = analisesDoMes.reduce((sum, a) => sum + a.lance_fixo_i_contemplacoes, 0);
        const lanceFixoIIContemplacoes = analisesDoMes.reduce((sum, a) => sum + a.lance_fixo_ii_contemplacoes, 0);
        const lanceLivreContemplacoes = analisesDoMes.reduce((sum, a) => sum + a.lance_livre_contemplacoes, 0);
        const lanceLimitadoContemplacoes = analisesDoMes.reduce((sum, a) => sum + a.lance_limitado_contemplacoes, 0);
        
        return {
          mes,
          data: analisesDoMes[0].data_analise,
          sorteioOfertados,
          lanceFixoIOfertados,
          lanceFixoIIOfertados,
          lanceLivreOfertados,
          lanceLimitadoOfertados,
          sorteioContemplacoes,
          lanceFixoIContemplacoes,
          lanceFixoIIContemplacoes,
          lanceLivreContemplacoes,
          lanceLimitadoContemplacoes
        };
      });

      // Identificar o mês mais recente globalmente
      dadosMensais.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      const mesMaisRecente = dadosMensais[0]?.mes;
      
      // Somar todos os valores do mês mais recente
      const dadosMesRecente = dadosMensais.filter(d => d.mes === mesMaisRecente);
      const totalOfertados = dadosMesRecente.reduce((sum, d) => 
        sum + d.sorteioOfertados + d.lanceFixoIOfertados + d.lanceFixoIIOfertados + 
        d.lanceLivreOfertados + d.lanceLimitadoOfertados, 0);
      const totalContemplacoes = dadosMesRecente.reduce((sum, d) => 
        sum + d.sorteioContemplacoes + d.lanceFixoIContemplacoes + d.lanceFixoIIContemplacoes + 
        d.lanceLivreContemplacoes + d.lanceLimitadoContemplacoes, 0);

      // Taxa geral: média dos últimos 6 meses
      const ultimos6 = dadosMensais.slice(0, 6);
      const totalOfertados6Meses = ultimos6.reduce((sum, m) => 
        sum + m.sorteioOfertados + m.lanceFixoIOfertados + m.lanceFixoIIOfertados + 
        m.lanceLivreOfertados + m.lanceLimitadoOfertados, 0);
      const totalContemplacoes6Meses = ultimos6.reduce((sum, m) => 
        sum + m.sorteioContemplacoes + m.lanceFixoIContemplacoes + m.lanceFixoIIContemplacoes + 
        m.lanceLivreContemplacoes + m.lanceLimitadoContemplacoes, 0);
      
      const taxaGeral = totalOfertados6Meses > 0 ? (totalContemplacoes6Meses / totalOfertados6Meses) * 100 : 0;
      const mediaContemplacoesMensal = ultimos6.length > 0 ? totalContemplacoes6Meses / ultimos6.length : 0;

      const lanceLivreBase = calcularTaxaLance(todasAnalises, 'lance_livre');
      const tendenciaLanceLivre = calcularTendenciaLanceLivre(todasAnalises);

      const metrica: MetricasAdministradora = {
        administradora: adm,
        taxaGeral,
        totalOfertados,
        totalContemplacoes,
        totalContemplacoesHistorico: totalContemplacoes6Meses,
        mediaContemplacoesMensal,
        sorteio: calcularTaxaLance(todasAnalises, 'sorteio'),
        lancefixoi: calcularTaxaLance(todasAnalises, 'lance_fixo_i'),
        lancefixoii: calcularTaxaLance(todasAnalises, 'lance_fixo_ii'),
        lancelivre: { ...lanceLivreBase, tendencia: tendenciaLanceLivre },
        lancelimitado: calcularTaxaLance(todasAnalises, 'lance_limitado'),
        evolucao: calcularEvolucao(todasAnalises),
        totalGrupos: gruposAdm.length,
        mesesAnalisados: todasAnalises.length
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
        console.warn('⚠️ Divergência nos totais da administradora:', {
          administradora: metrica.administradora,
          totalGeral: metrica.totalOfertados,
          somaCalculada,
          diferenca,
          totalGrupos: metrica.totalGrupos
        });
      }

      resultado.push(metrica);
    });

    return resultado.sort((a, b) => b.taxaGeral - a.taxaGeral);
  }, [grupos, administradorasSelecionadas]);

  return { metricas };
}
