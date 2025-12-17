import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { PageContext } from '@/types/pageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Lock, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true to process tokens
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPageContext } = useBranding();
  
  // Define pageContext ao montar o componente
  useEffect(() => {
    setPageContext(PageContext.AUTHENTICATION);
    console.log('🔐 ResetPassword: PageContext set to AUTHENTICATION');
  }, []);

  useEffect(() => {
    const handleRecoveryTokens = async () => {
      // Parse tokens from URL hash (format: #access_token=xxx&refresh_token=yyy&type=recovery)
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');
      
      console.log('URL hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      
      if (accessToken && refreshToken && type === 'recovery') {
        try {
          setLoading(true);
          
          // Set the session with the tokens from URL
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting recovery session:', error);
            setError('Link de recuperação inválido ou expirado. Solicite um novo link.');
            setTimeout(() => navigate('/auth'), 3000);
            return;
          }
          
          if (!session) {
            console.error('No session created');
            setError('Erro ao processar link de recuperação. Tente novamente.');
            setTimeout(() => navigate('/auth'), 3000);
            return;
          }
          
          console.log('Recovery session established successfully');
          // Clean URL hash after successful token processing
          window.history.replaceState({}, document.title, window.location.pathname);
          
        } catch (err) {
          console.error('Unexpected error:', err);
          setError('Erro inesperado. Solicite um novo link de recuperação.');
          setTimeout(() => navigate('/auth'), 3000);
        } finally {
          setLoading(false);
        }
      } else {
        // No recovery tokens found, check if there's an active recovery session
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            console.log('No active session or error:', error);
            setError('Link de recuperação necessário. Solicite um novo link através da página de login.');
            setTimeout(() => navigate('/auth'), 3000);
            return;
          }
          
          // Verify it's a recovery session
          const isRecovery = session.user?.recovery_sent_at || 
                            session.user?.email_confirmed_at === session.user?.last_sign_in_at;
          
          if (!isRecovery) {
            console.log('Not a recovery session');
            setError('Esta não é uma sessão de recuperação válida.');
            setTimeout(() => navigate('/auth'), 3000);
          }
        } catch (err) {
          console.error('Error checking session:', err);
          setError('Erro ao verificar sessão. Tente novamente.');
          setTimeout(() => navigate('/auth'), 3000);
        }
      }
    };
    
    handleRecoveryTokens();
  }, [navigate]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: 'Senha atualizada com sucesso',
          description: 'Você será redirecionado para a página inicial.',
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#1A4764" }}>
      <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">
            Redefinir Senha
          </CardTitle>
          <p className="text-white/80">
            Digite sua nova senha abaixo
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-300" />
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Nova Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Digite sua nova senha"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm font-medium">
                Confirmar Nova Senha
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                placeholder="Confirme sua nova senha"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-rc-secondary hover:bg-rc-secondary/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}