import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, Trash2, UserX, Eye } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import type { Company } from '@/types/company';
import { format } from 'date-fns';

interface MetricData {
  value: string;
  label: string;
}

interface LinkedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const CompanyBrandingEdit = () => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<LinkedUser[]>([]);
  const [showLinkUserDialog, setShowLinkUserDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [linkingUser, setLinkingUser] = useState(false);
  const [unlinkingUserId, setUnlinkingUserId] = useState<string | null>(null);
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
  const [userToUnlink, setUserToUnlink] = useState<LinkedUser | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    logoUrl: '',
    primaryColor: '#1A4764',
    secondaryColor: '#c9a45c',
    accentColor: '#e8f5e8',
    companyTagline: '',
    teamPhotoUrl: '',
    mentorPhotoUrl: '',
    metricsJson: [] as MetricData[],
    contactPhone: '',
    contactEmail: '',
    contactWhatsapp: '',
    feedbackQuestion: '',
    authorityQuote: '',
    authorityQuoteAuthor: '',
    authorityQuoteRole: '',
    contractCompanyName: '',
    contractCnpj: '',
    contractAddress: '',
    contractCity: '',
    contractCep: '',
    contractWebsite: '',
    pdfIntroText: '',
    pdfBackgroundColor: '#193D32',
    pdfAccentColor: '#B78D4A',
    pdfLogoUrl: '',
  });

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/meeting-selection');
      return;
    }

    if (isAdmin && companyId) {
      fetchCompanyData();
      fetchLinkedUsers();
      fetchAvailableUsers();
    }
  }, [companyId, isAdmin, roleLoading, navigate]);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      const company = data as Company;
      setCompany(company);
      
      // Parse metrics_json de Json para MetricData[]
      let parsedMetrics: MetricData[] = [];
      if (company.metrics_json) {
        try {
          parsedMetrics = JSON.parse(JSON.stringify(company.metrics_json)) as MetricData[];
        } catch (e) {
          parsedMetrics = [];
        }
      }

      setFormData({
        companyName: company.company_name || '',
        logoUrl: company.logo_url || '',
        primaryColor: company.primary_color || '#1A4764',
        secondaryColor: company.secondary_color || '#c9a45c',
        accentColor: company.accent_color || '#e8f5e8',
        companyTagline: company.company_tagline || '',
        teamPhotoUrl: company.team_photo_url || '',
        mentorPhotoUrl: company.mentor_photo_url || '',
        metricsJson: parsedMetrics,
        contactPhone: company.contact_phone || '',
        contactEmail: company.contact_email || '',
        contactWhatsapp: company.contact_whatsapp || '',
        feedbackQuestion: company.feedback_question || '',
        authorityQuote: company.authority_quote || '',
        authorityQuoteAuthor: company.authority_quote_author || '',
        authorityQuoteRole: company.authority_quote_role || '',
        contractCompanyName: company.contract_company_name || '',
        contractCnpj: company.contract_cnpj || '',
        contractAddress: company.contract_address || '',
        contractCity: company.contract_city || '',
        contractCep: company.contract_cep || '',
        contractWebsite: company.contract_website || '',
        pdfIntroText: company.pdf_intro_text || '',
        pdfBackgroundColor: company.pdf_background_color || '#193D32',
        pdfAccentColor: company.pdf_accent_color || '#B78D4A',
        pdfLogoUrl: company.pdf_logo_url || '',
      });
    } catch (error: any) {
      console.error('Error fetching company:', error);
      toast.error('Erro ao carregar dados da empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLinkedUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-company-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ companyId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch company users');
      }

      const users = await response.json();
      setLinkedUsers(users);
    } catch (error: any) {
      console.error('Error fetching linked users:', error);
      toast.error('Erro ao carregar usuários vinculados');
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Buscar user_ids vinculados a esta empresa
      const { data: linkedData, error: linkedError } = await supabase
        .from('user_companies')
        .select('user_id')
        .eq('company_id', companyId);

      if (linkedError) throw linkedError;

      const linkedUserIds = linkedData?.map(uc => uc.user_id) || [];

      // Buscar todos os usuários com roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Filtrar apenas os que não estão vinculados
      const availableUserIds = (rolesData || [])
        .filter(u => !linkedUserIds.includes(u.user_id))
        .map(u => u.user_id);

      if (availableUserIds.length === 0) {
        setAvailableUsers([]);
        return;
      }

      // Buscar detalhes dos usuários disponíveis usando a edge function get-company-users
      // mas vamos fazer um fetch simples para os disponíveis
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAvailableUsers([]);
        return;
      }

      // Para usuários disponíveis, vamos buscar diretamente do auth e montar a lista
      const availableUsersPromises = availableUserIds.map(async (userId) => {
        try {
          // Buscar status
          const { data: statusData } = await supabase
            .from('user_account_status')
            .select('is_active')
            .eq('user_id', userId)
            .maybeSingle();

          // Buscar role
          const roleData = rolesData?.find(r => r.user_id === userId);

          return {
            id: userId,
            email: '',
            full_name: 'Usuário',
            role: roleData?.role || 'partner',
            is_active: statusData?.is_active ?? true,
            created_at: new Date().toISOString()
          };
        } catch {
          return null;
        }
      });

      const resolvedUsers = await Promise.all(availableUsersPromises);
      const validUsers = resolvedUsers.filter(u => u !== null) as LinkedUser[];
      
      setAvailableUsers(validUsers);
    } catch (error: any) {
      console.error('Error fetching available users:', error);
      setAvailableUsers([]);
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: formData.companyName,
          logo_url: formData.logoUrl || null,
          primary_color: formData.primaryColor,
          secondary_color: formData.secondaryColor,
          accent_color: formData.accentColor,
          company_tagline: formData.companyTagline || null,
          team_photo_url: formData.teamPhotoUrl || null,
          mentor_photo_url: formData.mentorPhotoUrl || null,
          metrics_json: formData.metricsJson as any,
          contact_phone: formData.contactPhone || null,
          contact_email: formData.contactEmail || null,
          contact_whatsapp: formData.contactWhatsapp || null,
          feedback_question: formData.feedbackQuestion || null,
          authority_quote: formData.authorityQuote || null,
          authority_quote_author: formData.authorityQuoteAuthor || null,
          authority_quote_role: formData.authorityQuoteRole || null,
          contract_company_name: formData.contractCompanyName || null,
          contract_cnpj: formData.contractCnpj || null,
          contract_address: formData.contractAddress || null,
          contract_city: formData.contractCity || null,
          contract_cep: formData.contractCep || null,
          contract_website: formData.contractWebsite || null,
          pdf_intro_text: formData.pdfIntroText || null,
          pdf_background_color: formData.pdfBackgroundColor,
          pdf_accent_color: formData.pdfAccentColor,
          pdf_logo_url: formData.pdfLogoUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', companyId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error updating company:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveChanges();
      toast.success('Branding da empresa atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar branding da empresa');
    }
  };

  const [isOpeningPreview, setIsOpeningPreview] = useState(false);

  const handlePreview = async () => {
    if (!companyId) return;
    
    setIsOpeningPreview(true);
    toast.info('Salvando alterações antes da pré-visualização...');
    
    try {
      await saveChanges();
      toast.success('Alterações salvas!');
      
      // Aguardar 500ms para garantir que o Supabase processou
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const previewUrl = `/meeting-selection?preview=${companyId}`;
      window.open(previewUrl, '_blank');
      toast.success('Preview aberto em nova aba!');
    } catch (error) {
      toast.error('Erro ao salvar alterações. Preview não aberto.');
      console.error(error);
    } finally {
      setIsOpeningPreview(false);
    }
  };

  const handleLinkUser = async () => {
    if (!selectedUserId) {
      toast.error('Selecione um usuário');
      return;
    }

    setLinkingUser(true);
    try {
      const { error } = await supabase
        .from('user_companies')
        .upsert({
          user_id: selectedUserId,
          company_id: companyId!,
        });

      if (error) throw error;

      toast.success('Usuário vinculado com sucesso!');
      setShowLinkUserDialog(false);
      setSelectedUserId('');
      fetchLinkedUsers();
      fetchAvailableUsers();
    } catch (error: any) {
      console.error('Error linking user:', error);
      toast.error('Erro ao vincular usuário');
    } finally {
      setLinkingUser(false);
    }
  };

  const handleOpenUnlinkDialog = (user: LinkedUser) => {
    setUserToUnlink(user);
    setShowUnlinkDialog(true);
  };

  const handleUnlinkUser = async () => {
    if (!userToUnlink) return;

    setUnlinkingUserId(userToUnlink.id);
    try {
      const { error } = await supabase
        .from('user_companies')
        .delete()
        .eq('user_id', userToUnlink.id)
        .eq('company_id', companyId!);

      if (error) throw error;

      toast.success('Usuário desvinculado com sucesso!');
      setShowUnlinkDialog(false);
      setUserToUnlink(null);
      fetchLinkedUsers();
      fetchAvailableUsers();
    } catch (error: any) {
      console.error('Error unlinking user:', error);
      toast.error('Erro ao desvincular usuário');
    } finally {
      setUnlinkingUserId(null);
    }
  };

  const updateMetric = (index: number, field: 'value' | 'label', value: string) => {
    const newMetrics = [...formData.metricsJson];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setFormData({ ...formData, metricsJson: newMetrics });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metricsJson: [...formData.metricsJson, { value: '', label: '' }]
    });
  };

  const removeMetric = (index: number) => {
    const newMetrics = formData.metricsJson.filter((_, i) => i !== index);
    setFormData({ ...formData, metricsJson: newMetrics });
  };

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/companies')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Empresas
        </Button>
        
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Editar Branding: {formData.companyName}
            </h1>
            <p className="text-muted-foreground">
              Configure todos os aspectos visuais e de conteúdo da empresa
            </p>
          </div>
          
          <Button
            type="button"
            onClick={handlePreview}
            disabled={isOpeningPreview || isSaving}
            variant="outline"
            className="gap-2"
          >
            {isOpeningPreview ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparando preview...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Pré-visualizar
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="texts">Textos</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="juridico">Jurídico</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Nome da empresa e slogan. As cores são padrão do sistema.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyTagline">Slogan / Tagline</Label>
                    <Textarea
                      id="companyTagline"
                      value={formData.companyTagline}
                      onChange={(e) => setFormData({ ...formData, companyTagline: e.target.value })}
                      placeholder="Transformando patrimônio em renda..."
                      rows={3}
                    />
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Imagens da Marca</CardTitle>
                  <CardDescription>Logo, foto da equipe e foto do mentor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    label="Logo da Empresa"
                    currentImageUrl={formData.logoUrl}
                    onImageChange={(url) => setFormData({ ...formData, logoUrl: url || '' })}
                    folder="logos"
                  />

                  <ImageUpload
                    label="Foto da Equipe"
                    currentImageUrl={formData.teamPhotoUrl}
                    onImageChange={(url) => setFormData({ ...formData, teamPhotoUrl: url || '' })}
                    folder="team"
                  />

                  <ImageUpload
                    label="Foto do Parceiro"
                    currentImageUrl={formData.mentorPhotoUrl}
                    onImageChange={(url) => setFormData({ ...formData, mentorPhotoUrl: url || '' })}
                    folder="partner"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Autoridade</CardTitle>
                  <CardDescription>Defina suas conquistas e números de destaque</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.metricsJson.map((metric, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Valor</Label>
                        <Input
                          value={metric.value}
                          onChange={(e) => updateMetric(index, 'value', e.target.value)}
                          placeholder="R$ 2.4Bi"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={metric.label}
                          onChange={(e) => updateMetric(index, 'label', e.target.value)}
                          placeholder="Em créditos gerenciados"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeMetric(index)}
                        disabled={formData.metricsJson.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addMetric}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Métrica
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="texts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Textos Personalizáveis</CardTitle>
                  <CardDescription>Pergunta de feedback e citação de autoridade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="feedbackQuestion">Pergunta de Feedback</Label>
                    <Input
                      id="feedbackQuestion"
                      value={formData.feedbackQuestion}
                      onChange={(e) => setFormData({ ...formData, feedbackQuestion: e.target.value })}
                      placeholder="De 0 a 10 quanto você gostou do nosso atendimento?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorityQuote">Citação de Autoridade</Label>
                    <Textarea
                      id="authorityQuote"
                      value={formData.authorityQuote}
                      onChange={(e) => setFormData({ ...formData, authorityQuote: e.target.value })}
                      placeholder="A credibilidade conquistada junto à mídia..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="authorityQuoteAuthor">Autor da Citação</Label>
                      <Input
                        id="authorityQuoteAuthor"
                        value={formData.authorityQuoteAuthor}
                        onChange={(e) => setFormData({ ...formData, authorityQuoteAuthor: e.target.value })}
                        placeholder="Nome do autor"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authorityQuoteRole">Cargo do Autor</Label>
                      <Input
                        id="authorityQuoteRole"
                        value={formData.authorityQuoteRole}
                        onChange={(e) => setFormData({ ...formData, authorityQuoteRole: e.target.value })}
                        placeholder="CEO, Diretor..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                  <CardDescription>Telefone, e-mail e WhatsApp</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">E-mail</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="contato@empresa.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactWhatsapp">WhatsApp</Label>
                    <Input
                      id="contactWhatsapp"
                      value={formData.contactWhatsapp}
                      onChange={(e) => setFormData({ ...formData, contactWhatsapp: e.target.value })}
                      placeholder="5511987654321"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="juridico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Jurídicas</CardTitle>
                  <CardDescription>Dados da empresa para contratos e documentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractCompanyName">Razão Social</Label>
                    <Input
                      id="contractCompanyName"
                      value={formData.contractCompanyName}
                      onChange={(e) => setFormData({ ...formData, contractCompanyName: e.target.value })}
                      placeholder="EMPRESA LTDA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractCnpj">CNPJ</Label>
                    <Input
                      id="contractCnpj"
                      value={formData.contractCnpj}
                      onChange={(e) => setFormData({ ...formData, contractCnpj: e.target.value })}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractAddress">Endereço</Label>
                    <Input
                      id="contractAddress"
                      value={formData.contractAddress}
                      onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                      placeholder="Rua Exemplo, 123"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractCity">Cidade/Estado</Label>
                      <Input
                        id="contractCity"
                        value={formData.contractCity}
                        onChange={(e) => setFormData({ ...formData, contractCity: e.target.value })}
                        placeholder="São Paulo, SP"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contractCep">CEP</Label>
                      <Input
                        id="contractCep"
                        value={formData.contractCep}
                        onChange={(e) => setFormData({ ...formData, contractCep: e.target.value })}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractWebsite">Website</Label>
                    <Input
                      id="contractWebsite"
                      value={formData.contractWebsite}
                      onChange={(e) => setFormData({ ...formData, contractWebsite: e.target.value })}
                      placeholder="www.empresa.com.br"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de PDF</CardTitle>
                  <CardDescription>Personalize a aparência dos PDFs gerados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="pdfIntroText">Texto de Introdução</Label>
                    <Textarea
                      id="pdfIntroText"
                      value={formData.pdfIntroText}
                      onChange={(e) => setFormData({ ...formData, pdfIntroText: e.target.value })}
                      placeholder="Nossa empresa oferece consultoria especializada..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pdfBackgroundColor">Cor de Fundo PDF</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pdfBackgroundColor"
                          type="color"
                          value={formData.pdfBackgroundColor}
                          onChange={(e) => setFormData({ ...formData, pdfBackgroundColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.pdfBackgroundColor}
                          onChange={(e) => setFormData({ ...formData, pdfBackgroundColor: e.target.value })}
                          placeholder="#193D32"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdfAccentColor">Cor de Destaque PDF</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pdfAccentColor"
                          type="color"
                          value={formData.pdfAccentColor}
                          onChange={(e) => setFormData({ ...formData, pdfAccentColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.pdfAccentColor}
                          onChange={(e) => setFormData({ ...formData, pdfAccentColor: e.target.value })}
                          placeholder="#B78D4A"
                        />
                      </div>
                    </div>
                  </div>

                  <ImageUpload
                    label="Logo para PDF"
                    currentImageUrl={formData.pdfLogoUrl}
                    onImageChange={(url) => setFormData({ ...formData, pdfLogoUrl: url || '' })}
                    folder="pdf-logos"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Usuários Vinculados</CardTitle>
                      <CardDescription>
                        Gerencie os usuários que pertencem a esta empresa ({linkedUsers.length} usuário{linkedUsers.length !== 1 ? 's' : ''})
                      </CardDescription>
                    </div>
                    <Button onClick={() => setShowLinkUserDialog(true)} type="button">
                      <Plus className="mr-2 h-4 w-4" />
                      Vincular Usuário
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vinculado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linkedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Nenhum usuário vinculado a esta empresa
                          </TableCell>
                        </TableRow>
                      ) : (
                        linkedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role === 'admin' ? 'Admin' : 'Parceiro'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                {user.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(user.created_at), 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleOpenUnlinkDialog(user)}
                                disabled={unlinkingUserId === user.id}
                              >
                                {unlinkingUserId === user.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Desvinculando...
                                  </>
                                ) : (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Desvincular
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/companies')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>

      {/* Dialog para vincular usuário */}
      <Dialog open={showLinkUserDialog} onOpenChange={setShowLinkUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Usuário à Empresa</DialogTitle>
            <DialogDescription>
              Selecione um usuário para vincular a esta empresa. O usuário terá acesso ao branding configurado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Não há usuários disponíveis para vincular
                    </div>
                  ) : (
                    availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkUserDialog(false)} type="button" disabled={linkingUser}>
              Cancelar
            </Button>
            <Button onClick={handleLinkUser} disabled={!selectedUserId || linkingUser} type="button">
              {linkingUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vinculando...
                </>
              ) : (
                'Vincular'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação para desvincular */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desvincular <strong>{userToUnlink?.full_name}</strong> ({userToUnlink?.email}) desta empresa?
              O usuário perderá acesso ao branding configurado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!unlinkingUserId}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlinkUser} disabled={!!unlinkingUserId}>
              {unlinkingUserId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desvinculando...
                </>
              ) : (
                'Desvincular'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyBrandingEdit;
