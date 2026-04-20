import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw, ArrowLeft, Mail, Calendar, Edit, Building, Loader2, UserX, Filter, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
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

interface UserData {
  clerk_user_id: string;
  email: string;
  full_name: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | null;
  is_active: boolean;
  approved_at: string | null;
  role: 'admin' | 'partner';
  company_name: string | null;
}

const UserApprovals = () => {
  const navigate = useNavigate();
  const { userProfile, isAdmin: isUserAdmin, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserData[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState<'partner' | 'admin'>('partner');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [filterActiveStatus, setFilterActiveStatus] = useState<'all' | 'active' | 'inactive'>('active');
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string, email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isUserAdmin) {
      console.log('🚫 UserApprovals: Not an admin, redirecting to home');
      navigate('/');
    }
  }, [isUserAdmin, authLoading, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersData, companiesData] = await Promise.all([
        api.get('/admin/users'),
        api.get('/companies')
      ]);
      
      setUsers(usersData);
      setPendingUsers(usersData.filter((u: UserData) => u.status === 'pending'));
      setActiveUsers(usersData.filter((u: UserData) => u.status === 'approved'));
      setAvailableCompanies(companiesData);
      
      // Select default company (Autoridade Investimentos) if available
      const mainCompany = companiesData.find((c: Company) => c.company_name.includes('Autoridade'));
      if (mainCompany) setSelectedCompanyId(mainCompany.id);
      else if (companiesData.length > 0) setSelectedCompanyId(companiesData[0].id);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar a lista de usuários ou empresas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      fetchAllData();
    }
  }, [isUserAdmin]);

  const handleOpenApproveDialog = (user: UserData) => {
    setSelectedUser(user);
    setSelectedRole('partner');
    setShowApproveDialog(true);
  };

  const handleApprove = async () => {
    if (!selectedUser || !selectedCompanyId) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma empresa.',
        variant: 'destructive',
      });
      return;
    }

    setIsApproving(true);
    try {
      await api.post(`/admin/users/${selectedUser.clerk_user_id}/approve`, {
        role: selectedRole,
        company_id: selectedCompanyId
      });

      toast({
        title: 'Usuário aprovado!',
        description: `O usuário foi aprovado como ${selectedRole === 'admin' ? 'Admin' : 'Parceiro'}.`,
      });

      fetchAllData();
      setShowApproveDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Erro ao aprovar usuário',
        description: 'Não foi possível aprovar o usuário.',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;

    try {
      // Backend ainda não tem reject especializado, vamos usar update status
      await api.put(`/admin/users/${selectedUser.clerk_user_id}`, {
        status: 'rejected'
      });

      toast({
        title: 'Usuário rejeitado',
        description: 'A solicitação de acesso foi negada.',
      });

      fetchAllData();
      setShowRejectDialog(false);
      setSelectedUser(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Erro ao rejeitar usuário',
        description: 'Não foi possível rejeitar o usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    setTogglingUserId(user.clerk_user_id);
    try {
      await api.put(`/admin/users/${user.clerk_user_id}`, {
        is_active: !user.is_active
      });
      toast({ title: user.is_active ? 'Usuário inativado' : 'Usuário reativado' });
      fetchAllData();
    } catch (error) {
      toast({ title: 'Erro ao alterar status', variant: 'destructive' });
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleResetToPending = async (user: UserData) => {
    try {
      await api.put(`/admin/users/${user.clerk_user_id}`, {
        status: 'pending'
      });

      toast({
        title: 'Usuário resetado',
        description: 'O usuário voltou para a lista de pendentes.',
      });

      fetchAllData();
    } catch (error) {
      toast({ title: 'Erro ao resetar usuário', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      // DELETE user logic needed in backend if desired, for now we just inactivate or reject
      toast({ title: 'Funcionalidade de exclusão total depende de permissões Clerk do Admin' });
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || !isUserAdmin) {
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
          <Button variant="ghost" className="text-white border border-white/30 hover:bg-white/10 hover:border-[#C9A45C] hover:text-[#C9A45C] backdrop-blur-sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <DynamicLogo className="h-8 w-auto" variant="light" />
        </div>

        {/* Pendentes */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Clock className="w-6 h-6 text-[#C9A45C]" />
                  Solicitações Pendentes
                </CardTitle>
              </div>
              <Button onClick={fetchAllData} disabled={loading} className="bg-[#C9A45C] hover:bg-[#B78D4A] text-white">
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
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-[#C9A45C] mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Nenhuma solicitação pendente</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/90">Usuário</TableHead>
                    <TableHead className="text-white/90">Email</TableHead>
                    <TableHead className="text-white/90">Cadastro em</TableHead>
                    <TableHead className="text-right text-white/90">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((u) => (
                    <TableRow key={u.clerk_user_id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{u.full_name}</TableCell>
                      <TableCell className="text-white/80">{u.email}</TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => handleOpenApproveDialog(u)} className="bg-[#C9A45C] hover:bg-[#B78D4A]">
                            Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(u); setShowRejectDialog(true); }}>
                            Rejeitar
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

        {/* Ativos */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2 text-white">
                <CheckCircle className="w-6 h-6 text-[#C9A45C]" />
                Usuários Ativos
              </CardTitle>
              <div className="flex items-center gap-4">
                <Select value={filterActiveStatus} onValueChange={(v: any) => setFilterActiveStatus(v)}>
                  <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C9A45C]" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/90">Nome</TableHead>
                    <TableHead className="text-white/90">Email</TableHead>
                    <TableHead className="text-white/90">Role</TableHead>
                    <TableHead className="text-white/90">Empresa</TableHead>
                    <TableHead className="text-white/90">Status</TableHead>
                    <TableHead className="text-right text-white/90">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeUsers
                    .filter(u => filterActiveStatus === 'all' ? true : (filterActiveStatus === 'active' ? u.is_active : !u.is_active))
                    .map((u) => (
                    <TableRow key={u.clerk_user_id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{u.full_name}</TableCell>
                      <TableCell className="text-white/80">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'admin' ? 'destructive' : 'default'}>
                          {u.role === 'admin' ? 'Admin' : 'Parceiro'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/70">{u.company_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={u.is_active ? 'default' : 'secondary'} className={u.is_active ? 'bg-green-600' : 'bg-gray-500'}>
                          {u.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/edit/${u.clerk_user_id}`)}>
                            <Edit className="h-4 w-4 text-white" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleToggleStatus(u)} disabled={togglingUserId === u.clerk_user_id}>
                            {u.is_active ? <UserX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleResetToPending(u)} className="bg-yellow-600/20 text-yellow-500 border-yellow-600/30">
                            <RotateCcw className="w-4 h-4" />
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

      {/* Aprovação Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent className="bg-[#1A3A52] border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Aprovar Usuário</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Configure as permissões para {selectedUser?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/90">Empresa</Label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {availableCompanies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/90">Perfil</Label>
              <Select value={selectedRole} onValueChange={(v: any) => setSelectedRole(v)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Parceiro</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white border-white/20">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={isApproving} className="bg-[#C9A45C] hover:bg-[#B78D4A]">
              {isApproving ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirmar Aprovação'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejeição Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="bg-[#1A3A52] border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Rejeitar Solicitação</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea placeholder="Motivo (opcional)..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="bg-white/10 border-white/20 text-white" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600">Confirmar Rejeição</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserApprovals;
