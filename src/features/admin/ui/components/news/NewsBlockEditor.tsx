'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
} from 'lucide-react';
import { LayoutContainer, IconButton } from '@/shared/ui/components';
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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ADMIN_NEWS_TEXTS.EDITOR.PLACEHOLDER,
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
          'min-h-[260px] p-4 focus:outline-none text-text-primary text-sm sm:text-base leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && content && Object.keys(content).length > 0) {
      const currentJson = JSON.stringify(editor.getJSON());
      const newJson = JSON.stringify(content);
      if (currentJson !== newJson) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer
      className={`rounded-xl border border-border bg-surface overflow-hidden transition-all focus-within:border-primary shadow-sm ${className}`}
    >
      {/* Editor Toolbar */}
      {editable && (
        <LayoutContainer className="flex flex-wrap items-center gap-1 p-2 bg-drawer border-b border-border">
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
            aria-label={texts.HEADING_3}
            title={texts.HEADING_3}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={
              editor.isActive('heading', { level: 3 })
                ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }
            icon={<Heading3 className="w-4 h-4" />}
          />

          <LayoutContainer className="w-px h-5 bg-border mx-1" />

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

          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            aria-label={texts.ORDERED_LIST}
            title={texts.ORDERED_LIST}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive('orderedList')
                ? 'bg-primary text-button-primary-text font-bold shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }
            icon={<ListOrdered className="w-4 h-4" />}
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
            aria-label="Separador"
            title="Linha Divisória"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="text-text-secondary hover:text-text-primary"
            icon={<Minus className="w-4 h-4" />}
          />

          <LayoutContainer className="w-px h-5 bg-border mx-1" />

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
      )}

      {/* Editor Content Box */}
      <LayoutContainer className="tiptap-editor-wrapper bg-surface">
        <EditorContent editor={editor} />
      </LayoutContainer>
    </LayoutContainer>
  );
};

