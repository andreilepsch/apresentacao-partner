
import { Home } from "lucide-react";

interface HouseIconsSectionProps {
  count: number;
  selectedPath: 'rent-and-credit' | 'investment-first' | null;
  cycle: number;
}

const HouseIconsSection = ({ count, selectedPath, cycle }: HouseIconsSectionProps) => {
  const renderHouseIcons = (count: number) => {
    return (
      <div className="relative py-6">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {[...Array(count)].map((_, index) => {
            // Lógica para determinar se é casa própria
            const isOwnHome = (selectedPath === 'rent-and-credit' && index === 0) ||
                             (selectedPath === 'investment-first' && cycle === 3 && index === count - 1) ||
                             (selectedPath === 'investment-first' && cycle === 4 && index === 2); // Ciclo 3 vira moradia no ciclo 4
            
            return (
              <div
                key={index}
                className="group transform transition-all duration-300 relative"
              >
                {/* House container */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
                  transition-all duration-300 hover:scale-105
                  ${isOwnHome 
                    ? 'bg-gradient-to-br from-[#B78D4A] to-[#A67B3A] ring-2 ring-[#B78D4A]/20' 
                    : 'bg-gradient-to-br from-[#355F4D] to-[#224239]'
                  }
                `}>
                  <Home className="w-8 h-8 text-white" />
                </div>
                
                {/* Property label */}
                {isOwnHome && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-[#B78D4A] text-white px-4 py-1 rounded-full text-xs font-medium shadow-md">
                      Moradia
                    </div>
                  </div>
                )}
                
                {/* Connection line */}
                {index < count - 1 && (
                  <div className="absolute top-1/2 left-full w-4 h-0.5 bg-gradient-to-r from-[#355F4D]/30 to-transparent transform -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return renderHouseIcons(count);
};

export default HouseIconsSection;
