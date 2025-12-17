import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DynamicContactInfoProps {
  className?: string;
  variant?: 'inline' | 'buttons' | 'list';
  showIcons?: boolean;
}

const DynamicContactInfo: React.FC<DynamicContactInfoProps> = ({ 
  className = '',
  variant = 'list',
  showIcons = true
}) => {
  const { branding } = useBranding();

  const hasContact = branding.contactPhone || branding.contactEmail || branding.contactWhatsapp;

  if (!hasContact) {
    return null;
  }

  const handleWhatsAppClick = () => {
    if (branding.contactWhatsapp) {
      const cleanNumber = branding.contactWhatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (branding.contactPhone) {
      window.open(`tel:${branding.contactPhone}`);
    }
  };

  const handleEmailClick = () => {
    if (branding.contactEmail) {
      window.open(`mailto:${branding.contactEmail}`);
    }
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {branding.contactWhatsapp && (
          <Button 
            onClick={handleWhatsAppClick}
            variant="outline"
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        )}
        {branding.contactPhone && (
          <Button 
            onClick={handlePhoneClick}
            variant="outline"
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            Ligar
          </Button>
        )}
        {branding.contactEmail && (
          <Button 
            onClick={handleEmailClick}
            variant="outline"
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            Email
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
        {branding.contactWhatsapp && (
          <a 
            href={`https://wa.me/${branding.contactWhatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            {showIcons && <MessageCircle className="w-4 h-4" />}
            {branding.contactWhatsapp}
          </a>
        )}
        {branding.contactPhone && (
          <a 
            href={`tel:${branding.contactPhone}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            {showIcons && <Phone className="w-4 h-4" />}
            {branding.contactPhone}
          </a>
        )}
        {branding.contactEmail && (
          <a 
            href={`mailto:${branding.contactEmail}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            {showIcons && <Mail className="w-4 h-4" />}
            {branding.contactEmail}
          </a>
        )}
      </div>
    );
  }

  // variant === 'list'
  return (
    <div className={`space-y-3 ${className}`}>
      {branding.contactWhatsapp && (
        <a 
          href={`https://wa.me/${branding.contactWhatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:text-primary transition-colors"
        >
          {showIcons && <MessageCircle className="w-5 h-5" />}
          <span>{branding.contactWhatsapp}</span>
        </a>
      )}
      {branding.contactPhone && (
        <a 
          href={`tel:${branding.contactPhone}`}
          className="flex items-center gap-3 hover:text-primary transition-colors"
        >
          {showIcons && <Phone className="w-5 h-5" />}
          <span>{branding.contactPhone}</span>
        </a>
      )}
      {branding.contactEmail && (
        <a 
          href={`mailto:${branding.contactEmail}`}
          className="flex items-center gap-3 hover:text-primary transition-colors"
        >
          {showIcons && <Mail className="w-5 h-5" />}
          <span>{branding.contactEmail}</span>
        </a>
      )}
    </div>
  );
};

export default DynamicContactInfo;
