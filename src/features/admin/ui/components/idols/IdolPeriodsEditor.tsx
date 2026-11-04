'use client';

import React from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Input,
  Button,
} from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolPeriod } from '../../../../idols/services/idols.service';

export interface IdolPeriodsEditorProps {
  periods: IdolPeriod[];
  onAdd: () => void;
  onUpdate: (index: number, field: 'startYear' | 'endYear' | 'label', value: any) => void;
  onRemove: (index: number) => void;
}

export const IdolPeriodsEditor: React.FC<IdolPeriodsEditorProps> = ({
  periods,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.DRAWER;

  return (
    <LayoutContainer className="flex flex-col gap-3 p-4 rounded-2xl bg-surface/50 border border-border">
      <LayoutContainer className="flex items-center justify-between">
        <LayoutContainer className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <Title level="h4" className="text-xs font-black text-text-primary uppercase tracking-wider">
            {texts.SECTION_PERIODS}
          </Title>
        </LayoutContainer>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold"
        >
          {texts.BTN_ADD_PERIOD}
        </Button>
      </LayoutContainer>

      {periods.length === 0 ? (
        <Text as="p" className="text-xs text-text-muted italic py-1">
          Nenhuma passagem cadastrada. O ídolo utilizará os anos inicial e final padrão.
        </Text>
      ) : (
        <LayoutContainer className="flex flex-col gap-2.5">
          {periods.map((period, idx) => (
            <LayoutContainer
              key={idx}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-background border border-border"
            >
              <LayoutContainer className="flex items-center gap-2 flex-1 min-w-0">
                <LayoutContainer className="w-24 shrink-0">
                  <Input
                    type="number"
                    placeholder="Início"
                    value={period.startYear || ''}
                    onChange={(e) =>
                      onUpdate(
                        idx,
                        'startYear',
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                  />
                </LayoutContainer>
                <Text as="span" className="text-text-muted font-bold">
                  a
                </Text>
                <LayoutContainer className="w-24 shrink-0">
                  <Input
                    type="number"
                    placeholder="Fim (opc)"
                    value={period.endYear || ''}
                    onChange={(e) =>
                      onUpdate(
                        idx,
                        'endYear',
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                  />
                </LayoutContainer>
                <LayoutContainer className="flex-1 min-w-0">
                  <Input
                    placeholder={texts.PLACEHOLDER_PERIOD_LABEL}
                    value={period.label || ''}
                    onChange={(e) => onUpdate(idx, 'label', e.target.value)}
                  />
                </LayoutContainer>
              </LayoutContainer>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(idx)}
                className="p-2 rounded-xl text-error hover:bg-error/10 self-end sm:self-center shrink-0"
                title={texts.BTN_REMOVE_PERIOD}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
