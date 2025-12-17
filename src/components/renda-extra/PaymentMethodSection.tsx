
interface PaymentMethod {
  type: string;
  subtitle?: string;
  cards: Array<{
    title: string;
    value: string;
    bgColor: string;
    border?: boolean;
  }>;
}

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethod[];
}

const PaymentMethodSection = ({ paymentMethods }: PaymentMethodSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
      {paymentMethods.map((method, index) => (
        <div key={index} className="space-y-6">
          {/* Method Title */}
          <div className="text-center h-16 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-[#193D32] mb-2">
              {method.type}
            </h2>
            {method.subtitle && (
              <p className="text-sm text-[#B78D4A] font-semibold">
                {method.subtitle}
              </p>
            )}
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {method.cards.map((card, cardIndex) => (
              <div 
                key={cardIndex}
                className={`${card.bgColor} ${card.border ? 'border-2 border-white' : ''} rounded-xl p-6 text-white h-24 flex flex-col justify-center`}
              >
                <div className="text-sm font-medium mb-2 opacity-90">
                  {card.title}
                </div>
                <div className="text-2xl font-bold">
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSection;
