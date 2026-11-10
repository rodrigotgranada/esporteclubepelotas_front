'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Button,
  Badge,
} from '@/shared/ui/components/atoms';
import { Trophy, HelpCircle } from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../../constants/matches.constants';
import {
  useAdminMatchScoreModal,
  ScoreData,
} from '../../../hooks/useAdminMatchScoreModal';

export interface AdminMatchScoreModalProps {
  isOpen: boolean;
  opponentName?: string;
  opponentLogoUrl?: string;
  initialPelotasScore?: number | null;
  initialOpponentScore?: number | null;
  initialPenaltyPelotasScore?: number | null;
  initialPenaltyOpponentScore?: number | null;
  onConfirm: (scores: ScoreData) => void;
  onClose: () => void;
}

export const AdminMatchScoreModal: React.FC<AdminMatchScoreModalProps> = ({
  isOpen,
  opponentName,
  opponentLogoUrl,
  initialPelotasScore,
  initialOpponentScore,
  initialPenaltyPelotasScore,
  initialPenaltyOpponentScore,
  onConfirm,
  onClose,
}) => {
  const { SCORE_MODAL } = MATCHES_CONSTANTS.ADMIN;
  const currentOpponentName = opponentName?.trim() || SCORE_MODAL.OPPONENT_LABEL_DEFAULT;
  const currentOpponentBadge = opponentLogoUrl?.trim() || DEFAULT_OPPONENT_BADGE;

  const {
    pelotasScore,
    setPelotasScore,
    opponentScore,
    setOpponentScore,
    hasPenalties,
    handleTogglePenalties,
    penaltyPelotas,
    setPenaltyPelotas,
    penaltyOpponent,
    setPenaltyOpponent,
    error,
    handleConfirm,
  } = useAdminMatchScoreModal({
    isOpen,
    initialPelotasScore,
    initialOpponentScore,
    initialPenaltyPelotasScore,
    initialPenaltyOpponentScore,
    onConfirm,
    onClose,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <LayoutContainer className="space-y-5">
        {/* Cabeçalho */}
        <LayoutContainer className="border-b border-border/60 pb-3 flex items-center justify-between">
          <LayoutContainer className="flex items-center gap-2.5">
            <LayoutContainer className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/30">
              <Trophy size={18} />
            </LayoutContainer>
            <LayoutContainer>
              <Title level="h3" className="text-lg font-black text-text-primary">
                {SCORE_MODAL.TITLE}
              </Title>
              <Text className="text-xs text-text-muted mt-0.5">
                {SCORE_MODAL.SUBTITLE}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Confronto Visual & Inputs de Placar */}
        <LayoutContainer className="p-4 rounded-2xl bg-surface/40 border border-border/70 space-y-4">
          <LayoutContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Pelotas (Mandante ou Time do Clube) */}
            <LayoutContainer className="flex flex-col items-center text-center space-y-2">
              <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-sm">
                <SafeImage
                  src="/images/pelotas-logo.png"
                  alt="Esporte Clube Pelotas"
                  width={36}
                  height={36}
                  className="object-contain max-h-9"
                />
              </LayoutContainer>
              <Text className="text-xs font-black text-text-primary line-clamp-1">
                {SCORE_MODAL.PELOTAS_LABEL}
              </Text>
              <Input
                type="number"
                min={0}
                value={pelotasScore}
                onChange={(e) => setPelotasScore(e.target.value)}
                className="text-center font-black text-2xl h-14 bg-surface-hover/50 border-secondary/40 focus:border-secondary"
                placeholder={SCORE_MODAL.SCORE_PLACEHOLDER}
              />
            </LayoutContainer>

            {/* Separador Visual "X" */}
            <LayoutContainer className="flex flex-col items-center justify-center pt-6 px-1">
              <span className="text-base font-black text-secondary tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                {SCORE_MODAL.VS}
              </span>
            </LayoutContainer>

            {/* Adversário */}
            <LayoutContainer className="flex flex-col items-center text-center space-y-2">
              <LayoutContainer className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-sm">
                <SafeImage
                  src={currentOpponentBadge}
                  alt={currentOpponentName}
                  width={36}
                  height={36}
                  className="object-contain max-h-9"
                />
              </LayoutContainer>
              <Text className="text-xs font-black text-text-primary line-clamp-1">
                {currentOpponentName}
              </Text>
              <Input
                type="number"
                min={0}
                value={opponentScore}
                onChange={(e) => setOpponentScore(e.target.value)}
                className="text-center font-black text-2xl h-14 bg-surface-hover/50 border-secondary/40 focus:border-secondary"
                placeholder={SCORE_MODAL.SCORE_PLACEHOLDER}
              />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Linha do Switch: Disputa por Pênaltis */}
        <LayoutContainer className="pt-1">
          <Button
            type="button"
            variant="custom"
            size="none"
            role="switch"
            aria-checked={hasPenalties}
            onClick={handleTogglePenalties}
            className={`w-full h-[46px] px-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
              hasPenalties
                ? 'bg-secondary/15 border-secondary/60 text-secondary'
                : 'bg-surface-hover/40 border-border text-text-secondary hover:border-border/90'
            }`}
          >
            <LayoutContainer className="flex items-center gap-2">
              <HelpCircle size={16} className={hasPenalties ? 'text-secondary' : 'text-text-muted'} />
              <Text className="text-xs font-bold text-text-primary">
                {SCORE_MODAL.PENALTIES_SWITCH_LABEL}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="flex items-center gap-2.5">
              <Badge
                variant="default"
                className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  hasPenalties
                    ? 'bg-secondary text-primary shadow-xs'
                    : 'bg-surface text-text-muted border border-border/50'
                }`}
              >
                {hasPenalties ? SCORE_MODAL.PENALTIES_SWITCH_ACTIVE : SCORE_MODAL.PENALTIES_SWITCH_INACTIVE}
              </Badge>

              {/* Toggle Track & Knob */}
              <LayoutContainer
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  hasPenalties ? 'bg-secondary' : 'bg-surface-hover border border-border'
                }`}
              >
                <LayoutContainer
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    hasPenalties ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </LayoutContainer>
            </LayoutContainer>
          </Button>
        </LayoutContainer>

        {/* Campos Condicionais de Pênaltis (Abre suavemente se hasPenalties === true) */}
        {hasPenalties && (
          <LayoutContainer className="p-3.5 rounded-xl border border-secondary/40 bg-secondary/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <LayoutContainer className="flex items-center justify-between border-b border-secondary/20 pb-2">
              <Text className="text-xs font-black text-text-primary uppercase tracking-wide">
                {SCORE_MODAL.PENALTIES_SECTION_TITLE}
              </Text>
              <Badge
                variant="default"
                className="text-[9px] font-black uppercase text-primary bg-secondary px-2 py-0.5 rounded-full border-0"
              >
                {SCORE_MODAL.PENALTIES_BADGE}
              </Badge>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-2 gap-4">
              <LayoutContainer className="space-y-1">
                <Text className="text-[11px] font-semibold text-text-secondary">
                  {SCORE_MODAL.PENALTIES_PELOTAS_LABEL}
                </Text>
                <Input
                  type="number"
                  min={0}
                  value={penaltyPelotas}
                  onChange={(e) => setPenaltyPelotas(e.target.value)}
                  className="text-center font-bold text-lg bg-surface"
                  placeholder={SCORE_MODAL.SCORE_PLACEHOLDER}
                />
              </LayoutContainer>

              <LayoutContainer className="space-y-1">
                <Text className="text-[11px] font-semibold text-text-secondary">
                  {SCORE_MODAL.PENALTIES_OPPONENT_LABEL}
                </Text>
                <Input
                  type="number"
                  min={0}
                  value={penaltyOpponent}
                  onChange={(e) => setPenaltyOpponent(e.target.value)}
                  className="text-center font-bold text-lg bg-surface"
                  placeholder={SCORE_MODAL.SCORE_PLACEHOLDER}
                />
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Mensagem de Erro (se houver) */}
        {error && (
          <Text className="text-xs text-orange-500 font-semibold block text-center">
            {error}
          </Text>
        )}

        {/* Rodapé com Botões de Ação */}
        <LayoutContainer className="flex items-center justify-end space-x-3 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            {SCORE_MODAL.CANCEL_BUTTON}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-6 cursor-pointer shadow-md"
          >
            {SCORE_MODAL.CONFIRM_BUTTON}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};
