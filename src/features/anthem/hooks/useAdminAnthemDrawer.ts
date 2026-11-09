import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ClubAnthem, ClubAnthemFormData } from '../types/anthem.types';
import { anthemService } from '../services/anthem.service';
import { ANTHEM_TEXTS } from '../constants/anthem.constants';

const anthemSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(200, 'Máximo 200 caracteres'),
  subtitle: z.string().max(300, 'Máximo 300 caracteres').optional(),
  lyrics: z.string().min(1, 'A letra do hino é obrigatória'),
  authorLyrics: z.string().max(150, 'Máximo 150 caracteres').optional(),
  authorMusic: z.string().max(150, 'Máximo 150 caracteres').optional(),
  compositionYear: z.union([z.number(), z.string(), z.null()]).optional(),
  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  historyTitle: z.string().max(200, 'Máximo 200 caracteres').optional(),
  historyText: z.string().optional(),
  isActive: z.boolean(),
  isOfficial: z.boolean(),
  displayOrder: z.union([z.number(), z.string()]),
});

export type AnthemFormValues = z.infer<typeof anthemSchema>;

export const useAdminAnthemDrawer = ({
  anthem,
  onClose,
  onSuccess,
}: {
  anthem: ClubAnthem | null;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const inFlightRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAudioFile, setPendingAudioFile] = useState<File | null>(null);
  const [pendingAudioName, setPendingAudioName] = useState<string>('');
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');

  const form = useForm<AnthemFormValues>({
    resolver: zodResolver(anthemSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      lyrics: '',
      authorLyrics: '',
      authorMusic: '',
      compositionYear: null,
      audioUrl: '',
      videoUrl: '',
      coverImageUrl: '',
      historyTitle: '',
      historyText: '',
      isActive: true,
      isOfficial: false,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (anthem) {
      form.reset({
        title: anthem.title || '',
        subtitle: anthem.subtitle || '',
        lyrics: anthem.lyrics || '',
        authorLyrics: anthem.authorLyrics || '',
        authorMusic: anthem.authorMusic || '',
        compositionYear: anthem.compositionYear ?? null,
        audioUrl: anthem.audioUrl || '',
        videoUrl: anthem.videoUrl || '',
        coverImageUrl: anthem.coverImageUrl || '',
        historyTitle: anthem.historyTitle || '',
        historyText: anthem.historyText || '',
        isActive: anthem.isActive ?? true,
        isOfficial: anthem.isOfficial ?? false,
        displayOrder: anthem.displayOrder ?? 0,
      });
      setPendingAudioFile(null);
      setPendingAudioName('');
      setPendingCoverFile(null);
      setCoverPreviewUrl(anthem.coverImageUrl || '');
    } else {
      form.reset({
        title: '',
        subtitle: '',
        lyrics: '',
        authorLyrics: 'José Walter de Oliveira (Valmúrio)',
        authorMusic: 'José Walter de Oliveira (Valmúrio)',
        compositionYear: 1918,
        audioUrl: '',
        videoUrl: '',
        coverImageUrl: '',
        historyTitle: '',
        historyText: '',
        isActive: true,
        isOfficial: false,
        displayOrder: 0,
      });
      setPendingAudioFile(null);
      setPendingAudioName('');
      setPendingCoverFile(null);
      setCoverPreviewUrl('');
    }
  }, [anthem, form]);

  const handleSelectAudioFile = (file: File) => {
    setPendingAudioFile(file);
    setPendingAudioName(file.name);
  };

  const handleSelectCoverFile = (file: File) => {
    setPendingCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
  };

  const handleRemoveCover = () => {
    setPendingCoverFile(null);
    setCoverPreviewUrl('');
    form.setValue('coverImageUrl', '');
  };

  const onSubmit = async (values: AnthemFormValues) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalAudioUrl = values.audioUrl || '';
      let finalCoverUrl = values.coverImageUrl || '';

      // 1. Upload de áudio se houver arquivo pendente
      if (pendingAudioFile) {
        const uploadResult = await anthemService.uploadAudio(pendingAudioFile);
        finalAudioUrl = uploadResult.url;
      }

      // 2. Upload de imagem de capa se houver arquivo pendente
      if (pendingCoverFile) {
        const uploadResult = await anthemService.uploadCover(pendingCoverFile);
        finalCoverUrl = uploadResult.url;
      }

      const payload: ClubAnthemFormData = {
        title: values.title.trim(),
        subtitle: values.subtitle?.trim() || undefined,
        lyrics: values.lyrics.trim(),
        authorLyrics: values.authorLyrics?.trim() || undefined,
        authorMusic: values.authorMusic?.trim() || undefined,
        compositionYear: values.compositionYear ? Number(values.compositionYear) : null,
        audioUrl: finalAudioUrl || undefined,
        videoUrl: values.videoUrl?.trim() || undefined,
        coverImageUrl: finalCoverUrl || undefined,
        historyTitle: values.historyTitle?.trim() || undefined,
        historyText: values.historyText?.trim() || undefined,
        isActive: Boolean(values.isActive),
        isOfficial: Boolean(values.isOfficial),
        displayOrder: Number(values.displayOrder) || 0,
      };

      if (anthem) {
        await anthemService.adminUpdate(anthem.id, payload);
      } else {
        await anthemService.adminCreate(payload);
      }

      toast.success(ANTHEM_TEXTS.TOAST_SAVE_SUCCESS);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error('Erro ao salvar versão do hino:', err);
      toast.error(ANTHEM_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsSaving(false);
      inFlightRef.current = false;
    }
  };

  return {
    form,
    isSaving,
    pendingAudioName,
    coverPreviewUrl,
    handleSelectAudioFile,
    handleSelectCoverFile,
    handleRemoveCover,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};

