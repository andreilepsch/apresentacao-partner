import React from 'react';
import { useBranding } from '@/contexts/BrandingContext';

interface DynamicFeedbackQuestionProps {
  className?: string;
}

const DynamicFeedbackQuestion: React.FC<DynamicFeedbackQuestionProps> = ({ className = '' }) => {
  const { branding } = useBranding();

  return (
    <h1 className={className}>{branding.feedbackQuestion}</h1>
  );
};

export default DynamicFeedbackQuestion;
