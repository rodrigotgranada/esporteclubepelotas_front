'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Championship,
  ChampionshipCategory,
  ChampionshipFormData,
  RegulationItem,
} from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { championshipSchema, ChampionshipSchemaType } from '../schemas/matches.schema';
import { MATCHES_CONSTANTS } from '../constants/matches.constants';

export interface UseAdminChampionshipDrawerProps {
  championship: Championship | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdminChampionshipDrawer = ({
  championship,
  onClose,
  onSuccess,
}: UseAdminChampionshipDrawerProps) => {
  const inFlightRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  // Upload e Recorte de Logo com CropModal (1:1)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');

  const form = useForm<ChampionshipSchemaType>({
    resolver: zodResolver(championshipSchema),
    defaultValues: {
      name: '',
      seasonYear: new Date().getFullYear(),
      category: 'PROFESSIONAL_MEN',
      logoUrl: '',
      tableUrl: '',
      regulations: [],
      isActive: true,
      displayOrder: 0,
    },
  });

  const { fields: regulationFields, append: appendRegulation, remove: removeRegulation } =
    useFieldArray({
      control: form.control,
      name: 'regulations',
    });

  useEffect(() => {
    if (championship) {
      form.reset({
        name: championship.name,
        seasonYear: championship.seasonYear,
        category: championship.category,
        logoUrl: championship.logoUrl || '',
        tableUrl: championship.tableUrl || '',
        regulations: championship.regulations || [],
        isActive: championship.isActive,
        displayOrder: championship.displayOrder ?? 0,
      });
      setPendingLogoFile(null);
      setLogoPreviewUrl(championship.logoUrl || '');
    } else {
      form.reset({
        name: '',
        seasonYear: new Date().getFullYear(),
        category: 'PROFESSIONAL_MEN',
        logoUrl: '',
        tableUrl: '',
        regulations: [],
        isActive: true,
        displayOrder: 0,
      });
      setPendingLogoFile(null);
      setLogoPreviewUrl('');
    }
  }, [championship, form]);

  const handleSelectRawFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setCropSourceImage(objectUrl);
    setIsCropModalOpen(true);
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], `championship-logo-${Date.now()}.png`, {
      type: 'image/png',
    });
    setPendingLogoFile(croppedFile);
    setLogoPreviewUrl(URL.createObjectURL(croppedBlob));
    setIsCropModalOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setCropSourceImage('');
  };

  const handleRemoveLogo = () => {
    setPendingLogoFile(null);
    setLogoPreviewUrl('');
    form.setValue('logoUrl', '');
  };

  const handleAddRegulation = () => {
    appendRegulation({ title: '', url: '' });
  };

  const onSubmit = async (values: ChampionshipSchemaType) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalLogoUrl = values.logoUrl || '';

      if (pendingLogoFile) {
        finalLogoUrl = await matchesService.adminUploadMatchImage(pendingLogoFile);
      }

      const validRegulations: RegulationItem[] = (values.regulations || [])
        .filter((r) => r.title?.trim() && r.url?.trim())
        .map((r) => ({
          title: r.title.trim(),
          url: r.url.trim(),
        }));

      const payload: ChampionshipFormData = {
        name: values.name.trim(),
        seasonYear: Number(values.seasonYear),
        category: values.category as ChampionshipCategory,
        logoUrl: finalLogoUrl.trim() || undefined,
        tableUrl: values.tableUrl?.trim() || undefined,
        regulations: validRegulations,
        isActive: values.isActive,
        displayOrder: Number(values.displayOrder || 0),
      };

      if (championship?.id) {
        await matchesService.adminUpdateChampionship(championship.id, payload);
      } else {
        await matchesService.adminCreateChampionship(payload);
      }

      toast.success(MATCHES_CONSTANTS.ADMIN.TOASTS.CHAMPIONSHIP_SAVED);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar campeonato:', err);
      toast.error(MATCHES_CONSTANTS.ADMIN.TOASTS.SAVE_ERROR);
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return {
    form,
    regulationFields,
    isSaving,
    logoPreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectRawFile,
    handleCropSave,
    handleCropCancel,
    handleRemoveLogo,
    handleAddRegulation,
    removeRegulation,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
