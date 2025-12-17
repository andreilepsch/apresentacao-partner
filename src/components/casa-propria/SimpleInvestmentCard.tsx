import { Card } from "@/components/ui/card";

interface SimpleInvestmentCardProps {
  monthlyRent: number;
  formatCurrency: (value: number) => string;
}

const SimpleInvestmentCard = ({ monthlyRent, formatCurrency }: SimpleInvestmentCardProps) => {
  const totalInvested = monthlyRent * 12 * 5; // 5 anos de investimento
  const patrimonyReached = Math.floor(monthlyRent / 500) * 100000; // A cada 500 reais = 100 mil

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#193D32] mb-2">
            Sua Simulação - Casa Própria
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#B78D4A] to-[#355F4D] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            Investimento em casa própria durante 5 anos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Parcela Mensal */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#B78D4A] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[#193D32] mb-2">Parcela Mensal</h3>
            <p className="text-lg font-bold text-[#B78D4A]">{formatCurrency(monthlyRent)}</p>
            <p className="text-xs text-gray-500 mt-2">Valor mensal de investimento</p>
          </div>

          {/* Total Investido */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#193D32] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[#193D32] mb-2">Total Investido</h3>
            <p className="text-lg font-bold text-[#B78D4A]">{formatCurrency(totalInvested)}</p>
            <p className="text-xs text-gray-500 mt-2">Em 5 anos (60 meses)</p>
          </div>

          {/* Patrimônio Alcançado */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-[#355F4D] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[#193D32] mb-2">Patrimônio Alcançado</h3>
            <p className="text-lg font-bold text-[#B78D4A]">{formatCurrency(patrimonyReached)}</p>
            <p className="text-xs text-gray-500 mt-2">Valor do imóvel adquirido</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleInvestmentCard;