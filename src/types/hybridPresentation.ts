// Tipos para a apresentação híbrida personalizada baseada no PDF Francisco Banduk

export interface ClientProfile {
  nome: string;
  idade: number;
  profissao: string;
  startup?: string;
  capitalDisponivel: number;
  parcelasIdeais: number;
  rendaAlmejada: number;
}

export interface PropertyData {
  nome: string;
  valor: number;
  area: number;
  quartos: number;
  banheiros: number;
  vaga: boolean;
  entrega: string;
  diferenciais: string[];
}

export interface FinancialMetrics {
  capRate: number;
  roi: number;
  rendaMensalEsperada: number;
  rendaAnualEsperada: number;
  valorPatrimonial2035: number;
  rentabilidadeAnual: number;
}

export interface CreditStructure {
  creditoConsorcio: number;
  parcelaConsorcio: number;
  lanceFixo: number;
  entrada: number;
  finalizacao: number;
  valorConsorcio: number;
  parcelaMensal: number;
  opcoes?: Array<{
    nome: string;
    descricao: string;
    parcelaMensal: number;
    prazo: number;
    entrada: number;
    credito: number;
    contemplacao: string;
    lance: string;
    investimentoTotal: number;
    taxaAdmin: string;
    fundoReserva: string;
    recomendado?: boolean;
  }>;
}

export interface PaymentFlow {
  fase: string;
  valor: number;
  descricao: string;
  detalhes: Array<{
    item: string;
    valor: number;
  }>;
}

export interface ExpenseBreakdown {
  categoria: string;
  valor: number;
  detalhes: string[];
}

export interface PatrimonyProjection {
  ano: number;
  valor: number;
  rendaAcumulada: number;
}

export interface MarketComparison {
  tipo: 'Renda Fixa' | 'Aluguel Tradicional' | 'Airbnb';
  rentabilidadeAnual: number;
  rendaMensal: number;
  vantagens: string[];
  desvantagens: string[];
}

export interface HybridPresentationData {
  cliente: ClientProfile;
  imovel: PropertyData;
  metricas: FinancialMetrics;
  credito: CreditStructure;
  fluxoPagamento: PaymentFlow[];
  despesas: ExpenseBreakdown[];
  projecao: PatrimonyProjection[];
  comparativos: MarketComparison[];
  destaques: string[];
  proximosPassos: string[];
}

// Dados mockados baseados no PDF Francisco Banduk
export const MOCK_PRESENTATION_DATA: HybridPresentationData = {
  cliente: {
    nome: "Francisco Banduk",
    idade: 33,
    profissao: "Empresário",
    startup: "Tech Startup",
    capitalDisponivel: 400000,
    parcelasIdeais: 2500,
    rendaAlmejada: 5000
  },
  imovel: {
    nome: "COCOON",
    valor: 980000,
    area: 48,
    quartos: 2,
    banheiros: 1,
    vaga: true,
    entrega: "Dezembro/2026",
    diferenciais: [
      "Localização privilegiada no centro de SP",
      "Tecnologia smart building",
      "Área de coworking exclusiva",
      "Rooftop com vista panorâmica",
      "Academia e spa"
    ]
  },
  metricas: {
    capRate: 8.45,
    roi: 15.2,
    rendaMensalEsperada: 6900,
    rendaAnualEsperada: 82800,
    valorPatrimonial2035: 2400000,
    rentabilidadeAnual: 8.45
  },
  credito: {
    creditoConsorcio: 700000,
    parcelaConsorcio: 2284,
    lanceFixo: 30000,
    entrada: 98000,
    finalizacao: 182000,
    valorConsorcio: 700000,
    parcelaMensal: 2284,
    opcoes: [
      {
        nome: "Consórcio Estratégico",
        descricao: "Plano otimizado com lance fixo para contemplação rápida",
        parcelaMensal: 2284,
        prazo: 36,
        entrada: 98000,
        credito: 700000,
        contemplacao: "36º mês",
        lance: "Lance Fixo",
        investimentoTotal: 980000,
        taxaAdmin: "0,35%",
        fundoReserva: "2%",
        recomendado: true
      },
      {
        nome: "Consórcio Tradicional",
        descricao: "Plano padrão com sorteios mensais",
        parcelaMensal: 1950,
        prazo: 120,
        entrada: 98000,
        credito: 700000,
        contemplacao: "Sorteio",
        lance: "Lance Livre",
        investimentoTotal: 980000,
        taxaAdmin: "0,30%",
        fundoReserva: "2%",
        recomendado: false
      },
      {
        nome: "Consórcio Premium",
        descricao: "Plano com lance alto para contemplação garantida",
        parcelaMensal: 3500,
        prazo: 24,
        entrada: 98000,
        credito: 700000,
        contemplacao: "12º mês",
        lance: "Lance Alto",
        investimentoTotal: 980000,
        taxaAdmin: "0,40%",
        fundoReserva: "2%",
        recomendado: false
      }
    ]
  },
  fluxoPagamento: [
    { 
      fase: "Entrada", 
      valor: 98000, 
      descricao: "Assinatura do contrato",
      detalhes: [
        { item: "Sinal Imóvel", valor: 75000 },
        { item: "Taxa Consórcio", valor: 15000 },
        { item: "Documentação", valor: 8000 }
      ]
    },
    { 
      fase: "Consórcio", 
      valor: 700000, 
      descricao: "Contemplação estratégica",
      detalhes: [
        { item: "Crédito Liberado", valor: 700000 },
        { item: "36 Parcelas", valor: 2284 },
        { item: "Lance Fixo", valor: 30000 }
      ]
    },
    { 
      fase: "Finalização", 
      valor: 182000, 
      descricao: "Entrega do imóvel",
      detalhes: [
        { item: "Saldo Construção", valor: 182000 },
        { item: "Escritura", valor: 0 },
        { item: "Chaves", valor: 0 }
      ]
    },
  ],
  despesas: [
    { categoria: "Escritura", valor: 19600, detalhes: ["ITBI", "Cartório", "Registro"] },
    { categoria: "Mobília", valor: 50000, detalhes: ["Móveis planejados", "Eletrodomésticos", "Decoração"] },
    { categoria: "Reformas", valor: 30000, detalhes: ["Adequações", "Melhorias"] }
  ],
  projecao: [
    { ano: 2026, valor: 980000, rendaAcumulada: 0 },
    { ano: 2027, valor: 1078000, rendaAcumulada: 82800 },
    { ano: 2030, valor: 1400000, rendaAcumulada: 331200 },
    { ano: 2035, valor: 2400000, rendaAcumulada: 828000 }
  ],
  comparativos: [
    {
      tipo: 'Renda Fixa',
      rentabilidadeAnual: 12.0,
      rendaMensal: 4000,
      vantagens: ['Segurança', 'Liquidez'],
      desvantagens: ['Baixa rentabilidade', 'Inflação']
    },
    {
      tipo: 'Aluguel Tradicional',
      rentabilidadeAnual: 6.0,
      rendaMensal: 4900,
      vantagens: ['Estabilidade'],
      desvantagens: ['Vacância', 'Inadimplência']
    },
    {
      tipo: 'Airbnb',
      rentabilidadeAnual: 8.45,
      rendaMensal: 6900,
      vantagens: ['Alta rentabilidade', 'Flexibilidade'],
      desvantagens: ['Gestão ativa', 'Sazonalidade']
    }
  ],
  destaques: [
    "Rentabilidade 40% superior à renda fixa",
    "ROI de 15,2% ao ano",
    "Imóvel valorizado em localização nobre",
    "Patrimônio de R$ 2,4 milhões em 2035",
    "Renda passiva de R$ 6.900/mês"
  ],
  proximosPassos: [
    "Assinatura do contrato de consórcio",
    "Pagamento da entrada (R$ 98.000)",
    "Acompanhamento da construção",
    "Preparação para lance fixo (36º mês)",
    "Mobília e decoração do imóvel",
    "Início das operações Airbnb"
  ]
};