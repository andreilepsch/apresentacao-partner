
import { FC } from "react";

interface LocationMapProps {
  mapImage: string;
  mapAlt: string;
}

const LocationMap: FC<LocationMapProps> = ({ mapImage, mapAlt }) => {
  return (
    <div className="mb-8">
      <div className="relative rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <img 
          src={mapImage}
          alt={mapAlt}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default LocationMap;
