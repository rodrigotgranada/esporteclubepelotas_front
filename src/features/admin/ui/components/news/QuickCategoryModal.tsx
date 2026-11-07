'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Form,
  Input,
  Button,
  FormField,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { QuickCategoryFormData } from '@/features/admin/schemas';

export interface QuickCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<QuickCategoryFormData, any, any>;
  isLoading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

export const QuickCategoryModal: React.FC<QuickCategoryModalProps> = ({
  isOpen,
  onClose,
  form,
  isLoading,
  onSubmit,
}) => {
  const { MODAL_CATEGORY: texts } = ADMIN_NEWS_TEXTS;
  const {
    register,
    formState: { errors },
  } = form;

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

        <FormField
          label={`${texts.LABEL_NAME} *`}
          error={errors.name?.message}
        >
          <Input
            {...register('name')}
            placeholder={texts.PLACEHOLDER_NAME}
            autoFocus
          />
        </FormField>

        <FormField
          label={texts.LABEL_DESC}
          error={errors.description?.message}
        >
          <Input
            {...register('description')}
            placeholder={texts.PLACEHOLDER_DESC}
          />
        </FormField>

        <LayoutContainer className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
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
            className="font-bold"
          >
            {texts.BUTTON_SUBMIT}
          </Button>
        </LayoutContainer>
      </Form>
    </Modal>
  );
};
