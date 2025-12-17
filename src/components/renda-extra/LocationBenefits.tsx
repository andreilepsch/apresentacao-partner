
import { FC } from "react";
import { Car, Building2 } from "lucide-react";

const LocationBenefits: FC = () => {
  return (
    <div className="max-w-5xl mx-auto mb-16">
      <div className="bg-[#F7F5F0] rounded-xl p-8 md:p-12">
        <h3 className="text-[22px] font-semibold text-[#193D32] text-center mb-8">
          Por que essa localização é estratégica?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#193D32] rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-[#B78D4A]" />
            </div>
            <h4 className="font-bold text-[#193D32] mb-2">Mobilidade</h4>
            <p className="text-sm text-[#333333]/70">
              Acesso fácil ao transporte público e principais vias da cidade
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#193D32] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[#B78D4A]" />
            </div>
            <h4 className="font-bold text-[#193D32] mb-2">Valorização</h4>
            <p className="text-sm text-[#333333]/70">
              Região em constante desenvolvimento com alta demanda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationBenefits;
