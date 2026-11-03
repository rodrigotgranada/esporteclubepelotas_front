import React from 'react';

export interface LayoutContainerProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'ul' | 'ol' | 'li';
}

export const LayoutContainer = React.forwardRef<HTMLElement, LayoutContainerProps>(
  ({ children, as: Component = 'div', className = '', ...props }, ref) => {
    return (
      <Component ref={ref as any} className={className} {...props}>
        {children}
      </Component>
    );
  }
);
LayoutContainer.displayName = 'LayoutContainer';
