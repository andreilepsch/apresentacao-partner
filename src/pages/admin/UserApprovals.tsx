import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw, ArrowLeft, Mail, Calendar, Edit, Building, Loader2, UserX, Filter, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import DynamicLogo from '@/components/DynamicLogo';

interface Company {
  id: string;
  company_name: string;
}

interface PendingUser {
  id: string;
  user_id: string;
  status: string;
  requested_at: string;
  email?: string;
  full_name?: string;
  company_name?: string;
  created_at?: string;
}

interface ActiveUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'partner';
  company_name: string;
  approved_at: string;
  is_active: boolean;
}

const UserApprovals = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<'partner' | 'admin'>('partner');
  const [companyName, setCompanyName] = useState('');
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [filterActiveStatus, setFilterActiveStatus] = useState<'all' | 'active' | 'inactive'>('active');
  const [selectedUserToToggle, setSelectedUserToToggle] = useState<ActiveUser | null>(null);
  const [showToggleUserDialog, setShowToggleUserDialog] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string, email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const isMainAdmin = user?.email?.toLowerCase() === 'contato@autoridadeinvestimentos.com.br';
    if (!roleLoading && !isAdmin && !isMainAdmin) {
      console.log('🚫 UserApprovals: Not an admin, redirecting to home');
      navigate('/');
    }
  }, [isAdmin, user, roleLoading, navigate]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      console.log('🔍 UserApprovals: Fetching pending users...');

      // Attempt to fetch via RPC to get company_name from metadata
      const { data, error } = await supabase.rpc('get_pending_users_data');

      if (error) {
        console.warn("RPC get_pending_users_data failed, falling back to basic query.", error);
        // Fallback to basic query if RPC fails (e.g. migration not run)
        throw error;
      }

      setUsers(data as PendingUser[]);
    } catch (error) {
      console.error('Error fetching pending users via RPC, falling back to standard query:', error);

      // Fallback implementation
      try {
        const { data, error: fallbackError } = await supabase
          .from('user_account_status')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;

        const userIds = data?.map(u => u.user_id) || [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        const formattedData = (data || []).map(item => {
          const profile = profiles?.find(p => p.id === item.user_id);
          return {
            ...item,
            email: profile?.email || 'N/A',
            full_name: profile?.full_name || 'Sem nome',
            company_name: undefined // Explicitly undefined so UI allows input
          };
        });
        setUsers(formattedData as PendingUser[]);

        toast({
          title: 'Aviso',
          description: 'Não foi possível carregar os nomes das empresas automaticamente. Digite manualmente.',
          variant: 'default', // Not destructive, just a warning
        });
      } catch (finalError) {
        toast({
          title: 'Erro ao carregar usuários',
          description: 'Não foi possível carregar a lista de usuários pendentes.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    setLoadingActive(true);
    try {
      const { data: statuses, error: statusError } = await supabase
        .from('user_account_status')
        .select('*')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });

      if (statusError) throw statusError;

      const userIds = statuses?.map(s => s.user_id) || [];

      // Buscar perifis e roles
      const [profilesResult, rolesResult, userCompaniesResult] = await Promise.all([
        supabase.from('profiles').select('id, email, full_name').in('id', userIds),
        supabase.from('user_roles').select('user_id, role').in('user_id', userIds),
        supabase.from('user_companies').select('user_id, company_id').in('user_id', userIds)
      ]);

      // Buscar nomes das empresas separadamente para evitar problemas de JOIN
      const companyIds = userCompaniesResult.data?.map(uc => uc.company_id).filter(Boolean) || [];
      const { data: companiesData } = await supabase
        .from('companies')
        .select('id, company_name')
        .in('id', companyIds as string[]);

      const formattedActive = (statuses || []).map(status => {
        const profile = profilesResult.data?.find(p => p.id === status.user_id);
        const role = rolesResult.data?.find(r => r.user_id === status.user_id)?.role || 'partner';

        const userCompany = userCompaniesResult.data?.find(c => c.user_id === status.user_id);
        const company = companiesData?.find(c => c.id === userCompany?.company_id);
        const companyName = company?.company_name || 'N/A';

        return {
          id: status.user_id,
          user_id: status.user_id,
          email: profile?.email || 'N/A',
          full_name: profile?.full_name || 'Sem nome',
          role: role,
          company_name: companyName,
          approved_at: status.approved_at,
          is_active: status.is_active
        };
      });

      setActiveUsers(formattedActive);
    } catch (error) {
      console.error('Error fetching active users:', error);
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingUsers();
      fetchActiveUsers();
      fetchCompanies();
    }
  }, [isAdmin]);

  const fetchCompanies = async () => {
    try {
      // Buscar empresas da tabela companies
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name')
        .order('company_name');

      if (error) throw error;

      setAvailableCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Erro ao carregar empresas',
        description: 'Não foi possível carregar a lista de empresas.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenApproveDialog = (user: PendingUser) => {
    setSelectedUser(user);
    setSelectedRole('partner');
    setCompanyName(user.company_name || '');
    setShowApproveDialog(true);
  };

  const handleApprove = async () => {
    if (!selectedUser || !companyName.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe o nome da empresa.',
        variant: 'destructive',
      });
      return;
    }

    setIsApproving(true);
    try {
      const { error } = await supabase.rpc('approve_user_with_company', {
        _user_id: selectedUser.user_id,
        _company_name: companyName.trim(),
        _role: selectedRole,
      });

      if (error) throw error;

      const roleLabel = selectedRole === 'admin' ? 'Admin' : 'Parceiro';

      toast({
        title: 'Usuário aprovado!',
        description: `O usuário foi aprovado como ${roleLabel}.`,
      });

      fetchPendingUsers();
      fetchActiveUsers();
      setShowApproveDialog(false);
      setSelectedUser(null);
      setCompanyName('');
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Erro ao aprovar usuário',
        description: (error as any).message || (error as any).error_description || JSON.stringify(error),
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('reject_user', {
        _user_id: selectedUser.user_id,
        _reason: rejectReason || null
      });

      if (error) throw error;

      toast({
        title: 'Usuário rejeitado',
        description: 'A solicitação de acesso foi negada.',
      });

      fetchPendingUsers();
      fetchActiveUsers();
      setShowRejectDialog(false);
      setSelectedUser(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Erro ao rejeitar usuário',
        description: 'Não foi possível rejeitar o usuário. Tente novamente.',
        variant: 'destructive',
      });
    }
  };


  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_completely', {
        _user_id: userToDelete.id
      });

      if (error) throw error;

      toast({
        title: 'Usuário excluído',
        description: 'O registro do usuário foi removido do sistema.',
      });

      fetchPendingUsers();
      fetchActiveUsers();
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: 'Não foi possível excluir o usuário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetToPending = async (user: ActiveUser) => {
    try {
      const { error } = await supabase.rpc('reset_user_to_pending', {
        _user_id: user.user_id
      });

      if (error) throw error;

      toast({
        title: 'Usuário resetado',
        description: 'O usuário voltou para a lista de pendentes.',
      });

      fetchPendingUsers();
      fetchActiveUsers();
    } catch (error) {
      console.error('Error resetting user:', error);
      toast({
        title: 'Erro ao resetar usuário',
        description: (error as any).message || 'Não foi possível resetar o usuário.',
        variant: 'destructive',
      });
    }
  };

  const isMainAdmin = user?.email?.toLowerCase() === 'contato@autoridadeinvestimentos.com.br';

  if (roleLoading || (!isAdmin && !isMainAdmin)) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1A3A52 0%, #0F2838 100%)'
    }}>
      {/* Pattern de fundo sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 164, 92, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(201, 164, 92, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)`
        }} />
      </div>

      <div className="container mx-auto p-8 max-w-6xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <DynamicLogo className="h-8 w-auto" variant="light" />
        </div>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Clock className="w-6 h-6 text-[#C9A45C]" />
                  Aprovação de Usuários
                </CardTitle>
                <CardDescription className="text-white/70">
                  Gerencie solicitações de acesso ao sistema
                </CardDescription>
              </div>
              <Button onClick={fetchPendingUsers} disabled={loading} className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C9A45C]" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-[#C9A45C] mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Nenhuma solicitação pendente</p>
                <p className="text-sm text-white/70 mt-2">
                  Todas as solicitações de acesso foram processadas.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/90">Usuário</TableHead>
                    <TableHead className="text-white/90">Email</TableHead>
                    <TableHead className="text-white/90">Solicitado em</TableHead>
                    <TableHead className="text-white/90">Status</TableHead>
                    <TableHead className="text-right text-white/90">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {user.full_name || 'Sem nome'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-white/80">
                          <Mail className="w-4 h-4 text-[#C9A45C]" />
                          {user.email}
                        </div>
                        {user.company_name && (
                          <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                            <Building className="w-3 h-3 text-[#C9A45C]" />
                            {user.company_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Calendar className="w-4 h-4 text-[#C9A45C]" />
                          {new Date(user.requested_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendente
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOpenApproveDialog(user)}
                            className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRejectDialog(true);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setUserToDelete({ id: user.user_id, email: user.email || '' });
                              setShowDeleteDialog(true);
                            }}
                            className="bg-black hover:bg-red-900"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Excluir
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

        {/* Card de Usuários Ativos */}
        <Card className="mt-6 bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <CheckCircle className="w-6 h-6 text-[#C9A45C]" />
                  Usuários Ativos
                </CardTitle>
                <CardDescription className="text-white/70">
                  Lista de usuários aprovados no sistema ({activeUsers.length})
                </CardDescription>
              </div>
              <Button onClick={fetchActiveUsers} disabled={loadingActive} className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white">
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingActive ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>

            {!loadingActive && activeUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C9A45C]" />
                <span className="text-sm text-white/70">Filtrar por:</span>
                <Select value={filterActiveStatus} onValueChange={(value: any) => setFilterActiveStatus(value)}>
                  <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Apenas ativos</SelectItem>
                    <SelectItem value="inactive">Apenas inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loadingActive ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C9A45C]" />
              </div>
            ) : activeUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-white">Nenhum usuário ativo encontrado.</p>
                <p className="text-sm text-white/70 mt-2">
                  Os usuários aprovados aparecerão aqui.
                </p>
              </div>
            ) : (() => {
              const filteredUsers = filterActiveStatus === 'all'
                ? activeUsers
                : filterActiveStatus === 'active'
                  ? activeUsers.filter(u => u.is_active)
                  : activeUsers.filter(u => !u.is_active);

              return filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-white">Nenhum usuário encontrado</p>
                  <p className="text-sm text-white/70 mt-2">
                    Tente ajustar o filtro de status.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white/90">Nome</TableHead>
                      <TableHead className="text-white/90">Email</TableHead>
                      <TableHead className="text-white/90">Role</TableHead>
                      <TableHead className="text-white/90">Status</TableHead>
                      <TableHead className="text-white/90">Empresa</TableHead>
                      <TableHead className="text-white/90">Data de Aprovação</TableHead>
                      <TableHead className="text-right text-white/90">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          {user.full_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-white/80">
                            <Mail className="w-4 h-4 text-[#C9A45C]" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === 'admin' ? 'destructive' :
                                user.role === 'partner' ? 'default' :
                                  'secondary'
                            }
                          >
                            {user.role === 'admin' ? 'Admin' :
                              user.role === 'partner' ? 'Parceiro' :
                                'Usuário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'secondary'} className={user.is_active ? 'bg-green-600' : 'bg-gray-500'}>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/80">{user.company_name}</TableCell>
                        <TableCell>
                          <div className="text-sm text-white/70">
                            {new Date(user.approved_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/users/edit/${user.user_id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.is_active ? 'outline' : 'default'}
                              onClick={async () => {
                                setTogglingUserId(user.user_id);
                                try {
                                  const { data: { session } } = await supabase.auth.getSession();
                                  await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/toggle-user-status`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: user.user_id, isActive: !user.is_active })
                                  });
                                  toast({ title: user.is_active ? 'Usuário inativado' : 'Usuário reativado' });
                                  fetchActiveUsers();
                                } catch (error) {
                                  toast({ title: 'Erro', variant: 'destructive' });
                                } finally {
                                  setTogglingUserId(null);
                                }
                              }}
                              disabled={togglingUserId === user.user_id}
                            >
                              {togglingUserId === user.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : user.is_active ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleResetToPending(user)}
                              title="Voltar para pendente (reaprovar)"
                              className="bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/40 hover:text-yellow-400 border border-yellow-600/30"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setUserToDelete({ id: user.user_id, email: user.email });
                                setShowDeleteDialog(true);
                              }}
                              className="bg-black hover:bg-red-900"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
          </CardContent>
        </Card>
      </div >

      {/* Dialog de Aprovação */}
      < AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog} >
        <AlertDialogContent className="bg-[#1A3A52] border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Aprovar acesso do usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Configure o perfil e empresa para <strong className="text-[#C9A45C]">{selectedUser?.email}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/90">Empresa (Informada no Cadastro)</Label>
              <div className="p-3 rounded-md bg-white/5 border border-white/10 text-white font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-[#C9A45C]" />
                {companyName || <span className="text-white/40 italic">Não informada ou erro ao carregar</span>}
              </div>
              {!companyName && (
                <p className="text-xs text-yellow-500 mt-2">
                  ⚠️ O nome da empresa é obrigatório. Se estiver vazio, verifique se a função RPC 'get_pending_users_data' foi criada no banco de dados.
                </p>
              )}
              <p className="text-xs text-white/60">
                Este campo é informativo e não pode ser alterado.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-white/90">Perfil</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'partner' | 'admin')}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Parceiro</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowApproveDialog(false);
              setCompanyName('');
            }} className="text-white border-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={!companyName.trim() || isApproving}
              className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aprovando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >

      {/* Dialog de Rejeição */}
      < AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog} >
        <AlertDialogContent className="bg-[#1A3A52] border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Rejeitar solicitação de acesso</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Tem certeza que deseja rejeitar o acesso de <strong className="text-[#C9A45C]">{selectedUser?.email}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block text-white/90">
              Motivo da rejeição (opcional)
            </label>
            <Textarea
              placeholder="Explique o motivo da rejeição..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowRejectDialog(false);
              setRejectReason('');
            }} className="text-white border-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Rejeição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >

      {/* Dialog de Exclusão */}
      < AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} >
        <AlertDialogContent className="bg-[#1A3A52] border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir usuário permanentemente?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Tem certeza que deseja excluir os dados de <strong className="text-[#C9A45C]">{userToDelete?.email}</strong>?
              Esta ação removerá o perfil, permissões e status do usuário. O usuário não conseguirá mais acessar o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setUserToDelete(null);
            }} className="text-white border-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirmar Exclusão
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >
    </div >
  );
};

export default UserApprovals;
