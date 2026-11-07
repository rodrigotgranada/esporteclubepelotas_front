import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormField } from './FormField';

function TestControlledForm() {
  const { control } = useForm<{ testField: string }>({
    defaultValues: { testField: 'Valor Inicial' },
  });

  return (
    <FormField
      control={control}
      name="testField"
      label="Campo Teste"
      required
      description="Descrição auxiliar"
      render={({ field }) => (
        <input data-testid="test-input" {...field} />
      )}
    />
  );
}

describe('FormField Molecule', () => {
  it('renders label, description and required indicator in wrapper mode', () => {
    render(
      <FormField
        label="Nome Completo"
        required
        description="Informe o nome registrado"
        error="Nome é obrigatório"
      >
        <input data-testid="child-input" />
      </FormField>
    );

    expect(screen.getByText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByTestId('child-input')).toBeInTheDocument();
  });

  it('renders with react-hook-form controller integration', () => {
    render(<TestControlledForm />);

    expect(screen.getByText('Campo Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição auxiliar')).toBeInTheDocument();
    const input = screen.getByTestId('test-input') as HTMLInputElement;
    expect(input.value).toBe('Valor Inicial');
  });
});
