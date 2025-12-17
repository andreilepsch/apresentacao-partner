export interface Company {
  id: string;
  company_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  company_tagline: string | null;
  team_photo_url: string | null;
  mentor_photo_url: string | null;
  metrics_json: any; // Json from Supabase
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  feedback_question: string | null;
  authority_quote: string | null;
  authority_quote_author: string | null;
  authority_quote_role: string | null;
  contract_company_name: string | null;
  contract_cnpj: string | null;
  contract_address: string | null;
  contract_city: string | null;
  contract_cep: string | null;
  contract_website: string | null;
  pdf_intro_text: string | null;
  pdf_background_color: string;
  pdf_accent_color: string;
  pdf_logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
