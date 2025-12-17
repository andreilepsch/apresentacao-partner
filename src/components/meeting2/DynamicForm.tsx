import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormSection from './FormSection';
import PropertySelector from './PropertySelector';
import { useMeeting2Form } from '@/hooks/useMeeting2Form';

interface DynamicFormProps {
  onSubmit: () => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit }) => {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    isFormComplete,
    completionPercentage
  } = useMeeting2Form();

  const handleFormSubmit = () => {
    handleSubmit(onSubmit);
  };

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Progresso do Formulário</span>
          <span className="text-[#C9A45C] font-bold">{completionPercentage}%</span>
        </div>
        <Progress 
          value={completionPercentage} 
          className="h-2 bg-white/20"
        />
        <p className="text-white/70 text-sm mt-2">
          Complete todos os campos para continuar para a apresentação híbrida
        </p>
      </div>

      {/* Personal Data Section */}
      <FormSection
        sectionId="personal"
        formData={formData}
        updateField={updateField}
        errors={errors}
      />

      {/* Investment Strategy Section */}
      <FormSection
        sectionId="strategy"
        formData={formData}
        updateField={updateField}
        errors={errors}
      />

      {/* Property Selection Section */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 animate-fade-in">
        <PropertySelector
          selectedProperty={formData.imovelSelecionado}
          onPropertySelect={(propertyId) => updateField('imovelSelecionado', propertyId as any)}
          error={errors.imovelSelecionado}
        />
      </div>

      {/* Auto-save Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-white/60 text-sm">
          <Save className="w-4 h-4" />
          <span>Dados salvos automaticamente</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-4">
        <Button
          onClick={handleFormSubmit}
          disabled={!isFormComplete || isSubmitting}
          className={cn(
            "px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300",
            isFormComplete 
              ? "bg-[#C9A45C] text-black hover:bg-[#E5C875] shadow-lg hover:shadow-xl"
              : "bg-white/10 text-white/50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Processando...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>Ir para Apresentação Híbrida</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
        
        {!isFormComplete && (
          <p className="text-white/60 text-sm mt-3">
            Complete todos os campos acima para continuar
          </p>
        )}
      </div>
    </div>
  );
};


export default DynamicForm;