import React, { useState, useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { PageContext } from '@/types/pageContext';

interface DynamicLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light' | 'icon-only';
  className?: string;
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({
  size = 'md',
  variant = 'light',
  className = ''
}) => {
  const { branding, isLoading, pageContext } = useBranding();
  const [logoSrc, setLogoSrc] = useState<string>('');

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  };

  // Determinar logo correta baseada no pageContext
  const getLogoSrc = () => {
    // Se estiver carregando e não for tela de login, esperar para evitar flash da logo padrão
    if (isLoading && pageContext !== PageContext.AUTHENTICATION) {
      return '';
    }

    // 1. Prioridade Máxima: Logo Negativa Customizada (para variantes dark)
    if (variant === 'dark' && branding.logoNegativeUrl) {
      return branding.logoNegativeUrl;
    }

    // 2. Prioridade: Logo Principal Customizada
    if (branding.logoUrl) {
      return branding.logoUrl;
    }

    // 3. Fallback: No Default Logo
    return '';
  };

  // Atualizar logo quando branding, pageContext ou variant mudarem
  useEffect(() => {
    const newSrc = getLogoSrc();
    console.log('🖼️ DynamicLogo: Logo source updated:', {
      isLoading,
      pageContext,
      brandingLogoUrl: branding.logoUrl,
      brandingLogoNegativeUrl: branding.logoNegativeUrl,
      variant,
      finalSrc: newSrc
    });
    setLogoSrc(newSrc);
  }, [branding.logoUrl, branding.logoNegativeUrl, isLoading, variant, pageContext]);

  if (!logoSrc && !isLoading) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      {logoSrc ? (
        <img
          key={logoSrc}
          src={logoSrc}
          alt={branding.companyName}
          className={`${sizeClasses[size]} object-contain transition-opacity duration-300`}
          loading="eager"
        />
      ) : (
        <div className={`${sizeClasses[size]} animate-pulse bg-gray-200 rounded`} />
      )}
    </div>
  );
};

export default DynamicLogo;
