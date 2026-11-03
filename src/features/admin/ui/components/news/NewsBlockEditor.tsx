'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
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
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { LayoutContainer, Text, IconButton, Button, Input } from '@/shared/ui/components';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle position tracking on left gutter
  const [handleTop, setHandleTop] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'transform' | 'add_below'>('transform');

  // Image insertion modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

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
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
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

  // Focus the active block
  const focusActiveBlock = () => {
    if (!editor || !activeElement) return;
    try {
      const pos = editor.view.posAtDOM(activeElement, 0);
      editor.chain().focus(pos).run();
    } catch {
      editor.commands.focus();
    }
  };

  // Apply block type (for either transform or adding below)
  const applyBlockType = (type: string, level?: 1 | 2 | 3) => {
    if (!editor) return;

    if (menuMode === 'add_below') {
      focusActiveBlock();
      // Insert a new paragraph block right below
      editor.chain().focus().insertContent({ type: 'paragraph' }).run();
    } else {
      focusActiveBlock();
    }

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
      case 'image':
        setIsMenuOpen(false);
        setIsImageModalOpen(true);
        return;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  // Click on (+) Button: Opens menu in "Adicionar abaixo" mode
  const handleAddClick = () => {
    focusActiveBlock();
    setMenuMode('add_below');
    setIsMenuOpen(true);
  };

  // Click on (⋮⋮) Handle: Opens menu in "Transformar" mode
  const handleGripClick = () => {
    focusActiveBlock();
    setMenuMode('transform');
    setIsMenuOpen(!isMenuOpen);
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

  // Insert image via URL
  const handleInsertImageUrl = () => {
    if (!editor || !imageUrlInput.trim()) return;
    editor.chain().focus().setImage({ src: imageUrlInput.trim() }).run();
    setImageUrlInput('');
    setIsImageModalOpen(false);
  };

  // Insert image via local file selection
  const handleSelectLocalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        editor.chain().focus().setImage({ src: reader.result }).run();
      }
    };
    reader.readAsDataURL(file);
    setIsImageModalOpen(false);
    e.target.value = '';
  };

  if (!editor) {
    return null;
  }

  return (
    <LayoutContainer
      className={`rounded-xl border border-border bg-surface transition-all focus-within:border-primary shadow-sm flex flex-col ${className}`}
    >
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelectLocalImage}
        className="hidden"
      />

      {/* Top Format Bar */}
      {editable && (
        <LayoutContainer className="flex flex-wrap items-center justify-between gap-1 p-2 bg-drawer border-b border-border rounded-t-xl text-xs">
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
            {/* Quick Image Button in Top Bar */}
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.BLOCK_TYPE_IMAGE}
              title={texts.BLOCK_TYPE_IMAGE}
              onClick={() => setIsImageModalOpen(true)}
              className="text-text-secondary hover:text-primary"
              icon={<ImageIcon className="w-4 h-4" />}
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
            className="absolute left-2.5 z-40 flex items-center gap-0.5 select-none transition-all duration-150"
          >
            {/* 1. Add Block (+) Button: Inserts new block below */}
            <button
              type="button"
              onClick={handleAddClick}
              title={texts.BLOCK_ADD_TOOLTIP}
              aria-label={texts.BLOCK_ADD_TOOLTIP}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen && menuMode === 'add_below'
                  ? 'bg-primary text-black font-bold shadow-xs'
                  : 'hover:bg-drawer text-text-secondary hover:text-primary'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* 2. Drag / Option Handle (⋮⋮): Options for current line */}
            <button
              type="button"
              onClick={handleGripClick}
              title={texts.BLOCK_HANDLE_TOOLTIP}
              aria-label={texts.BLOCK_HANDLE_TOOLTIP}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen && menuMode === 'transform'
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
                className={`absolute ${
                  handleTop !== null &&
                  editorWrapperRef.current &&
                  handleTop > Math.max(60, editorWrapperRef.current.clientHeight - 340)
                    ? 'bottom-8'
                    : 'top-8'
                } left-0 w-64 max-h-[340px] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface shadow-2xl p-2 flex flex-col gap-1 z-[60] animate-in fade-in zoom-in-95 duration-150`}
              >
                <Text className="text-[10px] font-black uppercase tracking-wider text-text-secondary px-2 pt-1 pb-0.5">
                  {menuMode === 'add_below' ? texts.MENU_HEADER_ADD : texts.MENU_HEADER_TRANSFORM}
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

                {/* Imagem no Texto */}
                <button
                  type="button"
                  onClick={() => applyBlockType('image')}
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

                {/* Se estiver no modo Transformar, exibe a opção de excluir bloco */}
                {menuMode === 'transform' && (
                  <>
                    <LayoutContainer className="h-px bg-border my-1" />
                    <button
                      type="button"
                      onClick={handleDeleteBlock}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-error/10 text-left transition-colors cursor-pointer text-xs font-semibold text-error"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{texts.BLOCK_ACTION_DELETE}</span>
                    </button>
                  </>
                )}
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
      <LayoutContainer className="px-4 py-2 border-t border-border bg-drawer/50 rounded-b-xl flex items-center gap-2 text-[11px] text-text-secondary">
        <Sparkles className="w-3 h-3 text-primary shrink-0" />
        <span>
          Clique no (<strong>+</strong>) para inserir um novo bloco abaixo ou nos pontinhos (<strong>⋮⋮</strong>) para transformar a linha atual (Título, Subtítulo, Imagem, Citação, Lista).
        </span>
      </LayoutContainer>

      {/* Modal / Dialog to Insert Image into Text */}
      {isImageModalOpen && (
        <LayoutContainer className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <LayoutContainer className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl p-6 flex flex-col gap-4">
            <LayoutContainer className="flex items-center justify-between pb-2 border-b border-border">
              <Text className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                {texts.IMAGE_MODAL_TITLE}
              </Text>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="w-7 h-7 rounded-full bg-drawer flex items-center justify-center text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </LayoutContainer>

            {/* Option A: Upload from computer */}
            <LayoutContainer className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center text-xs font-bold py-3"
                leftIcon={<Upload className="w-4 h-4 text-primary" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {texts.IMAGE_MODAL_UPLOAD_BTN}
              </Button>
            </LayoutContainer>

            <LayoutContainer className="flex items-center gap-3">
              <LayoutContainer className="flex-1 h-px bg-border" />
              <Text className="text-[11px] text-text-secondary uppercase">OU</Text>
              <LayoutContainer className="flex-1 h-px bg-border" />
            </LayoutContainer>

            {/* Option B: Insert via URL */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-xs font-semibold text-text-primary">
                {texts.IMAGE_MODAL_URL_LABEL}
              </Text>
              <Input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder={texts.IMAGE_MODAL_URL_PLACEHOLDER}
                className="text-xs"
              />
            </LayoutContainer>

            <LayoutContainer className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsImageModalOpen(false)}
              >
                {texts.IMAGE_MODAL_CANCEL_BTN}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleInsertImageUrl}
                disabled={!imageUrlInput.trim()}
                leftIcon={<LinkIcon className="w-3.5 h-3.5" />}
              >
                {texts.IMAGE_MODAL_INSERT_BTN}
              </Button>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
