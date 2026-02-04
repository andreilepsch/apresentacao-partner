import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DynamicLogo from '@/components/DynamicLogo';
import { useUserRole } from '@/hooks/useUserRole';

const EditUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    role: 'partner' as 'admin' | 'partner',
    companyName: '',
  });

  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (userId && isAdmin) {
      fetchUserData();
    }
  }, [userId, isAdmin]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      if (!userId) return;

      // 1. Buscar Perfil (Nome, Email)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Não lançar erro aqui, tentar buscar outros dados
      }

      // 2. Buscar Role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // 3. Buscar Empresa Vinculada
      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userId)
        .maybeSingle();

      let companyName = '';
      if (userCompany?.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', userCompany.company_id)
          .maybeSingle();
        companyName = company?.company_name || '';
      }

      setUserData({
        fullName: profile?.full_name || '',
        email: profile?.email || '',
        role: (roleData?.role as 'admin' | 'partner') || 'partner',
        companyName,
      });

      // 4. Buscar lista de empresas para o dropdown
      const { data: companies } = await supabase
        .from('companies')
        .select('id, company_name')
        .order('company_name');

      if (companies) {
        // Remover duplicatas e valores vazios
        const uniqueCompanies = Array.from(new Set(companies.map(c => c.company_name).filter(Boolean)));
        setAvailableCompanies(uniqueCompanies);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!userId) return;

      const { error } = await supabase.rpc('admin_update_user_profile', {
        _user_id: userId,
        _full_name: userData.fullName,
        _email: userData.email,
        _role: userData.role,
        _company_name: userData.companyName
      });

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso!');
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar: ' + (error.message || error.error_description || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  if (roleLoading || !isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <DynamicLogo className="h-8" variant="light" />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Editar Usuário
          </h1>
          <p className="text-muted-foreground">
            Gerencie dados pessoais e vinculação a empresas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={userData.fullName}
                onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="role">Perfil</Label>
              <Select
                value={userData.role}
                onValueChange={(value: 'admin' | 'partner') =>
                  setUserData({ ...userData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="partner">Parceiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company">Empresa Vinculada</Label>
              <div className="space-y-2">
                <Select
                  value={userData.companyName || undefined}
                  onValueChange={(value) =>
                    setUserData({ ...userData, companyName: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sem empresa vinculada" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userData.companyName && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUserData({ ...userData, companyName: '' })}
                  >
                    Remover vinculação
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Vincule este usuário a uma empresa existente. As configurações de branding da empresa serão aplicadas automaticamente.
              </p>
            </div>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditUserProfile;
