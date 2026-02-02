import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, RotateCcw, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { PersonalDataForm } from '@/components/profile/PersonalDataForm';
import { PasswordUpdateForm } from '@/components/profile/PasswordUpdateForm';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

interface MetricData {
  value: string;
  label: string;
}

const BrandingSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { branding, updateBranding, resetToDefaults, isLoading } = useBranding();
  const [personalData, setPersonalData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  });
  const [formData, setFormData] = useState({
    companyName: branding.companyName,
    logoUrl: branding.logoUrl || '',
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    accentColor: branding.accentColor,
    companyTagline: branding.companyTagline,
    teamPhotoUrl: branding.teamPhotoUrl || '',
    partnerPhotoUrl: branding.partnerPhotoUrl || '',
    metricsJson: branding.metricsJson,
    contactPhone: branding.contactPhone || '',
    contactEmail: branding.contactEmail || '',
    contactWhatsapp: branding.contactWhatsapp || '',
    feedbackQuestion: branding.feedbackQuestion,
    authorityQuote: branding.authorityQuote,
    authorityQuoteAuthor: branding.authorityQuoteAuthor,
    authorityQuoteRole: branding.authorityQuoteRole,
    contractCompanyName: branding.contractCompanyName,
    contractCnpj: branding.contractCnpj,
    contractAddress: branding.contractAddress,
    contractCity: branding.contractCity,
    contractCep: branding.contractCep,
    contractWebsite: branding.contractWebsite,
    pdfIntroText: branding.pdfIntroText,
    pdfBackgroundColor: branding.pdfBackgroundColor,
    pdfAccentColor: branding.pdfAccentColor,
    pdfLogoUrl: branding.pdfLogoUrl || '',
    logoNegativeUrl: branding.logoNegativeUrl || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user) {
      setPersonalData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    setFormData({
      companyName: branding.companyName,
      logoUrl: branding.logoUrl || '',
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      accentColor: branding.accentColor,
      companyTagline: branding.companyTagline,
      teamPhotoUrl: branding.teamPhotoUrl || '',
      partnerPhotoUrl: branding.partnerPhotoUrl || '',
      metricsJson: branding.metricsJson,
      contactPhone: branding.contactPhone || '',
      contactEmail: branding.contactEmail || '',
      contactWhatsapp: branding.contactWhatsapp || '',
      feedbackQuestion: branding.feedbackQuestion,
      authorityQuote: branding.authorityQuote,
      authorityQuoteAuthor: branding.authorityQuoteAuthor,
      authorityQuoteRole: branding.authorityQuoteRole,
      contractCompanyName: branding.contractCompanyName,
      contractCnpj: branding.contractCnpj,
      contractAddress: branding.contractAddress,
      contractCity: branding.contractCity,
      contractCep: branding.contractCep,
      contractWebsite: branding.contractWebsite,
      pdfIntroText: branding.pdfIntroText,
      pdfBackgroundColor: branding.pdfBackgroundColor,
      pdfAccentColor: branding.pdfAccentColor,
      pdfLogoUrl: branding.pdfLogoUrl || '',
      logoNegativeUrl: branding.logoNegativeUrl || '',
    });
  }, [branding]);

  const handleUpdateName = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: personalData.fullName }
      });

      if (error) throw error;

      toast.success('Nome atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating name:', error);
      toast.error('Erro ao atualizar nome');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await handleUpdateName();
      await updateBranding(formData);
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetToDefaults();
      toast.success('Identidade visual restaurada para padrão');
    } catch (error) {
      toast.error('Erro ao restaurar identidade visual');
    } finally {
      setIsResetting(false);
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

  if (isLoading || roleLoading) {
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
          onClick={() => navigate('/settings')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Configurações
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Identidade Visual</h1>
          <p className="text-muted-foreground">Personalize completamente sua marca para apresentações aos clientes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="texts">Textos</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="juridico">Jurídico</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Informações da sua conta</CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalDataForm
                    fullName={personalData.fullName}
                    email={personalData.email}
                    role={isAdmin ? 'admin' : 'partner'}
                    onFullNameChange={(value) => setPersonalData({ ...personalData, fullName: value })}
                    canEditEmail={false}
                    showRole={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Altere sua senha</CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordUpdateForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas da Empresa</CardTitle>
                  <CardDescription>
                    {isAdmin
                      ? 'Configure o nome e slogan da empresa. As cores da apresentação são padrão do sistema.'
                      : 'Você pode personalizar alguns campos. Campos bloqueados são definidos pelo administrador.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      Nome da Empresa (Fantasia)
                      {roleLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        !isAdmin && <Badge variant="outline">Apenas Administradores</Badge>
                      )}
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Nome da sua empresa"
                      disabled={!isAdmin && !roleLoading && user?.email !== 'contato@autoridadeinvestimentos.com.br'}
                    />
                    {!isAdmin && !roleLoading && user?.email !== 'contato@autoridadeinvestimentos.com.br' && (
                      <p className="text-xs text-muted-foreground italic">
                        Contate o administrador para alterar o nome da empresa.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyTagline">
                      Slogan / Tagline
                      {!isAdmin && <Badge className="ml-2" variant="secondary">Editável</Badge>}
                    </Label>
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Logo da Empresa</Label>
                      {!isAdmin && <Badge variant="outline">Apenas Admin</Badge>}
                    </div>
                    <ImageUpload
                      label=""
                      currentImageUrl={formData.logoUrl}
                      onImageChange={(url) => setFormData({ ...formData, logoUrl: url || '' })}
                      folder="logos"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Foto da Equipe</Label>
                      {!isAdmin && <Badge variant="secondary">Editável</Badge>}
                    </div>
                    <ImageUpload
                      label=""
                      currentImageUrl={formData.teamPhotoUrl}
                      onImageChange={(url) => setFormData({ ...formData, teamPhotoUrl: url || '' })}
                      folder="team"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Foto do Parceiro</Label>
                      {!isAdmin && <Badge variant="secondary">Editável</Badge>}
                    </div>
                    <ImageUpload
                      label=""
                      currentImageUrl={formData.partnerPhotoUrl}
                      onImageChange={(url) => setFormData({ ...formData, partnerPhotoUrl: url || '' })}
                      folder="partner"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Logo Negativa (Para fundos escuros)</Label>
                      {!isAdmin && <Badge variant="outline">Apenas Admin</Badge>}
                    </div>
                    <ImageUpload
                      label=""
                      currentImageUrl={formData.logoNegativeUrl}
                      onImageChange={(url) => setFormData({ ...formData, logoNegativeUrl: url || '' })}
                      folder="logos"
                    />
                    <p className="text-xs text-muted-foreground">
                      Versão branca ou clara da sua logo para ser usada na home e em telas de fundo escuro.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Home Preview Section */}
              <Card className="mt-8 border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    Preview da Home (Modo Escuro)
                  </CardTitle>
                  <CardDescription>
                    Veja como sua logo negativa aparecerá na tela inicial do sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-[300px] w-full bg-[#1A3A52] flex flex-col items-center justify-center overflow-hidden">
                    {/* Background decoration from MeetingSelection */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 164, 92, 0.4) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 80%, rgba(201, 164, 92, 0.3) 0%, transparent 50%)`
                      }} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-md text-center px-4">
                      {formData.logoNegativeUrl ? (
                        <img
                          src={formData.logoNegativeUrl}
                          alt="Logo Preview"
                          className="h-16 w-auto object-contain animate-fade-in"
                        />
                      ) : (
                        <div className="h-16 w-48 bg-white/10 rounded flex items-center justify-center text-white/40 text-xs italic">
                          Logo Negativa não configurada
                        </div>
                      )}

                      <div className="space-y-2 mt-4">
                        <h2 className="text-2xl font-bold text-white tracking-wide">
                          Bem-vindo, <span className="text-[#C9A45C]">Usuário Exemplo</span>
                        </h2>
                        <p className="text-sm text-white/70">
                          Selecione qual apresentação deseja acessar
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 w-full mt-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#C9A45C]/20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                    <p className="text-xs text-muted-foreground">
                      Pergunta mostrada na avaliação final
                    </p>
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
                    <p className="text-xs text-muted-foreground">
                      Citação exibida na página de reconhecimento
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="authorityQuoteAuthor">Autor da Citação</Label>
                      <Input
                        id="authorityQuoteAuthor"
                        value={formData.authorityQuoteAuthor}
                        onChange={(e) => setFormData({ ...formData, authorityQuoteAuthor: e.target.value })}
                        placeholder="Seu Nome"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authorityQuoteRole">Cargo do Autor</Label>
                      <Input
                        id="authorityQuoteRole"
                        value={formData.authorityQuoteRole}
                        onChange={(e) => setFormData({ ...formData, authorityQuoteRole: e.target.value })}
                        placeholder="CEO da Empresa"
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
                  <CardDescription>Telefone, email e WhatsApp para apresentações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Telefone</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
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
                      placeholder="5511999999999"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="juridico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Jurídicos</CardTitle>
                  <CardDescription>Informações da empresa para contratos e documentos legais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <Label htmlFor="contractAddress">Endereço Completo</Label>
                    <Input
                      id="contractAddress"
                      value={formData.contractAddress}
                      onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
                      placeholder="Rua, Número, Complemento"
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

                  <div className="space-y-2">
                    <Label htmlFor="pdfIntroText">Texto de Introdução dos PDFs</Label>
                    <Textarea
                      id="pdfIntroText"
                      value={formData.pdfIntroText}
                      onChange={(e) => setFormData({ ...formData, pdfIntroText: e.target.value })}
                      placeholder="Nossa empresa oferece consultoria especializada..."
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Este texto aparecerá na introdução dos relatórios em PDF gerados pelo sistema.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de PDF</CardTitle>
                  <CardDescription>
                    Configure as cores e logo que aparecem nos PDFs gerados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    label="Logo do PDF (ícone/marca)"
                    currentImageUrl={formData.pdfLogoUrl}
                    onImageChange={(url) => setFormData({ ...formData, pdfLogoUrl: url || '' })}
                    folder="pdf-logos"
                  />
                  <p className="text-sm text-muted-foreground -mt-4">
                    Logo que aparece nos slides de apresentação dos PDFs. Pode ser diferente da logo principal.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="pdfBackgroundColor">Cor de Fundo dos Slides</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cor de fundo das seções principais do PDF
                    </p>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        id="pdfBackgroundColor"
                        value={formData.pdfBackgroundColor}
                        onChange={(e) => setFormData({ ...formData, pdfBackgroundColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.pdfBackgroundColor}
                        onChange={(e) => setFormData({ ...formData, pdfBackgroundColor: e.target.value })}
                        className="flex-1"
                        placeholder="#193D32"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pdfAccentColor">Cor de Borda/Accent</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cor das bordas, ícones e destaques do PDF
                    </p>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        id="pdfAccentColor"
                        value={formData.pdfAccentColor}
                        onChange={(e) => setFormData({ ...formData, pdfAccentColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.pdfAccentColor}
                        onChange={(e) => setFormData({ ...formData, pdfAccentColor: e.target.value })}
                        className="flex-1"
                        placeholder="#B78D4A"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurar Padrão
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default BrandingSettings;
