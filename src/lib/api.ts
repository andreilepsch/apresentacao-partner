/**
 * api.ts — Cliente HTTP que substitui o Supabase client
 * Todas as chamadas de dados vão para o backend Express em /api
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Header de autenticação: passa o clerk_user_id
function getAuthHeaders(clerkUserId?: string | null): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (clerkUserId) {
    headers['x-clerk-user-id'] = clerkUserId;
  }
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  options?: { body?: unknown; clerkUserId?: string | null }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getAuthHeaders(options?.clerkUserId),
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// =====================================================
// AUTH / PROFILE
// =====================================================
export const authApi = {
  sync: (clerkUserId: string, email: string, fullName: string) =>
    request('/auth/sync', {}, { method: 'POST', body: { email, fullName }, clerkUserId }),

  me: (clerkUserId: string) =>
    request<{ user: UserProfile }>('GET', '/auth/me', { clerkUserId }),
};

// =====================================================
// COMPANIES
// =====================================================
export const companiesApi = {
  list: (clerkUserId: string) =>
    request<Company[]>('GET', '/companies', { clerkUserId }),

  get: (clerkUserId: string, id: string) =>
    request<Company>('GET', `/companies/${id}`, { clerkUserId }),

  create: (clerkUserId: string, data: Partial<Company>) =>
    request<Company>('POST', '/companies', { body: data, clerkUserId }),

  update: (clerkUserId: string, id: string, data: Partial<Company>) =>
    request<Company>('PUT', `/companies/${id}`, { body: data, clerkUserId }),
};

// =====================================================
// UPLOAD DE IMAGENS → R2
// =====================================================
export async function uploadImage(
  clerkUserId: string,
  file: File,
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { 'x-clerk-user-id': clerkUserId },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro no upload');
  }

  const data = await res.json();
  return data.url;
}

// =====================================================
// GRUPOS CONSÓRCIO
// =====================================================
export const gruposApi = {
  list: (clerkUserId: string) =>
    request<GrupoConsorcio[]>('GET', '/grupos', { clerkUserId }),

  get: (clerkUserId: string, id: string) =>
    request<GrupoConsorcio>('GET', `/grupos/${id}`, { clerkUserId }),

  create: (clerkUserId: string, data: Partial<GrupoConsorcio>) =>
    request<GrupoConsorcio>('POST', '/grupos', { body: data, clerkUserId }),

  createComCreditos: (clerkUserId: string, grupo: Partial<GrupoConsorcio>, creditos: CreditoInsert[]) =>
    request<GrupoConsorcio>('POST', '/grupos/com-creditos', { body: { grupo, creditos }, clerkUserId }),

  update: (clerkUserId: string, id: string, data: Partial<GrupoConsorcio>) =>
    request<GrupoConsorcio>('PUT', `/grupos/${id}`, { body: data, clerkUserId }),

  updateComCreditos: (clerkUserId: string, id: string, grupo: Partial<GrupoConsorcio>, creditos: CreditoInsert[]) =>
    request<GrupoConsorcio>('PUT', `/grupos/${id}/com-creditos`, { body: { grupo, creditos }, clerkUserId }),

  delete: (clerkUserId: string, id: string) =>
    request<{ success: boolean }>('DELETE', `/grupos/${id}`, { clerkUserId }),

  // Análises mensais
  getAnalises: (clerkUserId: string, grupoId: string) =>
    request<AnaliseMensal[]>('GET', `/grupos/${grupoId}/analises`, { clerkUserId }),

  createAnalise: (clerkUserId: string, grupoId: string, data: Partial<AnaliseMensal>) =>
    request<AnaliseMensal>('POST', `/grupos/${grupoId}/analises`, { body: data, clerkUserId }),
};

export const analisesApi = {
  update: (clerkUserId: string, id: string, data: Partial<AnaliseMensal>) =>
    request<AnaliseMensal>('PUT', `/analises/${id}`, { body: data, clerkUserId }),

  delete: (clerkUserId: string, id: string) =>
    request<{ success: boolean }>('DELETE', `/analises/${id}`, { clerkUserId }),
};

// =====================================================
// ADMIN
// =====================================================
export const adminApi = {
  listUsers: (clerkUserId: string) =>
    request<UserProfile[]>('GET', '/admin/users', { clerkUserId }),

  approveUser: (clerkUserId: string, userId: string, role = 'partner', companyId?: string) =>
    request('POST', `/admin/users/${userId}/approve`, {
      body: { role, company_id: companyId },
      clerkUserId,
    }),

  updateUser: (clerkUserId: string, userId: string, data: Partial<UserProfile>) =>
    request('PUT', `/admin/users/${userId}`, { body: data, clerkUserId }),
};

export const creditosApi = {
  list: (clerkUserId: string, administradora?: string) =>
    request<CreditPrice[]>('GET', `/credits${administradora ? `?administradora=${administradora}` : ''}`, { clerkUserId }),
};

export const administradorasApi = {
  list: (clerkUserId: string) =>
    request<Administradora[]>('GET', '/administradoras', { clerkUserId }),
};

// =====================================================
// TYPES
// =====================================================
export interface UserProfile {
  clerk_user_id: string;
  email: string;
  full_name: string;
  status?: string;
  is_active?: boolean;
  role?: string;
  company_id?: string;
  company_name?: string;
  logo_url?: string;
  logo_negative_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  company_tagline?: string;
  metrics_json?: Array<{ label: string; value: string }>;
  media_json?: Array<Record<string, unknown>>;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  feedback_question?: string;
  authority_quote?: string;
  authority_quote_author?: string;
  authority_quote_role?: string;
  team_photo_url?: string;
  mentor_photo_url?: string;
  pdf_background_color?: string;
  pdf_accent_color?: string;
  pdf_logo_url?: string;
  pdf_intro_text?: string;
  contract_company_name?: string;
  contract_cnpj?: string;
  contract_address?: string;
  contract_city?: string;
  contract_cep?: string;
  contract_website?: string;
}

export interface Company {
  id: string;
  company_name: string;
  logo_url?: string;
  logo_negative_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  company_tagline?: string;
  team_photo_url?: string;
  mentor_photo_url?: string;
  metrics_json?: Array<{ label: string; value: string }>;
  media_json?: Array<Record<string, unknown>>;
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
  pdf_logo_url?: string;
  pdf_background_color: string;
  pdf_accent_color: string;
  is_active: boolean;
}

export interface GrupoConsorcio {
  id: string;
  clerk_user_id: string;
  administradora: string;
  numero_grupo: string;
  prazo_meses: number;
  capacidade_cotas: number;
  participantes_atual: number;
  data_inicio: string;
  data_fim: string;
  created_at: string;
  analises?: AnaliseMensal[];
}

export interface AnaliseMensal {
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
}

export interface CreditoInsert {
  credito: number;
  parcela: number;
  grupo_descricao?: string;
}

export interface CreditPrice {
  id: string;
  administradora: string;
  group_code: string;
  prazo_months: number;
  credito: number;
  parcela: number;
}

export interface Administradora {
  id: string;
  nome: string;
  logo_url?: string;
  ranking_abac?: number;
}
