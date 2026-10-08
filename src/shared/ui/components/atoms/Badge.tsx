import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'primary' | 'danger' | 'default';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  isAbsolute?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  primary: 'bg-primary text-background font-bold border-primary/20',
  danger: 'bg-error/10 text-error border-error/20',
  default: 'bg-surface text-text-primary border-border',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  isAbsolute = false
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center gap-1.5 uppercase rounded-md border';
  
  // Variantes primárias (sólidas) podem ter estilos arredondados diferentes dependendo do local, 
  // mas vamos manter o default ou permitir customizar pelo className.
  const absoluteStyles = isAbsolute ? 'absolute top-0 right-0 rounded-tr-xl rounded-bl-xl border-none rounded-tl-none rounded-br-none' : '';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${absoluteStyles} ${className}`}>
      {children}
    </span>
  );
};
