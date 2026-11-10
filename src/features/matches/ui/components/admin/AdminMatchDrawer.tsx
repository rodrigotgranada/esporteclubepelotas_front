'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Input,
  Select,
  Option,
  Textarea,
  Spinner,
} from '@/shared/ui/components/atoms';
import { Drawer } from '@/shared/ui/components/molecules/Drawer';
import { CropModal } from '@/shared/ui/components/molecules/CropModal';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Championship, Match } from '../../../types/matches.types';
import { useAdminMatchDrawer } from '../../../hooks/useAdminMatchDrawer';
import { MATCHES_CONSTANTS } from '../../../constants/matches.constants';

export interface AdminMatchDrawerProps {
  isOpen: boolean;
  match: Match | null;
  championships: Championship[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminMatchDrawer: React.FC<AdminMatchDrawerProps> = ({
  isOpen,
  match,
  championships,
  onClose,
  onSuccess,
}) => {
  const { MATCH_DRAWER } = MATCHES_CONSTANTS.ADMIN;

  const {
    form,
    isSaving,
    logoPreviewUrl,
    isCropModalOpen,
    cropSourceImage,
    handleSelectRawFile,
    handleCropSave,
    handleCropCancel,
    handleRemoveLogo,
    onSubmit,
  } = useAdminMatchDrawer({
    match,
    championships,
    onClose,
    onSuccess,
  });

  const {
    register,
    formState: { errors },
  } = form;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={match ? MATCH_DRAWER.EDIT_TITLE : MATCH_DRAWER.CREATE_TITLE}
    >
      <form onSubmit={onSubmit} className="space-y-6 pb-20">
        {/* Campeonato */}
        <LayoutContainer className="space-y-1.5">
          <Text className="text-xs font-semibold uppercase text-text-muted">
            {MATCH_DRAWER.CHAMPIONSHIP_LABEL}
          </Text>
          <Select {...register('championshipId')} className="w-full">
            {championships.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name} {c.seasonYear}
              </Option>
            ))}
          </Select>
          {errors.championshipId && (
            <Text className="text-xs text-orange-500">{errors.championshipId.message}</Text>
          )}
        </LayoutContainer>

        {/* Adversário e Escudo */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.OPPONENT_LABEL}
            </Text>
            <Input
              {...register('opponentName')}
              placeholder={MATCH_DRAWER.OPPONENT_PLACEHOLDER}
            />
            {errors.opponentName && (
              <Text className="text-xs text-orange-500">{errors.opponentName.message}</Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.OPPONENT_LOGO_LABEL}
            </Text>
            <LayoutContainer className="flex items-center space-x-3">
              <LayoutContainer className="w-14 h-14 rounded-xl bg-surface-hover border border-border/60 flex items-center justify-center p-1 relative">
                {logoPreviewUrl ? (
                  <SafeImage
                    src={logoPreviewUrl}
                    alt="Escudo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <Text className="text-xs text-text-muted">Sem logo</Text>
                )}
              </LayoutContainer>

              <LayoutContainer className="flex flex-col space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSelectRawFile(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  Selecionar & Recortar
                </Button>
                {logoPreviewUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="text-xs text-orange-500 hover:text-orange-400 p-0 h-auto justify-start"
                  >
                    Remover logo
                  </Button>
                )}
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Mando de Campo e Estádio */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.HOME_AWAY_LABEL}
            </Text>
            <Select {...register('homeAway')} className="w-full">
              <Option value="HOME">Pelotas Mandante (Boca do Lobo)</Option>
              <Option value="AWAY">Pelotas Visitante (Fora de Casa)</Option>
            </Select>
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.STADIUM_LABEL}
            </Text>
            <Input {...register('stadiumName')} placeholder={MATCH_DRAWER.STADIUM_PLACEHOLDER} />
            {errors.stadiumName && (
              <Text className="text-xs text-orange-500">{errors.stadiumName.message}</Text>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Cidade e Data/Hora */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.CITY_LABEL}
            </Text>
            <Input {...register('city')} placeholder={MATCH_DRAWER.CITY_PLACEHOLDER} />
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.DATE_LABEL}
            </Text>
            <Input type="datetime-local" {...register('matchDate')} />
            {errors.matchDate && (
              <Text className="text-xs text-orange-500">{errors.matchDate.message}</Text>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Rodada e Status */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.ROUND_LABEL}
            </Text>
            <Input {...register('roundName')} placeholder={MATCH_DRAWER.ROUND_PLACEHOLDER} />
            {errors.roundName && (
              <Text className="text-xs text-orange-500">{errors.roundName.message}</Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.STATUS_LABEL}
            </Text>
            <Select {...register('status')} className="w-full">
              <Option value="SCHEDULED">Agendado</Option>
              <Option value="IN_PROGRESS">Ao Vivo</Option>
              <Option value="FINISHED">Encerrado</Option>
              <Option value="POSTPONED">Adiado</Option>
              <Option value="CANCELLED">Cancelado</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Placares Normais */}
        <LayoutContainer className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover/30 border border-border/50">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.SCORE_PELOTAS_LABEL}
            </Text>
            <Input type="number" {...register('pelotasScore')} placeholder="0" />
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.SCORE_OPPONENT_LABEL}
            </Text>
            <Input type="number" {...register('opponentScore')} placeholder="0" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Placares Pênaltis (Opcional) */}
        <LayoutContainer className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-hover/20 border border-border/40">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.PENALTIES_PELOTAS_LABEL}
            </Text>
            <Input type="number" {...register('penaltyPelotasScore')} placeholder="Ex: 5" />
          </LayoutContainer>

          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-text-muted">
              {MATCH_DRAWER.PENALTIES_OPPONENT_LABEL}
            </Text>
            <Input type="number" {...register('penaltyOpponentScore')} placeholder="Ex: 4" />
          </LayoutContainer>
        </LayoutContainer>

        {/* Transmissão Ao Vivo (YouTube) e Ingressos */}
        <LayoutContainer className="space-y-4">
          <LayoutContainer className="space-y-1.5">
            <Text className="text-xs font-semibold uppercase text-secondary">
              📺 {MATCH_DRAWER.TRANSMISSION_URL_LABEL}
            </Text>
            <Input
              {...register('transmissionUrl')}
              placeholder={MATCH_DRAWER.TRANSMISSION_URL_PLACEHOLDER}
            />
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LayoutContainer className="space-y-1.5">
              <Text className="text-xs font-semibold uppercase text-text-muted">
                {MATCH_DRAWER.BROADCAST_CHANNEL_LABEL}
              </Text>
              <Input
                {...register('broadcastChannel')}
                placeholder={MATCH_DRAWER.BROADCAST_CHANNEL_PLACEHOLDER}
              />
            </LayoutContainer>

            <LayoutContainer className="space-y-1.5">
              <Text className="text-xs font-semibold uppercase text-text-muted">
                {MATCH_DRAWER.TICKET_URL_LABEL}
              </Text>
              <Input
                {...register('ticketUrl')}
                placeholder={MATCH_DRAWER.TICKET_URL_PLACEHOLDER}
              />
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>

        {/* Observações */}
        <LayoutContainer className="space-y-1.5">
          <Text className="text-xs font-semibold uppercase text-text-muted">
            {MATCH_DRAWER.NOTES_LABEL}
          </Text>
          <Textarea {...register('notes')} placeholder={MATCH_DRAWER.NOTES_PLACEHOLDER} rows={2} />
        </LayoutContainer>

        {/* Botões de Ação */}
        <LayoutContainer className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            {MATCH_DRAWER.CANCEL_BUTTON}
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-6"
          >
            {isSaving ? (
              <LayoutContainer className="flex items-center space-x-2">
                <Spinner size={16} />
                <Text>{MATCH_DRAWER.SAVING_BUTTON}</Text>
              </LayoutContainer>
            ) : (
              MATCH_DRAWER.SAVE_BUTTON
            )}
          </Button>
        </LayoutContainer>
      </form>

      {/* Modal de Recorte de Imagem 1:1 */}
      {isCropModalOpen && cropSourceImage && (
        <CropModal
          isOpen={isCropModalOpen}
          imageSrc={cropSourceImage}
          aspect={1}
          onCropSave={handleCropSave}
          onClose={handleCropCancel}
        />
      )}
    </Drawer>
  );
};
