import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PersonalDataFormProps {
  fullName: string;
  email: string;
  role?: string;
  onFullNameChange: (value: string) => void;
  onEmailChange?: (value: string) => void;
  canEditEmail?: boolean;
  showRole?: boolean;
}

export const PersonalDataForm = ({
  fullName,
  email,
  role,
  onFullNameChange,
  onEmailChange,
  canEditEmail = false,
  showRole = true
}: PersonalDataFormProps) => {
  const getRoleBadgeVariant = (role: string) => {
    if (role === 'admin') return 'destructive';
    if (role === 'partner') return 'default';
    return 'secondary';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'admin') return 'Admin';
    if (role === 'partner') return 'Parceiro';
    return 'Usuário';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Seu nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange?.(e.target.value)}
          disabled={!canEditEmail}
          placeholder="seu@email.com"
        />
        {!canEditEmail && (
          <p className="text-xs text-muted-foreground">
            Email não pode ser alterado. Entre em contato com o administrador.
          </p>
        )}
      </div>

      {showRole && role && (
        <div className="space-y-2">
          <Label>Perfil de Acesso</Label>
          <div>
            <Badge variant={getRoleBadgeVariant(role)}>
              {getRoleLabel(role)}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};
