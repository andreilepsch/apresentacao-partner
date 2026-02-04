import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { PageContext } from '@/types/pageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, RotateCcw, ArrowLeft, Plus, Trash2, FileText, ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { useMeeting2PDFGenerator } from '@/hooks/useMeeting2PDFGenerator';
import { Badge } from '@/components/ui/badge';
import { MediaCard } from '@/contexts/BrandingContext';

import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { maskPhone, maskCnpj, maskCep, maskWhatsapp } from '@/utils/masks';

interface MetricData {
  value: string;
  label: string;
}

const BrandingSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { branding, updateBranding, resetToDefaults, isLoading, setPageContext } = useBranding();
  const { generateMeeting2PDF } = useMeeting2PDFGenerator();

  useEffect(() => {
    setPageContext(PageContext.PRESENTATION);
  }, [setPageContext]);


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
      pdfLogoUrl: branding.pdfLogoUrl || '',
      logoNegativeUrl: branding.logoNegativeUrl || '',
      mediaJson: branding.mediaJson,
    });
  }, [branding]);

  const updateMediaCard = (index: number, field: keyof MediaCard, value: string) => {
    const newMedia = [...formData.mediaJson];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setFormData({ ...formData, mediaJson: newMedia });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
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
          <Tabs defaultValue="images" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="texts">Textos</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="juridico">Jurídico</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>



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
                      {!isAdmin && <Badge variant="secondary">Editável</Badge>}
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
                      {!isAdmin && <Badge variant="secondary">Editável</Badge>}
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
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="recognition" className="w-full">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="recognition" className="flex-1">Reconhecimento</TabsTrigger>
                      <TabsTrigger value="feedback" className="flex-1">Perguntas e Feedback</TabsTrigger>
                    </TabsList>

                    <TabsContent value="feedback" className="space-y-6">
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
                    </TabsContent>

                    <TabsContent value="recognition" className="space-y-8">
                      {/* Citação Section */}
                      <div className="space-y-6 border-b pb-8">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Citação de Autoridade</h3>
                          <p className="text-sm text-muted-foreground mb-4">Frase destacada de autoridade ou do parceiro</p>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="authorityQuote">Citação</Label>
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
                          </div>
                        </div>
                      </div>

                      {/* Media Section */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Na Mídia</h3>
                          <p className="text-sm text-muted-foreground mb-4">Artigos e notícias destacadas (Área de 3 colunas)</p>

                          <div className="space-y-8">
                            {formData.mediaJson && formData.mediaJson.map((card, index) => (
                              <div key={card.id || index} className="p-4 border rounded-lg space-y-4 bg-accent/5">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-base">Card {index + 1}</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Nome do Veículo (Header)</Label>
                                    <Input
                                      value={card.outletName}
                                      onChange={(e) => updateMediaCard(index, 'outletName', e.target.value)}
                                      placeholder="Ex: VEJA SÃO PAULO"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Cor do Fundo do Header</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        value={card.headerColor}
                                        onChange={(e) => updateMediaCard(index, 'headerColor', e.target.value)}
                                        className="w-12 h-10 p-1"
                                      />
                                      <Input
                                        value={card.headerColor}
                                        onChange={(e) => updateMediaCard(index, 'headerColor', e.target.value)}
                                        placeholder="#000000"
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Cor do Texto do Header</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        value={card.headerTextColor}
                                        onChange={(e) => updateMediaCard(index, 'headerTextColor', e.target.value)}
                                        className="w-12 h-10 p-1"
                                      />
                                      <Input
                                        value={card.headerTextColor}
                                        onChange={(e) => updateMediaCard(index, 'headerTextColor', e.target.value)}
                                        placeholder="#FFFFFF"
                                        className="flex-1"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Título da Matéria</Label>
                                  <Input
                                    value={card.title}
                                    onChange={(e) => updateMediaCard(index, 'title', e.target.value)}
                                    placeholder="Título principal do card"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Descrição / Resumo</Label>
                                  <Textarea
                                    value={card.description}
                                    onChange={(e) => updateMediaCard(index, 'description', e.target.value)}
                                    placeholder="Texto do corpo do card"
                                    rows={4}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Imagem (Opcional)</Label>
                                  <ImageUpload
                                    label="Imagem da Matéria"
                                    currentImageUrl={card.imageUrl || null}
                                    onImageChange={(url) => updateMediaCard(index, 'imageUrl', url || '')}
                                    folder="media"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
                      onChange={(e) => setFormData({ ...formData, contactPhone: maskPhone(e.target.value) })}
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
                      onChange={(e) => setFormData({ ...formData, contactWhatsapp: maskWhatsapp(e.target.value) })}
                      placeholder="+55 (11) 99999-9999"
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
                      onChange={(e) => setFormData({ ...formData, contractCnpj: maskCnpj(e.target.value) })}
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
                        onChange={(e) => setFormData({ ...formData, contractCep: maskCep(e.target.value) })}
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

                  <div className="space-y-2 pt-4 border-t border-border mt-4">
                    <Label>Teste de Geração</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gere um PDF de teste para visualizar como suas configurações de cores e logo serão aplicadas.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generateMeeting2PDF({
                        clientName: "Cliente Exemplo da Silva",
                        selectedCredit: {
                          creditValue: "R$ 500.000,00",
                          installment: "R$ 2.500,00",
                          estimatedIncome: "R$ 15.000,00",
                          patrimony: "R$ 1.500.000,00"
                        },
                        administrator: {
                          name: "Administradora Exemplo",
                          highlights: ["Taxas competitivas", "Processo ágil", "Tradição no mercado"],
                          trustIndicators: [
                            { number: "40+", label: "Anos de história" },
                            { number: "100k", label: "Clientes ativos" }
                          ]
                        },
                        commitments: [
                          { title: "Envio de Documentos", description: "RG, CPF e Comprovante de Residência", icon: "file-text" },
                          { title: "Pagamento da 1ª Parcela", description: "Boleto bancário", icon: "credit-card" }
                        ],
                        cycles: []
                      }, {
                        // Pass current form data as branding override
                        ...branding,
                        companyName: formData.companyName,
                        pdfLogoUrl: formData.pdfLogoUrl,
                        logoUrl: formData.logoUrl,
                        pdfBackgroundColor: formData.pdfBackgroundColor,
                        pdfAccentColor: formData.pdfAccentColor,
                        contractCnpj: formData.contractCnpj,
                        contractWebsite: formData.contractWebsite,
                        companyTagline: formData.companyTagline,
                        contactPhone: formData.contactPhone,
                        contactEmail: formData.contactEmail,
                        contactWhatsapp: formData.contactWhatsapp,
                        pdfIntroText: formData.pdfIntroText
                      })}
                      className="w-full"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Baixar PDF de Teste
                    </Button>
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
