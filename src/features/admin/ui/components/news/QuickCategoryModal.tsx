'use client';

import React from 'react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Form,
  Input,
  Button,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

export const QuickCategoryModal: React.FC<QuickCategoryModalProps> = ({
  isOpen,
  onClose,
  name,
  setName,
  description,
  setDescription,
  isLoading,
  onSubmit,
}) => {
  const { MODAL_CATEGORY: texts } = ADMIN_NEWS_TEXTS;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md w-full p-6"
    >
      <Title level="h3" className="text-lg font-bold text-text-primary mb-2">
        {texts.TITLE}
      </Title>

      <Form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
        <Text as="p" className="text-sm text-text-secondary">
          {texts.DESC}
        </Text>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {texts.LABEL_NAME} *
          </Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={texts.PLACEHOLDER_NAME}
            required
            autoFocus
          />
        </LayoutContainer>

        <LayoutContainer className="flex flex-col gap-1.5">
          <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            {texts.LABEL_DESC}
          </Text>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={texts.PLACEHOLDER_DESC}
          />
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {texts.BUTTON_CANCEL}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!name.trim() || isLoading}
          >
            {texts.BUTTON_SUBMIT}
          </Button>
        </LayoutContainer>
      </Form>
    </Modal>
  );
};
