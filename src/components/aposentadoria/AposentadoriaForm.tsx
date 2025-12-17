
import { useState } from "react";
import { DollarSign, Target, Clock, Flag, Globe, Brain, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FormData {
  monthlyInvestment: string;
  targetRetirement: string;
  currentAge: string;
  retirementAge: string;
  irpfDeclaration: string[];
}

interface AposentadoriaFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalysis: () => void;
}

const AposentadoriaForm = ({ formData, setFormData, onAnalysis }: AposentadoriaFormProps) => {
  const [isRetirementDropdownOpen, setIsRetirementDropdownOpen] = useState(false);

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

  const handleAgeInput = (field: string, value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 2) {
      handleInputChange(field, numbers);
    }
  };

  const isFormComplete = formData.monthlyInvestment !== "" && 
                       formData.targetRetirement !== "" && 
                       formData.currentAge !== "" &&
                       formData.retirementAge !== "" &&
                       formData.irpfDeclaration.length > 0;

  const retirementOptions = [
    { value: "10000", label: "R$ 10.000" },
    { value: "15000", label: "R$ 15.000" },
    { value: "20000", label: "R$ 20.000" },
    { value: "25000", label: "R$ 25.000" },
    { value: "30000", label: "R$ 30.000" }
  ];

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

        {/* Campo 2 - Renda Desejada na Aposentadoria */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Target className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual renda mensal você deseja na aposentadoria?
          </label>
          
          <DropdownMenu open={isRetirementDropdownOpen} onOpenChange={setIsRetirementDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-14 w-full justify-start text-lg border-2 border-[#E5E7EB] hover:border-[#B78D4A] rounded-xl px-4 bg-white hover:bg-[#F9FAFB] transition-all duration-200"
              >
                {formData.targetRetirement ? 
                  retirementOptions.find(opt => opt.value === formData.targetRetirement)?.label : 
                  "Selecione a renda desejada"
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[400px] bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg">
              {retirementOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    handleInputChange('targetRetirement', option.value);
                    setIsRetirementDropdownOpen(false);
                  }}
                  className="h-12 text-lg hover:bg-[#C8F4D1] cursor-pointer transition-colors duration-150"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Campo 3 - Idade Atual */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <User className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual sua idade atual?
          </label>
          <Input
            type="text"
            placeholder="Ex: 35"
            value={formData.currentAge}
            onChange={(e) => handleAgeInput('currentAge', e.target.value)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 4 - Idade para Aposentar */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Clock className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Com quantos anos você quer se aposentar?
          </label>
          <Input
            type="text"
            placeholder="Ex: 60"
            value={formData.retirementAge}
            onChange={(e) => handleAgeInput('retirementAge', e.target.value)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 5 - Declaração IRPF */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Target className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Aonde você declara Imposto de Renda?
          </label>
          
          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="brasil-apo" 
                checked={formData.irpfDeclaration.includes("brasil")}
                onCheckedChange={(checked) => handleCheckboxChange("brasil", checked as boolean)}
              />
              <Label htmlFor="brasil-apo" className="flex items-center cursor-pointer text-lg font-medium">
                <Flag className="w-5 h-5 mr-2 text-[#B78D4A]" />
                Brasil
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="exterior-apo" 
                checked={formData.irpfDeclaration.includes("exterior")}
                onCheckedChange={(checked) => handleCheckboxChange("exterior", checked as boolean)}
              />
              <Label htmlFor="exterior-apo" className="flex items-center cursor-pointer text-lg font-medium">
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
            Construir Planejamento de Aposentadoria
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AposentadoriaForm;
