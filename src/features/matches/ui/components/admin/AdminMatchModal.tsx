'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Select,
  Option,
  Button,
} from '@/shared/ui/components/atoms';
import { Radio } from 'lucide-react';
import { Championship, Match } from '../../../types/matches.types';
import { MATCHES_CONSTANTS, MATCH_STATUS_LABELS } from '../../../constants/matches.constants';
import { useAdminMatchModal } from '../../../hooks/useAdminMatchModal';
import { AdminOpponentModal } from '@/features/opponents/ui/components/AdminOpponentModal';
import { OpponentSearchCombobox } from './OpponentSearchCombobox';

export interface AdminMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  championships: Championship[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminMatchModal: React.FC<AdminMatchModalProps> = ({
  isOpen,
  match,
  championships,
  onClose,
  onSuccess,
}) => {
  const { MATCH_DRAWER } = MATCHES_CONSTANTS.ADMIN;

  const {
    form: {
      register,
      watch,
      setValue,
      formState: { errors },
    },
    isEditing,
    activeTab,
    setActiveTab,
    isSaving,
    opponents,
    isQuickClubModalOpen,
    setIsQuickClubModalOpen,
    quickClubInitialName,
    handleOpenQuickClub,
    handleSelectOpponentClub,
    handleQuickClubSuccess,
    handleHomeAwayChange,
    onSubmit,
  } = useAdminMatchModal({
    match,
    championships,
    onClose,
    onSuccess,
  });

  const selectedOpponentName = watch('opponentName');
  const currentHomeAway = watch('homeAway');
  const currentStatus = watch('status');
  const hasLiveCoverage = watch('hasLiveCoverage');

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <LayoutContainer className="space-y-5">
          {/* Cabeçalho */}
          <LayoutContainer className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <LayoutContainer>
              <Title level="h3" className="text-xl font-bold text-text-primary">
                {isEditing ? MATCH_DRAWER.EDIT_TITLE : MATCH_DRAWER.CREATE_TITLE}
              </Title>
              <Text className="text-xs text-text-muted mt-0.5">
                {isEditing
                  ? 'Atualize os dados da partida, transmissão ou lance o placar oficial.'
                  : 'Agende uma nova partida preenchendo o confronto, local e data.'}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          {/* Abas de Navegação (Exclusivas para modo de Edição) */}
          {isEditing && (
            <LayoutContainer className="flex items-center space-x-2 border-b border-border/60 pb-1">
              <Button
                type="button"
                variant="custom"
                size="none"
                onClick={() => setActiveTab('match')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'match'
                    ? 'bg-secondary text-primary shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                1. Dados da Partida
              </Button>

              <Button
                type="button"
                variant="custom"
                size="none"
                onClick={() => setActiveTab('score')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'score'
                    ? 'bg-secondary text-primary shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`}
              >
                2. Placar & Resultado
              </Button>
            </LayoutContainer>
          )}

          {/* Formulário Principal */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* ================= DADOS DA PARTIDA ================= */}
            {(activeTab === 'match' || !isEditing) && (
              <LayoutContainer className="space-y-4 animate-in fade-in duration-150">
                {/* Linha 1: Campeonato (50%) & Minuto a Minuto Ao Vivo (50%) */}
                <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Campeonato Oficial */}
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.CHAMPIONSHIP_LABEL}
                    </Text>
                    <Select
                      {...register('championshipId')}
                      className="w-full"
                    >
                      {championships.map((champ) => (
                        <Option key={champ.id} value={champ.id}>
                          {champ.name} {champ.seasonYear} ({champ.category})
                        </Option>
                      ))}
                    </Select>
                    {errors.championshipId && (
                      <Text className="text-xs text-orange-500 font-medium">
                        {errors.championshipId.message}
                      </Text>
                    )}
                  </LayoutContainer>

                  {/* Switch: Minuto a Minuto Ao Vivo */}
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.LIVE_COVERAGE_LABEL}
                    </Text>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hasLiveCoverage}
                      onClick={() => setValue('hasLiveCoverage', !hasLiveCoverage)}
                      className={`w-full h-[42px] px-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                        hasLiveCoverage
                          ? 'bg-secondary/15 border-secondary/60 text-secondary'
                          : 'bg-surface-hover/50 border-border text-text-secondary hover:border-border/90'
                      }`}
                    >
                      <LayoutContainer className="flex items-center gap-2">
                        <Radio size={16} className={hasLiveCoverage ? 'text-secondary animate-pulse' : 'text-text-muted'} />
                        <Text className="text-xs font-bold text-text-primary">
                          Lance a Lance
                        </Text>
                      </LayoutContainer>

                      <LayoutContainer className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          hasLiveCoverage
                            ? 'bg-secondary text-primary shadow-xs'
                            : 'bg-surface text-text-muted border border-border/50'
                        }`}>
                          {hasLiveCoverage ? 'Ativado' : 'Desativado'}
                        </span>

                        {/* Toggle Track & Knob */}
                        <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          hasLiveCoverage ? 'bg-secondary' : 'bg-surface-hover border border-border'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                            hasLiveCoverage ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </div>
                      </LayoutContainer>
                    </button>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Linha 2: Seleção do Clube Adversário (100% de largura) */}
                <LayoutContainer className="space-y-1.5">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.OPPONENT_LABEL}
                    </Text>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenQuickClub(selectedOpponentName)}
                      className="text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary/10 cursor-pointer h-7 px-2.5"
                    >
                      + Cadastrar Novo Clube
                    </Button>
                  </LayoutContainer>

                  <OpponentSearchCombobox
                    opponents={opponents}
                    value={selectedOpponentName || ''}
                    onChange={(val) => setValue('opponentName', val, { shouldValidate: true })}
                    onSelectClub={handleSelectOpponentClub}
                    onOpenQuickCreate={handleOpenQuickClub}
                    error={errors.opponentName?.message}
                  />
                </LayoutContainer>

                {/* Linha 3: Mando de Campo */}
                <LayoutContainer className="space-y-1">
                  <Text className="text-xs font-semibold text-text-secondary">
                    {MATCH_DRAWER.HOME_AWAY_LABEL}
                  </Text>
                  <LayoutContainer className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="custom"
                      size="none"
                      onClick={() => handleHomeAwayChange('HOME')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        currentHomeAway === 'HOME'
                          ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-xs'
                          : 'border-border/60 bg-surface/50 text-text-secondary hover:bg-surface'
                      }`}
                    >
                      <Text className="text-xs font-bold block">Mandante (Casa)</Text>
                      <Text className="text-[10px] text-text-muted block mt-0.5">
                        Estádio Boca do Lobo (Pelotas - RS)
                      </Text>
                    </Button>

                    <Button
                      type="button"
                      variant="custom"
                      size="none"
                      onClick={() => handleHomeAwayChange('AWAY')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        currentHomeAway === 'AWAY'
                          ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-xs'
                          : 'border-border/60 bg-surface/50 text-text-secondary hover:bg-surface'
                      }`}
                    >
                      <Text className="text-xs font-bold block">Visitante (Fora)</Text>
                      <Text className="text-[10px] text-text-muted block mt-0.5">
                        Estádio Sede do Adversário
                      </Text>
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Linha 4: Estádio e Cidade (Editáveis) */}
                <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.STADIUM_LABEL}
                    </Text>
                    <Input
                      placeholder={MATCH_DRAWER.STADIUM_PLACEHOLDER}
                      {...register('stadiumName')}
                    />
                    {errors.stadiumName && (
                      <Text className="text-xs text-orange-500 font-medium">
                        {errors.stadiumName.message}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.CITY_LABEL}
                    </Text>
                    <Input
                      placeholder={MATCH_DRAWER.CITY_PLACEHOLDER}
                      {...register('city')}
                    />
                  </LayoutContainer>
                </LayoutContainer>

                {/* Linha 5: Data/Hora, Fase e Status */}
                <LayoutContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.DATE_LABEL}
                    </Text>
                    <Input
                      type="datetime-local"
                      {...register('matchDate')}
                    />
                    {errors.matchDate && (
                      <Text className="text-xs text-orange-500 font-medium">
                        {errors.matchDate.message}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.ROUND_LABEL}
                    </Text>
                    <Input
                      placeholder={MATCH_DRAWER.ROUND_PLACEHOLDER}
                      {...register('roundName')}
                    />
                    {errors.roundName && (
                      <Text className="text-xs text-orange-500 font-medium">
                        {errors.roundName.message}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.STATUS_LABEL}
                    </Text>
                    <Select
                      {...register('status')}
                      className="w-full"
                    >
                      <Option value="SCHEDULED">{MATCH_STATUS_LABELS.SCHEDULED}</Option>
                      <Option value="IN_PROGRESS">{MATCH_STATUS_LABELS.IN_PROGRESS}</Option>
                      <Option value="FINISHED">{MATCH_STATUS_LABELS.FINISHED}</Option>
                      <Option value="POSTPONED">{MATCH_STATUS_LABELS.POSTPONED}</Option>
                      <Option value="CANCELLED">{MATCH_STATUS_LABELS.CANCELLED}</Option>
                    </Select>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Linha 6: Link da Transmissão Oficial Ao Vivo */}
                <LayoutContainer className="space-y-1">
                  <Text className="text-xs font-semibold text-text-secondary">
                    {MATCH_DRAWER.TRANSMISSION_URL_LABEL}
                  </Text>
                  <Input
                    placeholder={MATCH_DRAWER.TRANSMISSION_URL_PLACEHOLDER}
                    {...register('transmissionUrl')}
                  />
                  <Text className="text-[10px] text-text-muted block">
                    Link opcional para canal oficial do YouTube, Federação ou streaming ao vivo.
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* ================= ABA 2: PLACAR & RESULTADO (Apenas Edição) ================= */}
            {isEditing && activeTab === 'score' && (
              <LayoutContainer className="space-y-4 animate-in fade-in duration-150 p-4 rounded-xl border border-border/60 bg-surface/30">
                <LayoutContainer className="border-b border-border/50 pb-2 flex items-center justify-between">
                  <Text className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    Placar Oficial do Jogo
                  </Text>
                  {currentStatus !== 'FINISHED' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setValue('status', 'FINISHED')}
                      className="text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary/10 cursor-pointer"
                    >
                      Definir Status como Encerrado
                    </Button>
                  )}
                </LayoutContainer>

                <LayoutContainer className="grid grid-cols-2 gap-4">
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.SCORE_PELOTAS_LABEL}
                    </Text>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register('pelotasScore')}
                    />
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.SCORE_OPPONENT_LABEL}
                    </Text>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      {...register('opponentScore')}
                    />
                  </LayoutContainer>
                </LayoutContainer>

                {/* Pênaltis Opcionais */}
                <LayoutContainer className="border-t border-border/40 pt-3 space-y-2">
                  <Text className="text-xs font-semibold text-text-secondary block">
                    Disputa de Pênaltis (Caso aplicável)
                  </Text>
                  <LayoutContainer className="grid grid-cols-2 gap-4">
                    <LayoutContainer className="space-y-1">
                      <Text className="text-xs font-semibold text-text-secondary">
                        {MATCH_DRAWER.PENALTIES_PELOTAS_LABEL}
                      </Text>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register('penaltyPelotasScore')}
                      />
                    </LayoutContainer>

                    <LayoutContainer className="space-y-1">
                      <Text className="text-xs font-semibold text-text-secondary">
                        {MATCH_DRAWER.PENALTIES_OPPONENT_LABEL}
                      </Text>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...register('penaltyOpponentScore')}
                      />
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Rodapé com Botões de Ação */}
            <LayoutContainer className="flex items-center justify-end space-x-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {MATCH_DRAWER.CANCEL_BUTTON}
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-6 cursor-pointer shadow-md"
              >
                {isSaving ? MATCH_DRAWER.SAVING_BUTTON : MATCH_DRAWER.SAVE_BUTTON}
              </Button>
            </LayoutContainer>
          </form>
        </LayoutContainer>
      </Modal>

      {/* Mini-Modal Rápido In-Place para Cadastrar Novo Clube Adversário */}
      {isQuickClubModalOpen && (
        <AdminOpponentModal
          isOpen={isQuickClubModalOpen}
          onClose={() => setIsQuickClubModalOpen(false)}
          initialName={quickClubInitialName}
          onSuccess={handleQuickClubSuccess}
          isQuickMode={true}
        />
      )}
    </>
  );
};
