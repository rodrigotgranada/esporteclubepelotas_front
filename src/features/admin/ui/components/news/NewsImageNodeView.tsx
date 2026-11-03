'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
} from 'lucide-react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export const NewsImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
}) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;
  const isEditable = editor.isEditable;
  const [isHovered, setIsHovered] = useState(false);

  const src: string = node.attrs.src || '';
  const alt: string = node.attrs.alt || '';
  const width: string = node.attrs.width || '100%';
  const align: 'left' | 'center' | 'right' = node.attrs.align || 'center';
  const caption: string = node.attrs.caption || '';

  // Max width classes mapped to percentage
  const widthClasses: Record<string, string> = {
    '25%': 'w-full max-w-xs',
    '50%': 'w-full max-w-md',
    '75%': 'w-full max-w-2xl',
    '100%': 'w-full max-w-full',
  };

  // Alignment classes for flex layout
  const alignClasses: Record<string, string> = {
    left: 'items-start mr-auto',
    center: 'items-center mx-auto',
    right: 'items-end ml-auto',
  };

  const showToolbar = isEditable && (selected || isHovered);

  return (
    <NodeViewWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative my-6 flex flex-col ${alignClasses[align] || 'items-center mx-auto'} ${
        widthClasses[width] || 'w-full max-w-full'
      } transition-all duration-150 select-none`}
    >
      {/* Image Card Container */}
      <LayoutContainer
        className={`relative w-full rounded-2xl overflow-hidden border transition-all ${
          selected
            ? 'border-primary ring-2 ring-primary/30 shadow-lg'
            : 'border-border bg-drawer/30 shadow-xs hover:border-primary/60'
        }`}
      >
        {/* Floating Quick Action Bar (Resize & Align Toolbar) */}
        {showToolbar && (
          <LayoutContainer className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-surface/95 backdrop-blur-md border border-border shadow-xl rounded-xl p-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
            {/* Width Selector Pills */}
            <LayoutContainer className="flex items-center gap-1 bg-drawer p-0.5 rounded-lg border border-border">
              {(['25%', '50%', '75%', '100%'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateAttributes({ width: w })}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                    width === w
                      ? 'bg-primary text-button-primary-text shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  title={`Redimensionar para ${w}`}
                >
                  {w}
                </button>
              ))}
            </LayoutContainer>

            <LayoutContainer className="w-px h-4 bg-border" />

            {/* Alignment Buttons */}
            <LayoutContainer className="flex items-center gap-0.5 bg-drawer p-0.5 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => updateAttributes({ align: 'left' })}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  align === 'left'
                    ? 'bg-primary text-button-primary-text'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={texts.IMAGE_NODE_ALIGN_LEFT}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ align: 'center' })}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  align === 'center'
                    ? 'bg-primary text-button-primary-text'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={texts.IMAGE_NODE_ALIGN_CENTER}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => updateAttributes({ align: 'right' })}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  align === 'right'
                    ? 'bg-primary text-button-primary-text'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={texts.IMAGE_NODE_ALIGN_RIGHT}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </LayoutContainer>

            <LayoutContainer className="w-px h-4 bg-border" />

            {/* Delete Image */}
            <button
              type="button"
              onClick={deleteNode}
              className="p-1 rounded-lg text-error hover:bg-error/10 transition-colors cursor-pointer"
              title={texts.IMAGE_NODE_DELETE}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </LayoutContainer>
        )}

        {/* The Image Itself */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption || alt || 'Imagem'}
          className="w-full h-auto max-h-[500px] object-contain rounded-2xl block mx-auto pointer-events-auto cursor-pointer"
        />
      </LayoutContainer>

      {/* Caption Field Below Image */}
      {isEditable ? (
        <LayoutContainer className="w-full mt-1.5 flex flex-col items-center">
          <input
            type="text"
            value={caption}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder={texts.IMAGE_NODE_CAPTION_PLACEHOLDER}
            className="w-full text-center text-xs text-text-secondary placeholder:text-text-secondary/50 bg-drawer/20 hover:bg-drawer/50 focus:bg-surface border border-transparent focus:border-border rounded-lg px-3 py-1 focus:outline-none transition-colors italic"
          />
        </LayoutContainer>
      ) : caption ? (
        <Text className="text-xs text-text-secondary italic text-center mt-1.5 px-2">
          {caption}
        </Text>
      ) : null}
    </NodeViewWrapper>
  );
};

