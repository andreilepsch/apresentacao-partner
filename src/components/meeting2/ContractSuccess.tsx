import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContractSuccessProps {
  onBackToSelection: () => void;
}

const ContractSuccess: React.FC<ContractSuccessProps> = ({ onBackToSelection }) => {
  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-gradient-to-r from-[#C9A45C] to-[#E5C875] rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-black" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Contrato Enviado com Sucesso!
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Suas informações foram enviadas e processadas. Em breve você receberá o contrato para assinatura.
        </p>
      </div>

      {/* Success Details Card */}
      <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden max-w-lg mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <FileCheck className="w-8 h-8 text-[#C9A45C]" />
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Próximos Passos</h3>
              <p className="text-white/70">O que acontece agora?</p>
            </div>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#C9A45C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80">Análise dos documentos enviados</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#C9A45C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80">Preparação do contrato personalizado</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#C9A45C] rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80">Envio para assinatura digital</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="pt-4">
        <Button
          onClick={onBackToSelection}
          className="bg-gradient-to-r from-[#C9A45C] to-[#E5C875] text-black font-semibold px-12 py-4 text-lg rounded-full hover:shadow-lg hover:shadow-[#C9A45C]/25 transition-all duration-300"
        >
          Voltar para Seleção de Apresentação
        </Button>
      </div>
    </div>
  );
};

export default ContractSuccess;