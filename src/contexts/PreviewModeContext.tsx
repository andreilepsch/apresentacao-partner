import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface PreviewModeContextType {
  isPreviewMode: boolean;
  previewCompanyId: string | null;
  enterPreviewMode: (companyId: string) => void;
  exitPreviewMode: () => void;
}

const PreviewModeContext = createContext<PreviewModeContextType | undefined>(undefined);

export const PreviewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewCompanyId, setPreviewCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const previewParam = searchParams.get('preview');
    console.log('🔗 PreviewModeContext: URL change detected:', {
      previewParam,
      currentPath: window.location.pathname,
      fullUrl: window.location.href,
      allParams: Object.fromEntries(searchParams.entries())
    });
    
    if (previewParam) {
      console.log('✅ PreviewMode: Entering preview mode for company:', previewParam);
      setIsPreviewMode(true);
      setPreviewCompanyId(previewParam);
    } else {
      console.log('❌ PreviewMode: No preview param found, exiting preview mode');
      setIsPreviewMode(false);
      setPreviewCompanyId(null);
    }
  }, [searchParams]);

  const enterPreviewMode = (companyId: string) => {
    setSearchParams({ preview: companyId });
  };

  const exitPreviewMode = () => {
    console.log('🚪 Exiting preview mode, navigating to meeting selection');
    navigate('/meeting-selection');
  };

  return (
    <PreviewModeContext.Provider value={{
      isPreviewMode,
      previewCompanyId,
      enterPreviewMode,
      exitPreviewMode
    }}>
      {children}
    </PreviewModeContext.Provider>
  );
};

export const usePreviewMode = () => {
  const context = useContext(PreviewModeContext);
  if (!context) {
    throw new Error('usePreviewMode must be used within PreviewModeProvider');
  }
  return context;
};
