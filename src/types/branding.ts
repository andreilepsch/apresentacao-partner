export interface MetricData {
  value: string;
  label: string;
}

export interface UserBranding {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  company_tagline: string;
  team_photo_url: string | null;
  mentor_photo_url: string | null;
  metrics_json: MetricData[];
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  feedback_question: string;
  authority_quote: string;
  authority_quote_author: string;
  authority_quote_role: string;
  contract_company_name: string;
  contract_cnpj: string;
  contract_address: string;
  contract_city: string;
  contract_cep: string;
  contract_website: string;
  pdf_intro_text: string;
  pdf_background_color: string;
  pdf_accent_color: string;
  pdf_logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'partner' | 'user';
  created_at: string;
}
