
import { DollarSign, Home, Target, Flag, Globe, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormData {
  monthlyInvestment: string;
  downPayment: string;
  irpfDeclaration: string[];
}

interface DiagnosisFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalysis: () => void;
}

const DiagnosisForm = ({ formData, setFormData, onAnalysis }: DiagnosisFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData({
      ...formData,
      irpfDeclaration: checked 
        ? [...formData.irpfDeclaration, value]
        : formData.irpfDeclaration.filter(item => item !== value)
    });
  };

  const formatCurrency = (value: string, maxDigits: number) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '';
    
    const limitedNumbers = numbers.slice(0, maxDigits);
    const formatted = parseInt(limitedNumbers).toLocaleString('pt-BR');
    return `R$ ${formatted}`;
  };

  const handleCurrencyInput = (field: string, value: string, maxDigits: number) => {
    const formatted = formatCurrency(value, maxDigits);
    handleInputChange(field, formatted);
  };

  const isFormComplete = formData.monthlyInvestment !== "" && 
                       formData.downPayment !== "" && 
                       formData.irpfDeclaration.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mx-auto max-w-2xl">
      <div className="space-y-6">
        
        {/* Campo 1 - Investimento Mensal */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <DollarSign className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual valor você pode investir mensalmente?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 5.000"
            value={formData.monthlyInvestment}
            onChange={(e) => handleCurrencyInput('monthlyInvestment', e.target.value, 5)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 2 - Valor de Entrada para Imóvel */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Home className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Valor de entrada que você tem para um imóvel
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 55.000"
            value={formData.downPayment}
            onChange={(e) => handleCurrencyInput('downPayment', e.target.value, 7)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 3 - Declaração IRPF */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Target className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Aonde você declara Imposto de Renda?
          </label>
          
          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="brasil" 
                checked={formData.irpfDeclaration.includes("brasil")}
                onCheckedChange={(checked) => handleCheckboxChange("brasil", checked as boolean)}
              />
              <Label htmlFor="brasil" className="flex items-center cursor-pointer text-lg font-medium">
                <Flag className="w-5 h-5 mr-2 text-[#B78D4A]" />
                Brasil
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="exterior" 
                checked={formData.irpfDeclaration.includes("exterior")}
                onCheckedChange={(checked) => handleCheckboxChange("exterior", checked as boolean)}
              />
              <Label htmlFor="exterior" className="flex items-center cursor-pointer text-lg font-medium">
                <Globe className="w-5 h-5 mr-2 text-[#B78D4A]" />
                Exterior
              </Label>
            </div>
          </div>
        </div>

        {/* Botão Construir Planejamento */}
        <div className="pt-8">
          <Button
            onClick={onAnalysis}
            disabled={!isFormComplete}
            className={`w-full h-16 text-xl font-semibold rounded-xl transition-all duration-300 ${
              isFormComplete
                ? "bg-[#193D32] text-white hover:bg-[#2A5A4A] hover:shadow-lg transform hover:scale-[1.02]"
                : "bg-[#E5E7EB] text-[#A0AEC0] cursor-not-allowed"
            }`}
            style={{
              boxShadow: isFormComplete ? '0px 4px 10px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Brain className="w-6 h-6 mr-2" />
            Construir Planejamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisForm;
