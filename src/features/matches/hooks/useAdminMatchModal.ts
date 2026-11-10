'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Championship, Match, MatchFormData, MatchStatus, HomeAway } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { matchSchema, MatchSchemaType } from '../schemas/matches.schema';
import { MATCHES_CONSTANTS } from '../constants/matches.constants';
import { OpponentClub } from '@/features/opponents/types/opponents.types';
import { opponentsService } from '@/features/opponents/services/opponents.service';

export type MatchModalTab = 'match' | 'score';

export interface UseAdminMatchModalProps {
  match: Match | null;
  championships: Championship[];
  onClose: () => void;
  onSuccess: () => void;
}

export const useAdminMatchModal = ({
  match,
  championships,
  onClose,
  onSuccess,
}: UseAdminMatchModalProps) => {
  const inFlightRef = useRef(false);
  const [activeTab, setActiveTab] = useState<MatchModalTab>('match');
  const [isSaving, setIsSaving] = useState(false);

  // Catálogo de Clubes Adversários
  const [opponents, setOpponents] = useState<OpponentClub[]>([]);
  const [isLoadingOpponents, setIsLoadingOpponents] = useState(false);
  const [isQuickClubModalOpen, setIsQuickClubModalOpen] = useState(false);
  const [quickClubInitialName, setQuickClubInitialName] = useState<string>('');

  // Recorte manual de Escudo (caso queira subir arquivo direto)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');

  const isEditing = Boolean(match);

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
      slug: '',
      hasLiveCoverage: false,
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

  const { watch, setValue } = form;
  const currentHomeAway = watch('homeAway');
  const currentOpponentName = watch('opponentName');

  // Buscar lista de clubes adversários
  const loadOpponents = useCallback(async () => {
    try {
      setIsLoadingOpponents(true);
      const list = await opponentsService.adminGetOpponents();
      setOpponents(list);
    } catch {
      console.warn('Não foi possível carregar a lista de adversários.');
    } finally {
      setIsLoadingOpponents(false);
    }
  }, []);

  useEffect(() => {
    loadOpponents();
  }, [loadOpponents]);

  // Resetar formulário ao abrir/mudar match
  useEffect(() => {
    setActiveTab('match');

    if (match) {
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
        slug: match.slug || '',
        hasLiveCoverage: match.hasLiveCoverage ?? false,
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
        slug: '',
        hasLiveCoverage: false,
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

  // Selecionar um clube adversário do catálogo
  const handleSelectOpponentClub = (club: OpponentClub) => {
    setValue('opponentName', club.name, { shouldValidate: true });
    if (club.badgeUrl) {
      setValue('opponentLogoUrl', club.badgeUrl);
      setLogoPreviewUrl(club.badgeUrl);
      setPendingLogoFile(null);
    }

    // Se o mando for fora (visitante), preenche automaticamente com o estádio e cidade do adversário
    if (currentHomeAway === 'AWAY') {
      if (club.stadiumName) setValue('stadiumName', club.stadiumName);
      if (club.city) setValue('city', club.city);
    }
  };

  // Alterar Mando de Campo com automação de local
  const handleHomeAwayChange = (mando: HomeAway) => {
    setValue('homeAway', mando);

    if (mando === 'HOME') {
      setValue('stadiumName', 'Estádio Boca do Lobo');
      setValue('city', 'Pelotas - RS');
    } else {
      // Tentar encontrar o clube selecionado para preencher estádio/cidade
      const found = opponents.find(
        (c) => c.name.toLowerCase() === currentOpponentName.toLowerCase() ||
               (c.shortName && c.shortName.toLowerCase() === currentOpponentName.toLowerCase())
      );
      if (found) {
        if (found.stadiumName) setValue('stadiumName', found.stadiumName);
        if (found.city) setValue('city', found.city);
      } else {
        setValue('stadiumName', '');
        setValue('city', '');
      }
    }
  };

  // Abrir Modal de Cadastro Rápido de Clube
  const handleOpenQuickClub = (initialName?: string) => {
    setQuickClubInitialName(initialName?.trim() || '');
    setIsQuickClubModalOpen(true);
  };

  // Callback de sucesso ao cadastrar novo clube in-place
  const handleQuickClubSuccess = (newClub?: OpponentClub) => {
    loadOpponents();
    setIsQuickClubModalOpen(false);
    setQuickClubInitialName('');

    if (newClub) {
      handleSelectOpponentClub(newClub);
      toast.success(`Clube "${newClub.name}" selecionado para esta partida!`);
    }
  };

  // Upload e Recorte de Escudo Avulso
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
    setValue('opponentLogoUrl', '');
  };

  // Submissão do formulário
  const onSubmit = async (values: MatchSchemaType) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalLogoUrl = values.opponentLogoUrl || '';

      if (pendingLogoFile) {
        finalLogoUrl = await matchesService.adminUploadMatchImage(pendingLogoFile);
      }

      const dateUtc = new Date(values.matchDate).toISOString();

      // No cadastro novo, placar é estritamente null conforme exigência
      const pelotasScore = isEditing && values.pelotasScore !== null && values.pelotasScore !== undefined
        ? Number(values.pelotasScore)
        : null;
      const opponentScore = isEditing && values.opponentScore !== null && values.opponentScore !== undefined
        ? Number(values.opponentScore)
        : null;
      const penaltyPelotas = isEditing && values.penaltyPelotasScore !== null && values.penaltyPelotasScore !== undefined
        ? Number(values.penaltyPelotasScore)
        : null;
      const penaltyOpponent = isEditing && values.penaltyOpponentScore !== null && values.penaltyOpponentScore !== undefined
        ? Number(values.penaltyOpponentScore)
        : null;

      const payload: MatchFormData = {
        championshipId: values.championshipId,
        opponentName: values.opponentName.trim(),
        opponentLogoUrl: finalLogoUrl.trim() || undefined,
        homeAway: values.homeAway as HomeAway,
        stadiumName: values.stadiumName.trim(),
        city: values.city?.trim() || undefined,
        matchDate: dateUtc,
        roundName: values.roundName.trim(),
        slug: values.slug?.trim() || undefined,
        hasLiveCoverage: Boolean(values.hasLiveCoverage),
        status: values.status as MatchStatus,
        pelotasScore,
        opponentScore,
        penaltyPelotasScore: penaltyPelotas,
        penaltyOpponentScore: penaltyOpponent,
        ticketUrl: undefined,
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
    isEditing,
    activeTab,
    setActiveTab,
    isSaving,
    // Catálogo de Oponentes
    opponents,
    isLoadingOpponents,
    isQuickClubModalOpen,
    setIsQuickClubModalOpen,
    quickClubInitialName,
    handleOpenQuickClub,
    handleSelectOpponentClub,
    handleQuickClubSuccess,
    handleHomeAwayChange,
    // Imagem / Recorte
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

