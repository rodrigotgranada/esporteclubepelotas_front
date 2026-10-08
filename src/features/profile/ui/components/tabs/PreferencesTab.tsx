import React from 'react';
import { LayoutContainer, Title, Text, Button, Checkbox } from '@/shared/ui/components';
import { Settings, Download, Bell, Smartphone } from 'lucide-react';
import { User } from '@/store/useAuthStore';
import { PROFILE_TEXTS } from '../../../constants';

interface Props {
  user: User;
}

export const PreferencesTab = ({ user }: Props) => {
  return (
    <LayoutContainer className="animate-in fade-in duration-300 space-y-8">
      <LayoutContainer>
        <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2 mb-2">
          <Settings size={24} className="text-primary" />
          {PROFILE_TEXTS.PREFERENCES_TITLE}
        </Title>
        <Text className="text-text-secondary text-sm">{PROFILE_TEXTS.PREFERENCES_DESCRIPTION}</Text>
      </LayoutContainer>

      <LayoutContainer className="bg-surface border border-border rounded-xl p-6">
        <Title level="h3" className="text-lg font-bold text-text-primary mb-4">{PROFILE_TEXTS.PREFERENCES_COMMS_TITLE}</Title>
        
        <LayoutContainer className="space-y-4">
          <Checkbox 
            defaultChecked
            label={
              <Text as="span" className="text-text-primary font-medium flex items-center gap-2">
                <Bell size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                {PROFILE_TEXTS.PREFERENCES_COMMS_EMAIL_LABEL}
              </Text>
            }
            description={PROFILE_TEXTS.PREFERENCES_COMMS_EMAIL_DESC}
          />

          <Checkbox 
            label={
              <Text as="span" className="text-text-primary font-medium flex items-center gap-2">
                <Smartphone size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                {PROFILE_TEXTS.PREFERENCES_COMMS_SMS_LABEL}
              </Text>
            }
            description={PROFILE_TEXTS.PREFERENCES_COMMS_SMS_DESC}
          />
        </LayoutContainer>
        
        <Button variant="secondary" size="md" className="mt-6 px-6">{PROFILE_TEXTS.PREFERENCES_BUTTON_SAVE}</Button>
      </LayoutContainer>

      <LayoutContainer className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 mt-8">
        <Title level="h3" className="text-lg font-bold text-secondary mb-2">{PROFILE_TEXTS.PREFERENCES_PRIVACY_TITLE}</Title>
        <Text className="text-secondary/80 mb-6 text-sm">
          {PROFILE_TEXTS.PREFERENCES_PRIVACY_DESC}
        </Text>
        <Button variant="outline" size="sm" className="border-secondary/50 text-secondary hover:bg-secondary/10 transition-colors">
          <Download size={16} /> {PROFILE_TEXTS.PREFERENCES_BUTTON_EXPORT}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
