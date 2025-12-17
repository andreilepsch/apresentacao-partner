
import { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  placeholder?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  placeholder 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);

  useEffect(() => {
    // Verificar se a imagem já está em cache do preload
    const checkImageCache = () => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        setIsLoaded(true);
        setIsInView(true);
        return true;
      }
      return false;
    };

    if (priority) {
      // Imagens prioritárias: carregar imediatamente
      if (!checkImageCache()) {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
      }
      return;
    }

    // Verificar se já está em cache
    if (checkImageCache()) return;

    // Lazy loading para imagens não-críticas
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Começar a carregar um pouco antes
    );

    const element = document.getElementById(`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [src, priority]);

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src, isLoaded]);

  return (
    <div 
      id={`img-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          {placeholder && (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
      )}
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
