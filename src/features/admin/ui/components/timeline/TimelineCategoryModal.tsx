'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Input,
  Textarea,
  Select,
  Option,
  Switch,
  Button,
} from '@/shared/ui/components';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';
import { Flag, Trophy, Landmark, Star, Sparkles, Medal, Shield, Heart } from 'lucide-react';

export interface TimelineCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  isEditing: boolean;
  name: string;
  setName: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  icon: string;
  setIcon: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  displayOrder: number;
  setDisplayOrder: (val: number) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
}

export const renderCategoryIconComponent = (iconName: string, className = 'w-4 h-4 text-primary') => {
  switch (iconName) {
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Medal':
      return <Medal className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Flag':
    default:
      return <Flag className={className} />;
  }
};

export const TimelineCategoryModal: React.FC<TimelineCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  isEditing,
  name,
  setName,
  slug,
  setSlug,
  icon,
  setIcon,
  description,
  setDescription,
  displayOrder,
  setDisplayOrder,
  isActive,
  setIsActive,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.MODAL_CATEGORY;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full p-6">
      <LayoutContainer className="flex items-center gap-2 mb-1">
        {renderCategoryIconComponent(icon, 'w-5 h-5 text-primary')}
        <Title level="h3" className="text-lg font-black text-text-primary">
          {isEditing ? texts.TITLE_EDIT : texts.TITLE_CREATE}
        </Title>
      </LayoutContainer>

      <Text className="text-xs text-text-secondary mb-4 leading-relaxed">
        {texts.DESC}
      </Text>

      <LayoutContainer className="flex flex-col gap-4">
        {/* Name and Slug */}
        <Input
          label={texts.FIELD_NAME}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={texts.FIELD_NAME_PLACEHOLDER}
          required
        />

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={texts.FIELD_SLUG}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={texts.FIELD_SLUG_PLACEHOLDER}
          />

          <LayoutContainer className="flex flex-col">
            <Select
              label={texts.FIELD_ICON}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              {ADMIN_TIMELINE_CONSTANTS.CATEGORY_ICONS.map((ic) => (
                <Option key={ic.value} value={ic.value}>
                  {ic.label}
                </Option>
              ))}
            </Select>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <Input
            label={texts.FIELD_ORDER}
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />

          <LayoutContainer className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <Text className="text-xs font-bold text-text-primary">
              {texts.FIELD_ACTIVE}
            </Text>
            <Switch checked={isActive} onChange={setIsActive} />
          </LayoutContainer>
        </LayoutContainer>

        <Textarea
          label={texts.FIELD_DESC}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={texts.FIELD_DESC_PLACEHOLDER}
          rows={3}
        />

        {/* Modal Actions */}
        <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-2">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            {texts.BTN_CANCEL}
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} className="font-bold">
            {isSaving ? texts.BTN_SAVING : texts.BTN_SAVE}
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};

