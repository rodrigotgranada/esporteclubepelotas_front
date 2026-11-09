import React, { useMemo } from 'react';
import { Video } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
} from '@/shared/ui/components';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemVideoSectionProps {
  videoUrl?: string | null;
}

export const AnthemVideoSection: React.FC<AnthemVideoSectionProps> = ({ videoUrl }) => {
  const embedUrl = useMemo(() => {
    if (!videoUrl) return null;
    try {
      const trimmed = videoUrl.trim();
      let videoId = '';

      if (trimmed.includes('youtu.be/')) {
        videoId = trimmed.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (trimmed.includes('watch?v=')) {
        videoId = trimmed.split('watch?v=')[1]?.split('&')[0] || '';
      } else if (trimmed.includes('/embed/')) {
        videoId = trimmed.split('/embed/')[1]?.split('?')[0] || '';
      }

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
      return null;
    } catch {
      return null;
    }
  }, [videoUrl]);

  if (!embedUrl) {
    return null;
  }

  return (
    <LayoutContainer className="relative rounded-3xl border border-border/80 bg-surface/70 backdrop-blur-xs p-6 sm:p-10 shadow-lg">
      <LayoutContainer className="flex items-center gap-3 pb-6 mb-8 border-b border-border/60">
        <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Video className="w-5 h-5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary">
            {ANTHEM_TEXTS.VIDEO_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {ANTHEM_TEXTS.VIDEO_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Container de Vídeo Proporção 16:9 */}
      <LayoutContainer className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/70 bg-black">
        <iframe
          src={embedUrl}
          title={ANTHEM_TEXTS.VIDEO_TITLE}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};

