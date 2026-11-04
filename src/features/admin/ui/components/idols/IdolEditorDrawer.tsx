'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Text,
  Title,
  Input,
  Select,
  Option,
  Button,
  Checkbox,
  Spinner,
  ImageCropper,
  Textarea,
} from '@/shared/ui/components';
import { Save, X, Star } from 'lucide-react';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { useAdminIdolDrawer } from '../../../hooks/idols/useAdminIdolDrawer';
import { IdolPlayerFields } from './IdolPlayerFields';
import { IdolCoachFields } from './IdolCoachFields';
import { IdolStaffFields } from './IdolStaffFields';
import { IdolFanFields } from './IdolFanFields';
import { IdolPeriodsEditor } from './IdolPeriodsEditor';
import { IdolGalleryEditor } from './IdolGalleryEditor';
import { IdolCategory } from '../../../../idols/services/idols.service';

export interface IdolEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  idolId: string | null;
  onSaveSuccess: () => void;
}

export const IdolEditorDrawer: React.FC<IdolEditorDrawerProps> = ({
  isOpen,
  onClose,
  idolId,
  onSaveSuccess,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  const {
    isLoading,
    isSaving,
    name,
    setName,
    nickname,
    setNickname,
    slug,
    setSlug,
    category,
    setCategory,
    photoUrl,
    handleCropSave,
    handlePhotoRemove,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    periods,
    handleAddPeriod,
    handleUpdatePeriod,
    handleRemovePeriod,
    galleryItems,
    handleAddGalleryItems,
    handleUpdateGalleryCaption,
    handleRemoveGalleryItem,
    isActiveInClub,
    setIsActiveInClub,
    birthDate,
    setBirthDate,
    deathDate,
    setDeathDate,
    birthPlace,
    setBirthPlace,
    quote,
    setQuote,
    biography,
    setBiography,
    isFeatured,
    setIsFeatured,
    order,
    setOrder,
    // Player
    position,
    setPosition,
    preferredFoot,
    setPreferredFoot,
    historicJerseyNumber,
    setHistoricJerseyNumber,
    matchesCount,
    setMatchesCount,
    goalsCount,
    setGoalsCount,
    titlesText,
    setTitlesText,
    memorableMatch,
    setMemorableMatch,
    // Coach
    coachMatches,
    setCoachMatches,
    coachWins,
    setCoachWins,
    coachDraws,
    setCoachDraws,
    coachLosses,
    setCoachLosses,
    coachTitlesText,
    setCoachTitlesText,
    tacticalStyle,
    setTacticalStyle,
    // Staff
    roleName,
    setRoleName,
    yearsOfDedication,
    setYearsOfDedication,
    backstageStory,
    setBackstageStory,
    // Fan
    stadiumSector,
    setStadiumSector,
    trademark,
    setTrademark,
    handleSave,
  } = useAdminIdolDrawer(idolId, isOpen, onSaveSuccess);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={idolId ? texts.TITLE_EDIT : texts.TITLE_CREATE}
      size="2xl"
    >
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center p-16">
          <Spinner className="w-8 h-8 text-primary mb-3" />
          <Text as="p" className="text-text-secondary font-medium">
            Carregando dados do ídolo...
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-6 pb-8">
          {/* Section: Category & Basic Identification */}
          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              {texts.SECTION_BASIC}
            </Title>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_CATEGORY}
                </Text>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IdolCategory)}
                >
                  <Option value="PLAYER">{ADMIN_IDOLS_TEXTS.CATEGORIES.PLAYER}</Option>
                  <Option value="COACH">{ADMIN_IDOLS_TEXTS.CATEGORIES.COACH}</Option>
                  <Option value="STAFF">{ADMIN_IDOLS_TEXTS.CATEGORIES.STAFF}</Option>
                  <Option value="FAN">{ADMIN_IDOLS_TEXTS.CATEGORIES.FAN}</Option>
                </Select>
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_NAME} *
                </Text>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={texts.PLACEHOLDER_NAME}
                />
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_NICKNAME}
                </Text>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={texts.PLACEHOLDER_NICKNAME}
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_SLUG}
                </Text>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={texts.PLACEHOLDER_SLUG}
                />
              </LayoutContainer>
            </LayoutContainer>

            {/* Photo Cropper (Vertical 3:4) */}
            <LayoutContainer className="flex flex-col gap-2 pt-2">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.LABEL_PHOTO}
              </Text>
              <Text as="p" className="text-xs text-text-muted mb-1">
                {texts.PHOTO_HINT}
              </Text>
              <ImageCropper
                shape="rect"
                aspect={3 / 4}
                initialImage={photoUrl}
                onCropSave={handleCropSave}
                onImageRemove={handlePhotoRemove}
                placeholderLabel="Clique para carregar e recortar a foto em 3:4"
                className="w-full max-w-sm mx-auto"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Dynamic Category Specific Fields */}
          {category === 'PLAYER' && (
            <IdolPlayerFields
              position={position}
              setPosition={setPosition}
              preferredFoot={preferredFoot}
              setPreferredFoot={setPreferredFoot}
              historicJerseyNumber={historicJerseyNumber}
              setHistoricJerseyNumber={setHistoricJerseyNumber}
              matchesCount={matchesCount}
              setMatchesCount={setMatchesCount}
              goalsCount={goalsCount}
              setGoalsCount={setGoalsCount}
              titlesText={titlesText}
              setTitlesText={setTitlesText}
              memorableMatch={memorableMatch}
              setMemorableMatch={setMemorableMatch}
            />
          )}

          {category === 'COACH' && (
            <IdolCoachFields
              coachMatches={coachMatches}
              setCoachMatches={setCoachMatches}
              coachWins={coachWins}
              setCoachWins={setCoachWins}
              coachDraws={coachDraws}
              setCoachDraws={setCoachDraws}
              coachLosses={coachLosses}
              setCoachLosses={setCoachLosses}
              coachTitlesText={coachTitlesText}
              setCoachTitlesText={setCoachTitlesText}
              tacticalStyle={tacticalStyle}
              setTacticalStyle={setTacticalStyle}
            />
          )}

          {category === 'STAFF' && (
            <IdolStaffFields
              roleName={roleName}
              setRoleName={setRoleName}
              yearsOfDedication={yearsOfDedication}
              setYearsOfDedication={setYearsOfDedication}
              backstageStory={backstageStory}
              setBackstageStory={setBackstageStory}
            />
          )}

          {category === 'FAN' && (
            <IdolFanFields
              stadiumSector={stadiumSector}
              setStadiumSector={setStadiumSector}
              trademark={trademark}
              setTrademark={setTrademark}
            />
          )}

          {/* Section: Period & Personal Dates */}
          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              Período & Origem
            </Title>

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_START_YEAR} *
                </Text>
                <Input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value ? Number(e.target.value) : '')}
                  placeholder={texts.PLACEHOLDER_START_YEAR}
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_END_YEAR}
                </Text>
                <Input
                  type="number"
                  disabled={isActiveInClub}
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value ? Number(e.target.value) : '')}
                  placeholder={texts.PLACEHOLDER_END_YEAR}
                />
              </LayoutContainer>
            </LayoutContainer>

            <Checkbox
              checked={isActiveInClub}
              onChange={(e) => setIsActiveInClub(e.target.checked)}
              label={texts.CHECKBOX_ACTIVE_IN_CLUB}
            />

            {/* Multiple Periods Editor */}
            <IdolPeriodsEditor
              periods={periods}
              onAdd={handleAddPeriod}
              onUpdate={handleUpdatePeriod}
              onRemove={handleRemovePeriod}
            />

            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_BIRTH_DATE}
                </Text>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_DEATH_DATE}
                </Text>
                <Input
                  type="date"
                  value={deathDate}
                  onChange={(e) => setDeathDate(e.target.value)}
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Text as="span" className="text-xs font-semibold text-text-secondary">
                  {texts.LABEL_BIRTH_PLACE}
                </Text>
                <Input
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder={texts.PLACEHOLDER_BIRTH_PLACE}
                />
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Section: Quote & Biography */}
          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <Title level="h3" className="text-sm font-black text-text-primary uppercase tracking-wider">
              {texts.SECTION_BIO}
            </Title>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.LABEL_QUOTE}
              </Text>
              <Input
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder={texts.PLACEHOLDER_QUOTE}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.LABEL_BIOGRAPHY} *
              </Text>
              <Textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder={texts.PLACEHOLDER_BIOGRAPHY}
                rows={6}
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Section: Historical Gallery with Captions */}
          <IdolGalleryEditor
            idolId={idolId}
            items={galleryItems}
            onUpdateCaption={handleUpdateGalleryCaption}
            onRemoveItem={handleRemoveGalleryItem}
            onAddItems={handleAddGalleryItems}
          />

          {/* Section: Visibility & Ordering */}
          <LayoutContainer className="flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
            <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <LayoutContainer className="flex items-center gap-3">
                <Star className={`w-5 h-5 ${isFeatured ? 'text-primary fill-primary' : 'text-text-muted'}`} />
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-sm font-bold text-text-primary">
                    {texts.LABEL_FEATURED}
                  </Text>
                  <Text as="span" className="text-xs text-text-muted">
                    Exibe este ídolo com destaque especial no topo do Memorial público
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
              <Checkbox
                label="Destacar"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1.5 pt-3 border-t border-border">
              <Text as="span" className="text-xs font-semibold text-text-secondary">
                {texts.LABEL_ORDER}
              </Text>
              <Input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
                className="max-w-xs"
              />
            </LayoutContainer>
          </LayoutContainer>

          {/* Drawer Footer Actions */}
          <LayoutContainer className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              {texts.BUTTON_CANCEL}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="font-bold"
            >
              {isSaving ? texts.BUTTON_SAVING : texts.BUTTON_SAVE}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </Drawer>
  );
};
