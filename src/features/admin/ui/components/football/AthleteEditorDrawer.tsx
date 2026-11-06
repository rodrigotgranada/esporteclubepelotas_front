'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Title,
  Text,
  Input,
  Select,
  Option,
  Button,
  ImageCropper,
  Switch,
  Badge,
} from '@/shared/ui/components';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';
import { FOOTBALL_CONSTANTS } from '@/features/football/constants/football.constants';
import {
  AthleteGender,
  AthleteType,
  PreferredFoot,
} from '@/features/football/services/football.service';

export interface AthleteEditorDrawerProps {
  isOpen: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  errors: Record<string, string>;

  // Fields
  gender: AthleteGender;
  setGender: (v: AthleteGender) => void;
  athleteType: AthleteType;
  setAthleteType: (v: AthleteType) => void;
  youthCategory: string;
  setYouthCategory: (v: string) => void;
  entryYear: string;
  setEntryYear: (v: string) => void;
  staffRole: string;
  setStaffRole: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  nickname: string;
  setNickname: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthPlace: string;
  setBirthPlace: (v: string) => void;
  height: string;
  setHeight: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  preferredFoot: PreferredFoot;
  setPreferredFoot: (v: PreferredFoot) => void;
  primaryPosition: string;
  setPrimaryPosition: (v: string) => void;
  secondaryPositionsText: string;
  setSecondaryPositionsText: (v: string) => void;
  pastClubsText: string;
  setPastClubsText: (v: string) => void;
  biography: string;
  setBiography: (v: string) => void;
  instagram: string;
  setInstagram: (v: string) => void;
  isRetired: boolean;
  setIsRetired: (v: boolean) => void;
  photoUrl: string;
  setPhotoUrl: (v: string) => void;
  pendingPhotoFile: File | null;
  setPendingPhotoFile: (f: File | null) => void;
}

export const AthleteEditorDrawer: React.FC<AthleteEditorDrawerProps> = ({
  isOpen,
  isEditing,
  onClose,
  onSave,
  isSaving,
  errors,
  gender,
  setGender,
  athleteType,
  setAthleteType,
  youthCategory,
  setYouthCategory,
  entryYear,
  setEntryYear,
  staffRole,
  setStaffRole,
  name,
  setName,
  nickname,
  setNickname,
  birthDate,
  setBirthDate,
  birthPlace,
  setBirthPlace,
  height,
  setHeight,
  weight,
  setWeight,
  preferredFoot,
  setPreferredFoot,
  primaryPosition,
  setPrimaryPosition,
  secondaryPositionsText,
  setSecondaryPositionsText,
  pastClubsText,
  setPastClubsText,
  biography,
  setBiography,
  instagram,
  setInstagram,
  isRetired,
  setIsRetired,
  photoUrl,
  setPhotoUrl,
  setPendingPhotoFile,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.DRAWER_ATHLETE;
  const isStaff = athleteType === 'STAFF';
  const isYouth = athleteType === 'YOUTH';

  const handleCropComplete = (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], 'photo.webp', { type: croppedImageBlob.type || 'image/webp' });
    setPendingPhotoFile(file);
    const previewUrl = URL.createObjectURL(croppedImageBlob);
    setPhotoUrl(previewUrl);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="lg"
    >
      <LayoutContainer className="flex flex-col gap-6 p-6">
        {/* Foto Oficial Crop 3:4 */}
        <LayoutContainer className="flex flex-col gap-2">
          <Text as="span" className="text-xs font-extrabold uppercase text-text-primary tracking-wider">
            {texts.PHOTO_LABEL}
          </Text>
          <ImageCropper
            shape="rect"
            aspect={3 / 4}
            initialImage={photoUrl}
            onCropSave={handleCropComplete}
            onImageRemove={() => {
              setPhotoUrl('');
              setPendingPhotoFile(null);
            }}
            placeholderLabel={texts.PHOTO_LABEL}
          />
        </LayoutContainer>

        {/* Gênero & Vínculo */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-secondary border border-border">
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_GENDER} *
            </Text>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value as AthleteGender)}
              className="w-full"
            >
              <Option value="MALE">{texts.GENDER_MALE}</Option>
              <Option value="FEMALE">{texts.GENDER_FEMALE}</Option>
            </Select>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_ATHLETE_TYPE} *
            </Text>
            <Select
              value={athleteType}
              onChange={(e) => {
                const nextType = e.target.value as AthleteType;
                setAthleteType(nextType);
                if (nextType === 'STAFF' && !staffRole) {
                  setStaffRole('Treinador');
                }
              }}
              className="w-full"
            >
              <Option value="PROFESSIONAL">{texts.TYPE_PROFESSIONAL}</Option>
              <Option value="YOUTH">{texts.TYPE_YOUTH}</Option>
              <Option value="STAFF">{texts.TYPE_STAFF}</Option>
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        {/* Submenu Condicional da Comissão Técnica */}
        {isStaff && (
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-primary/20 flex flex-col gap-2 shadow-xs">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_STAFF_ROLE} *
              </Text>
              <Select
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
                className="w-full"
              >
                {FOOTBALL_CONSTANTS.STAFF_ROLES.map((role) => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
              {errors.staffRole && (
                <Text as="span" className="text-[11px] text-[#ea580c] font-medium">
                  {errors.staffRole}
                </Text>
              )}
            </LayoutContainer>
            <Text as="p" className="text-xs text-text-muted italic">
              ℹ️ {texts.STAFF_NOTICE}
            </Text>
          </LayoutContainer>
        )}

        {/* Nome Completo & Apelido */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_NAME} *
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={texts.FIELD_NAME_PLACEHOLDER}
              className={errors.name ? 'border-[#ea580c]' : ''}
            />
            {errors.name && (
              <Text as="span" className="text-[11px] text-[#ea580c] font-medium">
                {errors.name}
              </Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_NICKNAME}
            </Text>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={texts.FIELD_NICKNAME_PLACEHOLDER}
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Posição Principal & Pé Preferencial (Apenas Atletas) */}
        {!isStaff && (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_PRIMARY_POSITION} *
              </Text>
              <Input
                value={primaryPosition}
                onChange={(e) => setPrimaryPosition(e.target.value)}
                placeholder={texts.FIELD_PRIMARY_POSITION_PLACEHOLDER}
                className={errors.primaryPosition ? 'border-[#ea580c]' : ''}
              />
              {errors.primaryPosition && (
                <Text as="span" className="text-[11px] text-[#ea580c] font-medium">
                  {errors.primaryPosition}
                </Text>
              )}
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_PREFERRED_FOOT}
              </Text>
              <Select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value as PreferredFoot)}
                className="w-full"
              >
                <Option value="RIGHT">Destro</Option>
                <Option value="LEFT">Canhoto</Option>
                <Option value="BOTH">Ambidestro</Option>
              </Select>
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Data de Nascimento & Naturalidade */}
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_BIRTH_DATE}
            </Text>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_BIRTH_PLACE}
            </Text>
            <Input
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder={texts.FIELD_BIRTH_PLACE_PLACEHOLDER}
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Altura & Peso (Apenas Atletas) */}
        {!isStaff && (
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_HEIGHT}
              </Text>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={texts.FIELD_HEIGHT_PLACEHOLDER}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-bold text-text-primary">
                {texts.FIELD_WEIGHT}
              </Text>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={texts.FIELD_WEIGHT_PLACEHOLDER}
              />
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Posições Secundárias (Apenas Atletas) */}
        {!isStaff && (
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_SECONDARY_POSITIONS}
            </Text>
            <Input
              value={secondaryPositionsText}
              onChange={(e) => setSecondaryPositionsText(e.target.value)}
              placeholder={texts.FIELD_SECONDARY_POSITIONS_PLACEHOLDER}
            />
          </LayoutContainer>
        )}

        {/* Base vs Clubes Anteriores (Comissão técnica e Profissionais têm clubes anteriores) */}
        {isYouth ? (
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-primary/20 flex flex-col gap-4">
            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-primary">
                  {texts.FIELD_YOUTH_CATEGORY}
                </Text>
                <Select
                  value={youthCategory}
                  onChange={(e) => setYouthCategory(e.target.value)}
                  className="w-full"
                >
                  <Option value="">Selecione a Categoria</Option>
                  <Option value="SUB_20">Sub-20 (Júnior)</Option>
                  <Option value="SUB_17">Sub-17 (Juvenil)</Option>
                  <Option value="SUB_15">Sub-15 (Infantil)</Option>
                </Select>
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-bold text-text-primary">
                  {texts.FIELD_ENTRY_YEAR}
                </Text>
                <Input
                  type="number"
                  value={entryYear}
                  onChange={(e) => setEntryYear(e.target.value)}
                  placeholder={texts.FIELD_ENTRY_YEAR_PLACEHOLDER}
                />
              </LayoutContainer>
            </LayoutContainer>
            <Text as="p" className="text-xs text-text-muted italic">
              ℹ️ {texts.YOUTH_NOTICE}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="flex flex-col gap-1.5">
            <Text as="span" className="text-xs font-bold text-text-primary">
              {texts.FIELD_PAST_CLUBS}
            </Text>
            <Input
              value={pastClubsText}
              onChange={(e) => setPastClubsText(e.target.value)}
              placeholder={texts.FIELD_PAST_CLUBS_PLACEHOLDER}
            />
          </LayoutContainer>
        )}

        {/* Instagram */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-bold text-text-primary">
            {texts.FIELD_INSTAGRAM}
          </Text>
          <Input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder={texts.FIELD_INSTAGRAM_PLACEHOLDER}
          />
        </LayoutContainer>

        {/* Biografia / Resumo da Trajetória */}
        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-bold text-text-primary">
            {texts.FIELD_BIOGRAPHY}
          </Text>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows={4}
            placeholder={texts.FIELD_BIOGRAPHY_PLACEHOLDER}
            className="w-full p-3 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-y"
          />
        </LayoutContainer>

        {/* Atleta Aposentado / Fora de Atividade (Apenas Atletas) */}
        {!isStaff && (
          <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-2">
            <LayoutContainer className="flex items-center justify-between gap-4">
              <LayoutContainer className="flex items-center gap-2">
                <Text as="span" className="text-xs font-bold text-text-primary">
                  {texts.FIELD_IS_RETIRED}
                </Text>
                {isRetired && (
                  <Badge variant="default" size="sm" className="font-extrabold text-[10px] uppercase text-text-muted">
                    {ADMIN_FOOTBALL_CONSTANTS.ATHLETES_TAB.BADGE_RETIRED}
                  </Badge>
                )}
              </LayoutContainer>

              <Switch
                checked={isRetired}
                onChange={setIsRetired}
                aria-label={texts.FIELD_IS_RETIRED}
              />
            </LayoutContainer>

            <Text as="p" className="text-xs text-text-muted leading-relaxed">
              {texts.FIELD_IS_RETIRED_DESC}
            </Text>
          </LayoutContainer>
        )}

        {/* Footer Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onSave}
            isLoading={isSaving}
            className="font-bold"
          >
            {isSaving ? texts.BTN_SAVING : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Drawer>
  );
};
