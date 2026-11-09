'use client';

import React from 'react';
import {
  Edit2,
  Trash2,
  Shirt,
  Sparkles,
  Trophy,
  Shield,
  Building2,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import { ClubKit } from '../../../../types/kits.types';
import { KITS_TEXTS } from '../../../../constants/kits.constants';
import { getKitTypeLabel, getKitTypeBadgeVariant } from '../../../../utils/kits.utils';

export interface AdminKitsTableProps {
  kits: ClubKit[];
  isLoading: boolean;
  onEdit: (kit: ClubKit) => void;
  onDelete: (kit: ClubKit) => void;
}

export const AdminKitsTable: React.FC<AdminKitsTableProps> = ({
  kits,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <LayoutContainer className="p-12 flex flex-col items-center justify-center gap-3 bg-surface rounded-2xl border border-border">
        <Spinner size={32} />
        <Text className="text-sm font-semibold text-text-secondary">
          Carregando acervo de uniformes...
        </Text>
      </LayoutContainer>
    );
  }

  if (kits.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center bg-surface rounded-2xl border border-border flex flex-col items-center gap-3">
        <LayoutContainer className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Shirt className="w-6 h-6" />
        </LayoutContainer>
        <Title level="h3" className="text-lg font-bold text-text-primary">
          Nenhum uniforme encontrado
        </Title>
        <Text className="text-xs sm:text-sm text-text-secondary max-w-md">
          Não há uniformes correspondentes aos filtros aplicados. Cadastre um novo manto ou altere a busca.
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="w-full bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
      {/* Visualização em Lista / Grid Mobile First */}
      <LayoutContainer className="flex flex-col divide-y divide-border">
        {kits.map((kit) => {
          const typeLabel = getKitTypeLabel(kit.kitType);
          const badgeVariant = getKitTypeBadgeVariant(kit.kitType);

          return (
            <LayoutContainer
              key={kit.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-background/40 transition-colors duration-200"
            >
              {/* Foto + Informações Principais */}
              <LayoutContainer className="flex items-center gap-4 flex-1 min-w-0">
                {/* Miniatura do Manto */}
                <LayoutContainer className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-background/60 border border-border flex items-center justify-center shrink-0">
                  <SafeImage
                    src={kit.imageUrl}
                    alt={kit.name}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                    fallbackSrc="/images/pelotas-logo.png"
                  />
                </LayoutContainer>

                {/* Dados Textuais */}
                <LayoutContainer className="flex flex-col min-w-0 flex-1">
                  <LayoutContainer className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={badgeVariant} size="sm" className="font-bold text-[11px]">
                      <Text as="span">{typeLabel}</Text>
                    </Badge>

                    {kit.isCurrent ? (
                      <Badge variant="primary" size="sm" className="font-extrabold text-[10px] uppercase inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <Text as="span">{KITS_TEXTS.BADGE_CURRENT}</Text>
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm" className="font-semibold text-[10px] uppercase text-text-muted">
                        <Text as="span">{KITS_TEXTS.BADGE_HISTORICAL}</Text>
                      </Badge>
                    )}

                    {!kit.isActive && (
                      <Badge variant="danger" size="sm" className="font-semibold text-[10px]">
                        <Text as="span">{KITS_TEXTS.BADGE_INACTIVE}</Text>
                      </Badge>
                    )}
                  </LayoutContainer>

                  <Title level="h4" className="text-base sm:text-lg font-bold text-text-primary truncate">
                    {kit.name}
                  </Title>

                  <LayoutContainer className="flex items-center gap-3 text-xs text-text-secondary mt-1 flex-wrap">
                    <LayoutContainer className="flex items-center gap-1 text-primary font-medium">
                      <Trophy className="w-3.5 h-3.5 shrink-0" />
                      <Text as="span">{kit.competition} ({kit.seasonYear})</Text>
                    </LayoutContainer>

                    {kit.manufacturer && (
                      <LayoutContainer className="flex items-center gap-1 text-text-muted">
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <Text as="span">{kit.manufacturer}</Text>
                      </LayoutContainer>
                    )}

                    {kit.sponsor && (
                      <LayoutContainer className="flex items-center gap-1 text-text-muted">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <Text as="span">{kit.sponsor}</Text>
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>

              {/* Botões de Ação na Linha: Apenas Editar e Excluir */}
              <LayoutContainer className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(kit)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5 text-text-secondary" />}
                  className="text-xs font-bold hover:text-primary hover:border-primary/60"
                >
                  {KITS_TEXTS.BTN_EDIT}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(kit)}
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-error" />}
                  className="text-xs font-bold text-error border-error/30 hover:bg-error/10 hover:border-error"
                >
                  {KITS_TEXTS.BTN_DELETE}
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>
    </LayoutContainer>
  );
};

