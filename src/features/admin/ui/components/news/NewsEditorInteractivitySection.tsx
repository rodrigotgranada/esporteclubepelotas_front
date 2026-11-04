'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { LayoutContainer, Text, Checkbox } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorInteractivitySectionProps {
  allowReactions: boolean;
  setAllowReactions: (val: boolean) => void;
  allowComments: boolean;
  setAllowComments: (val: boolean) => void;
}

export const NewsEditorInteractivitySection: React.FC<NewsEditorInteractivitySectionProps> = ({
  allowReactions,
  setAllowReactions,
  allowComments,
  setAllowComments,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface shadow-xs">
      <LayoutContainer className="flex flex-col gap-0.5">
        <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          {texts.LABEL_INTERACTIVITY_SECTION}
        </Text>
        <Text as="span" className="text-[11px] text-text-secondary">
          {texts.LABEL_INTERACTIVITY_HINT}
        </Text>
      </LayoutContainer>

      <LayoutContainer className="flex flex-col gap-2 pt-1">
        <Checkbox
          id="allow-reactions"
          label={texts.LABEL_ALLOW_REACTIONS}
          description={texts.ALLOW_REACTIONS_HINT}
          checked={allowReactions}
          onChange={(e) => setAllowReactions(e.target.checked)}
        />

        <Checkbox
          id="allow-comments"
          label={texts.LABEL_ALLOW_COMMENTS}
          description={texts.ALLOW_COMMENTS_HINT}
          checked={allowComments}
          onChange={(e) => setAllowComments(e.target.checked)}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
