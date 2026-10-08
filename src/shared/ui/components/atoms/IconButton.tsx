import React, { forwardRef } from 'react';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-yellow-500 text-blue-950 hover:bg-yellow-400',
  secondary: 'bg-white/10 text-white hover:text-yellow-400 hover:bg-white/20',
  ghost: 'bg-transparent text-gray-400 hover:text-white',
  danger: 'bg-white/10 text-white hover:text-red-400 hover:bg-red-500/20',
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'secondary', size = 'md', isLoading, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'flex items-center justify-center rounded-full transition-all cursor-pointer hover:scale-110';
    const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
