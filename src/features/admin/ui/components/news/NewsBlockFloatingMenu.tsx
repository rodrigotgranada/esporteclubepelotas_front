'use client';

import React from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsBlockFloatingMenuProps {
  menuMode: 'transform' | 'add_below';
  menuRef: React.RefObject<HTMLDivElement | null>;
  isDropup: boolean;
  onApplyBlockType: (type: string, level?: 1 | 2 | 3) => void;
  onDeleteBlock: () => void;
}

export const NewsBlockFloatingMenu: React.FC<NewsBlockFloatingMenuProps> = ({
  menuMode,
  menuRef,
  isDropup,
  onApplyBlockType,
  onDeleteBlock,
}) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer
      ref={menuRef}
      className={`absolute ${
        isDropup ? 'bottom-8' : 'top-8'
      } left-0 w-64 max-h-[340px] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface shadow-2xl p-2 flex flex-col gap-1 z-[60] animate-in fade-in zoom-in-95 duration-150`}
    >
      <Text className="text-[10px] font-black uppercase tracking-wider text-text-secondary px-2 pt-1 pb-0.5">
        {menuMode === 'add_below' ? texts.MENU_HEADER_ADD : texts.MENU_HEADER_TRANSFORM}
      </Text>

      {/* Parágrafo */}
      <button
        type="button"
        onClick={() => onApplyBlockType('paragraph')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Type className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_PARAGRAPH}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_PARAGRAPH_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Título 1 (H1) */}
      <button
        type="button"
        onClick={() => onApplyBlockType('heading', 1)}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Heading1 className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_H1}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_H1_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Subtítulo (H2) */}
      <button
        type="button"
        onClick={() => onApplyBlockType('heading', 2)}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Heading2 className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_H2}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_H2_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Título 3 (H3) */}
      <button
        type="button"
        onClick={() => onApplyBlockType('heading', 3)}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Heading3 className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_H3}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_H3_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Imagem no Texto */}
      <button
        type="button"
        onClick={() => onApplyBlockType('image')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ImageIcon className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_IMAGE}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_IMAGE_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Citação / Destaque */}
      <button
        type="button"
        onClick={() => onApplyBlockType('blockquote')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Quote className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_QUOTE}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_QUOTE_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Lista com Marcadores */}
      <button
        type="button"
        onClick={() => onApplyBlockType('bulletList')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <List className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_BULLET}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_BULLET_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Lista Numerada */}
      <button
        type="button"
        onClick={() => onApplyBlockType('orderedList')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ListOrdered className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_ORDERED}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_ORDERED_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Linha Divisória */}
      <button
        type="button"
        onClick={() => onApplyBlockType('horizontalRule')}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer group"
      >
        <LayoutContainer className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Minus className="w-3.5 h-3.5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">
            {texts.BLOCK_TYPE_DIVIDER}
          </span>
          <span className="text-[10px] text-text-secondary">
            {texts.BLOCK_TYPE_DIVIDER_DESC}
          </span>
        </LayoutContainer>
      </button>

      {/* Opção de excluir linha no modo transform */}
      {menuMode === 'transform' && (
        <>
          <LayoutContainer className="h-px bg-border my-1" />
          <button
            type="button"
            onClick={onDeleteBlock}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-error/10 text-left transition-colors cursor-pointer text-xs font-semibold text-error"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{texts.BLOCK_ACTION_DELETE}</span>
          </button>
        </>
      )}
    </LayoutContainer>
  );
};
