import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface DynamicTeamPhotoProps {
  className?: string;
}

const DynamicTeamPhoto: React.FC<DynamicTeamPhotoProps> = ({ className = '' }) => {
  const { branding } = useBranding();

  const photoUrl = branding.teamPhotoUrl || '/lovable-uploads/7e5e79f6-17c4-4b38-b27b-e2dcbdcafb17.png';

  return (
    <img 
      src={photoUrl}
      alt={`Equipe ${branding.companyName}`}
      className={`w-full h-auto object-cover rounded-xl ${className}`}
    />
  );
};

export default DynamicTeamPhoto;
