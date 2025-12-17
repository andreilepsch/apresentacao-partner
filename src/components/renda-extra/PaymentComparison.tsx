
import { DollarSign, CreditCard } from "lucide-react";

const PaymentComparison = () => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="bg-[#F7F5F0] rounded-xl p-8">
        <h3 className="text-2xl font-bold text-[#193D32] text-center mb-6">
          Comparativo das modalidades
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#193D32] rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-[#B78D4A]" />
            </div>
            <h4 className="font-bold text-[#193D32] mb-2">Pagamento em Dinheiro</h4>
            <p className="text-sm text-[#333333]/70">
              Lance pago integralmente com recursos próprios, 
              mantendo o valor total do crédito disponível.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#193D32] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-[#B78D4A]" />
            </div>
            <h4 className="font-bold text-[#193D32] mb-2">Pagamento com o Crédito</h4>
            <p className="text-sm text-[#333333]/70">
              Lance pago com parte do próprio crédito, 
              reduzindo o valor disponível para compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComparison;
