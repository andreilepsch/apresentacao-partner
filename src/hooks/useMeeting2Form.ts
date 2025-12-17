import { useState, useCallback, useEffect } from 'react';
import { Meeting2FormData, meeting2FormSchema } from '@/types/meeting2Form';
import { useToast } from '@/hooks/use-toast';
import { mapFormDataToPresentation, validateFormData } from '@/utils/hybridDataMapper';

const STORAGE_KEY = 'meeting2-form-data';

export const useMeeting2Form = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Meeting2FormData>({
    nome: '',
    idade: '',
    profissao: '',
    estrategiaInvestimento: '',
    imovelSelecionado: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Meeting2FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = useCallback(<K extends keyof Meeting2FormData>(
    field: K,
    value: Meeting2FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateField = useCallback((field: keyof Meeting2FormData, value: any) => {
    try {
      const fieldSchema = meeting2FormSchema.shape[field];
      fieldSchema.parse(value);
      return null;
    } catch (error: any) {
      return error.errors?.[0]?.message || 'Campo inválido';
    }
  }, []);

  const validateForm = useCallback(() => {
    try {
      const processedData = {
        ...formData,
        idade: typeof formData.idade === 'string' ? parseInt(formData.idade) || 0 : formData.idade
      };
      
      meeting2FormSchema.parse(processedData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Partial<Record<keyof Meeting2FormData, string>> = {};
      
      error.errors?.forEach((err: any) => {
        const field = err.path[0] as keyof Meeting2FormData;
        if (field) {
          fieldErrors[field] = err.message;
        }
      });
      
      setErrors(fieldErrors);
      return false;
    }
  }, [formData]);

  const handleSubmit = useCallback(async (onSuccess?: () => void) => {
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        const processedData = {
          ...formData,
          idade: typeof formData.idade === 'string' ? parseInt(formData.idade) || 0 : formData.idade
        };
        
        // Validate if we have all necessary data for presentation
        if (!validateFormData(processedData)) {
          toast({
            title: "Dados incompletos",
            description: "Alguns dados necessários estão faltando para gerar a apresentação.",
            variant: "destructive"
          });
          return;
        }
        
        // Generate presentation data from form data
        try {
          const presentationData = mapFormDataToPresentation(processedData);
          
          // Save both form data and presentation data
          localStorage.setItem('meeting2-form-data', JSON.stringify(processedData));
          localStorage.setItem('meeting2-presentation-data', JSON.stringify(presentationData));
          
          toast({
            title: "Formulário enviado com sucesso!",
            description: "Redirecionando para a apresentação personalizada...",
          });
          
          onSuccess?.();
        } catch (error) {
          console.error('Error generating presentation data:', error);
          toast({
            title: "Erro ao gerar apresentação",
            description: "Não foi possível processar os dados para a apresentação.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erro no formulário",
          description: "Por favor, corrija os campos destacados.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro interno",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, toast]);

  const clearForm = useCallback(() => {
    const initialData: Meeting2FormData = {
      nome: '',
      idade: '',
      profissao: '',
      estrategiaInvestimento: '',
      imovelSelecionado: ''
    };
    
    setFormData(initialData);
    setErrors({});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('meeting2-form-data');
    localStorage.removeItem('meeting2-presentation-data');
  }, []);

  const isFormComplete = useCallback(() => {
    return !!(
      formData.nome &&
      formData.idade &&
      formData.profissao &&
      formData.estrategiaInvestimento &&
      formData.imovelSelecionado
    );
  }, [formData]);

  const getCompletionPercentage = useCallback(() => {
    const fields = Object.values(formData);
    const completedFields = fields.filter(value => value !== '' && value !== null && value !== undefined);
    return Math.round((completedFields.length / fields.length) * 100);
  }, [formData]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateField,
    validateForm,
    handleSubmit,
    clearForm,
    isFormComplete: isFormComplete(),
    completionPercentage: getCompletionPercentage()
  };
};