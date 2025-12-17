import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePreviewMode } from '@/contexts/PreviewModeContext';
import { PageContext } from '@/types/pageContext';
import type { UserBranding } from '@/types/branding';
import { toast } from 'sonner';

interface MetricData {
  value: string;
  label: string;
}

interface BrandingData {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyTagline: string;
  teamPhotoUrl: string | null;
  partnerPhotoUrl: string | null;
  metricsJson: MetricData[];
  contactPhone: string | null;
  contactEmail: string | null;
  contactWhatsapp: string | null;
  feedbackQuestion: string;
  authorityQuote: string;
  authorityQuoteAuthor: string;
  authorityQuoteRole: string;
  contractCompanyName: string;
  contractCnpj: string;
  contractAddress: string;
  contractCity: string;
  contractCep: string;
  contractWebsite: string;
  pdfIntroText: string;
  pdfBackgroundColor: string;
  pdfAccentColor: string;
  pdfLogoUrl: string | null;
}

interface BrandingContextType {
  branding: BrandingData;
  isLoading: boolean;
  pageContext: PageContext;
  setPageContext: (context: PageContext) => void;
  updateBranding: (data: Partial<BrandingData>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refetchBranding: () => Promise<void>;
}

const defaultBranding: BrandingData = {
  companyName: 'Referência Partner',
  logoUrl: null,
  primaryColor: '#1A4764',
  secondaryColor: '#c9a45c',
  accentColor: '#e8f5e8',
  companyTagline: 'Transformando patrimônio em renda através de investimentos imobiliários inteligentes',
  teamPhotoUrl: null,
  partnerPhotoUrl: null,
  metricsJson: [
    { value: "R$ 2.4Bi", label: "Em créditos gerenciados" },
    { value: "15 anos", label: "De experiência no mercado" },
    { value: "98%", label: "De satisfação dos clientes" }
  ],
  contactPhone: null,
  contactEmail: null,
  contactWhatsapp: null,
  feedbackQuestion: 'De 0 a 10 quanto você gostou do nosso atendimento?',
  authorityQuote: 'A credibilidade conquistada junto à mídia especializada reflete nosso compromisso com a transparência e excelência nos resultados.',
  authorityQuoteAuthor: 'CEO',
  authorityQuoteRole: 'CEO da Empresa',
  contractCompanyName: 'EMPRESA LTDA',
  contractCnpj: '00.000.000/0001-00',
  contractAddress: 'Endereço da empresa',
  contractCity: 'Cidade, Estado',
  contractCep: '00000-000',
  contractWebsite: 'www.empresa.com.br',
  pdfIntroText: 'Nossa empresa oferece consultoria especializada em investimentos imobiliários, com metodologia comprovada e suporte completo em todas as etapas do seu investimento.',
  pdfBackgroundColor: '#193D32',
  pdfAccentColor: '#B78D4A',
  pdfLogoUrl: null,
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  isLoading: true,
  pageContext: PageContext.AUTHENTICATION,
  setPageContext: () => {},
  updateBranding: async () => {},
  resetToDefaults: async () => {},
  refetchBranding: async () => {},
});

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const { isPreviewMode, previewCompanyId } = usePreviewMode();
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [isLoading, setIsLoading] = useState(true);
  const [pageContext, setPageContext] = useState<PageContext>(PageContext.AUTHENTICATION);
  const [cachedCompanyId, setCachedCompanyId] = useState<string | null>(null);

  // Preload critical images for instant loading
  const preloadImages = (brandingData: BrandingData) => {
    const imagesToPreload = [
      brandingData.logoUrl,
      brandingData.pdfLogoUrl,
      brandingData.teamPhotoUrl,
      brandingData.partnerPhotoUrl,
    ].filter((url): url is string => !!url);

    imagesToPreload.forEach((url) => {
      const img = new Image();
      img.src = url;
      console.log('🖼️ Preloading image:', url);
    });
  };

  const fetchBranding = async () => {
    console.log('🔍 fetchBranding called:', {
      isPreviewMode,
      previewCompanyId,
      hasUser: !!user,
      pageContext
    });

    // AUTHENTICATION/NAVIGATION: Sempre usar branding padrão
    if (pageContext === PageContext.AUTHENTICATION || pageContext === PageContext.NAVIGATION) {
      console.log('🎯 Using default branding for', pageContext);
      setBranding(defaultBranding);
      setIsLoading(false);
      return;
    }

    // ✅ Permitir preview sem autenticação (apenas em PRESENTATION)
    if (!user && !isPreviewMode) {
      console.log('⚠️ No user and not preview mode, using defaults');
      setBranding(defaultBranding);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let companyId: string | null = null;

      // PRESENTATION MODE: Preview mode - usar company_id do preview
      if (isPreviewMode && previewCompanyId) {
        companyId = previewCompanyId;
        console.log('🎨 Preview Mode: Loading branding for company', companyId);
      } else if (user) {
        // PRESENTATION MODE: Normal mode - buscar company_id do usuário
        const { data: userCompany } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        companyId = userCompany?.company_id || null;
        console.log('👤 User company mapping:', userCompany);
      }

      setCachedCompanyId(companyId);

      let brandingData = null;

      // ✅ IMPORTANTE: Buscar branding da empresa publicamente (funciona sem autenticação)
      if (companyId) {
        console.log('📡 Fetching company data for ID:', companyId);
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .single();

        if (companyError) {
          console.error('❌ Error fetching company:', companyError);
        }

        if (!companyError && company) {
          console.log('✅ Found company data:', company);
          brandingData = {
            companyName: company.company_name || defaultBranding.companyName,
            companyTagline: company.company_tagline || defaultBranding.companyTagline,
            logoUrl: company.logo_url || defaultBranding.logoUrl,
            primaryColor: company.primary_color || defaultBranding.primaryColor,
            secondaryColor: company.secondary_color || defaultBranding.secondaryColor,
            accentColor: company.accent_color || defaultBranding.accentColor,
            teamPhotoUrl: company.team_photo_url || defaultBranding.teamPhotoUrl,
            partnerPhotoUrl: company.mentor_photo_url || defaultBranding.partnerPhotoUrl,
            contactPhone: company.contact_phone || defaultBranding.contactPhone,
            contactEmail: company.contact_email || defaultBranding.contactEmail,
            contactWhatsapp: company.contact_whatsapp || defaultBranding.contactWhatsapp,
            feedbackQuestion: company.feedback_question || defaultBranding.feedbackQuestion,
            authorityQuote: company.authority_quote || defaultBranding.authorityQuote,
            authorityQuoteAuthor: company.authority_quote_author || defaultBranding.authorityQuoteAuthor,
            authorityQuoteRole: company.authority_quote_role || defaultBranding.authorityQuoteRole,
            metricsJson: company.metrics_json || defaultBranding.metricsJson,
            contractCompanyName: company.contract_company_name || defaultBranding.contractCompanyName,
            contractCnpj: company.contract_cnpj || defaultBranding.contractCnpj,
            contractAddress: company.contract_address || defaultBranding.contractAddress,
            contractCity: company.contract_city || defaultBranding.contractCity,
            contractCep: company.contract_cep || defaultBranding.contractCep,
            contractWebsite: company.contract_website || defaultBranding.contractWebsite,
            pdfIntroText: company.pdf_intro_text || defaultBranding.pdfIntroText,
            pdfBackgroundColor: company.pdf_background_color || defaultBranding.pdfBackgroundColor,
            pdfAccentColor: company.pdf_accent_color || defaultBranding.pdfAccentColor,
            pdfLogoUrl: company.pdf_logo_url || defaultBranding.pdfLogoUrl,
          };
        }
      }

      // Se encontrou branding, aplicar e fazer preload das imagens
      if (brandingData) {
        preloadImages(brandingData);
        setBranding(brandingData);
        setIsLoading(false);
        return;
      }

      // Se estiver em preview mode e não encontrou a empresa, usar defaults
      if (isPreviewMode) {
        console.warn('Preview mode: Company not found, using defaults');
        setBranding(defaultBranding);
        setIsLoading(false);
        return;
      }

      // Fallback para user_branding (apenas se não estiver em preview)
      if (user) {
        console.log('Falling back to own user_branding');
        const { data: legacyData, error: legacyError } = await supabase
          .from('user_branding')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!legacyError && legacyData) {
          const ownBranding = legacyData as unknown as UserBranding;
          const legacyBrandingData = {
            companyName: ownBranding.company_name,
            logoUrl: ownBranding.logo_url,
            primaryColor: ownBranding.primary_color,
            secondaryColor: ownBranding.secondary_color,
            accentColor: ownBranding.accent_color,
            companyTagline: ownBranding.company_tagline,
            teamPhotoUrl: ownBranding.team_photo_url,
            partnerPhotoUrl: ownBranding.mentor_photo_url,
            metricsJson: ownBranding.metrics_json,
            contactPhone: ownBranding.contact_phone,
            contactEmail: ownBranding.contact_email,
            contactWhatsapp: ownBranding.contact_whatsapp,
            feedbackQuestion: (ownBranding as any).feedback_question || defaultBranding.feedbackQuestion,
            authorityQuote: (ownBranding as any).authority_quote || defaultBranding.authorityQuote,
            authorityQuoteAuthor: (ownBranding as any).authority_quote_author || defaultBranding.authorityQuoteAuthor,
            authorityQuoteRole: (ownBranding as any).authority_quote_role || defaultBranding.authorityQuoteRole,
            contractCompanyName: (ownBranding as any).contract_company_name || defaultBranding.contractCompanyName,
            contractCnpj: (ownBranding as any).contract_cnpj || defaultBranding.contractCnpj,
            contractAddress: (ownBranding as any).contract_address || defaultBranding.contractAddress,
            contractCity: (ownBranding as any).contract_city || defaultBranding.contractCity,
            contractCep: (ownBranding as any).contract_cep || defaultBranding.contractCep,
            contractWebsite: (ownBranding as any).contract_website || defaultBranding.contractWebsite,
            pdfIntroText: (ownBranding as any).pdf_intro_text || defaultBranding.pdfIntroText,
            pdfBackgroundColor: (ownBranding as any).pdf_background_color || defaultBranding.pdfBackgroundColor,
            pdfAccentColor: (ownBranding as any).pdf_accent_color || defaultBranding.pdfAccentColor,
            pdfLogoUrl: (ownBranding as any).pdf_logo_url || defaultBranding.pdfLogoUrl,
          };
          preloadImages(legacyBrandingData);
          setBranding(legacyBrandingData);
        }
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      setBranding(defaultBranding);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id || isPreviewMode || pageContext === PageContext.AUTHENTICATION || pageContext === PageContext.NAVIGATION) {
      fetchBranding();
    }
  }, [user?.id, isPreviewMode, previewCompanyId, pageContext]);

  // Campos que usuários NÃO-ADMIN podem editar
  const USER_EDITABLE_FIELDS = [
    'companyTagline',
    'teamPhotoUrl',
    'partnerPhotoUrl',
    'contactPhone',
    'contactWhatsapp',
  ];

  const updateBranding = async (data: Partial<BrandingData>) => {
    if (!user) return;

    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) throw roleError;

      const isAdmin = roleData?.role === 'admin';

      if (!cachedCompanyId) {
        throw new Error('Nenhuma empresa vinculada ao usuário');
      }

      // Preparar dados para atualização
      let updateData: any = {};

      if (isAdmin) {
        // Admin pode editar TUDO
        if (data.companyName !== undefined) updateData.company_name = data.companyName;
        if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl || null;
        if (data.primaryColor !== undefined) updateData.primary_color = data.primaryColor;
        if (data.secondaryColor !== undefined) updateData.secondary_color = data.secondaryColor;
        if (data.accentColor !== undefined) updateData.accent_color = data.accentColor;
        if (data.companyTagline !== undefined) updateData.company_tagline = data.companyTagline || null;
        if (data.teamPhotoUrl !== undefined) updateData.team_photo_url = data.teamPhotoUrl || null;
        if (data.partnerPhotoUrl !== undefined) updateData.mentor_photo_url = data.partnerPhotoUrl || null;
        if (data.metricsJson !== undefined) updateData.metrics_json = data.metricsJson as any;
        if (data.contactPhone !== undefined) updateData.contact_phone = data.contactPhone || null;
        if (data.contactEmail !== undefined) updateData.contact_email = data.contactEmail || null;
        if (data.contactWhatsapp !== undefined) updateData.contact_whatsapp = data.contactWhatsapp || null;
        if (data.feedbackQuestion !== undefined) updateData.feedback_question = data.feedbackQuestion || null;
        if (data.authorityQuote !== undefined) updateData.authority_quote = data.authorityQuote || null;
        if (data.authorityQuoteAuthor !== undefined) updateData.authority_quote_author = data.authorityQuoteAuthor || null;
        if (data.authorityQuoteRole !== undefined) updateData.authority_quote_role = data.authorityQuoteRole || null;
        if (data.contractCompanyName !== undefined) updateData.contract_company_name = data.contractCompanyName || null;
        if (data.contractCnpj !== undefined) updateData.contract_cnpj = data.contractCnpj || null;
        if (data.contractAddress !== undefined) updateData.contract_address = data.contractAddress || null;
        if (data.contractCity !== undefined) updateData.contract_city = data.contractCity || null;
        if (data.contractCep !== undefined) updateData.contract_cep = data.contractCep || null;
        if (data.contractWebsite !== undefined) updateData.contract_website = data.contractWebsite || null;
        if (data.pdfIntroText !== undefined) updateData.pdf_intro_text = data.pdfIntroText || null;
        if (data.pdfBackgroundColor !== undefined) updateData.pdf_background_color = data.pdfBackgroundColor;
        if (data.pdfAccentColor !== undefined) updateData.pdf_accent_color = data.pdfAccentColor;
        if (data.pdfLogoUrl !== undefined) updateData.pdf_logo_url = data.pdfLogoUrl || null;
        updateData.updated_at = new Date().toISOString();
      } else {
        // Usuário só pode editar campos permitidos
        if (data.companyTagline !== undefined) updateData.company_tagline = data.companyTagline || null;
        if (data.teamPhotoUrl !== undefined) updateData.team_photo_url = data.teamPhotoUrl || null;
        if (data.partnerPhotoUrl !== undefined) updateData.mentor_photo_url = data.partnerPhotoUrl || null;
        if (data.contactPhone !== undefined) updateData.contact_phone = data.contactPhone || null;
        if (data.contactWhatsapp !== undefined) updateData.contact_whatsapp = data.contactWhatsapp || null;
        
        if (Object.keys(updateData).length === 0) {
          throw new Error('Você não tem permissão para editar esses campos');
        }
        
        updateData.updated_at = new Date().toISOString();
      }

      // Atualizar branding da empresa
      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', cachedCompanyId);

      if (updateError) throw updateError;

      setBranding((prev) => ({ ...prev, ...data }));
      toast.success(
        isAdmin 
          ? 'Branding da empresa atualizado!' 
          : 'Seus dados personalizados foram salvos!'
      );
    } catch (error: any) {
      console.error('Error updating branding:', error);
      toast.error(error.message || 'Erro ao atualizar branding');
      throw error;
    }
  };

  const resetToDefaults = async () => {
    if (!user) return;

    try {
      // Apenas admins podem resetar branding da empresa
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      const isAdmin = roleData?.role === 'admin';

      if (!isAdmin) {
        throw new Error('Apenas administradores podem resetar o branding da empresa');
      }

      if (!cachedCompanyId) {
        throw new Error('Nenhuma empresa vinculada a este usuário');
      }

      const { error } = await supabase
        .from('companies')
        .update({
          company_name: defaultBranding.companyName,
          logo_url: defaultBranding.logoUrl,
          primary_color: defaultBranding.primaryColor,
          secondary_color: defaultBranding.secondaryColor,
          accent_color: defaultBranding.accentColor,
          company_tagline: defaultBranding.companyTagline,
          team_photo_url: defaultBranding.teamPhotoUrl,
          mentor_photo_url: defaultBranding.partnerPhotoUrl,
          metrics_json: defaultBranding.metricsJson as any,
          contact_phone: defaultBranding.contactPhone,
          contact_email: defaultBranding.contactEmail,
          contact_whatsapp: defaultBranding.contactWhatsapp,
          feedback_question: defaultBranding.feedbackQuestion,
          authority_quote: defaultBranding.authorityQuote,
          authority_quote_author: defaultBranding.authorityQuoteAuthor,
          authority_quote_role: defaultBranding.authorityQuoteRole,
          contract_company_name: defaultBranding.contractCompanyName,
          contract_cnpj: defaultBranding.contractCnpj,
          contract_address: defaultBranding.contractAddress,
          contract_city: defaultBranding.contractCity,
          contract_cep: defaultBranding.contractCep,
          contract_website: defaultBranding.contractWebsite,
          pdf_intro_text: defaultBranding.pdfIntroText,
          pdf_background_color: defaultBranding.pdfBackgroundColor,
          pdf_accent_color: defaultBranding.pdfAccentColor,
          pdf_logo_url: defaultBranding.pdfLogoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cachedCompanyId);

      if (error) throw error;

      setBranding(defaultBranding);
    } catch (error) {
      console.error('Error resetting branding:', error);
      throw error;
    }
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        isLoading,
        pageContext,
        setPageContext,
        updateBranding,
        resetToDefaults,
        refetchBranding: fetchBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
