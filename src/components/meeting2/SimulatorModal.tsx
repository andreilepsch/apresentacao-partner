import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, AlertCircle } from 'lucide-react';

interface SimulatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimulate: (newInstallment: number) => void;
  currentInstallment?: number;
}

export function SimulatorModal({ 
  open, 
  onOpenChange, 
  onSimulate, 
  currentInstallment = 0 
}: SimulatorModalProps) {
  const [installmentValue, setInstallmentValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Converte para número e formata
    const amount = Number(numbers) / 100;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return Number(numbers) / 100;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    setInstallmentValue(formatted);
    setError('');
  };

  const handleSimulate = () => {
    const numericValue = parseCurrency(installmentValue);
    
    if (numericValue < 500) {
      setError('O valor mínimo da parcela é R$ 500,00');
      return;
    }
    
    if (numericValue > 50000) {
      setError('O valor máximo da parcela é R$ 50.000,00');
      return;
    }

    onSimulate(numericValue);
    onOpenChange(false);
    setInstallmentValue('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSimulate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#C9A45C] to-[#E5C875] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Simulador de Parcelas
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="installment" className="text-sm font-medium text-gray-700">
              Nova Parcela Mensal Desejada
            </Label>
            <Input
              id="installment"
              type="text"
              value={installmentValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="R$ 0,00"
              className="text-lg font-semibold text-center"
            />
            {currentInstallment > 0 && (
              <p className="text-xs text-gray-500 text-center">
                Parcela atual: {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(currentInstallment)}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSimulate}
              disabled={!installmentValue || !!error}
              className="flex-1 bg-gradient-to-r from-[#C9A45C] to-[#E5C875] hover:from-[#B78D4A] hover:to-[#D4B75C] text-white"
            >
              Simular
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}