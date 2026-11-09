import React from 'react';
import { Music, Award, CheckCircle2, Play } from 'lucide-react';
import {
  Modal,
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
} from '@/shared/ui/components';
import { ClubAnthem } from '../../types/anthem.types';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ClubAnthem[];
  currentAnthemId?: string;
  onSelectVersion: (version: ClubAnthem) => void;
}

export const AnthemVersionsModal: React.FC<AnthemVersionsModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentAnthemId,
  onSelectVersion,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <LayoutContainer className="flex flex-col gap-4 py-2">
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ANTHEM_TEXTS.VERSIONS_MODAL_TITLE}
        </Title>
        <Text className="text-sm text-text-secondary">
          {ANTHEM_TEXTS.VERSIONS_MODAL_DESC}
        </Text>

        <LayoutContainer className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {versions.map((ver) => {
            const isSelected = ver.id === currentAnthemId;

            return (
              <LayoutContainer
                key={ver.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-xs'
                    : 'bg-surface hover:bg-background border-border/80'
                }`}
              >
                <LayoutContainer className="flex items-center gap-3">
                  <LayoutContainer
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-primary text-blue-950 font-bold'
                        : 'bg-surface border border-border text-text-secondary'
                    }`}
                  >
                    <Music className="w-5 h-5" />
                  </LayoutContainer>

                  <LayoutContainer className="flex flex-col">
                    <LayoutContainer className="flex items-center gap-2">
                      <Title level="h4" className="text-sm font-bold text-text-primary">
                        {ver.title}
                      </Title>
                      {ver.isOfficial && (
                        <Badge variant="primary" size="sm" className="text-[10px] uppercase font-black px-1.5 py-0.2">
                          <Award className="w-2.5 h-2.5 mr-0.5" />
                          {ANTHEM_TEXTS.VERSIONS_OFFICIAL_BADGE}
                        </Badge>
                      )}
                    </LayoutContainer>

                    {ver.subtitle && (
                      <Text className="text-xs text-text-secondary">
                        {ver.subtitle}
                      </Text>
                    )}

                    <Text className="text-[11px] text-text-secondary/80 font-mono">
                      {ver.authorMusic || ver.authorLyrics || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR}
                      {ver.compositionYear ? ` (${ver.compositionYear})` : ''}
                    </Text>
                  </LayoutContainer>
                </LayoutContainer>

                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onSelectVersion(ver)}
                  leftIcon={isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  className="font-bold text-xs shrink-0"
                >
                  {isSelected ? 'Ativo' : ANTHEM_TEXTS.BTN_SELECT_VERSION}
                </Button>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      </LayoutContainer>
    </Modal>
  );
};

