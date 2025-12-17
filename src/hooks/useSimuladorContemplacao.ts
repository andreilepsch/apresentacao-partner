import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  SimulacaoParams, 
  MetricasBase, 
  IndicadorCompetitividade, 
  Cenario, 
  ResultadoSimulacao,
  TipoLance 
} from '@/types/simulador';
import { GrupoConsorcio } from '@/types/gruposConsorcio';

// Utility functions
function quantile(arr: number[], q: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Fetch administradoras
export function useAdministradoras() {
  return useQuery({
    queryKey: ['administradoras-simulador'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grupos_consorcio')
        .select('administradora')
        .order('administradora');
      
      if (error) throw error;
      
      const unique = Array.from(new Set(data.map(g => g.administradora)));
      return unique;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

// Fetch grupos por administradora
export function useGruposPorAdministradora(administradora: string | null) {
  return useQuery({
    queryKey: ['grupos-por-administradora', administradora],
    queryFn: async () => {
      if (!administradora) return [];
      
      const { data, error } = await supabase
        .from('grupos_consorcio')
        .select('id, administradora, numero_grupo, prazo_meses, capacidade_cotas, data_inicio, data_fim')
        .eq('administradora', administradora)
        .order('numero_grupo');
      
      if (error) throw error;
      return data as GrupoConsorcio[];
    },
    enabled: !!administradora,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch análises mensais do grupo com JOIN para pegar data_inicio
async function fetchAnalises(grupoId: string, meses: number, tipoLance: TipoLance, apenasContemplacao: boolean) {
  const dataLimite = new Date();
  dataLimite.setMonth(dataLimite.getMonth() - meses);
  
  let query = supabase
    .from('analises_mensais')
    .select(`
      *,
      grupos_consorcio!inner(data_inicio, prazo_meses, capacidade_cotas)
    `)
    .eq('grupo_id', grupoId)
    .gte('data_analise', dataLimite.toISOString().split('T')[0])
    .order('data_analise', { ascending: true });
  
  if (apenasContemplacao) {
    query = query.gt(`${tipoLance}_contemplacoes`, 0);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Calcular mes_ciclo_real no JavaScript
  return data.map(analise => {
    const dataInicio = new Date(analise.grupos_consorcio.data_inicio);
    const dataAnalise = new Date(analise.data_analise);
    
    const diffMeses = 
      (dataAnalise.getFullYear() - dataInicio.getFullYear()) * 12 +
      (dataAnalise.getMonth() - dataInicio.getMonth()) + 1;
    
    return {
      ...analise,
      mes_ciclo_real: diffMeses
    };
  });
}

// Calcular métricas base
function calcularMetricasBase(analises: any[], tipoLance: TipoLance): MetricasBase {
  const percentuais = analises
    .filter(a => a[`${tipoLance}_contemplacoes`] > 0)
    .map(a => parseFloat(a[`${tipoLance}_percentual`]))
    .filter(p => !isNaN(p))
    .sort((a, b) => a - b);

  if (percentuais.length === 0) {
    throw new Error('Amostra insuficiente para este tipo de lance. Tente outro tipo ou aumente a janela histórica.');
  }

  const p_min = percentuais[0];
  const p_max = percentuais[percentuais.length - 1];
  const p_med = quantile(percentuais, 0.5);

  const taxas = analises.map(a => {
    const ofertados = a[`${tipoLance}_ofertados`] || 0;
    const contemplacoes = a[`${tipoLance}_contemplacoes`] || 0;
    return ofertados > 0 ? contemplacoes / ofertados : 0;
  });

  const taxa_media_contemplacao = taxas.reduce((sum, t) => sum + t, 0) / taxas.length;

  const confianca = 
    percentuais.length >= 10 ? 'alta' :
    percentuais.length >= 6 ? 'media' : 'baixa';

  return {
    p_min,
    p_med,
    p_max,
    taxa_media_contemplacao,
    meses_com_contemplacao: percentuais.length,
    confianca
  };
}

// Calcular competitividade
function calcularCompetitividade(lanceUsuario: number, metricas: MetricasBase): IndicadorCompetitividade {
  const { p_min, p_max } = metricas;
  
  const IC = p_max === p_min 
    ? 0.5 
    : clamp((lanceUsuario - p_min) / (p_max - p_min), 0, 1);

  const nivel = IC < 0.33 ? 'Baixa' : IC < 0.66 ? 'Média' : 'Alta';
  
  const descricao = 
    nivel === 'Baixa' ? 'Seu lance está abaixo da faixa histórica. Contemplação menos provável.' :
    nivel === 'Média' ? 'Seu lance está na faixa competitiva média. Chance moderada.' :
    'Seu lance está acima da média histórica. Chance elevada de contemplação.';

  return { valor: IC, nivel, descricao };
}

// Calcular dinâmica de participantes
export function calcularDinamica(analises: any[], tipoLance: TipoLance): any {
  const participantes = analises.map(a => a[`${tipoLance}_ofertados`] || 0);
  const contemplacoes = analises.map(a => a[`${tipoLance}_contemplacoes`] || 0);
  
  // Taxa de variação mensal (saída - entrada)
  const variacoes = [];
  for (let i = 1; i < participantes.length; i++) {
    const variacao = participantes[i] - participantes[i-1] + contemplacoes[i-1];
    variacoes.push(variacao);
  }
  
  const taxa_saida_mensal = variacoes.filter(v => v < 0).reduce((sum, v) => sum + Math.abs(v), 0) / Math.max(variacoes.filter(v => v < 0).length, 1);
  const taxa_entrada_mensal = variacoes.filter(v => v > 0).reduce((sum, v) => sum + v, 0) / Math.max(variacoes.filter(v => v > 0).length, 1);
  
  // Volatilidade (desvio padrão)
  const media = participantes.reduce((sum, p) => sum + p, 0) / participantes.length;
  const variancia = participantes.reduce((sum, p) => sum + Math.pow(p - media, 2), 0) / participantes.length;
  const volatilidade = Math.sqrt(variancia);
  
  return {
    participantes_historico: participantes,
    contemplacoes_historico: contemplacoes,
    taxa_saida_mensal: taxa_saida_mensal || 0,
    taxa_entrada_mensal: taxa_entrada_mensal || 0,
    volatilidade,
    participantes_atual: participantes[participantes.length - 1],
    mes_atual: analises[analises.length - 1].mes_ciclo_real
  };
}

// Modelo dinâmico para Sorteio
function calcularCenariosSorteio(
  analises: any[],
  tipoLance: TipoLance,
  prazo_meses: number
): Cenario[] {
  const dinamica = calcularDinamica(analises, tipoLance);
  const media_contemplacoes = dinamica.contemplacoes_historico.reduce((sum: number, c: number) => sum + c, 0) / dinamica.contemplacoes_historico.length;
  
  let participantes_restantes = dinamica.participantes_atual;
  const mes_inicial = dinamica.mes_atual + 1;
  
  const calcularMesParaProbabilidade = (prob_alvo: number): number => {
    let prob_acumulada = 0;
    let mes = mes_inicial;
    let participantes = participantes_restantes;
    
    while (prob_acumulada < prob_alvo && mes <= prazo_meses) {
      const prob_mensal = participantes > 0 ? media_contemplacoes / participantes : 0;
      prob_acumulada += (1 - prob_acumulada) * prob_mensal;
      
      participantes -= media_contemplacoes;
      participantes = Math.max(1, participantes);
      mes++;
    }
    
    return clamp(mes, mes_inicial, prazo_meses);
  };
  
  return [
    { 
      nome: 'Otimista', 
      mes_estimado: calcularMesParaProbabilidade(0.25), 
      probabilidade: '25%',
      cor: '#10b981',
      modelo_usado: 'sorteio'
    },
    { 
      nome: 'Médio', 
      mes_estimado: calcularMesParaProbabilidade(0.50), 
      probabilidade: '50%',
      cor: '#f59e0b',
      modelo_usado: 'sorteio'
    },
    { 
      nome: 'Conservador', 
      mes_estimado: calcularMesParaProbabilidade(0.75), 
      probabilidade: '75%',
      cor: '#ef4444',
      modelo_usado: 'sorteio'
    }
  ];
}

// Modelo de fila para Lance Fixo
function calcularCenariosLanceFixo(
  analises: any[],
  tipoLance: TipoLance,
  prazo_meses: number,
  mesEntrada: number | null,
  capacidade_cotas: number
): Cenario[] {
  const dinamica = calcularDinamica(analises, tipoLance);
  const media_contemplacoes = dinamica.contemplacoes_historico.reduce((sum: number, c: number) => sum + c, 0) / dinamica.contemplacoes_historico.length;
  
  // Usar dados reais de participantes para estimar posição na fila
  const mes_entrada_real = mesEntrada || 1;
  const mes_inicial = Math.max(dinamica.mes_atual + 1, mes_entrada_real);
  
  // Estimar posição baseado em participantes observados
  // Se entrou no mês 30 e agora estamos no mês 150, já passou muito tempo
  const meses_decorridos_desde_entrada = dinamica.mes_atual - mes_entrada_real;
  const contemplacoes_ja_ocorridas = meses_decorridos_desde_entrada * media_contemplacoes;
  
  // Posição estimada: quanto mais cedo entrou, mais à frente na fila
  const participantes_iniciais_estimados = dinamica.participantes_atual + contemplacoes_ja_ocorridas;
  const posicao_estimada = Math.max(1, participantes_iniciais_estimados * (mes_entrada_real / prazo_meses));
  
  // Simular fila dinâmica com decaimento de participantes
  const calcularMesParaPosicao = (fator_posicao: number): number => {
    let posicao_atual = Math.max(1, posicao_estimada * fator_posicao);
    let mes = mes_inicial;
    
    while (posicao_atual > 0 && mes <= prazo_meses) {
      // A cada mês, X pessoas são contempladas
      posicao_atual -= media_contemplacoes;
      mes++;
      
      // Limite de segurança
      if (mes > prazo_meses) break;
    }
    
    return clamp(mes, mes_inicial, prazo_meses);
  };
  
  return [
    { 
      nome: 'Otimista', 
      mes_estimado: calcularMesParaPosicao(0.7), // Você está mais à frente na fila
      probabilidade: '25%',
      cor: '#10b981',
      modelo_usado: 'fila'
    },
    { 
      nome: 'Médio', 
      mes_estimado: calcularMesParaPosicao(1.0), // Posição estimada exata
      probabilidade: '50%',
      cor: '#f59e0b',
      modelo_usado: 'fila'
    },
    { 
      nome: 'Conservador', 
      mes_estimado: calcularMesParaPosicao(1.3), // Você está mais atrás na fila
      probabilidade: '75%',
      cor: '#ef4444',
      modelo_usado: 'fila'
    }
  ];
}

// Modelo de leilão para Lance Livre/Limitado
function calcularCenariosLeilao(
  IC: number,
  analises: any[],
  tipoLance: TipoLance,
  prazo_meses: number,
  metricas: MetricasBase
): Cenario[] {
  const dinamica = calcularDinamica(analises, tipoLance);
  const taxa_base = metricas.taxa_media_contemplacao;
  
  // Ajustar taxa por competitividade
  let fator_competitividade = 1.0;
  if (IC < 0.25) {
    fator_competitividade = 0.6;
  } else if (IC >= 0.75) {
    fator_competitividade = 1.5;
  }
  
  const taxa_ajustada = taxa_base * fator_competitividade;
  const mes_inicial = dinamica.mes_atual + 1;
  
  const calcularMesParaProbabilidade = (prob_alvo: number): number => {
    if (taxa_ajustada <= 0 || taxa_ajustada >= 1) return prazo_meses;
    
    const mes = Math.log(1 - prob_alvo) / Math.log(1 - taxa_ajustada);
    return Math.round(clamp(mes + mes_inicial, mes_inicial, prazo_meses));
  };
  
  return [
    { 
      nome: 'Otimista', 
      mes_estimado: calcularMesParaProbabilidade(0.25), 
      probabilidade: '25%',
      cor: '#10b981',
      modelo_usado: 'leilao'
    },
    { 
      nome: 'Médio', 
      mes_estimado: calcularMesParaProbabilidade(0.50), 
      probabilidade: '50%',
      cor: '#f59e0b',
      modelo_usado: 'leilao'
    },
    { 
      nome: 'Conservador', 
      mes_estimado: calcularMesParaProbabilidade(0.75), 
      probabilidade: '75%',
      cor: '#ef4444',
      modelo_usado: 'leilao'
    }
  ];
}

// Função orquestradora
function calcularCenarios(
  IC: number,
  analises: any[],
  tipoLance: TipoLance,
  prazo_meses: number,
  metricas: MetricasBase,
  mesEntrada: number | null,
  capacidade_cotas: number
): Cenario[] {
  if (tipoLance === 'sorteio') {
    return calcularCenariosSorteio(analises, tipoLance, prazo_meses);
  } else if (tipoLance === 'lance_fixo_i' || tipoLance === 'lance_fixo_ii') {
    return calcularCenariosLanceFixo(analises, tipoLance, prazo_meses, mesEntrada, capacidade_cotas);
  } else {
    return calcularCenariosLeilao(IC, analises, tipoLance, prazo_meses, metricas);
  }
}

// Hook principal de simulação
export function useSimulacao(params: SimulacaoParams | null) {
  return useQuery({
    queryKey: ['simulacao', params],
    queryFn: async (): Promise<ResultadoSimulacao> => {
      if (!params) throw new Error('Parâmetros não fornecidos');

      // Buscar grupo
      const { data: grupo, error: grupoError } = await supabase
        .from('grupos_consorcio')
        .select('*')
        .eq('id', params.grupoId)
        .single();

      if (grupoError) throw grupoError;

      // Buscar análises
      const analises = await fetchAnalises(
        params.grupoId,
        params.janelaHistorica,
        params.tipoLance,
        params.considerarApenasContemplacao
      );

      if (analises.length < 3) {
        throw new Error('Amostra insuficiente (mínimo 3 análises). Selecione outro grupo ou aumente a janela histórica.');
      }

      // Calcular métricas
      const metricas = calcularMetricasBase(analises, params.tipoLance);
      const competitividade = calcularCompetitividade(params.percentualLance, metricas);
      const dinamica = calcularDinamica(analises, params.tipoLance);
      const cenarios = calcularCenarios(
        competitividade.valor,
        analises,
        params.tipoLance,
        grupo.prazo_meses,
        metricas,
        params.mesEntrada,
        grupo.capacidade_cotas
      );

      return {
        cenarios,
        metricas,
        competitividade,
        dinamica,
        grupo: {
          administradora: grupo.administradora,
          numero_grupo: grupo.numero_grupo,
          prazo_meses: grupo.prazo_meses,
          capacidade_cotas: grupo.capacidade_cotas,
        },
        params
      };
    },
    enabled: !!params,
    retry: false,
  });
}
