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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-details?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user details');
      }

      const data = await response.json();
      
      // Buscar empresa vinculada do usuário via user_companies
      let companyName = '';
      if (data.companyId) {
        const { data: company } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', data.companyId)
          .single();
        
        companyName = company?.company_name || '';
      }

      setUserData({
        fullName: data.fullName || '',
        email: data.email || '',
        role: data.role || 'partner',
        companyName,
      });

      // Buscar empresas disponíveis da tabela companies
      const { data: companies } = await supabase
        .from('companies')
        .select('id, company_name')
        .order('company_name');

      if (companies) {
        setAvailableCompanies(companies.map(c => c.company_name));
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('No session');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            companyName: userData.companyName || null,
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      toast.success('Usuário atualizado com sucesso!');
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar: ' + error.message);
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
