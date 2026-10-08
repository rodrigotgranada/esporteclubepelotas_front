import React from 'react';
import { LayoutContainer, Title, Text, Button, Input, Badge } from '@/shared/ui/components';
import { AlertCircle, KeyRound, Mail, Smartphone, CheckCircle2 } from 'lucide-react';
import { PROFILE_TEXTS } from '@/features/profile/constants';
import { useChangesData } from '../../../hooks/useChangesData';

export const ChangesTab = () => {
  const { user, loadingId, getFormData, handleInputChange, handleConfirm } = useChangesData();

  if (!user || !user.pendingChanges || user.pendingChanges.length === 0) {
    return (
      <LayoutContainer className="animate-in fade-in duration-300">
        <LayoutContainer className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <CheckCircle2 size={48} className="text-success mb-4" />
          <Title level="h3" className="text-xl font-bold text-text-primary mb-2">{PROFILE_TEXTS.CHANGES_EMPTY_TITLE}</Title>
          <Text className="text-text-secondary">{PROFILE_TEXTS.CHANGES_EMPTY_DESC}</Text>
        </LayoutContainer>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="animate-in fade-in duration-300 space-y-6">
      <LayoutContainer>
        <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2 mb-2">
          <AlertCircle size={24} className="text-primary" />
          {PROFILE_TEXTS.CHANGES_TITLE}
        </Title>
        <Text className="text-text-secondary text-sm">{PROFILE_TEXTS.CHANGES_DESCRIPTION}</Text>
      </LayoutContainer>

      <LayoutContainer className="grid grid-cols-1 gap-6">
        {user.pendingChanges.map((change, index) => {
          const id = `${change.type}-${index}`;
          const isEmail = change.type === 'email';
          const Icon = isEmail ? Mail : Smartphone;
          const cardTitle = isEmail ? PROFILE_TEXTS.CHANGES_CARD_TITLE_EMAIL : PROFILE_TEXTS.CHANGES_CARD_TITLE_PHONE;
          const instructions = isEmail ? PROFILE_TEXTS.CHANGES_CARD_INSTRUCTIONS_EMAIL : PROFILE_TEXTS.CHANGES_CARD_INSTRUCTIONS_PHONE;
          const currentData = getFormData(id);

          return (
            <LayoutContainer
              key={id}
              className="bg-surface border border-primary/30 rounded-xl p-5 md:p-6 shadow-lg shadow-primary/5 relative overflow-hidden"
            >
              <LayoutContainer className="absolute top-0 right-0 p-4">
                <Badge variant="warning">{PROFILE_TEXTS.CHANGES_BADGE_WAITING}</Badge>
              </LayoutContainer>

              <LayoutContainer className="flex items-center gap-3 mb-6">
                <LayoutContainer className="p-3 bg-primary/10 rounded-full text-primary">
                  <Icon size={24} />
                </LayoutContainer>
                <LayoutContainer>
                  <Title level="h3" className="text-lg font-bold text-text-primary">{cardTitle}</Title>
                  <Text className="text-text-secondary text-sm">
                    {isEmail ? PROFILE_TEXTS.CHANGES_CARD_NEW_EMAIL : PROFILE_TEXTS.CHANGES_CARD_NEW_PHONE}{' '}
                    <Text as="strong" className="text-primary">{change.newValue}</Text>
                  </Text>
                </LayoutContainer>
              </LayoutContainer>

              <LayoutContainer className="bg-background/50 rounded-lg p-5 border border-border">
                <Text className="text-sm text-text-secondary mb-4">{instructions}</Text>

                <Input
                  label={PROFILE_TEXTS.CHANGES_INPUT_CODE_LABEL}
                  placeholder={PROFILE_TEXTS.CHANGES_INPUT_CODE_PLACEHOLDER}
                  value={currentData.code}
                  onChange={(e) => handleInputChange(id, e.target.value.replace(/\D/g, '').substring(0, 6))}
                  className="text-center text-2xl tracking-[0.5em] font-bold"
                  maxLength={6}
                />

                <LayoutContainer className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleConfirm(change.type, id)}
                    isLoading={loadingId === id}
                    disabled={currentData.code?.length !== 6}
                    leftIcon={<KeyRound size={18} />}
                  >
                    {PROFILE_TEXTS.CHANGES_BUTTON_CONFIRM}
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};
