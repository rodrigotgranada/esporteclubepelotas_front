'use client';

import React from 'react';
import {
  Edit2,
  Trash2,
  Sparkles,
  Shield,
  Dog,
  Flag,
  Palette,
  Calendar,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import { ClubSymbol, SymbolCategory } from '@/features/symbols/types/symbols.types';
import { SYMBOLS_TEXTS, CATEGORY_LABELS } from '@/features/symbols/constants/symbols.constants';

export interface AdminSymbolsTableProps {
  symbols: ClubSymbol[];
  isLoading: boolean;
  onEdit: (symbol: ClubSymbol) => void;
  onDelete: (symbol: ClubSymbol) => void;
}

export const AdminSymbolsTable: React.FC<AdminSymbolsTableProps> = ({
  symbols,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <LayoutContainer className="p-12 flex flex-col items-center justify-center gap-3 bg-surface rounded-2xl border border-border">
        <Spinner size={32} />
        <Text className="text-sm font-semibold text-text-secondary">
          Carregando acervo de símbolos...
        </Text>
      </LayoutContainer>
    );
  }

  if (symbols.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center bg-surface rounded-2xl border border-border flex flex-col items-center gap-3">
        <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </LayoutContainer>
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {SYMBOLS_TEXTS.EMPTY_RECORDS}
        </Title>
      </LayoutContainer>
    );
  }

  const getCategoryIcon = (cat: SymbolCategory) => {
    switch (cat) {
      case 'MASCOT':
        return <Dog className="w-3.5 h-3.5" />;
      case 'SHIELD':
        return <Shield className="w-3.5 h-3.5" />;
      case 'FLAG':
        return <Flag className="w-3.5 h-3.5" />;
      case 'COLORS':
        return <Palette className="w-3.5 h-3.5" />;
    }
  };

  const formatPeriod = (symbol: ClubSymbol) => {
    if (symbol.yearStart && symbol.yearEnd) {
      return `${symbol.yearStart} – ${symbol.yearEnd}`;
    }
    if (symbol.yearStart) {
      return `Desde ${symbol.yearStart}`;
    }
    return 'Registro Histórico';
  };

  return (
    <LayoutContainer className="w-full bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
      <LayoutContainer className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-border bg-background/50 text-text-secondary text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-bold w-20">{SYMBOLS_TEXTS.COL_IMAGE}</th>
              <th className="py-4 px-6 font-bold">{SYMBOLS_TEXTS.COL_NAME}</th>
              <th className="py-4 px-6 font-bold w-36">{SYMBOLS_TEXTS.COL_CATEGORY}</th>
              <th className="py-4 px-6 font-bold w-40">{SYMBOLS_TEXTS.COL_PERIOD}</th>
              <th className="py-4 px-6 font-bold w-44">{SYMBOLS_TEXTS.COL_STATUS}</th>
              <th className="py-4 px-6 font-bold text-right w-44 min-w-[176px]">{SYMBOLS_TEXTS.COL_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {symbols.map((symbol) => (
              <tr
                key={symbol.id}
                className="hover:bg-background/40 transition-colors group"
              >
                {/* Imagem em Miniatura */}
                <td className="py-4 px-6">
                  <LayoutContainer className="relative w-12 h-12 rounded-xl overflow-hidden bg-background border border-border/80 flex items-center justify-center p-1">
                    <SafeImage
                      src={symbol.imageUrl || '/images/pelotas-logo.png'}
                      alt={symbol.name || 'Símbolo'}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>
                </td>

                {/* Nome e Subtítulo */}
                <td className="py-4 px-6">
                  <LayoutContainer className="flex flex-col">
                    <Text className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">
                      {symbol.name || formatPeriod(symbol)}
                    </Text>
                    {symbol.subtitle && (
                      <Text className="text-xs text-text-secondary line-clamp-1">
                        {symbol.subtitle}
                      </Text>
                    )}
                  </LayoutContainer>
                </td>

                {/* Categoria */}
                <td className="py-4 px-6">
                  <Badge
                    variant="default"
                    size="sm"
                    className="font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    {getCategoryIcon(symbol.category)}
                    <Text as="span">{CATEGORY_LABELS[symbol.category] || symbol.category}</Text>
                  </Badge>
                </td>

                {/* Período / Ano */}
                <td className="py-4 px-6">
                  <LayoutContainer className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <Text as="span">{formatPeriod(symbol)}</Text>
                  </LayoutContainer>
                </td>

                {/* Status & Oficial */}
                <td className="py-4 px-6">
                  <LayoutContainer className="flex flex-wrap items-center gap-1.5">
                    {symbol.isOfficial && (
                      <Badge
                        variant="primary"
                        size="sm"
                        className="font-extrabold uppercase text-[10px] tracking-wider inline-flex items-center gap-1 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        <Text as="span">{SYMBOLS_TEXTS.BADGE_OFFICIAL}</Text>
                      </Badge>
                    )}
                    <Badge
                      variant={symbol.isActive ? 'default' : 'danger'}
                      size="sm"
                      className="text-[10px] font-bold"
                    >
                      {symbol.isActive ? SYMBOLS_TEXTS.BADGE_ACTIVE : SYMBOLS_TEXTS.BADGE_INACTIVE}
                    </Badge>
                  </LayoutContainer>
                </td>

                {/* Ações ESTRITAMENTE Editar e Excluir com rótulo visível */}
                <td className="py-4 px-6 text-right w-44 min-w-[176px]">
                  <LayoutContainer className="inline-flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(symbol)}
                      className="h-8 px-2.5 text-xs text-text-primary hover:text-primary hover:bg-primary/10 font-bold inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-border/60 hover:border-primary/40 shadow-xs"
                      title={SYMBOLS_TEXTS.BTN_EDIT}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-primary" />
                      <Text as="span">{SYMBOLS_TEXTS.BTN_EDIT}</Text>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(symbol)}
                      className="h-8 px-2.5 text-xs text-error hover:bg-error/10 font-bold inline-flex items-center gap-1.5 cursor-pointer rounded-lg border border-error/30 hover:border-error/60 shadow-xs"
                      title={SYMBOLS_TEXTS.BTN_DELETE}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-error" />
                      <Text as="span">{SYMBOLS_TEXTS.BTN_DELETE}</Text>
                    </Button>
                  </LayoutContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LayoutContainer>
    </LayoutContainer>
  );
};
