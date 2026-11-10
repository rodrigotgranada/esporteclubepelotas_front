'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Championship, Match, MatchFormData, MatchStatus, HomeAway } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { matchSchema, MatchSchemaType } from '../schemas/matches.schema';
import { MATCHES_CONSTANTS } from '../constants/matches.constants';

export interface UseAdminMatchDrawerProps {
  match: Match | null;
  championships: Championship[];
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdminMatchDrawer = ({
  match,
  championships,
  onClose,
  onSuccess,
}: UseAdminMatchDrawerProps) => {
  const inFlightRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  // Upload e Recorte de Escudo com CropModal (1:1)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');

  const form = useForm<MatchSchemaType>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      championshipId: championships[0]?.id || '',
      opponentName: '',
      opponentLogoUrl: '',
      homeAway: 'HOME',
      stadiumName: 'Estádio Boca do Lobo',
      city: 'Pelotas - RS',
      matchDate: new Date().toISOString().slice(0, 16),
      roundName: '',
      status: 'SCHEDULED',
      pelotasScore: null,
      opponentScore: null,
      penaltyPelotasScore: null,
      penaltyOpponentScore: null,
      ticketUrl: '',
      broadcastChannel: '',
      transmissionUrl: '',
      notes: '',
      displayOrder: 0,
    },
  });

  useEffect(() => {
    if (match) {
      // Formata data ISO para string aceita em input datetime-local (YYYY-MM-DDTHH:mm)
      let formattedDate = '';
      try {
        const d = new Date(match.matchDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch {
        formattedDate = new Date().toISOString().slice(0, 16);
      }

      form.reset({
        championshipId: match.championshipId,
        opponentName: match.opponentName,
        opponentLogoUrl: match.opponentLogoUrl || '',
        homeAway: match.homeAway,
        stadiumName: match.stadiumName,
        city: match.city || '',
        matchDate: formattedDate,
        roundName: match.roundName,
        status: match.status,
        pelotasScore: match.pelotasScore ?? null,
        opponentScore: match.opponentScore ?? null,
        penaltyPelotasScore: match.penaltyPelotasScore ?? null,
        penaltyOpponentScore: match.penaltyOpponentScore ?? null,
        ticketUrl: match.ticketUrl || '',
        broadcastChannel: match.broadcastChannel || '',
        transmissionUrl: match.transmissionUrl || '',
        notes: match.notes || '',
        displayOrder: match.displayOrder ?? 0,
      });
      setPendingLogoFile(null);
      setLogoPreviewUrl(match.opponentLogoUrl || '');
    } else {
      form.reset({
        championshipId: championships[0]?.id || '',
        opponentName: '',
        opponentLogoUrl: '',
        homeAway: 'HOME',
        stadiumName: 'Estádio Boca do Lobo',
        city: 'Pelotas - RS',
        matchDate: new Date().toISOString().slice(0, 16),
        roundName: '',
        status: 'SCHEDULED',
        pelotasScore: null,
        opponentScore: null,
        penaltyPelotasScore: null,
        penaltyOpponentScore: null,
        ticketUrl: '',
        broadcastChannel: '',
        transmissionUrl: '',
        notes: '',
        displayOrder: 0,
      });
      setPendingLogoFile(null);
      setLogoPreviewUrl('');
    }
  }, [match, championships, form]);

  // Seleção e Recorte de Imagem
  const handleSelectRawFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setCropSourceImage(objectUrl);
    setIsCropModalOpen(true);
  };

  const handleCropSave = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], `opponent-logo-${Date.now()}.png`, {
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
    form.setValue('opponentLogoUrl', '');
  };

  // Submissão do Formulário
  const onSubmit = async (values: MatchSchemaType) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalLogoUrl = values.opponentLogoUrl || '';

      // Upload obrigatório pré-commit caso haja arquivo selecionado
      if (pendingLogoFile) {
        finalLogoUrl = await matchesService.adminUploadMatchImage(pendingLogoFile);
      }

      // Converte data local para Instant UTC (ISO string)
      const dateUtc = new Date(values.matchDate).toISOString();

      const payload: MatchFormData = {
        championshipId: values.championshipId,
        opponentName: values.opponentName.trim(),
        opponentLogoUrl: finalLogoUrl.trim() || undefined,
        homeAway: values.homeAway as HomeAway,
        stadiumName: values.stadiumName.trim(),
        city: values.city?.trim() || undefined,
        matchDate: dateUtc,
        roundName: values.roundName.trim(),
        status: values.status as MatchStatus,
        pelotasScore: values.pelotasScore !== undefined && values.pelotasScore !== null ? Number(values.pelotasScore) : null,
        opponentScore: values.opponentScore !== undefined && values.opponentScore !== null ? Number(values.opponentScore) : null,
        penaltyPelotasScore: values.penaltyPelotasScore !== undefined && values.penaltyPelotasScore !== null ? Number(values.penaltyPelotasScore) : null,
        penaltyOpponentScore: values.penaltyOpponentScore !== undefined && values.penaltyOpponentScore !== null ? Number(values.penaltyOpponentScore) : null,
        ticketUrl: values.ticketUrl?.trim() || undefined,
        broadcastChannel: values.broadcastChannel?.trim() || undefined,
        transmissionUrl: values.transmissionUrl?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        displayOrder: Number(values.displayOrder || 0),
      };

      if (match?.id) {
        await matchesService.adminUpdateMatch(match.id, payload);
      } else {
        await matchesService.adminCreateMatch(payload);
      }

      toast.success(MATCHES_CONSTANTS.ADMIN.TOASTS.MATCH_SAVED);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar partida:', err);
      toast.error(MATCHES_CONSTANTS.ADMIN.TOASTS.SAVE_ERROR);
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
    }
  };

  return {
    form,
    isSaving,
    logoPreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectRawFile,
    handleCropSave,
    handleCropCancel,
    handleRemoveLogo,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
