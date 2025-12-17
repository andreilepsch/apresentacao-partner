
import { FC } from "react";
import { LucideIcon } from "lucide-react";

interface Amenity {
  icon: LucideIcon;
  name: string;
  color: string;
}

interface PropertyAmenitiesProps {
  amenities: Amenity[];
}

const PropertyAmenities: FC<PropertyAmenitiesProps> = ({ amenities }) => {
  return (
    <div className="max-w-5xl mx-auto mb-16">
      <h3 className="text-[22px] font-semibold text-[#193D32] text-center mb-8">
        Diferenciais do Imóvel
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {amenities.map((amenity, index) => (
          <div 
            key={index}
            className="bg-[#F7F5F0] rounded-xl p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <amenity.icon className={`w-6 h-6 ${amenity.color}`} />
            </div>
            <h4 className="font-semibold text-[#193D32] text-sm">{amenity.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;
