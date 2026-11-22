'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import toast from 'react-hot-toast';
import { verifyUploadedUrl } from '@/shared/hooks';
import { adminNewsService } from '../../services/admin-news.service';
import { ADMIN_NEWS_TEXTS } from '../../constants/admin-news.constants';
import { NewsCustomImageExtension } from '../../ui/components/news/NewsCustomImageExtension';

export interface UseNewsBlockEditorOptions {
  content?: Record<string, unknown> | string;
  onChange: (json: Record<string, unknown>) => void;
  editable?: boolean;
  onUploadImage?: (file: File | Blob) => Promise<{ url: string }>;
  placeholder?: string;
}

const resolveInitialContent = (input?: Record<string, unknown> | string) => {
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

export const useNewsBlockEditor = ({
  content,
  onChange,
  editable = true,
  onUploadImage,
  placeholder,
}: UseNewsBlockEditorOptions) => {
  const { EDITOR: texts } = ADMIN_NEWS_TEXTS;
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [handleTop, setHandleTop] = useState<number | null>(null);
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'transform' | 'add_below'>('transform');
  const [isDropup, setIsDropup] = useState(false);

  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

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
      onChange(ed.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] py-4 pr-4 pl-14 focus:outline-none text-text-primary text-sm sm:text-base leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (!editor || !content) return;
    if (typeof content === 'string') {
      const trimmed = content.trim();
      if (trimmed.startsWith('{') && trimmed.includes('"type":"doc"')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (JSON.stringify(editor.getJSON()) !== JSON.stringify(parsed)) {
            editor.commands.setContent(parsed);
          }
        } catch {
          // ignore malformed JSON
        }
      } else if (editor.getHTML() !== content && editor.getText().trim() === '') {
        editor.commands.setContent(content);
      }
      return;
    }
    if (Object.keys(content).length > 0) {
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

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
      setIsDropup(topOffset > Math.max(60, editorWrapperRef.current.clientHeight - 340));
    }
  };

  const focusActiveBlock = () => {
    if (!editor || !activeElement) return;
    try {
      const pos = editor.view.posAtDOM(activeElement, 0);
      editor.chain().focus(pos).run();
    } catch {
      editor.commands.focus();
    }
  };

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

  const handleAddClick = () => {
    focusActiveBlock();
    setMenuMode('add_below');
    setIsMenuOpen(true);
  };

  const handleGripClick = () => {
    focusActiveBlock();
    setMenuMode('transform');
    setIsMenuOpen((prev) => !prev);
  };

  const handleDeleteBlock = () => {
    if (!editor) return;
    focusActiveBlock();
    const { $from } = editor.state.selection;
    if ($from.depth > 0) {
      const from = $from.before(1);
      const to = $from.after(1);
      const tr = editor.state.tr.delete(from, to);
      editor.view.dispatch(tr);
    }
    setIsMenuOpen(false);
  };

  const handleImageSelected = (source: string) => {
    setIsImagePickerOpen(false);
    setCropSourceImage(source);
    setIsCropModalOpen(true);
  };

  const uploadContentBlob = async (blob: Blob) => {
    const loadingToast = toast.loading(ADMIN_NEWS_TEXTS.TOAST.UPLOADING_CONTENT_IMAGE);
    try {
      const { url } = await (onUploadImage
        ? onUploadImage(blob)
        : adminNewsService.uploadContentImage(blob));
      const verifiedUrl = verifyUploadedUrl(url, ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
      editor?.chain().focus().setImage({ src: verifiedUrl }).run();
      toast.dismiss(loadingToast);
      toast.success(ADMIN_NEWS_TEXTS.TOAST.SUCCESS_CONTENT_IMAGE_UPLOADED);
      setIsCropModalOpen(false);
      setCropSourceImage(null);
    } catch (err) {
      console.error('Failed to upload content image', err);
      toast.dismiss(loadingToast);
      toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
    }
  };

  const handleUseOriginalImage = async () => {
    if (!editor || !cropSourceImage) return;
    if (cropSourceImage.startsWith('data:') || cropSourceImage.startsWith('blob:')) {
      try {
        const response = await fetch(cropSourceImage);
        const blob = await response.blob();
        await uploadContentBlob(blob);
      } catch (err) {
        console.error('Failed to read original image blob', err);
        toast.error(ADMIN_NEWS_TEXTS.TOAST.ERROR_CONTENT_IMAGE_UPLOAD);
      }
      return;
    }

    editor.chain().focus().setImage({ src: cropSourceImage }).run();
    setIsCropModalOpen(false);
    setCropSourceImage(null);
  };

  const closeCropModal = () => {
    setIsCropModalOpen(false);
    setCropSourceImage(null);
  };

  return {
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
    handleCropSave: uploadContentBlob,
    handleUseOriginalImage,
    closeCropModal,
  };
};
