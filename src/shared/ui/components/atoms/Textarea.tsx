import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <textarea
          {...props}
          ref={ref}
          className={`w-full bg-surface border ${
            error ? 'border-error' : 'border-border'
          } rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

