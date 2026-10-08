import React, { useState } from 'react';
import { LayoutContainer, Text, Button, Input, Spinner } from '@/shared/ui/components';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { Camera, Users, MessageCircle, Video } from 'lucide-react';

export const SocialSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [socialData, setSocialData] = useState({
    instagram: settings?.socialMedia?.instagram || '',
    facebook: settings?.socialMedia?.facebook || '',
    x: settings?.socialMedia?.x || '',
    youtube: settings?.socialMedia?.youtube || ''
  });

  const handleChange = (field: keyof typeof socialData, value: string) => {
    setSocialData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const data = { socialMedia: socialData };
      const newSettings = await settingsApi.updateSettings(data);
      updateSettings({ socialMedia: newSettings.socialMedia });
      toast.success('Redes sociais atualizadas com sucesso!');
    } catch (error) {
      console.error('Error updating social settings:', error);
      toast.error('Erro ao atualizar as redes sociais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutContainer className="max-w-2xl bg-surface border border-border rounded-2xl p-6">
      <Text className="text-text-secondary mb-6">Configure os links para as redes sociais oficiais do clube.</Text>

      <LayoutContainer className="space-y-6">
        <LayoutContainer className="flex items-center gap-4">
          <LayoutContainer className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C]">
            <Camera size={20} />
          </LayoutContainer>
          <LayoutContainer className="flex-1">
            <Input 
              placeholder="https://instagram.com/seuclube" 
              value={socialData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-4">
          <LayoutContainer className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
            <Users size={20} />
          </LayoutContainer>
          <LayoutContainer className="flex-1">
            <Input 
              placeholder="https://facebook.com/seuclube" 
              value={socialData.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-4">
          <LayoutContainer className="w-10 h-10 rounded-full bg-text-primary/10 flex items-center justify-center text-text-primary">
            <MessageCircle size={20} />
          </LayoutContainer>
          <LayoutContainer className="flex-1">
            <Input 
              placeholder="https://x.com/seuclube" 
              value={socialData.x}
              onChange={(e) => handleChange('x', e.target.value)}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-4">
          <LayoutContainer className="w-10 h-10 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000]">
            <Video size={20} />
          </LayoutContainer>
          <LayoutContainer className="flex-1">
            <Input 
              placeholder="https://youtube.com/seuclube" 
              value={socialData.youtube}
              onChange={(e) => handleChange('youtube', e.target.value)}
            />
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="pt-4 border-t border-border flex justify-end">
          <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
            Salvar Redes Sociais
          </Button>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
