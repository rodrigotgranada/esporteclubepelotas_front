'use client';

import React from 'react';
import { LayoutContainer, Input, IconButton, Text } from '@/shared/ui/components';
import { Search, X } from 'lucide-react';
import { GLOBAL_SEARCH_TEXTS } from '../../constants/search.constants';

export interface GlobalSearchInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onClose?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  showShortcutHint?: boolean;
  className?: string;
}

export const GlobalSearchInputBar: React.FC<GlobalSearchInputBarProps> = ({
  value,
  onChange,
  onClear,
  onClose,
  inputRef,
  placeholder = GLOBAL_SEARCH_TEXTS.PLACEHOLDER,
  showShortcutHint = false,
  className = '',
}) => {
  return (
    <LayoutContainer className={`relative flex items-center gap-2 w-full ${className}`}>
      <LayoutContainer className="relative flex-1 flex items-center">
        <LayoutContainer className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none z-10 flex items-center">
          <Search className="w-4 h-4" />
        </LayoutContainer>

        <Input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={GLOBAL_SEARCH_TEXTS.SEARCH_INPUT_ARIA}
          className="pl-10 pr-10 py-2.5 text-sm rounded-xl bg-surface/90 border-border focus:ring-primary"
        />

        {value.length > 0 && (
          <LayoutContainer className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              aria-label={GLOBAL_SEARCH_TEXTS.CLEAR_SEARCH_ARIA}
              icon={<X className="w-4 h-4" />}
              className="text-text-secondary hover:text-text-primary hover:bg-background/60"
            />
          </LayoutContainer>
        )}
      </LayoutContainer>

      {showShortcutHint && (
        <Text
          as="span"
          className="hidden lg:inline-flex text-[11px] font-medium text-text-secondary px-2 py-1 rounded-md border border-border bg-surface/70 shrink-0"
        >
          {GLOBAL_SEARCH_TEXTS.SHORTCUT_HINT}
        </Text>
      )}

      {onClose && (
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label={GLOBAL_SEARCH_TEXTS.CLOSE_SEARCH_ARIA}
          icon={<X className="w-4 h-4" />}
          className="border border-border text-text-secondary hover:text-text-primary hover:bg-surface shrink-0 rounded-xl w-9 h-9"
        />
      )}
    </LayoutContainer>
  );
};

