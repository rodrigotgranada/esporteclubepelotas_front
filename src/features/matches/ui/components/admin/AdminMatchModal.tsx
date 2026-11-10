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
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
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
    logoPreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectRawFile,
    handleCropSave,
    handleCropCancel,
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <LayoutContainer className="space-y-6">
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

          {/* Abas de Navegação */}
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
              1. Confronto & Local
            </Button>

            <Button
              type="button"
              variant="custom"
              size="none"
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-secondary text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              2. Transmissão & Ingressos
            </Button>

            {/* Aba de Placar exclusiva para edição de partida existente */}
            {isEditing && (
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
                3. Placar & Resultado
              </Button>
            )}
          </LayoutContainer>

          {/* Formulário Principal */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* ================= ABA 1: CONFRONTO & LOCAL ================= */}
            {activeTab === 'match' && (
              <LayoutContainer className="space-y-4 animate-in fade-in duration-150">
                {/* Linha 1: Campeonato */}
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

                {/* Linha 2: Seleção do Clube Adversário (Combobox com Search Dropdown) */}
                <LayoutContainer className="p-4 rounded-xl border border-border/60 bg-surface/30 space-y-3">
                  <LayoutContainer className="flex items-center justify-between">
                    <Text className="text-xs font-semibold text-text-secondary">
                      Clube Adversário *
                    </Text>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenQuickClub(selectedOpponentName)}
                      className="text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary/10 cursor-pointer"
                    >
                      + Cadastrar Novo Clube
                    </Button>
                  </LayoutContainer>

                  <LayoutContainer className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    {/* Input com Dropdown Filtrável */}
                    <LayoutContainer className="md:col-span-2">
                      <OpponentSearchCombobox
                        opponents={opponents}
                        value={selectedOpponentName || ''}
                        onChange={(val) => setValue('opponentName', val, { shouldValidate: true })}
                        onSelectClub={handleSelectOpponentClub}
                        onOpenQuickCreate={handleOpenQuickClub}
                        error={errors.opponentName?.message}
                      />
                    </LayoutContainer>

                    {/* Escudo do Adversário */}
                    <LayoutContainer className="flex items-center gap-3 p-2 rounded-xl bg-surface-card border border-border/60">
                      <LayoutContainer className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center p-1 overflow-hidden shrink-0">
                        <SafeImage
                          src={logoPreviewUrl || '/images/pelotas-logo.png'}
                          alt={selectedOpponentName || 'Escudo'}
                          width={40}
                          height={40}
                          className="object-contain max-h-10"
                        />
                      </LayoutContainer>
                      <LayoutContainer className="space-y-1 overflow-hidden">
                        <label className="text-[11px] font-bold text-secondary cursor-pointer hover:underline block truncate">
                          Trocar Escudo
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleSelectRawFile(file);
                            }}
                          />
                        </label>
                        <Text className="text-[10px] text-text-muted block truncate">
                          Proporção 1:1
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  </LayoutContainer>
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
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
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
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
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
              </LayoutContainer>
            )}

            {/* ================= ABA 2: TRANSMISSÃO & INGRESSOS ================= */}
            {activeTab === 'broadcast' && (
              <LayoutContainer className="space-y-4 animate-in fade-in duration-150">
                <LayoutContainer className="space-y-1">
                  <Text className="text-xs font-semibold text-text-secondary">
                    {MATCH_DRAWER.TRANSMISSION_URL_LABEL}
                  </Text>
                  <Input
                    placeholder={MATCH_DRAWER.TRANSMISSION_URL_PLACEHOLDER}
                    {...register('transmissionUrl')}
                  />
                  <Text className="text-[11px] text-text-muted">
                    Cole o link do YouTube, Federação ou streaming ao vivo.
                  </Text>
                </LayoutContainer>

                <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.BROADCAST_CHANNEL_LABEL}
                    </Text>
                    <Input
                      placeholder={MATCH_DRAWER.BROADCAST_CHANNEL_PLACEHOLDER}
                      {...register('broadcastChannel')}
                    />
                  </LayoutContainer>

                  <LayoutContainer className="space-y-1">
                    <Text className="text-xs font-semibold text-text-secondary">
                      {MATCH_DRAWER.TICKET_URL_LABEL}
                    </Text>
                    <Input
                      placeholder={MATCH_DRAWER.TICKET_URL_PLACEHOLDER}
                      {...register('ticketUrl')}
                    />
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="space-y-1">
                  <Text className="text-xs font-semibold text-text-secondary">
                    {MATCH_DRAWER.NOTES_LABEL}
                  </Text>
                  <Input
                    placeholder={MATCH_DRAWER.NOTES_PLACEHOLDER}
                    {...register('notes')}
                  />
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* ================= ABA 3: PLACAR & RESULTADO (Apenas Edição) ================= */}
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

                <LayoutContainer className="pt-2">
                  <Text className="text-xs font-semibold text-text-muted mb-2 block">
                    Decisão por Pênaltis (Opcional - Mata-Mata)
                  </Text>
                  <LayoutContainer className="grid grid-cols-2 gap-4">
                    <LayoutContainer className="space-y-1">
                      <Text className="text-xs text-text-muted">
                        {MATCH_DRAWER.PENALTIES_PELOTAS_LABEL}
                      </Text>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Ex: 5"
                        {...register('penaltyPelotasScore')}
                      />
                    </LayoutContainer>

                    <LayoutContainer className="space-y-1">
                      <Text className="text-xs text-text-muted">
                        {MATCH_DRAWER.PENALTIES_OPPONENT_LABEL}
                      </Text>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Ex: 4"
                        {...register('penaltyOpponentScore')}
                      />
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Rodapé de Ações */}
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

      {/* Modal de Recorte Oficial 1:1 do Escudo */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          aspect={1}
          onCropSave={handleCropSave}
          onClose={handleCropCancel}
        />
      )}
    </>
  );
};
