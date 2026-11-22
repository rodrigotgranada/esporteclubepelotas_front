'use client';

import React from 'react';
import { EditorContent } from '@tiptap/react';
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
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useNewsBlockEditor } from '../../../hooks/news/useNewsBlockEditor';
import { NewsBlockFloatingMenu } from './NewsBlockFloatingMenu';
import { NewsImageInsertModal } from './NewsImageInsertModal';

export interface NewsBlockEditorProps {
  content?: Record<string, unknown> | string;
  onChange: (json: Record<string, unknown>) => void;
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

  const {
    editor,
    editorWrapperRef,
    menuRef,
    handleTop,
    isMenuOpen,
    menuMode,
    isDropup,
    isImagePickerOpen,
    setIsImagePickerOpen,
    cropSourceImage,
    isCropModalOpen,
    handleMouseMove,
    applyBlockType,
    handleAddClick,
    handleGripClick,
    handleDeleteBlock,
    handleImageSelected,
    handleCropSave,
    handleUseOriginalImage,
    closeCropModal,
  } = useNewsBlockEditor({
    content,
    onChange,
    editable,
    onUploadImage,
    placeholder,
  });

  if (!editor) {
    return null;
  }

  return (
    <LayoutContainer
      className={`rounded-xl border border-border bg-surface transition-all focus-within:border-primary shadow-sm flex flex-col ${className}`}
    >
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

      <LayoutContainer
        ref={editorWrapperRef}
        onMouseMove={handleMouseMove}
        className="relative bg-surface flex-1"
      >
        {editable && handleTop !== null && (
          <LayoutContainer
            style={{ top: `${Math.max(8, handleTop + 4)}px` }}
            className="absolute left-2.5 z-40 flex items-center gap-0.5 select-none transition-all duration-150"
          >
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

            {isMenuOpen && (
              <NewsBlockFloatingMenu
                menuMode={menuMode}
                menuRef={menuRef}
                isDropup={isDropup}
                onApplyBlockType={applyBlockType}
                onDeleteBlock={handleDeleteBlock}
              />
            )}
          </LayoutContainer>
        )}

        <LayoutContainer className="tiptap-editor-wrapper bg-surface min-h-[300px]">
          <EditorContent editor={editor} />
        </LayoutContainer>
      </LayoutContainer>

      <LayoutContainer className="px-4 py-2 border-t border-border bg-drawer/50 rounded-b-xl flex items-center gap-2 text-[11px] text-text-secondary">
        <Sparkles className="w-3 h-3 text-primary shrink-0" />
        <Text as="span">{texts.HINT_EDITOR_NOTION}</Text>
      </LayoutContainer>

      <NewsImageInsertModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onImageSelected={handleImageSelected}
      />

      {cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          onClose={closeCropModal}
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
