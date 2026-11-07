'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { NewsCustomImageExtension } from './NewsCustomImageExtension';
import {
  GripVertical,
  Plus,
  Heading1,
  Heading2,
  Quote,
  List,
  Bold,
  Italic,
  Undo2,
  Redo2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { LayoutContainer, IconButton, Text, CropModal } from '@/shared/ui/components';
import { verifyUploadedUrl } from '@/shared/hooks';
import toast from 'react-hot-toast';
import { adminNewsService } from '../../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { NewsBlockFloatingMenu } from './NewsBlockFloatingMenu';
import { NewsImageInsertModal } from './NewsImageInsertModal';

export interface NewsBlockEditorProps {
  content?: Record<string, any> | string;
  onChange: (json: Record<string, any>) => void;
  editable?: boolean;
  className?: string;
  onUploadImage?: (file: File | Blob) => Promise<{ url: string }>;
  placeholder?: string;
}

export const NewsBlockEditor: React.FC<NewsBlockEditorProps> = ({
  content,
  onChange,
  editable = true,
  className = '',
  onUploadImage,
  placeholder,
}) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle position tracking on left gutter
  const [handleTop, setHandleTop] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'transform' | 'add_below'>('transform');

  // Image insertion & crop modal states
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const resolveInitialContent = (input?: Record<string, any> | string) => {
    if (!input) return undefined;
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed.startsWith('{') && trimmed.includes('"type":"doc"')) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return input;
        }
      }
      return input;
    }
    return Object.keys(input).length > 0 ? input : undefined;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || texts.PLACEHOLDER,
      }),
      NewsCustomImageExtension.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: resolveInitialContent(content),
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
    if (editor && content) {
      if (typeof content === 'string') {
        const trimmed = content.trim();
        if (trimmed.startsWith('{') && trimmed.includes('"type":"doc"')) {
          try {
            const parsed = JSON.parse(trimmed);
            const currentJson = JSON.stringify(editor.getJSON());
            if (currentJson !== JSON.stringify(parsed)) {
              editor.commands.setContent(parsed);
            }
          } catch {
            // ignore malformed JSON
          }
        } else {
          if (editor.getHTML() !== content && editor.getText().trim() === '') {
            editor.commands.setContent(content);
          }
        }
      } else if (Object.keys(content).length > 0) {
        const currentJson = JSON.stringify(editor.getJSON());
        const newJson = JSON.stringify(content);
        if (currentJson !== newJson) {
          editor.commands.setContent(content);
        }
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

  // Apply block type
  const applyBlockType = (type: string, level?: 1 | 2 | 3) => {
    if (!editor) return;

    if (menuMode === 'add_below') {
      focusActiveBlock();
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
        setIsImagePickerOpen(true);
        return;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  // Click on (+) Button
  const handleAddClick = () => {
    focusActiveBlock();
    setMenuMode('add_below');
    setIsMenuOpen(true);
  };

  // Click on (⋮⋮) Handle
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

  // When an image source (computer file or URL) is chosen, open CropModal
  const handleImageSelected = (source: string) => {
    setIsImagePickerOpen(false);
    setCropSourceImage(source);
    setIsCropModalOpen(true);
  };

  // When crop is confirmed, upload image and insert verified public storage URL into editor
  const handleCropSave = async (croppedBlob: Blob) => {
    if (!editor) return;
    const loadingToast = toast.loading(ADMIN_NEWS_TEXTS.TOAST.UPLOADING_CONTENT_IMAGE);
    try {
      const { url } = await (onUploadImage
        ? onUploadImage(croppedBlob)
        : adminNewsService.uploadContentImage(croppedBlob));
      const verifiedUrl = verifyUploadedUrl(url, ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
      editor.chain().focus().setImage({ src: verifiedUrl }).run();
      toast.dismiss(loadingToast);
      toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CONTENT_IMAGE_UPLOADED);
      setIsCropModalOpen(false);
      setCropSourceImage(null);
    } catch (err) {
      console.error('Failed to upload cropped image', err);
      toast.dismiss(loadingToast);
      toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
    }
  };

  // If user chooses to insert original image without crop
  const handleUseOriginalImage = async () => {
    if (!editor || !cropSourceImage) return;

    if (cropSourceImage.startsWith('data:') || cropSourceImage.startsWith('blob:')) {
      const loadingToast = toast.loading(ADMIN_NEWS_TEXTS.TOAST.UPLOADING_CONTENT_IMAGE);
      try {
        const response = await fetch(cropSourceImage);
        const blob = await response.blob();
        const { url } = await (onUploadImage
          ? onUploadImage(blob)
          : adminNewsService.uploadContentImage(blob));
        const verifiedUrl = verifyUploadedUrl(url, ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
        editor.chain().focus().setImage({ src: verifiedUrl }).run();
        toast.dismiss(loadingToast);
        toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CONTENT_IMAGE_UPLOADED);
        setIsCropModalOpen(false);
        setCropSourceImage(null);
      } catch (err) {
        console.error('Failed to upload original image', err);
        toast.dismiss(loadingToast);
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
      }
      return;
    }

    editor.chain().focus().setImage({ src: cropSourceImage }).run();
    setIsCropModalOpen(false);
    setCropSourceImage(null);
  };

  if (!editor) {
    return null;
  }

  const isDropup =
    handleTop !== null &&
    editorWrapperRef.current !== null &&
    handleTop > Math.max(60, editorWrapperRef.current.clientHeight - 340);

  return (
    <LayoutContainer
      className={`rounded-xl border border-border bg-surface transition-all focus-within:border-primary shadow-sm flex flex-col ${className}`}
    >
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
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label={texts.BLOCK_TYPE_IMAGE}
              title={texts.BLOCK_TYPE_IMAGE}
              onClick={() => setIsImagePickerOpen(true)}
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
            {/* (+) Button: Inserts new block below */}
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddClick}
              title={texts.BLOCK_ADD_TOOLTIP}
              aria-label={texts.BLOCK_ADD_TOOLTIP}
              className={`!w-6 !h-6 !p-0 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen && menuMode === 'add_below'
                  ? 'bg-primary text-black font-bold shadow-xs'
                  : 'hover:bg-drawer text-text-secondary hover:text-primary'
              }`}
              icon={<Plus className="w-3.5 h-3.5" />}
            />

            {/* (⋮⋮) Handle: Options for current line */}
            <IconButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGripClick}
              title={texts.BLOCK_HANDLE_TOOLTIP}
              aria-label={texts.BLOCK_HANDLE_TOOLTIP}
              className={`!w-6 !h-6 !p-0 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                isMenuOpen && menuMode === 'transform'
                  ? 'bg-primary text-black font-bold shadow-xs'
                  : 'hover:bg-drawer text-text-secondary hover:text-text-primary'
              }`}
              icon={<GripVertical className="w-3.5 h-3.5" />}
            />

            {/* Floating Dropdown Menu */}
            {isMenuOpen && (
              <NewsBlockFloatingMenu
                menuMode={menuMode}
                menuRef={menuRef}
                isDropup={Boolean(isDropup)}
                onApplyBlockType={applyBlockType}
                onDeleteBlock={handleDeleteBlock}
              />
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
        <Text as="span">{texts.HINT_EDITOR_NOTION}</Text>
      </LayoutContainer>

      {/* 1. Modal to Choose Image Source (File or Web URL) */}
      <NewsImageInsertModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onImageSelected={handleImageSelected}
      />

      {/* 2. Crop, Resize & AI Background Removal Modal */}
      {cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropSourceImage(null);
          }}
          onCropSave={handleCropSave}
          onUseOriginal={handleUseOriginalImage}
          fixedShape="rect"
          aspectOptions={[
            { label: '16:9', value: 16 / 9 },
            { label: '4:3', value: 4 / 3 },
            { label: '1:1', value: 1 },
            { label: 'Livre', value: undefined },
          ]}
          texts={{
            title: texts.IMAGE_CROP_MODAL_TITLE,
          }}
        />
      )}
    </LayoutContainer>
  );
};
