import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import DynamicLogo from '@/components/DynamicLogo';
import { useAuthContext } from '@/contexts/AuthContext';

interface Company {
  id: string;
  company_name: string;
}

const EditUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isAdmin: isUserAdmin, loading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    role: 'partner' as 'admin' | 'partner',
    companyId: '',
    isActive: true
  });

  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (!authLoading && !isUserAdmin) {
      navigate('/');
    }
  }, [isUserAdmin, authLoading, navigate]);

  useEffect(() => {
    if (userId && isUserAdmin) {
      fetchData();
    }
  }, [userId, isUserAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userId) return;

      const [users, companies] = await Promise.all([
        api.get('/admin/users'),
        api.get('/companies')
      ]);

      const user = users.find((u: any) => u.clerk_user_id === userId);
      if (user) {
        setUserData({
          fullName: user.full_name || '',
          email: user.email || '',
          role: user.role || 'partner',
          companyId: user.company_id || '',
          isActive: user.is_active ?? true
        });
      }

      setAvailableCompanies(companies);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!userId) return;

      await api.put(`/admin/users/${userId}`, {
        full_name: userData.fullName,
        role: userData.role,
        company_id: userData.companyId || null,
        is_active: userData.isActive
      });

      toast.success('Usuário atualizado com sucesso!');
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error('Erro ao salvar usuário');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || (isUserAdmin && loading)) {
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
              <Label htmlFor="email">Email (Apenas Visualização)</Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                disabled
                className="bg-muted"
                readOnly
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
                  value={userData.companyId || "none"}
                  onValueChange={(value) =>
                    setUserData({ ...userData, companyId: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {availableCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status da Conta</Label>
              <Select
                value={userData.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setUserData({ ...userData, isActive: value === "active" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
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
