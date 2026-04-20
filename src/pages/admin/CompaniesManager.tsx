import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, Edit, Users, ArrowLeft, RefreshCw, Search, Filter, UserX, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import DynamicLogo from '@/components/DynamicLogo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Company } from '@/types/company';

interface CompanyWithUsers extends Company {
  user_count: number;
}

const CompaniesManager = () => {
  const navigate = useNavigate();
  const { isAdmin: isUserAdmin, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'users-asc' | 'users-desc'>('name-asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'with-users' | 'without-users'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');
  
  const [selectedCompanyToToggle, setSelectedCompanyToToggle] = useState<CompanyWithUsers | null>(null);
  const [showToggleCompanyDialog, setShowToggleCompanyDialog] = useState(false);
  const [togglingCompanyId, setTogglingCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isUserAdmin) {
      navigate('/');
    }
  }, [isUserAdmin, authLoading, navigate]);

  const fetchCompaniesData = async () => {
    setLoading(true);
    try {
      const [companiesData, usersData] = await Promise.all([
        api.get('/companies'),
        api.get('/admin/users')
      ]);

      // Calculate user counts per company
      const countMap: Record<string, number> = {};
      usersData.forEach((u: any) => {
        if (u.company_id) {
          countMap[u.company_id] = (countMap[u.company_id] || 0) + 1;
        }
      });

      const companiesWithCounts = companiesData.map((company: any) => ({
        ...company,
        user_count: countMap[company.id] || 0,
      })) as CompanyWithUsers[];

      setCompanies(companiesWithCounts);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Erro ao carregar empresas',
        description: 'Não foi possível carregar a lista de empresas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      fetchCompaniesData();
    }
  }, [isUserAdmin]);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      toast({ title: 'Erro', description: 'Insira um nome para a empresa.', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      await api.post('/companies', { company_name: newCompanyName.trim() });
      toast({ title: 'Empresa criada!', description: 'A nova empresa foi criada com sucesso.' });
      setShowCreateDialog(false);
      setNewCompanyName('');
      fetchCompaniesData();
    } catch (error) {
      toast({ title: 'Erro ao criar empresa', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleEditCompany = (companyId: string) => {
    navigate(`/admin/company-branding/${companyId}`);
  };

  const handleToggleCompanyStatus = (company: CompanyWithUsers) => {
    setSelectedCompanyToToggle(company);
    setShowToggleCompanyDialog(true);
  };

  const confirmToggleCompany = async () => {
    if (!selectedCompanyToToggle) return;
    setTogglingCompanyId(selectedCompanyToToggle.id);
    try {
      await api.put(`/companies/${selectedCompanyToToggle.id}`, {
        is_active: !selectedCompanyToToggle.is_active
      });
      
      toast({ title: selectedCompanyToToggle.is_active ? 'Empresa inativada' : 'Empresa reativada' });
      fetchCompaniesData();
      setShowToggleCompanyDialog(false);
      setSelectedCompanyToToggle(null);
    } catch (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } finally {
      setTogglingCompanyId(null);
    }
  };

  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    if (searchTerm.trim()) {
      result = result.filter(company => 
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus === 'with-users') {
      result = result.filter(company => company.user_count > 0);
    } else if (filterStatus === 'without-users') {
      result = result.filter(company => company.user_count === 0);
    }

    if (filterActive === 'active') {
      result = result.filter(c => c.is_active);
    } else if (filterActive === 'inactive') {
      result = result.filter(c => !c.is_active);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.company_name.localeCompare(b.company_name);
        case 'name-desc': return b.company_name.localeCompare(a.company_name);
        case 'date-asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'users-asc': return a.user_count - b.user_count;
        case 'users-desc': return b.user_count - a.user_count;
        default: return 0;
      }
    });

    return result;
  }, [companies, searchTerm, sortBy, filterStatus, filterActive]);

  if (authLoading || !isUserAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1A3A52 0%, #0F2838 100%)' }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 164, 92, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(201, 164, 92, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)`
        }} />
      </div>
      
      <div className="container mx-auto p-8 max-w-6xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Dashboard
          </Button>
          <DynamicLogo className="h-8 w-auto" variant="light" />
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Building className="w-6 h-6 text-[#C9A45C]" /> Gerenciar Empresas
                </CardTitle>
                <CardDescription className="text-white/70">
                  {companies.length} empresa(s) cadastrada(s)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchCompaniesData} disabled={loading} variant="outline" className="text-white">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                </Button>
                <Button onClick={() => setShowCreateDialog(true)} className="bg-[#C9A45C] hover:bg-[#B78D4A]">
                  <Plus className="w-4 h-4 mr-2" /> Nova Empresa
                </Button>
              </div>
            </div>

            {!loading && companies.length > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input placeholder="Buscar empresa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 text-white" />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="w-48 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                      <SelectItem value="date-desc">Mais recentes</SelectItem>
                      <SelectItem value="users-desc">Mais usuários</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                    <SelectTrigger className="w-48 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as empresas</SelectItem>
                      <SelectItem value="with-users">Com usuários</SelectItem>
                      <SelectItem value="without-users">Sem usuários</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterActive} onValueChange={(v: any) => setFilterActive(v)}>
                    <SelectTrigger className="w-40 bg-white/5 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos status</SelectItem>
                      <SelectItem value="active">Apenas ativas</SelectItem>
                      <SelectItem value="inactive">Apenas inativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#C9A45C]" /></div>
            ) : filteredAndSortedCompanies.length === 0 ? (
              <div className="text-center py-12 text-white">Nenhuma empresa encontrada</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white">Empresa</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Usuários</TableHead>
                    <TableHead className="text-white text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCompanies.map((c) => (
                    <TableRow key={c.id} className="border-white/10">
                      <TableCell className="text-white font-medium">{c.company_name}</TableCell>
                      <TableCell>
                        <Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Ativa' : 'Inativa'}</Badge>
                      </TableCell>
                      <TableCell className="text-white/80">{c.user_count} usuário(s)</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleEditCompany(c.id)} className="bg-[#C9A45C]"><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant={c.is_active ? 'destructive' : 'default'} onClick={() => handleToggleCompanyStatus(c)} disabled={togglingCompanyId === c.id}>
                            {c.is_active ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1A3A52] text-white border-white/20">
          <DialogHeader><DialogTitle>Nova Empresa</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Nome da Empresa</Label>
            <Input placeholder="Nome..." value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} className="bg-white/5 text-white" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateCompany} disabled={creating}>{creating ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showToggleCompanyDialog} onOpenChange={setShowToggleCompanyDialog}>
        <AlertDialogContent className="bg-[#1A3A52] text-white border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedCompanyToToggle?.is_active ? 'Inativar' : 'Reativar'} Empresa</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Isso afetará o acesso do(s) {selectedCompanyToToggle?.user_count} usuário(s) vinculado(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleCompany} className={selectedCompanyToToggle?.is_active ? 'bg-red-600' : 'bg-green-600'}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesManager;
