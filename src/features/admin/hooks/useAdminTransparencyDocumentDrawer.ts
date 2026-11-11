'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { uploadMedia } from '@/shared/services/media-upload.service';
import { transparencyService } from '@/features/transparency/services/transparency.service';
import { TransparencyDocument } from '@/features/transparency/types/transparency.types';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';

interface UseAdminTransparencyDocDrawerProps {
  document: TransparencyDocument | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function useAdminTransparencyDocumentDrawer({
  document,
  isOpen,
  onSuccess,
  onClose,
}: UseAdminTransparencyDocDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('BALANCO');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [published, setPublished] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setDescription(document.description || '');
      setCategory(document.category || 'BALANCO');
      setYear(document.year || new Date().getFullYear());
      setFileUrl(document.fileUrl || '');
      setFileSize(document.fileSize || '');
      setPublished(document.published ?? true);
    } else {
      setTitle('');
      setDescription('');
      setCategory('BALANCO');
      setYear(new Date().getFullYear());
      setFileUrl('');
      setFileSize('');
      setPublished(true);
    }
    setSelectedFile(null);
  }, [document, isOpen]);

  const handleSelectFile = (file: File) => {
    setSelectedFile(file);
    // Calcular tamanho aproximado
    const sizeInKb = Math.round(file.size / 1024);
    setFileSize(sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error('Informe o título do documento.');
      return;
    }

    try {
      setIsSaving(true);
      let targetFileUrl = fileUrl;

      // Fase 1: Media-First (Upload do binário antes do banco se selecionado novo arquivo)
      if (selectedFile) {
        setIsUploading(true);
        const uploadResult = await uploadMedia(selectedFile, {
          folder: 'transparency',
          endpoint: '/admin/transparency/documents/upload',
        });
        if (!uploadResult?.url) {
          throw new Error(TRANSPARENCY_TEXTS.ADMIN.UPLOAD_ERROR);
        }
        targetFileUrl = uploadResult.url;
        setIsUploading(false);
      }

      if (!targetFileUrl) {
        toast.error('O arquivo PDF é obrigatório.');
        return;
      }

      // Fase 2: Persistência no Banco
      if (document) {
        await transparencyService.updateDocument(document.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          year,
          fileUrl: targetFileUrl,
          fileSize: fileSize || undefined,
          published,
        });
      } else {
        await transparencyService.createDocument({
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          year,
          fileUrl: targetFileUrl,
          fileSize: fileSize || undefined,
          published,
        });
      }

      toast.success(TRANSPARENCY_TEXTS.ADMIN.SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao salvar documento:', err);
      const msg = err instanceof Error ? err.message : 'Falha ao salvar documento de transparência.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    year,
    setYear,
    fileUrl,
    fileSize,
    published,
    setPublished,
    selectedFile,
    handleSelectFile,
    isUploading,
    isSaving,
    handleSubmit,
  };
}

