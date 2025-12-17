import { useEffect } from 'react';

/**
 * Hook para fazer preload de imagens de propriedades
 * Carrega todas as imagens em segundo plano para garantir transições suaves
 */
export const usePropertyImagePreload = (images: string[]) => {
  useEffect(() => {
    if (!images || images.length === 0) return;

    console.log('🖼️ Preloading property images:', images.length);

    // Preload todas as imagens de propriedades
    const preloadPromises = images.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log('✅ Preloaded:', src);
          resolve();
        };
        img.onerror = () => {
          console.warn('⚠️ Failed to preload:', src);
          reject();
        };
        img.src = src;
      });
    });

    // Log quando todas as imagens estiverem prontas
    Promise.all(preloadPromises)
      .then(() => console.log('✨ All property images preloaded successfully'))
      .catch(() => console.warn('⚠️ Some property images failed to preload'));

    // Cleanup não necessário para preload de imagens
  }, [images]);
};
