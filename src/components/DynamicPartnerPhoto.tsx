import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface DynamicPartnerPhotoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const DynamicPartnerPhoto: React.FC<DynamicPartnerPhotoProps> = ({ 
  className = '',
  size = 'md'
}) => {
  const { branding } = useBranding();

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const photoUrl = branding.partnerPhotoUrl || '/lovable-uploads/7e5e79f6-17c4-4b38-b27b-e2dcbdcafb17.png';

  return (
    <img 
      src={photoUrl}
      alt={`Parceiro ${branding.companyName}`}
      className={`${sizeClasses[size]} object-cover rounded-full ${className}`}
    />
  );
};

export default DynamicPartnerPhoto;
