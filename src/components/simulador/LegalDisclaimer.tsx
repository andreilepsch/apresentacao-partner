import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LegalDisclaimer() {
  return (
    <Alert variant="destructive" className="mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Aviso Importante</AlertTitle>
      <AlertDescription>
        As estimativas exibidas são projeções estatísticas baseadas em dados históricos 
        dos grupos e <strong>não constituem promessa ou garantia de contemplação</strong>. 
        O resultado depende do comportamento do grupo, janela de entrada e estratégia de lance.
      </AlertDescription>
    </Alert>
  );
}
