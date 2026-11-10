'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Championship, Match, MatchFormData, MatchStatus, HomeAway } from '../types/matches.types';
import { matchesService } from '../services/matches.service';
import { matchSchema, MatchSchemaType } from '../schemas/matches.schema';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../constants/matches.constants';
import { OpponentClub } from '@/features/opponents/types/opponents.types';
import { opponentsService } from '@/features/opponents/services/opponents.service';

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
  const [isSaving, setIsSaving] = useState(false);

  // Catálogo de Clubes Adversários
  const [opponents, setOpponents] = useState<OpponentClub[]>([]);
  const [isLoadingOpponents, setIsLoadingOpponents] = useState(false);
  const [isQuickClubModalOpen, setIsQuickClubModalOpen] = useState(false);
  const [quickClubInitialName, setQuickClubInitialName] = useState<string>('');

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
    }
  }, [match, championships, form]);

  // Selecionar um clube adversário do catálogo
  const handleSelectOpponentClub = (club: OpponentClub) => {
    setValue('opponentName', club.name, { shouldValidate: true });
    const badge = club.badgeUrl || DEFAULT_OPPONENT_BADGE;
    setValue('opponentLogoUrl', badge);

    // Se o mando for fora (visitante), preenche automaticamente com o estádio e cidade do adversário
    if (currentHomeAway === 'AWAY') {
      if (club.stadiumName) setValue('stadiumName', club.stadiumName);
      if (club.city) setValue('city', club.city);
    }
  };

  // Alterar Mando de Campo com automação de local
  const handleHomeAwayChange = (mando: HomeAway) => {
    setValue('homeAway', mando, { shouldValidate: true, shouldDirty: true });

    if (mando === 'HOME') {
      setValue('stadiumName', 'Estádio Boca do Lobo', { shouldValidate: true, shouldDirty: true });
      setValue('city', 'Pelotas - RS', { shouldValidate: true, shouldDirty: true });
    } else {
      // Tentar encontrar o clube selecionado para preencher estádio/cidade
      const found = opponents.find(
        (c) => c.name.toLowerCase() === currentOpponentName.toLowerCase() ||
          (c.shortName && c.shortName.toLowerCase() === currentOpponentName.toLowerCase())
      );
      if (found) {
        if (found.stadiumName) setValue('stadiumName', found.stadiumName, { shouldValidate: true, shouldDirty: true });
        if (found.city) setValue('city', found.city, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue('stadiumName', '', { shouldValidate: true });
        setValue('city', '', { shouldValidate: true });
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

  // Submissão do formulário
  const onSubmit = async (values: MatchSchemaType) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSaving(true);

    try {
      let finalLogoUrl = values.opponentLogoUrl || '';

      if (!finalLogoUrl || !finalLogoUrl.trim() || finalLogoUrl === '/images/pelotas-logo.png') {
        finalLogoUrl = DEFAULT_OPPONENT_BADGE;
      }

      const dateUtc = new Date(values.matchDate).toISOString();

      // Placar só é gravado quando o status for FINISHED (Encerrado), tanto na criação quanto na edição!
      const isFinished = values.status === 'FINISHED';
      const pelotasScore = isFinished && values.pelotasScore !== null && values.pelotasScore !== undefined && !Number.isNaN(Number(values.pelotasScore))
        ? Number(values.pelotasScore)
        : null;
      const opponentScore = isFinished && values.opponentScore !== null && values.opponentScore !== undefined && !Number.isNaN(Number(values.opponentScore))
        ? Number(values.opponentScore)
        : null;
      const penaltyPelotas = isFinished && values.penaltyPelotasScore !== null && values.penaltyPelotasScore !== undefined && !Number.isNaN(Number(values.penaltyPelotasScore))
        ? Number(values.penaltyPelotasScore)
        : null;
      const penaltyOpponent = isFinished && values.penaltyOpponentScore !== null && values.penaltyOpponentScore !== undefined && !Number.isNaN(Number(values.penaltyOpponentScore))
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
        slug: undefined, // Gerado automaticamente pelo backend
        hasLiveCoverage: Boolean(values.hasLiveCoverage),
        status: values.status as MatchStatus,
        pelotasScore,
        opponentScore,
        penaltyPelotasScore: penaltyPelotas,
        penaltyOpponentScore: penaltyOpponent,
        ticketUrl: undefined,
        broadcastChannel: undefined,
        transmissionUrl: values.transmissionUrl?.trim() || undefined,
        notes: undefined,
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
    onSubmit: form.handleSubmit(onSubmit),
  };
};

