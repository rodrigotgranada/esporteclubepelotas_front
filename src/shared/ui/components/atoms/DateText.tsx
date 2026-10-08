import React from 'react';
import { Text } from './Text';

export interface DateTextProps {
  date?: string | Date | null;
  format?: 'date' | 'datetime' | 'time';
  className?: string;
  fallback?: string;
  useUtc?: boolean;
}

export const DateText = ({ 
  date, 
  format = 'date', 
  className = '',
  fallback = 'Não informado',
  useUtc,
}: DateTextProps) => {
  if (!date) {
    return <Text as="span" className={className}>{fallback}</Text>;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return <Text as="span" className={className}>{fallback}</Text>;
  }

  // Se useUtc for explicitamente passado, respeita. Caso contrário, se o formato for apenas 'date',
  // tratamos como data civil UTC para evitar shift de dia por fuso horário.
  const isUtcMode = useUtc !== undefined ? useUtc : format === 'date';

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: isUtcMode ? 'UTC' : 'America/Sao_Paulo',
    ...(format === 'date' || format === 'datetime' ? { year: 'numeric', month: '2-digit', day: '2-digit' } : {}),
    ...(format === 'time' || format === 'datetime' ? { hour: '2-digit', minute: '2-digit', second: '2-digit' } : {}),
  });

  return (
    <Text as="span" className={className}>
      {formatter.format(dateObj)}
    </Text>
  );
};
