import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ClubKit, ClubKitFormData, KitType } from '../types/kits.types';
import { kitsService } from '../services/kits.service';
import { kitFormSchema, KitFormSchema } from '../schemas/kit.schema';
import { getKitTypeLabel } from '../utils/kits.utils';

export interface UseAdminKitDrawerProps {
  kit: ClubKit | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdminKitDrawer = ({
  kit,
  onClose,
  onSuccess,
}: UseAdminKitDrawerProps) => {
  const inFlightRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  // Upload e Recorte com CropModal
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);

  // Galeria de Fotos Complementares
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const form = useForm<KitFormSchema>({
    resolver: zodResolver(kitFormSchema),
    defaultValues: {
      name: '',
      kitType: 'HOME',
      competition: '',
      seasonYear: new Date().getFullYear(),
      imageUrl: '',
      galleryUrls: [],
      manufacturer: '',
      sponsor: '',
      description: '',
      isCurrent: true,
      isActive: true,
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (kit) {
      form.reset({
        name: kit.name,
        kitType: kit.kitType,
        competition: kit.competition,
        seasonYear: kit.seasonYear,
        imageUrl: kit.imageUrl,
        galleryUrls: kit.galleryUrls || [],
        manufacturer: kit.manufacturer || '',
        sponsor: kit.sponsor || '',
        description: kit.description || '',
        isCurrent: kit.isCurrent,
        isActive: kit.isActive,
        displayOrder: kit.displayOrder ?? 0,
      });
      setPendingImageFile(null);
      setImagePreviewUrl(kit.imageUrl || '');
      setGalleryUrls(kit.galleryUrls || []);
    } else {
      form.reset({
        name: '',
        kitType: 'HOME',
        competition: '',
        seasonYear: new Date().getFullYear(),
        imageUrl: '',
        galleryUrls: [],
        manufacturer: '',
        sponsor: '',
        description: '',
        isCurrent: true,
        isActive: true,
        displayOrder: 0,
      });
      setPendingImageFile(null);
      setImagePreviewUrl('');
      setGalleryUrls([]);
    }
  }, [kit, form]);

  // Fluxo de seleção de imagem disparando CropModal
  const handleSelectImageFile = (file: File) => {
    setSelectedRawFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCropSourceImage(reader.result?.toString() || '');
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Salvar recorte do CropModal
  const handleCropSave = (croppedBlob: Blob) => {
    const fileName = selectedRawFile?.name || 'kit-cropped.png';
    const croppedFile = new File([croppedBlob], fileName, {
      type: croppedBlob.type || 'image/png',
    });
    setPendingImageFile(croppedFile);
    setImagePreviewUrl(URL.createObjectURL(croppedBlob));
    form.setValue('imageUrl', 'pending-file-upload', { shouldValidate: true });
    setIsCropModalOpen(false);
    setCropSourceImage('');
  };

  // Usar imagem original sem recorte
  const handleUseOriginal = () => {
    if (selectedRawFile) {
      setPendingImageFile(selectedRawFile);
      setImagePreviewUrl(URL.createObjectURL(selectedRawFile));
      form.setValue('imageUrl', 'pending-file-upload', { shouldValidate: true });
    }
    setIsCropModalOpen(false);
    setCropSourceImage('');
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setCropSourceImage('');
    setSelectedRawFile(null);
  };

  const handleRemoveImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl('');
    form.setValue('imageUrl', '', { shouldValidate: true });
  };

  // Fotos de galeria complementar
  const handleAddGalleryImage = async (file: File) => {
    try {
      setIsUploadingGallery(true);
      const url = await kitsService.uploadKitImage(file);
      setGalleryUrls((prev) => [...prev, url]);
      toast.success('Foto adicional carregada com sucesso!');
    } catch (err) {
      console.error('Erro ao subir foto de detalhe:', err);
      toast.error('Falha ao enviar foto para galeria.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (values: KitFormSchema) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalImageUrl = values.imageUrl;

      // 1. Upload Media-First se houver arquivo recortado/selecionado
      if (pendingImageFile) {
        toast.loading('Enviando foto do manto...', { id: 'upload-toast' });
        finalImageUrl = await kitsService.uploadKitImage(pendingImageFile);
        toast.dismiss('upload-toast');
      }

      if (!finalImageUrl || finalImageUrl === 'pending-file-upload') {
        toast.error('Selecione uma foto válida para o uniforme.');
        setIsSaving(false);
        inFlightRef.current = false;
        return;
      }

      const resolvedName =
        values.name && values.name.trim()
          ? values.name.trim()
          : getKitTypeLabel(values.kitType as KitType);

      const payload: ClubKitFormData = {
        name: resolvedName,
        kitType: values.kitType as KitType,
        competition: values.competition.trim(),
        seasonYear: Number(values.seasonYear),
        imageUrl: finalImageUrl,
        galleryUrls: galleryUrls,
        manufacturer: values.manufacturer?.trim() || undefined,
        sponsor: values.sponsor?.trim() || undefined,
        description: values.description?.trim() || undefined,
        isCurrent: Boolean(values.isCurrent),
        isActive: Boolean(values.isActive),
        displayOrder: Number(values.displayOrder) || 0,
      };

      if (kit) {
        await kitsService.adminUpdate(kit.id, payload);
        toast.success('Uniforme atualizado com sucesso!');
      } else {
        await kitsService.adminCreate(payload);
        toast.success('Uniforme cadastrado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar manto:', err);
      toast.error('Erro ao salvar uniforme no acervo.');
    } finally {
      setIsSaving(false);
      inFlightRef.current = false;
    }
  };

  return {
    form,
    isSaving,
    imagePreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    galleryUrls,
    isUploadingGallery,
    handleSelectImageFile,
    handleCropSave,
    handleUseOriginal,
    handleCloseCropModal,
    handleRemoveImage,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};

