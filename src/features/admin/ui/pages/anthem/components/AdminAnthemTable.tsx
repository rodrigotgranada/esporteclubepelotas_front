import React from 'react';
import {
  Edit2,
  Trash2,
  Award,
  Music,
  CheckCircle2,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
} from '@/shared/ui/components';
import { ClubAnthem } from '@/features/anthem/types/anthem.types';
import { ANTHEM_TEXTS } from '@/features/anthem/constants/anthem.constants';

export interface AdminAnthemTableProps {
  anthems: ClubAnthem[];
  isLoading: boolean;
  onEdit: (anthem: ClubAnthem) => void;
  onSetOfficial: (anthem: ClubAnthem) => void;
  onDelete: (anthem: ClubAnthem) => void;
}

export const AdminAnthemTable: React.FC<AdminAnthemTableProps> = ({
  anthems,
  isLoading,
  onEdit,
  onSetOfficial,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <LayoutContainer className="p-12 flex flex-col items-center justify-center gap-3 bg-surface rounded-2xl border border-border">
        <Spinner size={32} />
        <Text className="text-sm font-semibold text-text-secondary">
          Carregando versões do hino...
        </Text>
      </LayoutContainer>
    );
  }

  if (anthems.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center bg-surface rounded-2xl border border-border flex flex-col items-center gap-3">
        <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Music className="w-6 h-6" />
        </LayoutContainer>
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {ANTHEM_TEXTS.ADMIN_NO_RECORDS}
        </Title>
        <Text className="text-sm text-text-secondary max-w-md">
          {ANTHEM_TEXTS.ADMIN_EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="w-full bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
      <LayoutContainer className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-background/50 text-text-secondary text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-bold">{ANTHEM_TEXTS.ADMIN_COL_TITLE}</th>
              <th className="py-4 px-6 font-bold">{ANTHEM_TEXTS.ADMIN_COL_AUTHOR}</th>
              <th className="py-4 px-6 font-bold">{ANTHEM_TEXTS.ADMIN_COL_AUDIO}</th>
              <th className="py-4 px-6 font-bold">{ANTHEM_TEXTS.ADMIN_COL_OFFICIAL}</th>
              <th className="py-4 px-6 font-bold">{ANTHEM_TEXTS.ADMIN_COL_STATUS}</th>
              <th className="py-4 px-6 font-bold text-right">{ANTHEM_TEXTS.ADMIN_COL_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {anthems.map((anthem) => (
              <tr
                key={anthem.id}
                className="hover:bg-background/40 transition-colors group"
              >
                {/* Título e Subtítulo */}
                <td className="py-4 px-6">
                  <LayoutContainer className="flex flex-col">
                    <Text className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">
                      {anthem.title}
                    </Text>
                    {anthem.subtitle && (
                      <Text className="text-xs text-text-secondary">
                        {anthem.subtitle}
                      </Text>
                    )}
                  </LayoutContainer>
                </td>

                {/* Autores & Ano */}
                <td className="py-4 px-6">
                  <LayoutContainer className="flex flex-col">
                    <Text className="text-xs font-semibold text-text-primary">
                      {anthem.authorMusic || anthem.authorLyrics || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR}
                    </Text>
                    <Text className="text-[11px] text-text-secondary">
                      {anthem.compositionYear ? `Composição: ${anthem.compositionYear}` : 'Ano não informado'}
                    </Text>
                  </LayoutContainer>
                </td>

                {/* Áudio & Vídeo */}
                <td className="py-4 px-6">
                  <LayoutContainer className="flex items-center gap-2">
                    {anthem.audioUrl ? (
                      <a
                        href={anthem.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                        title="Ouvir arquivo de áudio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>MP3</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <Text className="text-xs text-text-secondary italic">Sem áudio</Text>
                    )}

                    {anthem.videoUrl && (
                      <a
                        href={anthem.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary text-[11px]"
                        title="Ver vídeo do YouTube"
                      >
                        Vídeo
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </LayoutContainer>
                </td>

                {/* Oficial */}
                <td className="py-4 px-6">
                  {anthem.isOfficial ? (
                    <Badge variant="primary" size="sm" className="font-black text-[10px] uppercase">
                      <Award className="w-3 h-3 mr-1" />
                      {ANTHEM_TEXTS.ADMIN_BADGE_OFFICIAL}
                    </Badge>
                  ) : (
                    <button
                      onClick={() => onSetOfficial(anthem)}
                      className="text-xs font-semibold text-text-secondary hover:text-primary hover:underline cursor-pointer flex items-center gap-1"
                      title="Definir como oficial"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {ANTHEM_TEXTS.ADMIN_BTN_MAKE_OFFICIAL}
                    </button>
                  )}
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <Badge
                    variant={anthem.isActive ? 'primary' : 'default'}
                    size="sm"
                    className="text-[10px] font-bold uppercase"
                  >
                    {anthem.isActive ? ANTHEM_TEXTS.ADMIN_BADGE_ACTIVE : ANTHEM_TEXTS.ADMIN_BADGE_INACTIVE}
                  </Badge>
                </td>

                {/* Ações */}
                <td className="py-4 px-6 text-right">
                  <LayoutContainer className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(anthem)}
                      className="p-1.5 text-text-secondary hover:text-text-primary"
                      title={ANTHEM_TEXTS.ADMIN_BTN_EDIT}
                      aria-label={ANTHEM_TEXTS.ADMIN_BTN_EDIT}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(anthem)}
                      className="p-1.5 text-text-secondary hover:text-[#ea580c]"
                      title={ANTHEM_TEXTS.ADMIN_BTN_DELETE}
                      aria-label={ANTHEM_TEXTS.ADMIN_BTN_DELETE}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </LayoutContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LayoutContainer>
    </LayoutContainer>
  );
};

