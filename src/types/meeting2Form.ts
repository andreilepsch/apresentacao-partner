import { z } from 'zod';

export interface Meeting2FormData {
  // Dados Pessoais
  nome: string;
  idade: number | '';
  profissao: string;
  
  // Estratégia de Investimento
  estrategiaInvestimento: 'guardar' | 'aplicar-cdi' | 'ambos' | '';
  
  // Seleção de Imóvel
  imovelSelecionado: 'pinheiros' | 'cocoon' | 'domingos-moraes' | '';
}

export const meeting2FormSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  idade: z.number().min(18, 'Idade mínima é 18 anos').max(120, 'Idade máxima é 120 anos'),
  profissao: z.string().trim().min(2, 'Profissão deve ter pelo menos 2 caracteres').max(100, 'Profissão muito longa'),
  estrategiaInvestimento: z.enum(['guardar', 'aplicar-cdi', 'ambos']),
  imovelSelecionado: z.enum(['pinheiros', 'cocoon', 'domingos-moraes'])
});

export interface FormConfig {
  sections: FormSection[];
  validation: typeof meeting2FormSchema;
  navigation: NavigationConfig;
}

export interface FormSection {
  id: string;
  title: string;
  icon: string;
  fields: FormField[];
  conditional?: ConditionalLogic;
}

export interface FormField {
  name: keyof Meeting2FormData;
  type: 'text' | 'number' | 'radio' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string; icon?: string }>;
}

export interface ConditionalLogic {
  field: keyof Meeting2FormData;
  condition: 'equals' | 'not_equals';
  value: any;
}

export interface NavigationConfig {
  backTo: string;
  nextTo: string;
}

export interface PropertyOption {
  id: 'pinheiros' | 'cocoon' | 'domingos-moraes';
  name: string;
  location: string;
  description: string;
  image?: string;
  features: string[];
}

export const PROPERTY_OPTIONS: PropertyOption[] = [
  {
    id: 'pinheiros',
    name: 'Empreendimento Pinheiros',
    location: 'Pinheiros, São Paulo',
    description: 'Localização privilegiada em uma das regiões mais valorizadas de São Paulo.',
    image: '/lovable-uploads/pinheiros-facade.jpg',
    features: ['Metrô Faria Lima a 300m', 'Área de lazer completa', 'Varanda gourmet', 'Academia exclusiva']
  },
  {
    id: 'cocoon',
    name: 'Cocoon Living',
    location: 'Região Central',
    description: 'Conceito inovador de moradia urbana com design moderno.',
    image: '/lovable-uploads/cocoon-facade.jpg',
    features: ['Mobiliado e decorado', 'Tecnologia integrada', 'Co-working exclusivo', 'Rooftop panorâmico']
  },
  {
    id: 'domingos-moraes',
    name: 'Residencial Domingos de Moraes',
    location: 'Vila Mariana, São Paulo',
    description: 'Excelente localização com fácil acesso ao centro e zonas empresariais.',
    image: '/lovable-uploads/domingos-facade.jpg',
    features: ['Metrô Ana Rosa próximo', 'Área verde preservada', 'Comércio local forte', 'Valor acessível']
  }
];

export const INVESTMENT_STRATEGY_OPTIONS = [
  {
    value: 'guardar' as const,
    label: 'Guardar Dinheiro',
    description: 'Foco em poupança tradicional e segurança',
    icon: 'PiggyBank'
  },
  {
    value: 'aplicar-cdi' as const,
    label: 'Aplicar em CDI',
    description: 'Rentabilidade em renda fixa',
    icon: 'BarChart3'
  },
  {
    value: 'ambos' as const,
    label: 'Ambos',
    description: 'Estratégia mista entre poupança e investimento',
    icon: 'ArrowRightLeft'
  }
];