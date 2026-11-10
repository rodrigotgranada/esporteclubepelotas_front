'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  LayoutContainer,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components/atoms';
import { Search, X, ChevronDown, PlusCircle, Building2 } from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { OpponentClub } from '@/features/opponents/types/opponents.types';

export interface OpponentSearchComboboxProps {
  opponents: OpponentClub[];
  value: string;
  onChange: (name: string) => void;
  onSelectClub: (club: OpponentClub) => void;
  onOpenQuickCreate: (initialName?: string) => void;
  error?: string;
  placeholder?: string;
}

export const OpponentSearchCombobox: React.FC<OpponentSearchComboboxProps> = ({
  opponents,
  value,
  onChange,
  onSelectClub,
  onOpenQuickCreate,
  error,
  placeholder = 'Digite o nome do clube para buscar no catálogo...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtragem dos adversários com base no que foi digitado
  const filteredClubs = useMemo(() => {
    if (!value || !value.trim()) {
      return opponents;
    }
    const q = value.toLowerCase().trim();
    return opponents.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.shortName && c.shortName.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.stadiumName && c.stadiumName.toLowerCase().includes(q))
    );
  }, [opponents, value]);

  // Fechar dropdown ao clicar fora ou apertar Escape
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

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (club: OpponentClub) => {
    onSelectClub(club);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(true);
  };

  return (
    <LayoutContainer ref={containerRef} className="relative w-full">
      {/* Campo de Input com Ícones */}
      <LayoutContainer className="relative flex items-center">
        <LayoutContainer className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
          <Search size={16} />
        </LayoutContainer>

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-16 py-2.5 bg-surface text-text-primary rounded-xl border transition-all text-sm outline-none ${
            error
              ? 'border-orange-500 focus:ring-1 focus:ring-orange-500'
              : 'border-border/80 focus:border-secondary focus:ring-1 focus:ring-secondary/40'
          }`}
        />

        <LayoutContainer className="absolute right-2.5 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              title="Limpar seleção"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            title="Abrir catálogo de clubes"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-secondary' : ''}`}
            />
          </button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Menu Dropdown com Busca Flutuante */}
      {isOpen && (
        <LayoutContainer className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-drawer border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          {/* Cabeçalho informativo da lista */}
          <LayoutContainer className="px-3.5 py-2 border-b border-border/50 bg-surface/50 flex items-center justify-between text-[11px] text-text-muted">
            <Text className="font-semibold text-text-secondary">
              {filteredClubs.length > 0
                ? `${filteredClubs.length} clube(s) encontrado(s)`
                : 'Catálogo de Adversários'}
            </Text>
            <Text className="text-[10px]">
              Selecione na lista ou cadastre
            </Text>
          </LayoutContainer>

          {/* Lista de Opções Rolável */}
          <LayoutContainer className="max-h-64 overflow-y-auto divide-y divide-border/40">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => {
                const isSelected =
                  club.name.toLowerCase() === value.toLowerCase() ||
                  (club.shortName && club.shortName.toLowerCase() === value.toLowerCase());

                return (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => handleSelect(club)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-secondary/15 hover:bg-secondary/20'
                        : 'hover:bg-surface-hover/80'
                    }`}
                  >
                    <LayoutContainer className="flex items-center gap-3 min-w-0">
                      {/* Mini Escudo */}
                      <LayoutContainer className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-2xs">
                        <SafeImage
                          src={club.badgeUrl || '/images/pelotas-logo.png'}
                          alt={club.name}
                          width={24}
                          height={24}
                          className="object-contain max-h-6"
                        />
                      </LayoutContainer>

                      {/* Nome e Apelido */}
                      <LayoutContainer className="min-w-0">
                        <LayoutContainer className="flex items-center gap-2 flex-wrap">
                          <Text
                            className={`text-xs font-bold truncate block ${
                              isSelected ? 'text-secondary' : 'text-text-primary'
                            }`}
                          >
                            {club.name}
                          </Text>
                          {club.shortName && (
                            <Badge
                              variant="default"
                              className="text-[10px] px-1.5 py-0 bg-surface border-border text-text-secondary"
                            >
                              {club.shortName}
                            </Badge>
                          )}
                        </LayoutContainer>

                        {/* Cidade e Estádio */}
                        {(club.city || club.stadiumName) && (
                          <Text className="text-[11px] text-text-muted truncate block mt-0.5">
                            {club.city}
                            {club.city && club.stadiumName ? ' • ' : ''}
                            {club.stadiumName}
                          </Text>
                        )}
                      </LayoutContainer>
                    </LayoutContainer>

                    {isSelected && (
                      <Badge
                        variant="default"
                        className="text-[10px] border-secondary/50 text-secondary bg-secondary/10 shrink-0"
                      >
                        Selecionado
                      </Badge>
                    )}
                  </button>
                );
              })
            ) : (
              // Estado Vazio com Botão Rápido de Cadastro
              <LayoutContainer className="p-4 text-center space-y-3">
                <LayoutContainer className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center mx-auto text-text-muted">
                  <Building2 size={20} />
                </LayoutContainer>
                <LayoutContainer className="space-y-1">
                  <Text className="text-xs text-text-primary font-bold block">
                    Nenhum clube encontrado no catálogo
                  </Text>
                  <Text className="text-[11px] text-text-muted block">
                    {value ? `Não encontramos "${value}". Deseja cadastrá-lo agora?` : 'Digite o nome do time para buscar ou cadastrar.'}
                  </Text>
                </LayoutContainer>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenQuickCreate(value);
                  }}
                  className="bg-secondary text-primary hover:bg-secondary-hover font-bold text-xs px-4 py-1.5 rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <PlusCircle size={14} />
                  Cadastrar &quot;{value.trim() || 'Novo Clube'}&quot;
                </Button>
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Rodapé Fixo para Adicionar Novo Clube */}
          {filteredClubs.length > 0 && (
            <LayoutContainer className="p-2 border-t border-border/50 bg-surface/30 flex items-center justify-between">
              <Text className="text-[11px] text-text-muted pl-2">
                Não encontrou o adversário na lista?
              </Text>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  onOpenQuickCreate(value);
                }}
                className="text-xs font-bold text-secondary hover:bg-secondary/10 px-2 py-1 rounded-lg cursor-pointer"
              >
                + Cadastrar Novo Clube
              </Button>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {error && (
        <Text className="text-xs text-orange-500 font-medium mt-1 block">
          {error}
        </Text>
      )}
    </LayoutContainer>
  );
};
