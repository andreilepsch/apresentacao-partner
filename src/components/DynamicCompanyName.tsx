import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface DynamicCompanyNameProps {
  className?: string;
}

const DynamicCompanyName: React.FC<DynamicCompanyNameProps> = ({ className = '' }) => {
  const { branding } = useBranding();

  return (
    <span className={className}>{branding.companyName || 'Referência Partner'}</span>
  );
};

export default DynamicCompanyName;
