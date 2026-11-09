'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Title,
  Input,
  Textarea,
  Button,
} from '@/shared/ui/components';
import { Dog, Shield, Palette, Loader2 } from 'lucide-react';
import {
  ClubSymbolOverview,
  ClubSymbolOverviewFormData,
  SymbolOverviewCategory,
} from '@/features/symbols/types/symbols.types';
import { SYMBOLS_TEXTS } from '@/features/symbols/constants/symbols.constants';

export interface AdminSymbolsOverviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory: SymbolOverviewCategory;
  getOverviewForCategory: (cat: SymbolOverviewCategory) => ClubSymbolOverview;
  onSave: (category: SymbolOverviewCategory, data: ClubSymbolOverviewFormData) => Promise<void>;
  isSaving: boolean;
}

export const AdminSymbolsOverviewDrawer: React.FC<AdminSymbolsOverviewDrawerProps> = ({
  isOpen,
  onClose,
  initialCategory,
  getOverviewForCategory,
  onSave,
  isSaving,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SymbolOverviewCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const current = getOverviewForCategory(selectedCategory);
    setTitle(current.title || '');
    setDescription(current.description || '');
  }, [selectedCategory, getOverviewForCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedCategory, {
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={SYMBOLS_TEXTS.OVERVIEW_DRAWER_TITLE}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        <LayoutContainer className="flex flex-col gap-6 p-6 overflow-y-auto">
          <Text className="text-xs text-text-secondary">
            {SYMBOLS_TEXTS.OVERVIEW_DRAWER_SUBTITLE}
          </Text>

          {/* Abas de Seção */}
          <LayoutContainer className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border">
            <Button
              type="button"
              variant={selectedCategory === 'MASCOT' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('MASCOT')}
              leftIcon={<Dog className="w-4 h-4" />}
              className="text-xs font-bold flex-1"
            >
              {SYMBOLS_TEXTS.OVERVIEW_TAB_MASCOT}
            </Button>

            <Button
              type="button"
              variant={selectedCategory === 'SHIELD' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('SHIELD')}
              leftIcon={<Shield className="w-4 h-4" />}
              className="text-xs font-bold flex-1"
            >
              {SYMBOLS_TEXTS.OVERVIEW_TAB_SHIELD}
            </Button>

            <Button
              type="button"
              variant={selectedCategory === 'FLAG_COLORS' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('FLAG_COLORS')}
              leftIcon={<Palette className="w-4 h-4" />}
              className="text-xs font-bold flex-1"
            >
              {SYMBOLS_TEXTS.OVERVIEW_TAB_FLAG_COLORS}
            </Button>
          </LayoutContainer>

          {/* Título da Narrativa */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              {SYMBOLS_TEXTS.OVERVIEW_FIELD_TITLE} *
            </Text>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A Mística do Lobo da Boca do Lobo"
              required
              className="text-sm py-2.5"
            />
          </LayoutContainer>

          {/* Descrição Geral / Narrativa Histórica */}
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-secondary">
              {SYMBOLS_TEXTS.OVERVIEW_FIELD_DESC} *
            </Text>
            <Textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva a narrativa histórica geral que apresenta esta seção..."
              required
              className="text-sm leading-relaxed"
            />
            <Text className="text-[11px] text-text-secondary">
              Este texto será apresentado com destaque no topo da página pública correspondente.
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Rodapé */}
        <LayoutContainer className="p-4 sm:p-6 border-t border-border bg-surface/90 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="font-bold text-xs"
          >
            {SYMBOLS_TEXTS.BTN_CANCEL}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving || !title.trim() || !description.trim()}
            className="font-bold text-xs px-6 py-2.5 min-w-[140px]"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <Text as="span">Salvando...</Text>
              </LayoutContainer>
            ) : (
              SYMBOLS_TEXTS.BTN_SAVE
            )}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
};

