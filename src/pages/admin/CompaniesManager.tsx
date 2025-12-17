import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, Edit, Users, ArrowLeft, RefreshCw, Search, Filter, UserX, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
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
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'users-asc' | 'users-desc'>('name-asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'with-users' | 'without-users'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');
  
  // Estado para inativar/reativar empresa
  const [selectedCompanyToToggle, setSelectedCompanyToToggle] = useState<CompanyWithUsers | null>(null);
  const [showToggleCompanyDialog, setShowToggleCompanyDialog] = useState(false);
  const [togglingCompanyId, setTogglingCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching companies and user counts...');
      
      // Buscar empresas e contagens via edge function em paralelo
      const [companiesResult, countsResponse] = await Promise.all([
        supabase
          .from('companies')
          .select('*')
          .order('company_name'),
        supabase.functions.invoke('get-companies-user-counts')
      ]);

      if (companiesResult.error) throw companiesResult.error;

      console.log('📊 Companies data:', companiesResult.data);
      console.log('📊 Counts response:', countsResponse);

      // Extrair mapa de contagens da resposta da edge function
      const countMap = (countsResponse.data?.counts || {}) as Record<string, number>;

      console.log('📊 Count map:', countMap);

      const companiesWithCounts = (companiesResult.data || []).map(company => ({
        ...company,
        metrics_json: company.metrics_json as any[] || [],
        user_count: countMap[company.id] || 0,
      })) as CompanyWithUsers[];

      console.log('✅ Companies with counts:', companiesWithCounts.map(c => ({ 
        name: c.company_name, 
        id: c.id, 
        count: c.user_count 
      })));

      setCompanies(companiesWithCounts);
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
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
    if (isAdmin) {
      fetchCompanies();
    }
  }, [isAdmin]);

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira um nome para a empresa.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('companies')
        .insert({
          company_name: newCompanyName.trim(),
        });

      if (error) throw error;

      toast({
        title: 'Empresa criada!',
        description: 'A nova empresa foi criada com sucesso.',
      });

      setShowCreateDialog(false);
      setNewCompanyName('');
      fetchCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: 'Erro ao criar empresa',
        description: 'Não foi possível criar a empresa. Tente novamente.',
        variant: 'destructive',
      });
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inactivate-company`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId: selectedCompanyToToggle.id,
          isActive: !selectedCompanyToToggle.is_active
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle company status');
      }
      
      const result = await response.json();
      
      toast({
        title: selectedCompanyToToggle.is_active ? 'Empresa inativada' : 'Empresa reativada',
        description: `${result.affectedUsers} usuário(s) também foram ${selectedCompanyToToggle.is_active ? 'inativados' : 'reativados'}.`
      });
      
      await fetchCompanies();
      setShowToggleCompanyDialog(false);
      setSelectedCompanyToToggle(null);
    } catch (error) {
      console.error('Error toggling company status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status da empresa.',
        variant: 'destructive',
      });
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
        case 'name-asc':
          return a.company_name.localeCompare(b.company_name);
        case 'name-desc':
          return b.company_name.localeCompare(a.company_name);
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'users-asc':
          return a.user_count - b.user_count;
        case 'users-desc':
          return b.user_count - a.user_count;
        default:
          return 0;
      }
    });

    return result;
  }, [companies, searchTerm, sortBy, filterStatus, filterActive]);

  if (roleLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #1A3A52 0%, #0F2838 100%)' 
    }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 164, 92, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(201, 164, 92, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)`
        }} />
      </div>
      
      <div className="container mx-auto p-8 max-w-6xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm" 
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <DynamicLogo className="h-8 w-auto" variant="light" />
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Building className="w-6 h-6 text-[#C9A45C]" />
                  Gerenciar Empresas
                </CardTitle>
                <CardDescription className="text-white/70">
                  {companies.length} empresa{companies.length !== 1 ? 's' : ''} cadastrada{companies.length !== 1 ? 's' : ''}
                  {filteredAndSortedCompanies.length !== companies.length && ` (${filteredAndSortedCompanies.length} filtrada${filteredAndSortedCompanies.length !== 1 ? 's' : ''})`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={fetchCompanies} 
                  disabled={loading} 
                  variant="outline"
                  className="bg-white/5 border-white/30 text-white hover:bg-white/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Empresa
                </Button>
              </div>
            </div>

            {!loading && companies.length > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    placeholder="Buscar empresa por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-[#C9A45C]"
                  />
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-white/70 hover:text-white"
                    >
                      Limpar
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#C9A45C]" />
                    <span className="text-sm text-white/70">Filtros:</span>
                  </div>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                      <SelectItem value="date-desc">Mais recentes</SelectItem>
                      <SelectItem value="date-asc">Mais antigas</SelectItem>
                      <SelectItem value="users-desc">Mais usuários</SelectItem>
                      <SelectItem value="users-asc">Menos usuários</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as empresas</SelectItem>
                      <SelectItem value="with-users">Com usuários</SelectItem>
                      <SelectItem value="without-users">Sem usuários</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterActive} onValueChange={(value: any) => setFilterActive(value)}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos status</SelectItem>
                      <SelectItem value="active">Apenas ativas</SelectItem>
                      <SelectItem value="inactive">Apenas inativas</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 ml-auto">
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-[#C9A45C]/20 text-[#C9A45C] border-[#C9A45C]/30">
                        Busca: "{searchTerm}"
                      </Badge>
                    )}
                    {filterStatus !== 'all' && (
                      <Badge variant="secondary" className="bg-[#C9A45C]/20 text-[#C9A45C] border-[#C9A45C]/30">
                        {filterStatus === 'with-users' ? 'Com usuários' : 'Sem usuários'}
                      </Badge>
                    )}
                    {filterActive !== 'all' && (
                      <Badge variant="secondary" className="bg-[#C9A45C]/20 text-[#C9A45C] border-[#C9A45C]/30">
                        {filterActive === 'active' ? 'Ativas' : 'Inativas'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C9A45C]" />
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-[#C9A45C] mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Nenhuma empresa cadastrada</p>
                <p className="text-sm text-white/70 mt-2">
                  Crie a primeira empresa para começar.
                </p>
              </div>
            ) : filteredAndSortedCompanies.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-[#C9A45C] mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Nenhuma empresa encontrada</p>
                <p className="text-sm text-white/70 mt-2">
                  Tente ajustar os filtros ou busca.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterActive('all');
                    setSortBy('name-asc');
                  }}
                  className="mt-4 bg-white/5 border-white/30 text-white hover:bg-white/10"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/90">Nome da Empresa</TableHead>
                    <TableHead className="text-white/90">Status</TableHead>
                    <TableHead className="text-white/90">Usuários Vinculados</TableHead>
                    <TableHead className="text-white/90">Criada em</TableHead>
                    <TableHead className="text-right text-white/90">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedCompanies.map((company) => (
                    <TableRow key={company.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[#C9A45C]" />
                          {company.company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.is_active ? 'default' : 'secondary'} className={company.is_active ? 'bg-green-600' : 'bg-gray-500'}>
                          {company.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-white/80">
                          <Users className="w-4 h-4 text-[#C9A45C]" />
                          <span>{company.user_count} usuário{company.user_count !== 1 ? 's' : ''}</span>
                          {company.user_count === 0 && (
                            <Badge variant="outline" className="text-xs text-white/50 border-white/20">
                              Sem usuários
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-white/70">
                        {new Date(company.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditCompany(company.id)}
                            className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant={company.is_active ? 'destructive' : 'default'}
                            onClick={() => handleToggleCompanyStatus(company)}
                            disabled={togglingCompanyId === company.id}
                          >
                            {togglingCompanyId === company.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : company.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Inativar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reativar
                              </>
                            )}
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
        <DialogContent className="bg-[#1A3A52] border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
            <DialogDescription className="text-white/70">
              Crie uma nova empresa para gerenciar usuários e branding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                placeholder="Digite o nome da empresa"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="bg-white/5 border-white/30 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={creating}
              className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white"
            >
              {creating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Empresa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showToggleCompanyDialog} onOpenChange={setShowToggleCompanyDialog}>
        <AlertDialogContent className="bg-[#1A3A52] border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCompanyToToggle?.is_active ? 'Inativar' : 'Reativar'} Empresa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {selectedCompanyToToggle?.is_active ? (
                <>
                  Você está prestes a <strong className="text-red-400">inativar</strong> a empresa <strong>{selectedCompanyToToggle.company_name}</strong>.
                  <br /><br />
                  <strong className="text-yellow-400">Atenção:</strong> Todos os {selectedCompanyToToggle.user_count} usuário(s) vinculados também serão inativados e não poderão acessar o sistema.
                </>
              ) : (
                <>
                  Você está prestes a <strong className="text-green-400">reativar</strong> a empresa <strong>{selectedCompanyToToggle?.company_name}</strong>.
                  <br /><br />
                  Todos os {selectedCompanyToToggle?.user_count} usuário(s) vinculados também serão reativados.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/30 text-white hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleCompany}
              className={selectedCompanyToToggle?.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {selectedCompanyToToggle?.is_active ? 'Inativar Empresa' : 'Reativar Empresa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompaniesManager;
