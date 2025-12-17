import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Meeting2Layout from '@/components/meeting2/Meeting2Layout';
import DynamicForm from '@/components/meeting2/DynamicForm';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Meeting2Form = () => {
  const navigate = useNavigate();
  useScrollToTop();

  const handleFormSubmit = () => {
    navigate('/meeting2/hibrida');
  };

  const handleBack = () => {
    navigate('/meeting2-selection');
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
          subtitle="Complete os dados abaixo para personalizar sua apresentação híbrida. Todas as informações serão utilizadas para criar uma experiência única e direcionada às suas necessidades de investimento."
          badge={{
            text: "ETAPA OBRIGATÓRIA",
            variant: "highlight"
          }}
        />

        <DynamicForm onSubmit={handleFormSubmit} />
      </Meeting2Layout>
    </div>
  );
};

export default Meeting2Form;