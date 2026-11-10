'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LayoutContainer, Text, Badge } from '@/shared/ui/components/atoms';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção...',
  searchPlaceholder = 'Digite para filtrar...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Encontrar opção selecionada atual
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filtragem das opções com base na digitação
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  // Fechar ao clicar fora ou apertar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Foco automático no input de pesquisa ao abrir
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('ALL');
  };

  return (
    <LayoutContainer ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botão Trigger que abre o dropdown */}
      <LayoutContainer
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border bg-surface-card text-left transition-all cursor-pointer ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-border/40'
            : isOpen
            ? 'border-secondary ring-1 ring-secondary/30 shadow-md'
            : 'border-border/80 hover:border-border hover:bg-surface-hover/30'
        }`}
      >
        <LayoutContainer className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
          <Text
            className={`text-sm truncate ${
              selectedOption && selectedOption.value !== 'ALL'
                ? 'text-text-primary font-medium'
                : 'text-text-muted'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>

          {selectedOption?.badge && (
            <Badge
              variant="default"
              className="text-[10px] px-1.5 py-0.5 border-border bg-surface text-text-muted shrink-0"
            >
              {selectedOption.badge}
            </Badge>
          )}
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-1 shrink-0 text-text-muted">
          {selectedOption && selectedOption.value !== 'ALL' && !disabled && (
            <LayoutContainer
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer"
              title="Limpar seleção"
            >
              <X size={13} />
            </LayoutContainer>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-secondary' : ''}`}
          />
        </LayoutContainer>
      </LayoutContainer>

      {/* Menu Suspenso */}
      {isOpen && (
        <LayoutContainer className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-border/80 bg-surface-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Campo de Busca no topo do dropdown */}
          <LayoutContainer className="p-2 border-b border-border/60 bg-surface/50">
            <LayoutContainer className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-text-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border/80 rounded-lg text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all"
              />
              {search && (
                <LayoutContainer
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 text-text-muted hover:text-text-primary cursor-pointer"
                >
                  <X size={12} />
                </LayoutContainer>
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* Lista de Opções Filtradas */}
          <LayoutContainer className="max-h-60 overflow-y-auto py-1 divide-y divide-border/20">
            {filteredOptions.length === 0 ? (
              <LayoutContainer className="py-4 px-3 text-center">
                <Text className="text-xs text-text-muted">
                  Nenhuma opção encontrada
                </Text>
              </LayoutContainer>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <LayoutContainer
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-secondary/10 text-secondary font-semibold'
                        : 'text-text-primary hover:bg-surface-hover/70'
                    }`}
                  >
                    <LayoutContainer className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <Text className={`truncate ${isSelected ? 'text-secondary font-bold' : ''}`}>
                        {opt.label}
                      </Text>
                      {opt.badge && (
                        <Badge
                          variant="default"
                          className="text-[10px] px-1.5 py-0.5 border-border bg-surface text-text-muted shrink-0"
                        >
                          {opt.badge}
                        </Badge>
                      )}
                    </LayoutContainer>

                    {isSelected && (
                      <Check size={14} className="text-secondary shrink-0" />
                    )}
                  </LayoutContainer>
                );
              })
            )}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

