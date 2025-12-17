import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook para navegação que preserva o parâmetro ?preview
 * Usado para manter o modo preview ativo durante toda a jornada da apresentação
 */
export const usePreviewNavigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const navigateWithPreview = useCallback((path: string, options?: any) => {
    const preview = searchParams.get('preview');
    
    if (preview) {
      // Preservar preview na navegação
      const separator = path.includes('?') ? '&' : '?';
      const newPath = `${path}${separator}preview=${preview}`;
      console.log('🔗 usePreviewNavigation: Navigating with preview preserved:', {
        originalPath: path,
        finalPath: newPath,
        previewId: preview
      });
      navigate(newPath, options);
    } else {
      // Navegação normal sem preview
      console.log('🔗 usePreviewNavigation: Normal navigation (no preview):', path);
      navigate(path, options);
    }
  }, [navigate, searchParams]);

  return { navigateWithPreview };
};
