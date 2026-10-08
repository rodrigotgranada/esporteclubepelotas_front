import React, { useState } from 'react';
import { LayoutContainer, Text, Button, Input, Spinner } from '@/shared/ui/components';
import { useSettingsStore } from '@/store/useSettingsStore';
import { settingsApi } from '@/shared/api/settings.api';
import { toast } from 'react-hot-toast';
import { FaInstagram, FaFacebookF, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { Plus, Trash2 } from 'lucide-react';

export const SocialSettingsTab = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [socialData, setSocialData] = useState<{
    instagram: string[];
    facebook: string[];
    x: string[];
    youtube: string[];
  }>({
    instagram: Array.isArray(settings?.socialMedia?.instagram) && settings.socialMedia.instagram.length > 0 ? settings.socialMedia.instagram : [''],
    facebook: Array.isArray(settings?.socialMedia?.facebook) && settings.socialMedia.facebook.length > 0 ? settings.socialMedia.facebook : [''],
    x: Array.isArray(settings?.socialMedia?.x) && settings.socialMedia.x.length > 0 ? settings.socialMedia.x : [''],
    youtube: Array.isArray(settings?.socialMedia?.youtube) && settings.socialMedia.youtube.length > 0 ? settings.socialMedia.youtube : ['']
  });

  const handleLinkChange = (field: keyof typeof socialData, index: number, value: string) => {
    setSocialData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addLink = (field: keyof typeof socialData) => {
    setSocialData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeLink = (field: keyof typeof socialData, index: number) => {
    setSocialData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Filter out empty strings
      const cleanedData = {
        instagram: socialData.instagram.filter(link => link.trim() !== ''),
        facebook: socialData.facebook.filter(link => link.trim() !== ''),
        x: socialData.x.filter(link => link.trim() !== ''),
        youtube: socialData.youtube.filter(link => link.trim() !== '')
      };
      
      const data = { socialMedia: cleanedData };
      const newSettings = await settingsApi.updateSettings(data);
      updateSettings({ socialMedia: newSettings.socialMedia });
      
      // Update local state to reflect cleaned data (with at least one empty string if it's completely empty)
      setSocialData({
        instagram: cleanedData.instagram.length ? cleanedData.instagram : [''],
        facebook: cleanedData.facebook.length ? cleanedData.facebook : [''],
        x: cleanedData.x.length ? cleanedData.x : [''],
        youtube: cleanedData.youtube.length ? cleanedData.youtube : ['']
      });

      toast.success('Redes sociais atualizadas com sucesso!');
    } catch (error) {
      console.error('Error updating social settings:', error);
      toast.error('Erro ao atualizar as redes sociais.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSocialSection = (
    field: keyof typeof socialData,
    title: string,
    Icon: React.ElementType,
    color: string,
    placeholder: string
  ) => (
    <LayoutContainer className="pt-4 first:pt-0">
      <Text className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
        <LayoutContainer className={`w-8 h-8 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={16} />
        </LayoutContainer>
        {title}
      </Text>
      
      <LayoutContainer className="space-y-3">
        {socialData[field].map((link, index) => (
          <LayoutContainer key={index} className="flex items-center gap-3">
            <LayoutContainer className="flex-1">
              <Input 
                placeholder={placeholder}
                value={link}
                onChange={(e) => handleLinkChange(field, index, e.target.value)}
              />
            </LayoutContainer>
            {socialData[field].length > 1 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-danger hover:bg-danger/10 px-3 py-2 h-auto"
                onClick={() => removeLink(field, index)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </LayoutContainer>
        ))}
      </LayoutContainer>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-3 text-primary hover:bg-primary/10 text-xs px-3 py-1.5 h-auto"
        onClick={() => addLink(field)}
        leftIcon={<Plus size={14} />}
      >
        Adicionar outro {title}
      </Button>
    </LayoutContainer>
  );

  return (
    <LayoutContainer className="max-w-2xl bg-surface border border-border rounded-2xl p-6">
      <Text className="text-text-secondary mb-6">Configure os links para as redes sociais oficiais do clube.</Text>

      <LayoutContainer className="space-y-6 divide-y divide-border">
        {renderSocialSection('instagram', 'Instagram', FaInstagram, '#E1306C', 'https://instagram.com/seuclube')}
        {renderSocialSection('facebook', 'Facebook', FaFacebookF, '#1877F2', 'https://facebook.com/seuclube')}
        {renderSocialSection('x', 'X (Twitter)', FaXTwitter, '#000000', 'https://x.com/seuclube')}
        {renderSocialSection('youtube', 'YouTube', FaYoutube, '#FF0000', 'https://youtube.com/seuclube')}
      </LayoutContainer>

      <LayoutContainer className="pt-6 mt-6 border-t border-border flex justify-end">
        <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
          Salvar Redes Sociais
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
