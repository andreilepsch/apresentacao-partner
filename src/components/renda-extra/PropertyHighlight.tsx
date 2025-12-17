
import { FC } from "react";

interface PropertyStats {
  area: string;
  bedrooms: string;
  quality: string;
}

interface PropertyHighlightProps {
  title: string;
  description: string;
  stats: PropertyStats;
}

const PropertyHighlight: FC<PropertyHighlightProps> = ({ title, description, stats }) => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="bg-[#193D32] rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-white/90 leading-relaxed mb-8">
          {description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-[#B78D4A] text-lg">{stats.area}</h4>
            <p className="text-sm text-white/80">Área útil</p>
          </div>
          <div>
            <h4 className="font-bold text-[#B78D4A] text-lg">{stats.bedrooms}</h4>
            <p className="text-sm text-white/80">Layout otimizado</p>
          </div>
          <div>
            <h4 className="font-bold text-[#B78D4A] text-lg">{stats.quality}</h4>
            <p className="text-sm text-white/80">Acabamento premium</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHighlight;
