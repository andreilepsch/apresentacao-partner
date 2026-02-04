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
import { Loader2, ArrowLeft, User, Building2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PersonalDataForm } from '@/components/profile/PersonalDataForm';
import { PasswordUpdateForm } from '@/components/profile/PasswordUpdateForm';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

const PersonalSettings = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { isAdmin, isLoading: roleLoading } = useUserRole();
    const { branding, updateBranding, isLoading, setPageContext } = useBranding();

    useEffect(() => {
        setPageContext(PageContext.PRESENTATION);
    }, [setPageContext]);

    const [personalData, setPersonalData] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || ''
    });

    const [formData, setFormData] = useState({
        companyName: branding.companyName,
        companyTagline: branding.companyTagline,
    });

    const [isSaving, setIsSaving] = useState(false);

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
            companyTagline: branding.companyTagline,
        });
    }, [branding]);

    const handleUpdateName = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: personalData.fullName }
            });

            if (error) throw error;
            // Sucesso silencioso aqui, pois será coberto pelo toast final ou individual se necessário
        } catch (error: any) {
            console.error('Error updating name:', error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await handleUpdateName();
            await updateBranding(formData);
            toast.success('Dados pessoais atualizados com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar dados');
        } finally {
            setIsSaving(false);
        }
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/settings')}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Configurações
                </Button>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Dados Pessoais</h1>
                    <p className="text-muted-foreground">Gerencie suas informações pessoais e da empresa</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Perfil
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Segurança
                            </TabsTrigger>
                            <TabsTrigger value="company" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Básico da Empresa
                            </TabsTrigger>
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


                        </TabsContent>

                        <TabsContent value="security" className="space-y-6">
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

                        <TabsContent value="company" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações Básicas da Empresa</CardTitle>
                                    <CardDescription>
                                        {isAdmin
                                            ? 'Configure o nome e slogan da empresa.'
                                            : 'Personalize o nome da sua empresa e o slogan para suas apresentações.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="flex items-center gap-2">
                                            Nome da Empresa (Fantasia)
                                            {!isAdmin && <Badge variant="secondary">Editável</Badge>}
                                        </Label>
                                        <Input
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            placeholder="Nome da sua empresa"
                                        />
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
                    </Tabs>

                    <div className="flex justify-end mt-8">
                        <Button type="submit" size="lg" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default PersonalSettings;
