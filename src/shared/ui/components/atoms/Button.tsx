import React from 'react';

export type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'outline' | 'custom';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'none';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-yellow-400 hover:bg-yellow-500 text-blue-950 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
  danger: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-[0_0_20px_rgba(202,138,4,0.2)]',
  outline: 'bg-transparent border border-white/20 text-white hover:bg-white/10',
  ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5',
  custom: '', // Para manter compatibilidade com classes completamente customizadas antigas
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3.5 px-6 font-bold',
  lg: 'py-4 px-8 text-lg font-bold',
  none: '',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'custom', size = 'none', fullWidth = false, type = 'button', ...props }, ref) => {
    
    const baseStyles = variant !== 'custom' 
      ? 'flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed' 
      : '';
      
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button 
        ref={ref} 
        type={type} 
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim()} 
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
