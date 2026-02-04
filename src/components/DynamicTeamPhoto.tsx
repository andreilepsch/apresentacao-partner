import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface DynamicTeamPhotoProps {
  className?: string;
}

const DynamicTeamPhoto: React.FC<DynamicTeamPhotoProps> = ({ className = '' }) => {
  const { branding } = useBranding();

  const photoUrl = branding.teamPhotoUrl || '/images/default-team-photo.jpg';

  return (
    <img
      src={photoUrl}
      alt={`Equipe ${branding.companyName}`}
      className={`w-full h-auto object-cover rounded-xl ${className}`}
    />
  );
};

export default DynamicTeamPhoto;
