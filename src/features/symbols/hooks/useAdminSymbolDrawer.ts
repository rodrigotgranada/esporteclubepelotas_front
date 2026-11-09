import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ClubSymbol, ClubSymbolFormData, SymbolCategory } from '../types/symbols.types';
import { symbolsService } from '../services/symbols.service';
import { SYMBOLS_TEXTS } from '../constants/symbols.constants';

const symbolSchema = z.object({
  category: z.enum(['MASCOT', 'SHIELD', 'FLAG', 'COLORS']),
  name: z.string().min(1, 'O nome é obrigatório').max(150, 'Máximo 150 caracteres'),
  subtitle: z.string().max(250, 'Máximo 250 caracteres').optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  yearStart: z.union([z.number(), z.string(), z.null()]).optional(),
  yearEnd: z.union([z.number(), z.string(), z.null()]).optional(),
  isOfficial: z.boolean(),
  isActive: z.boolean(),
  displayOrder: z.union([z.number(), z.string()]),
});

export type SymbolFormValues = z.infer<typeof symbolSchema>;

export const useAdminSymbolDrawer = ({
  symbol,
  onClose,
  onSuccess,
}: {
  symbol: ClubSymbol | null;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const inFlightRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const form = useForm<SymbolFormValues>({
    resolver: zodResolver(symbolSchema),
    defaultValues: {
      category: 'MASCOT',
      name: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      yearStart: null,
      yearEnd: null,
      isOfficial: false,
      isActive: true,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (symbol) {
      form.reset({
        category: symbol.category,
        name: symbol.name,
        subtitle: symbol.subtitle || '',
        description: symbol.description || '',
        imageUrl: symbol.imageUrl || '',
        yearStart: symbol.yearStart ?? null,
        yearEnd: symbol.yearEnd ?? null,
        isOfficial: symbol.isOfficial ?? false,
        isActive: symbol.isActive ?? true,
        displayOrder: symbol.displayOrder ?? 0,
      });
      setPendingImageFile(null);
      setImagePreviewUrl(symbol.imageUrl || '');
      setGalleryUrls(symbol.galleryUrls || []);
    } else {
      form.reset({
        category: 'MASCOT',
        name: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        yearStart: null,
        yearEnd: null,
        isOfficial: false,
        isActive: true,
        displayOrder: 0,
      });
      setPendingImageFile(null);
      setImagePreviewUrl('');
      setGalleryUrls([]);
    }
  }, [symbol, form]);

  const handleSelectImageFile = (file: File) => {
    setPendingImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl('');
    form.setValue('imageUrl', '');
  };

  const handleAddGalleryImage = async (file: File) => {
    try {
      setIsUploadingGallery(true);
      const res = await symbolsService.uploadImage(file);
      setGalleryUrls((prev) => [...prev, res.url]);
      toast.success('Foto adicionada à galeria!');
    } catch (err) {
      console.error('Erro ao subir foto para galeria:', err);
      toast.error('Falha ao adicionar foto.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (values: SymbolFormValues) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalImageUrl = values.imageUrl || '';

      // 1. Upload de imagem principal se houver pendência
      if (pendingImageFile) {
        const uploadResult = await symbolsService.uploadImage(pendingImageFile);
        finalImageUrl = uploadResult.url;
      }

      const payload: ClubSymbolFormData = {
        category: values.category as SymbolCategory,
        name: values.name.trim(),
        subtitle: values.subtitle?.trim() || undefined,
        description: values.description?.trim() || undefined,
        imageUrl: finalImageUrl || undefined,
        galleryUrls: galleryUrls,
        yearStart: values.yearStart ? Number(values.yearStart) : null,
        yearEnd: values.yearEnd ? Number(values.yearEnd) : null,
        isOfficial: Boolean(values.isOfficial),
        isActive: Boolean(values.isActive),
        displayOrder: Number(values.displayOrder) || 0,
      };

      if (symbol) {
        await symbolsService.adminUpdate(symbol.id, payload);
      } else {
        await symbolsService.adminCreate(payload);
      }

      toast.success(SYMBOLS_TEXTS.TOAST_SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar símbolo:', err);
      toast.error(SYMBOLS_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsSaving(false);
      inFlightRef.current = false;
    }
  };

  return {
    form,
    isSaving,
    imagePreviewUrl,
    galleryUrls,
    isUploadingGallery,
    handleSelectImageFile,
    handleRemoveImage,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
