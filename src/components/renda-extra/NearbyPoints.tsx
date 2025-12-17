
import { FC } from "react";
import { LucideIcon } from "lucide-react";

interface NearbyPoint {
  icon: LucideIcon;
  name: string;
  distance: string;
  color: string;
}

interface NearbyPointsProps {
  points: NearbyPoint[];
}

const NearbyPoints: FC<NearbyPointsProps> = ({ points }) => {
  return (
    <div>
      <h3 className="text-[22px] font-semibold text-[#193D32] mb-6 text-center">
        Pontos Estratégicos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {points.map((point, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                <point.icon className={`w-5 h-5 ${point.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-[#193D32] text-sm">{point.name}</h4>
                <p className="text-xs text-gray-600">{point.distance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPoints;
