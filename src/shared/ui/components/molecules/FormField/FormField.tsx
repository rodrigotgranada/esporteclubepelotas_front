'use client';

import React from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
  FieldError,
} from 'react-hook-form';
import { LayoutContainer, Text } from '@/shared/ui/components/atoms';
import { FORM_FIELD_TEXTS } from './FormField.constants';

export interface FormFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
  errorMessage?: string;
}

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | FieldError;
  required?: boolean;
  className?: string;
  name?: TName | string;
  control?: any;
  children?: React.ReactNode;
  render?: (props: FormFieldRenderProps<TFieldValues, TName>) => React.ReactNode;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  label,
  description,
  error,
  required = false,
  className = '',
  name,
  control,
  children,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  const getErrorMessage = (err?: string | FieldError): string | undefined => {
    if (!err) return undefined;
    if (typeof err === 'string') return err;
    return err.message;
  };

  const renderContent = (errorMessage?: string) => (
    <LayoutContainer className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1 select-none">
          {label}
          {required && (
            <Text
              as="span"
              className="text-[#ea580c] font-black"
              aria-label={FORM_FIELD_TEXTS.REQUIRED_ARIA_LABEL}
            >
              {FORM_FIELD_TEXTS.REQUIRED_ASTERISK}
            </Text>
          )}
        </Text>
      )}

      {render ? null : children}

      {description && !errorMessage && (
        <Text as="p" className="text-xs text-text-secondary">
          {description}
        </Text>
      )}

      {errorMessage && (
        <Text as="span" className="text-xs font-semibold text-[#ea580c]">
          {errorMessage}
        </Text>
      )}
    </LayoutContainer>
  );

  if (control && name && render) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState, formState }) => {
          const resolvedError =
            getErrorMessage(error) || fieldState.error?.message;
          return (
            <LayoutContainer className={`flex flex-col gap-1.5 w-full ${className}`}>
              {label && (
                <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1 select-none">
                  {label}
                  {required && (
                    <Text
                      as="span"
                      className="text-[#ea580c] font-black"
                      aria-label={FORM_FIELD_TEXTS.REQUIRED_ARIA_LABEL}
                    >
                      {FORM_FIELD_TEXTS.REQUIRED_ASTERISK}
                    </Text>
                  )}
                </Text>
              )}

              {render({
                field: field as any,
                fieldState,
                formState: formState as any,
                errorMessage: resolvedError,
              })}

              {description && !resolvedError && (
                <Text as="p" className="text-xs text-text-secondary">
                  {description}
                </Text>
              )}

              {resolvedError && (
                <Text as="span" className="text-xs font-semibold text-[#ea580c]">
                  {resolvedError}
                </Text>
              )}
            </LayoutContainer>
          );
        }}
      />
    );
  }

  const resolvedError = getErrorMessage(error);
  return renderContent(resolvedError);
}
