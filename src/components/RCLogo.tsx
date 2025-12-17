/**
 * RCLogo - Logo component with primary/secondary variants
 * 
 * Use RCLogo when you need:
 * - Simple primary (black) / secondary (white) variants
 * - Backward compatibility with existing code
 * 
 * Use DynamicLogo when you need:
 * - More variants (light/dark/icon-only)
 * - Explicit control over logo style based on background
 * 
 * Both components:
 * - Prioritize custom branding.logoUrl when available
 * - Fall back to default Partner logos
 * - Re-render correctly when branding updates
 */

import React, { useState, useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { PageContext } from '@/types/pageContext';

interface RCLogoProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RCLogo: React.FC<RCLogoProps> = ({ 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const { branding, isLoading, pageContext } = useBranding();
  const [logoSrc, setLogoSrc] = useState<string>('');

  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto'
  };

  const getLogoSrc = () => {
    // AUTHENTICATION/NAVIGATION: SEMPRE usar logo padrão
    if (pageContext === PageContext.AUTHENTICATION || pageContext === PageContext.NAVIGATION) {
      console.log('🎨 RCLogo: Using default logo for', pageContext);
      if (variant === 'secondary') {
        return '/lovable-uploads/logo-partner-white-text.png';
      }
      return '/lovable-uploads/logo-partner-black-text.png';
    }
    
    // PRESENTATION: Usar logo customizada se disponível
    if (pageContext === PageContext.PRESENTATION) {
      // Se ainda está carregando, usar default temporário
      if (isLoading) {
        console.log('🎨 RCLogo: Loading, using temporary default');
        if (variant === 'secondary') {
          return '/lovable-uploads/logo-partner-white-text.png';
        }
        return '/lovable-uploads/logo-partner-black-text.png';
      }
      
      // Priorizar logo customizada se existir
      if (branding.logoUrl) {
        console.log('🎨 RCLogo: Using custom logo:', branding.logoUrl);
        return branding.logoUrl;
      }
    }
    
    // Fallback para logo default baseada na variant
    console.log('🎨 RCLogo: Using default logo for variant:', variant);
    if (variant === 'secondary') {
      return '/lovable-uploads/logo-partner-white-text.png';
    }
    return '/lovable-uploads/logo-partner-black-text.png';
  };

  // Atualizar logo quando branding, pageContext ou variant mudarem
  useEffect(() => {
    const newSrc = getLogoSrc();
    console.log('🎨 RCLogo: Logo source updated:', {
      isLoading,
      pageContext,
      brandingLogoUrl: branding.logoUrl,
      variant,
      finalSrc: newSrc
    });
    setLogoSrc(newSrc);
  }, [branding.logoUrl, isLoading, variant, pageContext]);

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        key={logoSrc}
        src={logoSrc}
        alt={branding.companyName}
        className={`${sizeClasses[size]} object-contain transition-opacity duration-300`}
        loading="eager"
      />
    </div>
  );
};

export default RCLogo;
