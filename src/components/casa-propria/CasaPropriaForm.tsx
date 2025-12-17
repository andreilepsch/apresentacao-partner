
import { useState } from "react";
import { DollarSign, Home, TrendingUp, Clock, Target, Building, Flag, Globe, CreditCard } from "lucide-react";
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
  monthlyRent: string;
  availableSavings: string;
  monthlyIncome: string;
  monthlyInstallment: string;
  taxDeclaration: string[];
  propertyValue: string;
  timeframe: string;
}

interface CasaPropriaFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onAnalysis: () => void;
}

const CasaPropriaForm = ({ formData, setFormData, onAnalysis }: CasaPropriaFormProps) => {
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData({
      ...formData,
      taxDeclaration: checked 
        ? [...formData.taxDeclaration, value]
        : formData.taxDeclaration.filter(item => item !== value)
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

  const isFormComplete = formData.monthlyRent !== "" && 
                       formData.monthlyIncome !== "" && 
                       formData.monthlyInstallment !== "" &&
                       formData.availableSavings !== "" && 
                       formData.propertyValue !== "" &&
                       formData.taxDeclaration.length > 0 &&
                       formData.timeframe !== "";

  const timeframeOptions = [
    { value: "1", label: "1 ano" },
    { value: "3", label: "3 anos" },
    { value: "5", label: "5 anos" },
    { value: "10", label: "10 anos" },
    { value: "15", label: "15 anos" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mx-auto max-w-2xl">
      <div className="space-y-6">
        
        {/* Campo 1 - Renda Mensal Familiar */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <TrendingUp className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual sua renda mensal familiar?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 8.000"
            value={formData.monthlyIncome}
            onChange={(e) => handleCurrencyInput('monthlyIncome', e.target.value, 6)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 2 - Valor de Parcelas Mensais */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <CreditCard className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual valor de parcela que você consegue pagar junto do aluguel por mês?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 1.500"
            value={formData.monthlyInstallment}
            onChange={(e) => handleCurrencyInput('monthlyInstallment', e.target.value, 5)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 3 - Valor do Aluguel Atual */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Home className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Quanto você paga de aluguel atualmente?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 2.500"
            value={formData.monthlyRent}
            onChange={(e) => handleCurrencyInput('monthlyRent', e.target.value, 5)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 4 - Valor Disponível para Entrada */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <DollarSign className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Quanto você tem disponível para dar de entrada?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 50.000"
            value={formData.availableSavings}
            onChange={(e) => handleCurrencyInput('availableSavings', e.target.value, 7)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 5 - Valor do Imóvel Desejado */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Building className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Qual valor de imóvel médio você quer comprar?
          </label>
          <Input
            type="text"
            placeholder="Ex: R$ 300.000"
            value={formData.propertyValue}
            onChange={(e) => handleCurrencyInput('propertyValue', e.target.value, 7)}
            className="h-14 text-lg border-2 border-[#E5E7EB] focus:border-[#B78D4A] rounded-xl px-4 transition-all duration-200"
          />
        </div>

        {/* Campo 6 - Declaração de Imposto de Renda */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Target className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Onde você declara seu imposto de renda?
          </label>
          
          <div className="flex gap-6 pt-2">
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="brasil-casa" 
                checked={formData.taxDeclaration.includes("brasil")}
                onCheckedChange={(checked) => handleCheckboxChange("brasil", checked as boolean)}
              />
              <Label htmlFor="brasil-casa" className="flex items-center cursor-pointer text-lg font-medium">
                <Flag className="w-5 h-5 mr-2 text-[#B78D4A]" />
                Brasil
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-2 border-[#E5E7EB] rounded-xl hover:border-[#B78D4A] transition-all duration-200">
              <Checkbox 
                id="exterior-casa" 
                checked={formData.taxDeclaration.includes("exterior")}
                onCheckedChange={(checked) => handleCheckboxChange("exterior", checked as boolean)}
              />
              <Label htmlFor="exterior-casa" className="flex items-center cursor-pointer text-lg font-medium">
                <Globe className="w-5 h-5 mr-2 text-[#B78D4A]" />
                Exterior
              </Label>
            </div>
          </div>
        </div>

        {/* Campo 7 - Prazo */}
        <div className="space-y-3">
          <label className="flex items-center text-[#193D32] font-semibold text-lg">
            <Clock className="w-5 h-5 mr-3 text-[#B78D4A]" />
            Em quanto tempo você quer comprar sua casa?
          </label>
          
          <DropdownMenu open={isTimeframeDropdownOpen} onOpenChange={setIsTimeframeDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-14 w-full justify-start text-lg border-2 border-[#E5E7EB] hover:border-[#B78D4A] rounded-xl px-4 bg-white hover:bg-[#F9FAFB] transition-all duration-200"
              >
                {formData.timeframe ? 
                  timeframeOptions.find(opt => opt.value === formData.timeframe)?.label : 
                  "Selecione o prazo"
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[400px] bg-white border-2 border-[#E5E7EB] rounded-xl shadow-lg">
              {timeframeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => {
                    handleInputChange('timeframe', option.value);
                    setIsTimeframeDropdownOpen(false);
                  }}
                  className="h-12 text-lg hover:bg-[#C8F4D1] cursor-pointer transition-colors duration-150"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
            <Target className="w-6 h-6 mr-2" />
            Construir Planejamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CasaPropriaForm;
