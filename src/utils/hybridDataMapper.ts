import { Meeting2FormData, PROPERTY_OPTIONS, INVESTMENT_STRATEGY_OPTIONS } from '@/types/meeting2Form';
import { HybridPresentationData, PropertyData, ClientProfile, FinancialMetrics, PatrimonyProjection, MarketComparison, PaymentFlow, ExpenseBreakdown, CreditStructure } from '@/types/hybridPresentation';

// Dados expandidos das propriedades (alinhado com a interface PropertyData)
const EXPANDED_PROPERTY_DATA: Record<string, PropertyData & { endereco?: string; pontos?: string[] }> = {
  'pinheiros': {
    nome: 'Empreendimento Pinheiros',
    valor: 520000,
    area: 85,
    quartos: 2,
    banheiros: 2,
    vaga: true,
    entrega: 'Dezembro 2026',
    diferenciais: [
      'Localização Premium em Pinheiros',
      'Metrô Faria Lima a 300m',
      'Área de lazer completa',
      'Varanda gourmet',
      'Churrasqueira privativa',
      'Academia exclusiva'
    ],
    endereco: 'Rua dos Pinheiros, 1234 - Pinheiros, São Paulo - SP',
    pontos: [
      'Metrô Faria Lima - 300m',
      'Shopping Eldorado - 1,2km',
      'Hospital Albert Einstein - 2,5km',
      'Parque Villa-Lobos - 1,8km'
    ]
  },
  'cocoon': {
    nome: 'Cocoon Living',
    valor: 480000,
    area: 45,
    quartos: 1,
    banheiros: 1,
    vaga: true,
    entrega: 'Janeiro 2027',
    diferenciais: [
      'Conceito Smart Living',
      'Mobiliado e decorado',
      'Tecnologia integrada',
      'Sustentabilidade verde',
      'Co-working exclusivo',
      'Rooftop com vista panorâmica'
    ],
    endereco: 'Av. Paulista, 2000 - Bela Vista, São Paulo - SP',
    pontos: [
      'Metrô Trianon-MASP - 200m',
      'Av. Paulista - 0m',
      'Parque Trianon - 150m',
      'MASP - 300m'
    ]
  },
  'domingos-moraes': {
    nome: 'Residencial Domingos de Moraes',
    valor: 450000,
    area: 68,
    quartos: 2,
    banheiros: 2,
    vaga: true,
    entrega: 'Março 2027',
    diferenciais: [
      'Vila Mariana tradicional',
      'Metrô Ana Rosa próximo',
      'Área verde preservada',
      'Comércio local forte',
      'Excelente conectividade',
      'Valor acessível'
    ],
    endereco: 'Rua Domingos de Moraes, 3456 - Vila Mariana, São Paulo - SP',
    pontos: [
      'Metrô Ana Rosa - 800m',
      'Parque Ibirapuera - 1,5km',
      'Hospital do Coração - 1km',
      'Shopping Santa Cruz - 2km'
    ]
  }
};

// Função para gerar título dinâmico da estratégia
export const generateStrategyTitle = (estrategia: string): string => {
  const baseStrategy = 'Imóveis + Consórcio';
  
  switch (estrategia) {
    case 'guardar':
      return `${baseStrategy} + Poupança`;
    case 'aplicar-cdi':
      return `${baseStrategy} + CDI`;
    case 'ambos':
      return `${baseStrategy} + Híbrido (CDI + Poupança)`;
    default:
      return baseStrategy;
  }
};

// Função para gerar perfil do cliente baseado no formulário
const generateClientProfile = (formData: Meeting2FormData): ClientProfile => {
  const propertyData = EXPANDED_PROPERTY_DATA[formData.imovelSelecionado as string];
  const baseCapital = propertyData?.valor * 0.3 || 150000; // 30% do valor do imóvel
  
  return {
    nome: formData.nome,
    idade: typeof formData.idade === 'string' ? parseInt(formData.idade) : formData.idade,
    profissao: formData.profissao,
    capitalDisponivel: baseCapital,
    rendaAlmejada: baseCapital * 0.01, // 1% do capital como renda almejada
    parcelasIdeais: baseCapital * 0.015, // 1.5% do capital como parcela ideal
    startup: formData.profissao.toLowerCase().includes('empreendedor') ? 'Startup Tech' : undefined
  };
};

// Função para gerar métricas financeiras
const generateFinancialMetrics = (formData: Meeting2FormData, property: PropertyData & { valor: number }): FinancialMetrics => {
  const propertyValue = property.valor;
  const monthlyRent = propertyValue * 0.008; // 0.8% do valor do imóvel
  const monthlyExpenses = monthlyRent * 0.3; // 30% de despesas
  const netIncome = monthlyRent - monthlyExpenses;
  
  return {
    capRate: (netIncome * 12 / propertyValue) * 100,
    roi: ((netIncome * 12) / (propertyValue * 0.3)) * 100, // ROI baseado no capital inicial
    rendaMensalEsperada: netIncome,
    rendaAnualEsperada: netIncome * 12,
    valorPatrimonial2035: propertyValue * Math.pow(1.04, 10), // 4% ao ano por 10 anos
    rentabilidadeAnual: (netIncome * 12 / propertyValue) * 100
  };
};

// Função para gerar projeção patrimonial
const generatePatrimonyProjection = (property: PropertyData & { valor: number }): PatrimonyProjection[] => {
  const baseValue = property.valor;
  const projections: PatrimonyProjection[] = [];
  
  for (let year = 2025; year <= 2035; year++) {
    const yearsElapsed = year - 2025;
    const appreciatedValue = baseValue * Math.pow(1.04, yearsElapsed);
    const monthlyRent = appreciatedValue * 0.008;
    const annualIncome = monthlyRent * 12;
    const accumulatedIncome = annualIncome * (yearsElapsed + 1);
    
    projections.push({
      ano: year,
      valor: appreciatedValue,
      rendaAcumulada: accumulatedIncome
    });
  }
  
  return projections;
};

// Função para gerar comparações de mercado
const generateMarketComparison = (formData: Meeting2FormData, property: PropertyData & { valor: number }): MarketComparison[] => {
  const baseIncome = property.valor * 0.008;
  
  const comparisons: MarketComparison[] = [
    {
      tipo: 'Renda Fixa',
      rentabilidadeAnual: 11.5,
      rendaMensal: property.valor * 0.3 * 0.115 / 12, // 11.5% ao ano do capital inicial
      vantagens: ['Rentabilidade superior à poupança', 'Baixo risco'],
      desvantagens: ['Tributação regressiva', 'Sem proteção inflacionária total']
    },
    {
      tipo: 'Aluguel Tradicional',
      rentabilidadeAnual: 6.0,
      rendaMensal: property.valor * 0.006, // 0.6% do valor do imóvel
      vantagens: ['Estabilidade de renda', 'Menor gestão'],
      desvantagens: ['Vacância', 'Inadimplência', 'Baixa rentabilidade']
    },
    {
      tipo: 'Airbnb',
      rentabilidadeAnual: (baseIncome * 12 / (property.valor * 0.3)) * 100,
      rendaMensal: baseIncome * 0.7, // Descontando despesas
      vantagens: ['Alta rentabilidade', 'Valorização do imóvel', 'Proteção contra inflação'],
      desvantagens: ['Gestão necessária', 'Oscilação de demanda']
    }
  ];
  
  return comparisons;
};

// Função principal para mapear dados do formulário para apresentação
export const mapFormDataToPresentation = (formData: Meeting2FormData): HybridPresentationData & { estrategiaInvestimento: string } => {
  const selectedProperty = EXPANDED_PROPERTY_DATA[formData.imovelSelecionado as string];
  
  if (!selectedProperty) {
    throw new Error(`Propriedade não encontrada: ${formData.imovelSelecionado}`);
  }
  
  const cliente = generateClientProfile(formData);
  const metricas = generateFinancialMetrics(formData, selectedProperty);
  const projections = generatePatrimonyProjection(selectedProperty);
  const comparisons = generateMarketComparison(formData, selectedProperty);
  
  // Gerar estrutura de crédito
  const credito: CreditStructure = {
    creditoConsorcio: selectedProperty.valor * 0.7,
    parcelaConsorcio: (selectedProperty.valor * 0.7) / 180,
    lanceFixo: 30000,
    entrada: selectedProperty.valor * 0.3,
    finalizacao: selectedProperty.valor * 0.2,
    valorConsorcio: selectedProperty.valor * 0.7,
    parcelaMensal: (selectedProperty.valor * 0.7) / 180
  };

  // Gerar fluxo de pagamento
  const fluxoPagamento: PaymentFlow[] = [
    {
      fase: "Entrada",
      valor: selectedProperty.valor * 0.3,
      descricao: "Assinatura do contrato",
      detalhes: [
        { item: "Sinal Imóvel", valor: selectedProperty.valor * 0.25 },
        { item: "Taxa Consórcio", valor: selectedProperty.valor * 0.05 }
      ]
    },
    {
      fase: "Consórcio",
      valor: selectedProperty.valor * 0.7,
      descricao: "Contemplação estratégica",
      detalhes: [
        { item: "Crédito Liberado", valor: selectedProperty.valor * 0.7 },
        { item: "Parcelas Mensais", valor: (selectedProperty.valor * 0.7) / 180 }
      ]
    }
  ];

  // Gerar despesas
  const despesas: ExpenseBreakdown[] = [
    { 
      categoria: "Escritura", 
      valor: selectedProperty.valor * 0.02, 
      detalhes: ["ITBI", "Cartório", "Registro"] 
    },
    { 
      categoria: "Mobília", 
      valor: 50000, 
      detalhes: ["Móveis planejados", "Eletrodomésticos", "Decoração"] 
    }
  ];
  
  return {
    cliente,
    estrategiaInvestimento: generateStrategyTitle(formData.estrategiaInvestimento as string),
    imovel: selectedProperty,
    metricas,
    credito,
    fluxoPagamento,
    despesas,
    projecao: projections,
    comparativos: comparisons,
    destaques: [
      `Rentabilidade superior: ${metricas.roi.toFixed(1)}% ao ano`,
      `Renda mensal esperada: R$ ${metricas.rendaMensalEsperada.toLocaleString('pt-BR')}`,
      `CAP Rate: ${metricas.capRate.toFixed(1)}%`,
      `Patrimônio em 2035: R$ ${metricas.valorPatrimonial2035.toLocaleString('pt-BR')}`
    ],
    proximosPassos: [
      'Análise de crédito e documentação',
      'Assinatura do contrato de consórcio',
      'Contemplação e compra do imóvel',
      'Início da operação no Airbnb'
    ]
  };
};

// Função para validar se todos os dados necessários estão presentes
export const validateFormData = (formData: Meeting2FormData): boolean => {
  return !!(
    formData.nome &&
    formData.idade &&
    formData.profissao &&
    formData.estrategiaInvestimento &&
    formData.imovelSelecionado &&
    EXPANDED_PROPERTY_DATA[formData.imovelSelecionado as string]
  );
};