export interface LanceData {
  ofertados: number;
  contemplacoes: number;
  percentual: number;
}

export interface AnalyseMensal {
  id: string;
  grupo_id: string;
  mes_ano: string;
  data_analise: string;
  sorteio_ofertados: number;
  sorteio_contemplacoes: number;
  sorteio_percentual: number;
  lance_fixo_i_ofertados: number;
  lance_fixo_i_contemplacoes: number;
  lance_fixo_i_percentual: number;
  lance_fixo_ii_ofertados: number;
  lance_fixo_ii_contemplacoes: number;
  lance_fixo_ii_percentual: number;
  lance_livre_ofertados: number;
  lance_livre_contemplacoes: number;
  lance_livre_percentual: number;
  lance_limitado_ofertados: number;
  lance_limitado_contemplacoes: number;
  lance_limitado_percentual: number;
  created_at: string;
}

export interface GrupoConsorcio {
  id: string;
  user_id: string;
  administradora: string;
  numero_grupo: string;
  prazo_meses: number;
  capacidade_cotas: number;
  participantes_atual: number;
  data_inicio: string;
  data_fim: string;
  created_at: string;
  updated_at: string;
  analises?: AnalyseMensal[];
}

export const ADMINISTRADORAS = [
  'Magalu',
  'Canopus',
  'Rodobens',
  'Bancorbrás',
  'Âncora',
  'HS Consórcios'
] as const;

export type Administradora = typeof ADMINISTRADORAS[number];

export const TIPOS_LANCE = [
  'Sorteio',
  'Lance Fixo I',
  'Lance Fixo II',
  'Lance Livre',
  'Lance Limitado'
] as const;

export type TipoLance = typeof TIPOS_LANCE[number];
