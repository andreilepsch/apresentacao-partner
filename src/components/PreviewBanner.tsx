import React from 'react';
import { usePreviewMode } from '@/contexts/PreviewModeContext';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';

const PreviewBanner: React.FC = () => {
  const { isPreviewMode, exitPreviewMode } = usePreviewMode();
  const { branding, isLoading } = useBranding();

  if (!isPreviewMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5" />
          <div>
            <p className="font-bold text-sm">Modo Pré-visualização</p>
            <p className="text-xs opacity-90">
              {isLoading ? (
                <span>Carregando branding...</span>
              ) : (
                <>
                  Visualizando branding de: <span className="font-semibold">{branding.companyName}</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <Button
          onClick={exitPreviewMode}
          variant="outline"
          size="sm"
          className="bg-white text-orange-600 hover:bg-orange-50 border-white"
        >
          <X className="w-4 h-4 mr-2" />
          Sair do Preview
        </Button>
      </div>
    </div>
  );
};

export default PreviewBanner;
