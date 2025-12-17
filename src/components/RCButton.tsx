
import React from 'react';
import { cn } from '@/lib/utils';

interface RCButtonProps {
  variant?: 'primary' | 'secondary' | 'auxiliary';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const RCButton = ({ 
  variant = 'primary', 
  children, 
  onClick, 
  className,
  disabled = false 
}: RCButtonProps) => {
  const baseClasses = "font-manrope font-semibold rounded-full px-8 py-4 transition-all duration-300 text-body disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-rc-secondary text-rc-primary hover:bg-rc-accent hover:text-rc-primary",
    secondary: "bg-rc-primary text-white hover:bg-rc-accent hover:text-rc-primary",
    auxiliary: "border-2 border-gray-400 text-gray-600 bg-transparent hover:bg-rc-accent hover:text-rc-primary hover:border-rc-accent"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
};

export default RCButton;
