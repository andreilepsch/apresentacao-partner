import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';
import { Quote } from 'lucide-react';

const DynamicAuthorityQuote: React.FC = () => {
  const { branding } = useBranding();

  return (
    <div className="max-w-4xl mx-auto mb-16 relative">
      <div className="absolute top-0 left-0 w-16 h-16 opacity-10">
        <Quote className="w-full h-full text-primary" />
      </div>
      
      <blockquote className="text-xl md:text-2xl font-light text-primary text-center italic px-12 py-8 relative">
        "{branding.authorityQuote}"
      </blockquote>
      
      <div className="text-center mt-6">
        <p className="font-bold text-lg text-primary">{branding.authorityQuoteAuthor}</p>
        <p className="text-sm text-muted-foreground">{branding.authorityQuoteRole}</p>
      </div>
    </div>
  );
};

export default DynamicAuthorityQuote;
