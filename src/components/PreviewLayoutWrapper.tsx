import React from 'react';
import { usePreviewMode } from '@/contexts/PreviewModeContext';

interface PreviewLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PreviewLayoutWrapper: React.FC<PreviewLayoutWrapperProps> = ({ children, className = '' }) => {
  const { isPreviewMode } = usePreviewMode();
  
  return (
    <div className={`${isPreviewMode ? 'pt-16' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default PreviewLayoutWrapper;
