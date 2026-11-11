import React from 'react';
import Image from 'next/image';

export interface ShieldPlaceholderProps {
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * ShieldPlaceholder
 * Distintivo oficial centenário do Esporte Clube Pelotas (Áureo-Cerúleo).
 * Atua como o escudo padrão institucional do portal caso nenhum logo customizado tenha sido configurado.
 */
export const ShieldPlaceholder: React.FC<ShieldPlaceholderProps> = ({
  size = 32,
  className = '',
  alt = 'Distintivo Oficial E.C. Pelotas',
}) => {
  return (
    <span
      style={{ width: size, height: size }}
      className={`relative shrink-0 inline-flex items-center justify-center select-none ${className}`}
    >
      <Image
        src="/images/pelotas-logo.png"
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-sm pointer-events-none"
      />
    </span>
  );
};
