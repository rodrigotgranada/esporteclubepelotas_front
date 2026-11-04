'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { LayoutContainer, Text, Input, Button, Badge } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsEditorTagsSectionProps {
  tags: string[];
  tagInput: string;
  setTagInput: (val: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export const NewsEditorTagsSection: React.FC<NewsEditorTagsSectionProps> = ({
  tags,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;

  return (
    <LayoutContainer className="flex flex-col gap-2">
      <Text as="span" className="text-xs font-semibold text-text-primary uppercase tracking-wider">
        {texts.LABEL_TAGS}
      </Text>
      <LayoutContainer className="flex items-center gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddTag();
            }
          }}
          placeholder={texts.PLACEHOLDER_TAGS}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onAddTag}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {texts.BUTTON_ADD_TAG}
        </Button>
      </LayoutContainer>

      {tags.length > 0 && (
        <LayoutContainer className="flex flex-wrap items-center gap-1.5 pt-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="primary"
              size="sm"
              className="flex items-center gap-1 pl-2.5 pr-1 py-1"
            >
              <span>#{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTag(tag)}
                className="p-0.5 h-auto hover:bg-black/10 rounded-full"
                aria-label={`Remover tag ${tag}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

