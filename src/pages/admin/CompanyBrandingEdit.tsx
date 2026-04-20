import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, Trash2, UserX, Eye } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import type { Company } from '@/types/company';

interface MetricData {
  value: string;
  label: string;
}

interface LinkedUser {
  clerk_user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const CompanyBrandingEdit = () => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const { isAdmin: isUserAdmin, loading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [linkedUsers, setLinkedUsers] = useState<LinkedUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
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
    if (!authLoading && !isUserAdmin) {
      toast.error('Acesso negado.');
      navigate('/');
      return;
    }

    if (isUserAdmin && companyId) {
      fetchData();
    }
  }, [companyId, isUserAdmin, authLoading, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [companyData, usersData] = await Promise.all([
        api.get(`/companies/${companyId}`),
        api.get('/admin/users')
      ]);

      setCompany(companyData);
      
      // Filter linked vs available users
      const linked = usersData.filter((u: any) => u.company_id === companyId);
      const available = usersData.filter((u: any) => u.company_id !== companyId && u.status === 'approved');
      
      setLinkedUsers(linked as LinkedUser[]);
      setAvailableUsers(available);

      setFormData({
        companyName: companyData.company_name || '',
        logoUrl: companyData.logo_url || '',
        primaryColor: companyData.primary_color || '#1A4764',
        secondaryColor: companyData.secondary_color || '#c9a45c',
        accentColor: companyData.accent_color || '#e8f5e8',
        companyTagline: companyData.company_tagline || '',
        teamPhotoUrl: companyData.team_photo_url || '',
        mentorPhotoUrl: companyData.mentor_photo_url || '',
        metricsJson: Array.isArray(companyData.metrics_json) ? companyData.metrics_json : [],
        contactPhone: companyData.contact_phone || '',
        contactEmail: companyData.contact_email || '',
        contactWhatsapp: companyData.contact_whatsapp || '',
        feedbackQuestion: companyData.feedback_question || '',
        authorityQuote: companyData.authority_quote || '',
        authorityQuoteAuthor: companyData.authority_quote_author || '',
        authorityQuoteRole: companyData.authority_quote_role || '',
        contractCompanyName: companyData.contract_company_name || '',
        contractCnpj: companyData.contract_cnpj || '',
        contractAddress: companyData.contract_address || '',
        contractCity: companyData.contract_city || '',
        contractCep: companyData.contract_cep || '',
        contractWebsite: companyData.contract_website || '',
        pdfIntroText: companyData.pdf_intro_text || '',
        pdfBackgroundColor: companyData.pdf_background_color || '#193D32',
        pdfAccentColor: companyData.pdf_accent_color || '#B78D4A',
        pdfLogoUrl: companyData.pdf_logo_url || '',
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await api.put(`/companies/${companyId}`, {
        company_name: formData.companyName,
        logo_url: formData.logoUrl || null,
        primary_color: formData.primaryColor,
        secondary_color: formData.secondaryColor,
        accent_color: formData.accentColor,
        company_tagline: formData.companyTagline || null,
        team_photo_url: formData.teamPhotoUrl || null,
        mentor_photo_url: formData.mentorPhotoUrl || null,
        metrics_json: formData.metricsJson,
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
      });
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
      toast.success('Branding atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar!');
    }
  };

  const handlePreview = async () => {
    if (!companyId) return;
    try {
      await saveChanges();
      window.open(`/meeting-selection?preview=${companyId}`, '_blank');
    } catch (error) {
      toast.error('Erro ao salvar para preview');
    }
  };

  const handleLinkUser = async () => {
    if (!selectedUserId) return;
    setLinkingUser(true);
    try {
      await api.put(`/admin/users/${selectedUserId}`, {
        company_id: companyId
      });
      toast.success('Usuário vinculado!');
      setShowLinkUserDialog(false);
      setSelectedUserId('');
      fetchData();
    } catch (error) {
      toast.error('Erro ao vincular');
    } finally {
      setLinkingUser(false);
    }
  };

  const handleUnlinkUser = async () => {
    if (!userToUnlink) return;
    setUnlinkingUserId(userToUnlink.clerk_user_id);
    try {
      await api.put(`/admin/users/${userToUnlink.clerk_user_id}`, {
        company_id: null
      });
      toast.success('Usuário desvinculado!');
      setShowUnlinkDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao desvincular');
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
    setFormData({ ...formData, metricsJson: [...formData.metricsJson, { value: '', label: '' }] });
  };

  const removeMetric = (index: number) => {
    const newMetrics = formData.metricsJson.filter((_, i) => i !== index);
    setFormData({ ...formData, metricsJson: newMetrics });
  };

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/admin/companies')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Empresas
        </Button>
        
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Editar Branding: {formData.companyName}</h1>
            <p className="text-muted-foreground">Configure os aspectos visuais e de conteúdo da empresa</p>
          </div>
          <Button onClick={handlePreview} variant="outline" className="gap-2">
            <Eye className="w-4 h-4" /> Pré-visualizar
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 lg:grid-cols-8">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="texts">Textos</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="juridico">Jurídico</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader><CardTitle>Informações Básicas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Slogan</Label>
                    <Textarea value={formData.companyTagline} onChange={e => setFormData({ ...formData, companyTagline: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader><CardTitle>Imagens da Marca</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload label="Logo" currentImageUrl={formData.logoUrl} onImageChange={url => setFormData({ ...formData, logoUrl: url || '' })} folder="logos" />
                  <ImageUpload label="Foto Equipe" currentImageUrl={formData.teamPhotoUrl} onImageChange={url => setFormData({ ...formData, teamPhotoUrl: url || '' })} folder="team" />
                  <ImageUpload label="Foto Mentor" currentImageUrl={formData.mentorPhotoUrl} onImageChange={url => setFormData({ ...formData, mentorPhotoUrl: url || '' })} folder="partner" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card>
                <CardHeader><CardTitle>Métricas</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {formData.metricsJson.map((m, i) => (
                    <div key={i} className="flex gap-4">
                      <Input value={m.value} onChange={e => updateMetric(i, 'value', e.target.value)} placeholder="Valor" />
                      <Input value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} placeholder="Rótulo" />
                      <Button type="button" variant="destructive" onClick={() => removeMetric(i)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addMetric} className="w-full">Adicionar Métrica</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="texts">
               <Card>
                <CardHeader><CardTitle>Citação e Feedback</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Citação de Autoridade</Label>
                    <Textarea value={formData.authorityQuote} onChange={e => setFormData({ ...formData, authorityQuote: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Autor" value={formData.authorityQuoteAuthor} onChange={e => setFormData({ ...formData, authorityQuoteAuthor: e.target.value })} />
                    <Input placeholder="Cargo" value={formData.authorityQuoteRole} onChange={e => setFormData({ ...formData, authorityQuoteRole: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader><CardTitle>Contato</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Telefone" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} />
                  <Input placeholder="Email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
                  <Input placeholder="WhatsApp" value={formData.contactWhatsapp} onChange={e => setFormData({ ...formData, contactWhatsapp: e.target.value })} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="juridico">
              <Card>
                <CardHeader><CardTitle>Jurídico</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="CNPJ" value={formData.contractCnpj} onChange={e => setFormData({ ...formData, contractCnpj: e.target.value })} />
                  <Input placeholder="Endereço" value={formData.contractAddress} onChange={e => setFormData({ ...formData, contractAddress: e.target.value })} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf">
              <Card>
                <CardHeader><CardTitle>Configurações de PDF</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cor de Fundo</Label>
                      <Input type="color" value={formData.pdfBackgroundColor} onChange={e => setFormData({ ...formData, pdfBackgroundColor: e.target.value })} />
                    </div>
                    <div>
                      <Label>Cor de Destaque</Label>
                      <Input type="color" value={formData.pdfAccentColor} onChange={e => setFormData({ ...formData, pdfAccentColor: e.target.value })} />
                    </div>
                  </div>
                  <ImageUpload label="Logo PDF" currentImageUrl={formData.pdfLogoUrl} onImageChange={url => setFormData({ ...formData, pdfLogoUrl: url || '' })} folder="pdf" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Usuários Vinculados</CardTitle>
                      <CardDescription>Usuários que podem ver este branding</CardDescription>
                    </div>
                    <Button type="button" onClick={() => setShowLinkUserDialog(true)} disabled={availableUsers.length === 0}><Plus className="mr-2 h-4 w-4" /> Vincular Usuário</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {linkedUsers.map(u => (
                        <TableRow key={u.clerk_user_id}>
                          <TableCell className="font-medium">{u.full_name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell className="text-right">
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenUnlinkDialog(u)} disabled={unlinkingUserId === u.clerk_user_id} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/companies')}>Cancelar</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar Todas as Alterações'}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showLinkUserDialog} onOpenChange={setShowLinkUserDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Vincular Usuário</DialogTitle></DialogHeader>
          <div className="py-4">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger><SelectValue placeholder="Selecione um usuário" /></SelectTrigger>
              <SelectContent>
                {availableUsers.map(u => (
                  <SelectItem key={u.clerk_user_id} value={u.clerk_user_id}>{u.full_name} ({u.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkUserDialog(false)}>Cancelar</Button>
            <Button onClick={handleLinkUser} disabled={linkingUser || !selectedUserId}>Vincular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desvincular Usuário?</AlertDialogTitle>
            <AlertDialogDescription>O usuário perderá acesso a este branding.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlinkUser} className="bg-red-600">Sim, Desvincular</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyBrandingEdit;
