export type TipoLance = 'sorteio' | 'lance_fixo_i' | 'lance_fixo_ii' | 'lance_livre' | 'lance_limitado';

export interface SimulacaoParams {
  administradora: string;
  grupoId: string;
  tipoLance: TipoLance;
  valorCarta: number;
  percentualLance: number;
  mesEntrada: number | null; // Para Lance Fixo I/II
  janelaHistorica: 6 | 12 | 24;
  considerarApenasContemplacao: boolean;
}

export interface MetricasBase {
  p_min: number;
  p_med: number;
  p_max: number;
  taxa_media_contemplacao: number;
  meses_com_contemplacao: number;
  confianca: 'baixa' | 'media' | 'alta';
}

export interface IndicadorCompetitividade {
  valor: number;
  nivel: 'Baixa' | 'Média' | 'Alta';
  descricao: string;
}

export interface Cenario {
  nome: 'Otimista' | 'Médio' | 'Conservador';
  mes_estimado: number;
  probabilidade: string;
  cor: string;
  modelo_usado?: 'fila' | 'leilao' | 'sorteio';
}

export interface DadosDinamicos {
  participantes_historico: number[];
  contemplacoes_historico: number[];
  taxa_saida_mensal: number;
  taxa_entrada_mensal: number;
  volatilidade: number;
  participantes_atual: number;
  mes_atual: number;
}

export interface ResultadoSimulacao {
  cenarios: Cenario[];
  metricas: MetricasBase;
  competitividade: IndicadorCompetitividade;
  dinamica: DadosDinamicos;
  grupo: {
    administradora: string;
    numero_grupo: string;
    prazo_meses: number;
    capacidade_cotas: number;
  };
  params: SimulacaoParams;
}

export const TIPOS_LANCE_LABELS: Record<TipoLance, string> = {
  sorteio: 'Sorteio',
  lance_fixo_i: 'Lance Fixo I',
  lance_fixo_ii: 'Lance Fixo II',
  lance_livre: 'Lance Livre',
  lance_limitado: 'Lance Limitado',
};

export const TIPOS_LANCE_OPTIONS: { value: TipoLance; label: string }[] = [
  { value: 'sorteio', label: 'Sorteio' },
  { value: 'lance_fixo_i', label: 'Lance Fixo I' },
  { value: 'lance_fixo_ii', label: 'Lance Fixo II' },
  { value: 'lance_livre', label: 'Lance Livre' },
  { value: 'lance_limitado', label: 'Lance Limitado' },
];
