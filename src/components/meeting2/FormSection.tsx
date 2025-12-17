import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, TrendingUp, Building, PiggyBank, ArrowRightLeft, BarChart3 } from 'lucide-react';
import { Meeting2FormData, INVESTMENT_STRATEGY_OPTIONS } from '@/types/meeting2Form';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  sectionId: 'personal' | 'strategy' | 'property';
  formData: Meeting2FormData;
  updateField: <K extends keyof Meeting2FormData>(field: K, value: Meeting2FormData[K]) => void;
  errors: Partial<Record<keyof Meeting2FormData, string>>;
}

const FormSection: React.FC<FormSectionProps> = ({
  sectionId,
  formData,
  updateField,
  errors
}) => {
  const getSectionConfig = () => {
    switch (sectionId) {
      case 'personal':
        return {
          title: 'Dados Pessoais',
          icon: User,
          description: 'Informações básicas para personalizar sua apresentação'
        };
      case 'strategy':
        return {
          title: 'Estratégia de Investimento',
          icon: TrendingUp,
          description: 'Escolha sua abordagem financeira preferida'
        };
      case 'property':
        return {
          title: 'Seleção de Imóvel',
          icon: Building,
          description: 'Selecione o empreendimento de interesse'
        };
    }
  };

  const config = getSectionConfig();
  const Icon = config.icon;

  const renderPersonalFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-white font-medium">Nome Completo *</Label>
        <Input
          value={formData.nome}
          onChange={(e) => updateField('nome', e.target.value)}
          placeholder="Seu nome completo"
          className={cn(
            "bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12",
            errors.nome && "border-red-400 focus:border-red-400"
          )}
        />
        {errors.nome && (
          <span className="text-red-400 text-sm">{errors.nome}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-white font-medium">Idade *</Label>
        <Input
          type="number"
          value={formData.idade}
          onChange={(e) => updateField('idade', parseInt(e.target.value) || '')}
          placeholder="Sua idade"
          min="18"
          max="120"
          className={cn(
            "bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12",
            errors.idade && "border-red-400 focus:border-red-400"
          )}
        />
        {errors.idade && (
          <span className="text-red-400 text-sm">{errors.idade}</span>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label className="text-white font-medium">Profissão *</Label>
        <Input
          value={formData.profissao}
          onChange={(e) => updateField('profissao', e.target.value)}
          placeholder="Sua profissão atual"
          className={cn(
            "bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12",
            errors.profissao && "border-red-400 focus:border-red-400"
          )}
        />
        {errors.profissao && (
          <span className="text-red-400 text-sm">{errors.profissao}</span>
        )}
      </div>
    </div>
  );

  const getStrategyIcon = (iconName: string) => {
    switch (iconName) {
      case 'PiggyBank':
        return PiggyBank;
      case 'BarChart3':
        return BarChart3;
      case 'ArrowRightLeft':
        return ArrowRightLeft;
      default:
        return TrendingUp;
    }
  };

  const renderStrategyFields = () => (
    <div className="space-y-6">
      <RadioGroup
        value={formData.estrategiaInvestimento}
        onValueChange={(value) => updateField('estrategiaInvestimento', value as any)}
        className="space-y-4"
      >
        {INVESTMENT_STRATEGY_OPTIONS.map((option) => {
          const StrategyIcon = getStrategyIcon(option.icon);
          
          return (
            <div
              key={option.value}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                "bg-white/5 hover:bg-white/10",
                formData.estrategiaInvestimento === option.value
                  ? "border-[#C9A45C] bg-[#C9A45C]/10"
                  : "border-white/20 hover:border-white/30"
              )}
              onClick={() => updateField('estrategiaInvestimento', option.value)}
            >
              <RadioGroupItem value={option.value} id={option.value} className="border-white/40 text-[#C9A45C]" />
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-[#C9A45C]/20 p-2 rounded-lg">
                  <StrategyIcon className="w-5 h-5 text-[#C9A45C]" />
                </div>
                <div className="flex-1">
                  <Label htmlFor={option.value} className="text-white font-semibold cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-white/70 text-sm">{option.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
      
      {errors.estrategiaInvestimento && (
        <div className="text-center">
          <span className="text-red-400 text-sm">{errors.estrategiaInvestimento}</span>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (sectionId) {
      case 'personal':
        return renderPersonalFields();
      case 'strategy':
        return renderStrategyFields();
      case 'property':
        return (
          <div className="text-center text-white/70">
            <p>A seleção de imóvel será exibida em seção separada</p>
          </div>
        );
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden animate-fade-in">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#C9A45C]/20 p-3 rounded-xl">
            <Icon className="w-6 h-6 text-[#C9A45C]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{config.title}</h3>
            <p className="text-white/70">{config.description}</p>
          </div>
        </div>
        
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default FormSection;