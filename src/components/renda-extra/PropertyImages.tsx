
import { FC } from "react";

interface PropertyImagesProps {
  images: Array<{
    placeholder: string;
    alt: string;
  }>;
}

const PropertyImages: FC<PropertyImagesProps> = ({ images }) => {
  return (
    <div className="max-w-6xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-200 rounded-xl aspect-[4/3] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-sm">{image.placeholder}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyImages;
