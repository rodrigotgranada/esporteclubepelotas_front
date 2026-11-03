'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  GripVertical,
  Plus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Trash2,
  Bold,
  Italic,
  Undo2,
  Redo2,
  Sparkles,
} from 'lucide-react';
import { LayoutContainer, Text, Badge, IconButton } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsBlockEditorProps {
  content?: Record<string, any>;
  onChange: (json: Record<string, any>) => void;
  editable?: boolean;
  className?: string;
}

export const NewsBlockEditor: React.FC<NewsBlockEditorProps> = ({
  content,
  onChange,
  editable = true,
  className = '',
}) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle position tracking on left gutter
  const [handleTop, setHandleTop] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: texts.PLACEHOLDER,
      }),
    ],
    content: content && Object.keys(content).length > 0 ? content : undefined,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] py-4 pr-4 pl-14 focus:outline-none text-text-primary text-sm sm:text-base leading-relaxed',
      },
    },
  });

  // Sync external content update
  useEffect(() => {
    if (editor && content && Object.keys(content).length > 0) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(content);
      if (currentJson !== newJson) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  // Close block menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Update handle position when hovering over or selecting any block element
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editor || !editorWrapperRef.current) return;

    const target = e.target as HTMLElement;
    // Walk up to find the direct child of .ProseMirror
    let element: HTMLElement | null = target;
    while (element && element.parentElement && !element.parentElement.classList.contains('ProseMirror')) {
      element = element.parentElement;
    }

    if (element && element.parentElement?.classList.contains('ProseMirror')) {
      const wrapperRect = editorWrapperRef.current.getBoundingClientRect();
      const elRect = element.getBoundingClientRect();
      const topOffset = elRect.top - wrapperRect.top;
      setHandleTop(topOffset);
      setActiveElement(element);
    }
  };

  // Focus and select the active block
  const focusActiveBlock = () => {
    if (!editor || !activeElement) return;
    try {
      const pos = editor.view.posAtDOM(activeElement, 0);
      editor.chain().focus(pos).run();
    } catch {
      editor.commands.focus();
    }
  };

  // Transform block actions
  const applyBlockType = (type: string, level?: 1 | 2 | 3) => {
    if (!editor) return;
    focusActiveBlock();

    switch (type) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading':
        if (level) {
          editor.chain().focus().setHeading({ level }).run();
        }
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'horizontalRule':
        editor.chain().focus().setHorizontalRule().run();
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  // Add block below
  const handleAddBlockBelow = () => {
    if (!editor) return;
    focusActiveBlock();
    editor.chain().focus().insertContent({ type: 'paragraph' }).run();
    setIsMenuOpen(true);
  };

  // Delete active block
  const handleDeleteBlock = () => {
    if (!editor) return;
    focusActiveBlock();
    const { $from } = editor.state.selection;
    const depth = $from.depth;
    if (depth > 0) {
      const from = $from.before(1);
      const to = $from.after(1);
      const tr = editor.state.tr.delete(from, to);
      editor.view.dispatch(tr);
    }
    setIsMenuOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <LayoutContainer
      className={`rounded-xl border border-border bg-surface overflow-hidden transition-all focus-within:border-primary shadow-sm flex flex-col ${className}`}
    >
      {/* Top Format Bar */}
      {editable && (
        <LayoutContainer className="flex flex-wrap items-center justify-between gap-1 p-2 bg-drawer border-b border-border text-xs">
          <LayoutContainer className="flex items-center gap-1">
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.BOLD}
              title={texts.BOLD}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive('bold')
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<Bold className="w-4 h-4" />}
            />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.ITALIC}
              title={texts.ITALIC}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={
                editor.isActive('italic')
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<Italic className="w-4 h-4" />}
            />
            <LayoutContainer className="w-px h-5 bg-border mx-1" />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.HEADING_1}
              title={texts.HEADING_1}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={
                editor.isActive('heading', { level: 1 })
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<Heading1 className="w-4 h-4" />}
            />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.HEADING_2}
              title={texts.HEADING_2}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={
                editor.isActive('heading', { level: 2 })
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<Heading2 className="w-4 h-4" />}
            />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.BLOCKQUOTE}
              title={texts.BLOCKQUOTE}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={
                editor.isActive('blockquote')
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<Quote className="w-4 h-4" />}
            />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.BULLET_LIST}
              title={texts.BULLET_LIST}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive('bulletList')
                  ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }
              icon={<List className="w-4 h-4" />}
            />
          </LayoutContainer>

          <LayoutContainer className="flex items-center gap-1">
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.UNDO}
              title={texts.UNDO}
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
              className="text-text-secondary hover:text-text-primary disabled:opacity-40"
              icon={<Undo2 className="w-4 h-4" />}
            />
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.REDO}
              title={texts.REDO}
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
              className="text-text-secondary hover:text-text-primary disabled:opacity-40"
              icon={<Redo2 className="w-4 h-4" />}
            />
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Editor Body with Left Block Handle (Notion Style) */}
      <LayoutContainer
        ref={editorWrapperRef}
        onMouseMove={handleMouseMove}
        className="relative bg-surface flex-1"
      >
        {/* Floating Left Gutter Handle */}
        {editable && handleTop !== null && (
          <LayoutContainer
            style={{ top: `${Math.max(8, handleTop + 4)}px` }}
            className="absolute left-2.5 z-30 flex items-center gap-0.5 select-none transition-all duration-150"
          >
            {/* 1. Add Block (+) Button */}
            <button
              type="button"
              onClick={handleAddBlockBelow}
              title={texts.BLOCK_ADD_TOOLTIP}
              aria-label={texts.BLOCK_ADD_TOOLTIP}
              className="w-6 h-6 rounded-md hover:bg-drawer text-text-secondary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* 2. Drag / Option Handle (⋮⋮) */}
            <button
              type="button"
              onClick={() => {
                focusActiveBlock();
                setIsMenuOpen(!isMenuOpen);
              }}
              title={texts.BLOCK_HANDLE_TOOLTIP}
              aria-label={texts.BLOCK_HANDLE_TOOLTIP}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen
                  ? 'bg-primary text-black font-bold shadow-xs'
                  : 'hover:bg-drawer text-text-secondary hover:text-text-primary'
              }`}
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>

            {/* Notion Style Block Dropdown Menu */}
            {isMenuOpen && (
              <LayoutContainer
                ref={menuRef}
                className="absolute top-8 left-0 w-64 rounded-xl border border-border bg-surface shadow-2xl p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <Text className="text-[10px] font-black uppercase tracking-wider text-text-secondary px-2 pt-1 pb-0.5">
                  Transformar Bloco em:
                </Text>

                {/* Parágrafo */}
                <button
                  type="button"
                  onClick={() => applyBlockType('paragraph')}
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
                  onClick={() => applyBlockType('heading', 1)}
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
                  onClick={() => applyBlockType('heading', 2)}
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
                  onClick={() => applyBlockType('heading', 3)}
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

                {/* Citação / Destaque */}
                <button
                  type="button"
                  onClick={() => applyBlockType('blockquote')}
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
                  onClick={() => applyBlockType('bulletList')}
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
                  onClick={() => applyBlockType('orderedList')}
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
                  onClick={() => applyBlockType('horizontalRule')}
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

                {/* Ações do Bloco (Divisor, Add Abaixo, Excluir) */}
                <LayoutContainer className="h-px bg-border my-1" />

                <button
                  type="button"
                  onClick={handleAddBlockBelow}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-drawer text-left transition-colors cursor-pointer text-xs font-semibold text-text-primary"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>{texts.BLOCK_ACTION_ADD_BELOW}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteBlock}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-error/10 text-left transition-colors cursor-pointer text-xs font-semibold text-error"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{texts.BLOCK_ACTION_DELETE}</span>
                </button>
              </LayoutContainer>
            )}
          </LayoutContainer>
        )}

        {/* ProseMirror Editor Content */}
        <LayoutContainer className="tiptap-editor-wrapper bg-surface min-h-[300px]">
          <EditorContent editor={editor} />
        </LayoutContainer>
      </LayoutContainer>

      {/* Helpful Hint Bar at Bottom */}
      <LayoutContainer className="px-4 py-2 border-t border-border bg-drawer/50 flex items-center gap-2 text-[11px] text-text-secondary">
        <Sparkles className="w-3 h-3 text-primary shrink-0" />
        <span>
          Passe o mouse na lateral da linha e clique nos pontinhos (<strong>⋮⋮</strong>) para transformar o bloco (Título, Subtítulo, Citação, Lista) ou no (<strong>+</strong>) para adicionar um novo bloco.
        </span>
      </LayoutContainer>
    </LayoutContainer>
  );
};
