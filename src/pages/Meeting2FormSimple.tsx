import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Meeting2Layout from '@/components/meeting2/Meeting2Layout';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Meeting2FormSimple = () => {
  const navigate = useNavigate();
  useScrollToTop();

  const handleFormSubmit = () => {
    console.log('Form submitted, navigating to hibrida');
    navigate('/meeting2/hibrida');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#163B36" }}>
      <Meeting2Layout
        backTo="/meeting2-selection"
        badgeIcon={FileText}
        badgeText="FORMULÁRIO HÍBRIDO"
      >
        <Meeting2Layout.Hero
          title="Formulário de Personalização"
          subtitle="Complete os dados abaixo para personalizar sua apresentação híbrida."
          badge={{
            text: "ETAPA OBRIGATÓRIA",
            variant: "highlight"
          }}
        />

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Teste de Roteamento</h3>
            <p className="text-white/70 mb-6">
              Se você consegue ver esta página, o roteamento está funcionando corretamente.
            </p>
            
            <div className="text-center">
              <Button
                onClick={handleFormSubmit}
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-[#C9A45C] text-black hover:bg-[#E5C875] transition-all duration-300"
              >
                Continuar para Apresentação Híbrida
              </Button>
            </div>
          </div>
        </div>
      </Meeting2Layout>
    </div>
  );
};

export default Meeting2FormSimple;