import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'custom';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'none';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:opacity-90 text-background font-bold border-none shadow-md',
  secondary: 'bg-button-secondary hover:brightness-110 text-text-primary border border-border',
  outline: 'bg-transparent border border-border text-text-primary hover:bg-surface',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface',
  custom: '',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3.5 px-6 font-bold',
  lg: 'py-4 px-8 text-lg font-bold',
  none: '',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'primary', size = 'md', fullWidth = false, leftIcon, rightIcon, isLoading = false, type = 'button', disabled, ...props }, ref) => {
    
    const baseStyles = variant !== 'custom' 
      ? 'flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed' 
      : '';
      
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button 
        ref={ref} 
        type={type} 
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim()} 
        {...props}
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = 'Button';
