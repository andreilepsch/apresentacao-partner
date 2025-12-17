import { FC } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { usePropertyImagePreload } from "@/hooks/usePropertyImagePreload";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface OptimizedPropertyCarouselProps {
  images: string[];
}

const OptimizedPropertyCarousel: FC<OptimizedPropertyCarouselProps> = ({ images }) => {
  // Preload todas as imagens para transições instantâneas
  usePropertyImagePreload(images);
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="bg-gray-50 rounded-xl aspect-[4/3] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <OptimizedImage
                  src={image}
                  alt={`Imóvel - Vista ${index + 1}`}
                  className="w-full h-full hover:scale-105 transition-transform duration-300"
                  priority={index === 0} // Primeira imagem tem prioridade
                  placeholder={`Carregando vista ${index + 1}...`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default OptimizedPropertyCarousel;
