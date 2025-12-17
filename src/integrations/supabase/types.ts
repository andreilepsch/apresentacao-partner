export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      administradoras_info: {
        Row: {
          anos_mercado: number
          clientes_contemplados: string
          contemplacoes_mes: number
          created_at: string
          descricao_adicional: string | null
          id: string
          link_reclame_aqui: string
          nome: string
          parceira1_link: string | null
          parceira1_nome: string
          parceira2_link: string | null
          parceira2_nome: string
          parceira3_link: string | null
          parceira3_nome: string
          updated_at: string
        }
        Insert: {
          anos_mercado: number
          clientes_contemplados: string
          contemplacoes_mes: number
          created_at?: string
          descricao_adicional?: string | null
          id?: string
          link_reclame_aqui: string
          nome: string
          parceira1_link?: string | null
          parceira1_nome: string
          parceira2_link?: string | null
          parceira2_nome: string
          parceira3_link?: string | null
          parceira3_nome: string
          updated_at?: string
        }
        Update: {
          anos_mercado?: number
          clientes_contemplados?: string
          contemplacoes_mes?: number
          created_at?: string
          descricao_adicional?: string | null
          id?: string
          link_reclame_aqui?: string
          nome?: string
          parceira1_link?: string | null
          parceira1_nome?: string
          parceira2_link?: string | null
          parceira2_nome?: string
          parceira3_link?: string | null
          parceira3_nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      analises_mensais: {
        Row: {
          created_at: string
          data_analise: string
          grupo_id: string
          id: string
          lance_fixo_i_contemplacoes: number
          lance_fixo_i_ofertados: number
          lance_fixo_i_percentual: number
          lance_fixo_ii_contemplacoes: number
          lance_fixo_ii_ofertados: number
          lance_fixo_ii_percentual: number
          lance_limitado_contemplacoes: number
          lance_limitado_ofertados: number
          lance_limitado_percentual: number
          lance_livre_contemplacoes: number
          lance_livre_ofertados: number
          lance_livre_percentual: number
          mes_ano: string
          sorteio_contemplacoes: number
          sorteio_ofertados: number
          sorteio_percentual: number
        }
        Insert: {
          created_at?: string
          data_analise: string
          grupo_id: string
          id?: string
          lance_fixo_i_contemplacoes?: number
          lance_fixo_i_ofertados?: number
          lance_fixo_i_percentual?: number
          lance_fixo_ii_contemplacoes?: number
          lance_fixo_ii_ofertados?: number
          lance_fixo_ii_percentual?: number
          lance_limitado_contemplacoes?: number
          lance_limitado_ofertados?: number
          lance_limitado_percentual?: number
          lance_livre_contemplacoes?: number
          lance_livre_ofertados?: number
          lance_livre_percentual?: number
          mes_ano: string
          sorteio_contemplacoes?: number
          sorteio_ofertados?: number
          sorteio_percentual?: number
        }
        Update: {
          created_at?: string
          data_analise?: string
          grupo_id?: string
          id?: string
          lance_fixo_i_contemplacoes?: number
          lance_fixo_i_ofertados?: number
          lance_fixo_i_percentual?: number
          lance_fixo_ii_contemplacoes?: number
          lance_fixo_ii_ofertados?: number
          lance_fixo_ii_percentual?: number
          lance_limitado_contemplacoes?: number
          lance_limitado_ofertados?: number
          lance_limitado_percentual?: number
          lance_livre_contemplacoes?: number
          lance_livre_ofertados?: number
          lance_livre_percentual?: number
          mes_ano?: string
          sorteio_contemplacoes?: number
          sorteio_ofertados?: number
          sorteio_percentual?: number
        }
        Relationships: [
          {
            foreignKeyName: "analises_mensais_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_consorcio"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          accent_color: string
          authority_quote: string | null
          authority_quote_author: string | null
          authority_quote_role: string | null
          company_name: string
          company_tagline: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          contract_address: string | null
          contract_cep: string | null
          contract_city: string | null
          contract_cnpj: string | null
          contract_company_name: string | null
          contract_website: string | null
          created_at: string
          feedback_question: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          mentor_photo_url: string | null
          metrics_json: Json | null
          pdf_accent_color: string
          pdf_background_color: string
          pdf_intro_text: string | null
          pdf_logo_url: string | null
          primary_color: string
          secondary_color: string
          team_photo_url: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          authority_quote?: string | null
          authority_quote_author?: string | null
          authority_quote_role?: string | null
          company_name: string
          company_tagline?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contract_address?: string | null
          contract_cep?: string | null
          contract_city?: string | null
          contract_cnpj?: string | null
          contract_company_name?: string | null
          contract_website?: string | null
          created_at?: string
          feedback_question?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          mentor_photo_url?: string | null
          metrics_json?: Json | null
          pdf_accent_color?: string
          pdf_background_color?: string
          pdf_intro_text?: string | null
          pdf_logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          team_photo_url?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          authority_quote?: string | null
          authority_quote_author?: string | null
          authority_quote_role?: string | null
          company_name?: string
          company_tagline?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contract_address?: string | null
          contract_cep?: string | null
          contract_city?: string | null
          contract_cnpj?: string | null
          contract_company_name?: string | null
          contract_website?: string | null
          created_at?: string
          feedback_question?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          mentor_photo_url?: string | null
          metrics_json?: Json | null
          pdf_accent_color?: string
          pdf_background_color?: string
          pdf_intro_text?: string | null
          pdf_logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          team_photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_price: {
        Row: {
          administradora: string
          created_at: string
          credito: number
          group_code: number
          grupo_descricao: string | null
          id: string
          parcela: number
          prazo_months: number
        }
        Insert: {
          administradora: string
          created_at?: string
          credito: number
          group_code: number
          grupo_descricao?: string | null
          id?: string
          parcela: number
          prazo_months: number
        }
        Update: {
          administradora?: string
          created_at?: string
          credito?: number
          group_code?: number
          grupo_descricao?: string | null
          id?: string
          parcela?: number
          prazo_months?: number
        }
        Relationships: []
      }
      grupos_consorcio: {
        Row: {
          administradora: string
          capacidade_cotas: number
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          numero_grupo: string
          participantes_atual: number
          prazo_meses: number
          updated_at: string
          user_id: string
        }
        Insert: {
          administradora: string
          capacidade_cotas: number
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          numero_grupo: string
          participantes_atual: number
          prazo_meses: number
          updated_at?: string
          user_id: string
        }
        Update: {
          administradora?: string
          capacidade_cotas?: number
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          numero_grupo?: string
          participantes_atual?: number
          prazo_meses?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_account_status: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          is_active: boolean
          rejection_reason: string | null
          requested_at: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          rejection_reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_branding: {
        Row: {
          accent_color: string
          authority_quote: string | null
          authority_quote_author: string | null
          authority_quote_role: string | null
          company_name: string
          company_tagline: string | null
          contact_email: string | null
          contact_phone: string | null
          contact_whatsapp: string | null
          contract_address: string | null
          contract_cep: string | null
          contract_city: string | null
          contract_cnpj: string | null
          contract_company_name: string | null
          contract_website: string | null
          created_at: string
          feedback_question: string | null
          id: string
          logo_url: string | null
          mentor_photo_url: string | null
          metrics_json: Json | null
          pdf_accent_color: string
          pdf_background_color: string
          pdf_intro_text: string | null
          pdf_logo_url: string | null
          primary_color: string
          secondary_color: string
          team_photo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string
          authority_quote?: string | null
          authority_quote_author?: string | null
          authority_quote_role?: string | null
          company_name?: string
          company_tagline?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contract_address?: string | null
          contract_cep?: string | null
          contract_city?: string | null
          contract_cnpj?: string | null
          contract_company_name?: string | null
          contract_website?: string | null
          created_at?: string
          feedback_question?: string | null
          id?: string
          logo_url?: string | null
          mentor_photo_url?: string | null
          metrics_json?: Json | null
          pdf_accent_color?: string
          pdf_background_color?: string
          pdf_intro_text?: string | null
          pdf_logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          team_photo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string
          authority_quote?: string | null
          authority_quote_author?: string | null
          authority_quote_role?: string | null
          company_name?: string
          company_tagline?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contact_whatsapp?: string | null
          contract_address?: string | null
          contract_cep?: string | null
          contract_city?: string | null
          contract_cnpj?: string | null
          contract_company_name?: string | null
          contract_website?: string | null
          created_at?: string
          feedback_question?: string | null
          id?: string
          logo_url?: string | null
          mentor_photo_url?: string | null
          metrics_json?: Json | null
          pdf_accent_color?: string
          pdf_background_color?: string
          pdf_intro_text?: string | null
          pdf_logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          team_photo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_companies: {
        Row: {
          company_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_user: {
        Args: { _company_id?: string; _role?: string; _user_id: string }
        Returns: undefined
      }
      get_unique_company_names: {
        Args: never
        Returns: {
          company_name: string
        }[]
      }
      get_user_role: {
        Args: { target_user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      reject_user: {
        Args: { _reason?: string; _user_id: string }
        Returns: undefined
      }
      set_user_company: {
        Args: { _company_id: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "mentor" | "partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "mentor", "partner"],
    },
  },
} as const
