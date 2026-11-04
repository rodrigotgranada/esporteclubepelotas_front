'use client';

import React from 'react';
import Link from 'next/link';
import {
  Edit3,
  Trash2,
  Star,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Shield,
  Heart,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Button,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
} from '@/shared/ui/components';
import { ADMIN_IDOLS_TEXTS } from '../../../constants/admin-idols.constants';
import { IdolCategory, IdolData } from '../../../../idols/services/idols.service';

export interface IdolsTableProps {
  idols: IdolData[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onEdit: (id: string) => void;
  onDelete: (idol: IdolData) => void;
  onToggleFeatured: (idol: IdolData) => void;
}

export const IdolsTable: React.FC<IdolsTableProps> = ({
  idols,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggleFeatured,
}) => {
  const texts = ADMIN_IDOLS_TEXTS.TABLE;

  const getCategoryBadge = (category: IdolCategory) => {
    switch (category) {
      case 'PLAYER':
        return (
          <Badge variant="primary" size="sm" className="font-bold flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {ADMIN_IDOLS_TEXTS.CATEGORIES.PLAYER}
          </Badge>
        );
      case 'COACH':
        return (
          <Badge variant="warning" size="sm" className="font-bold flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {ADMIN_IDOLS_TEXTS.CATEGORIES.COACH}
          </Badge>
        );
      case 'STAFF':
        return (
          <Badge variant="default" size="sm" className="font-bold flex items-center gap-1 border border-border">
            <UserCheck className="w-3 h-3 text-primary" />
            {ADMIN_IDOLS_TEXTS.CATEGORIES.STAFF}
          </Badge>
        );
      case 'FAN':
        return (
          <Badge variant="default" size="sm" className="font-bold flex items-center gap-1 border border-primary/40 text-primary">
            <Heart className="w-3 h-3 text-primary" />
            {ADMIN_IDOLS_TEXTS.CATEGORIES.FAN}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPeriod = (startYear: number, endYear?: number | null, isActiveInClub?: boolean) => {
    if (isActiveInClub) {
      return `${startYear} - ${texts.IN_CLUB}`;
    }
    if (endYear && endYear !== startYear) {
      return `${startYear} - ${endYear}`;
    }
    return `${startYear}`;
  };

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-16 bg-surface border border-border rounded-2xl">
        <Spinner className="w-8 h-8 text-primary mb-3" />
        <Text as="p" className="text-text-secondary font-medium">
          {texts.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  if (idols.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-14 text-center bg-surface border border-dashed border-border rounded-2xl">
        <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border text-primary/70 mb-3 shadow-xs">
          <Trophy className="w-10 h-10" />
        </LayoutContainer>
        <Title level="h3" className="text-lg font-bold text-text-primary mb-1">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-sm text-text-secondary max-w-md leading-relaxed">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Desktop Table View */}
      <LayoutContainer className="hidden md:block w-full overflow-hidden rounded-2xl bg-surface border border-border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">{texts.COL_PHOTO}</TableHead>
              <TableHead>{texts.COL_NAME}</TableHead>
              <TableHead className="w-36">{texts.COL_CATEGORY}</TableHead>
              <TableHead className="w-36">{texts.COL_PERIOD}</TableHead>
              <TableHead className="w-20 text-center">{texts.COL_ORDER}</TableHead>
              <TableHead className="w-24 text-center">{texts.COL_FEATURED}</TableHead>
              <TableHead className="w-28 text-right">{texts.COL_ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {idols.map((idol) => {
              const idolId = idol._id || idol.id;
              return (
                <TableRow key={idolId} className="hover:bg-surface/80 transition-colors">
                  {/* Photo Thumbnail */}
                  <TableCell>
                    <LayoutContainer className="relative w-12 h-16 rounded-lg overflow-hidden bg-background border border-border shrink-0">
                      <SafeImage
                        src={idol.photoUrl}
                        fallbackSrc={DEFAULT_IDOL_COVER}
                        alt={idol.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </LayoutContainer>
                  </TableCell>

                  {/* Name and Nickname */}
                  <TableCell>
                    <LayoutContainer className="flex flex-col">
                      <Text
                        as="span"
                        className="font-extrabold text-text-primary text-base hover:text-primary transition-colors cursor-pointer"
                        onClick={() => onEdit(idolId)}
                      >
                        {idol.name}
                      </Text>
                      {idol.nickname && (
                        <Text as="span" className="text-xs font-semibold text-text-secondary">
                          &quot;{idol.nickname}&quot;
                        </Text>
                      )}
                      {idol.quote && (
                        <Text as="span" className="text-xs text-text-muted italic line-clamp-1 mt-0.5">
                          {idol.quote}
                        </Text>
                      )}
                    </LayoutContainer>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{getCategoryBadge(idol.category)}</TableCell>

                  {/* Period */}
                  <TableCell>
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {formatPeriod(idol.startYear, idol.endYear, idol.isActiveInClub)}
                    </Text>
                  </TableCell>

                  {/* Order */}
                  <TableCell className="text-center font-bold text-xs text-text-muted">
                    {idol.order ?? 0}
                  </TableCell>

                  {/* Featured Toggle */}
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFeatured(idol)}
                      className="p-1 rounded-lg"
                      title={idol.isFeatured ? 'Remover destaque' : 'Destacar no Memorial'}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          idol.isFeatured ? 'text-primary fill-primary' : 'text-text-muted hover:text-text-primary'
                        }`}
                      />
                    </Button>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-right">
                    <LayoutContainer className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/idolos/${idol.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-text-secondary hover:text-primary transition-colors inline-flex items-center justify-center"
                        title={texts.ACTION_VIEW}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(idolId)}
                        className="p-2 rounded-xl text-text-secondary hover:text-text-primary"
                        title={texts.ACTION_EDIT}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(idol)}
                        className="p-2 rounded-xl text-error hover:bg-error/10"
                        title={texts.ACTION_DELETE}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </LayoutContainer>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </LayoutContainer>

      {/* Mobile Cards View */}
      <LayoutContainer className="flex flex-col gap-3 md:hidden">
        {idols.map((idol) => {
          const idolId = idol._id || idol.id;
          return (
            <LayoutContainer
              key={idolId}
              className="flex items-start gap-4 p-4 rounded-2xl bg-surface border border-border shadow-xs"
            >
              <LayoutContainer className="relative w-16 h-20 rounded-xl overflow-hidden bg-background border border-border shrink-0">
                <SafeImage
                  src={idol.photoUrl}
                  fallbackSrc={DEFAULT_IDOL_COVER}
                  alt={idol.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5 flex-1 min-w-0">
                <LayoutContainer className="flex items-center justify-between gap-2">
                  <LayoutContainer className="flex items-center gap-1.5">
                    {getCategoryBadge(idol.category)}
                    {typeof idol.order === 'number' && idol.order > 0 && (
                      <Badge variant="default" size="sm" className="text-[10px] py-0 px-1 font-bold">
                        #{idol.order}
                      </Badge>
                    )}
                  </LayoutContainer>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFeatured(idol)}
                    className="p-1"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        idol.isFeatured ? 'text-primary fill-primary' : 'text-text-muted'
                      }`}
                    />
                  </Button>
                </LayoutContainer>

                <Title
                  level="h4"
                  className="text-base font-black text-text-primary line-clamp-1 cursor-pointer"
                  onClick={() => onEdit(idolId)}
                >
                  {idol.name}
                </Title>

                {idol.nickname && (
                  <Text as="p" className="text-xs font-semibold text-text-secondary line-clamp-1">
                    &quot;{idol.nickname}&quot;
                  </Text>
                )}

                <Text as="p" className="text-xs font-bold text-text-muted">
                  {formatPeriod(idol.startYear, idol.endYear, idol.isActiveInClub)}
                </Text>

                <LayoutContainer className="flex items-center justify-end gap-2 pt-2 border-t border-border mt-1">
                  <Link
                    href={`/idolos/${idol.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-text-secondary hover:text-primary transition-colors inline-flex items-center justify-center"
                    title={texts.ACTION_VIEW}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(idolId)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="text-xs font-bold"
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(idol)}
                    className="p-2 text-error hover:bg-error/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          );
        })}
      </LayoutContainer>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <LayoutContainer className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
          <Text as="span" className="text-xs text-text-secondary font-medium">
            Página {page} de {totalPages}
          </Text>
          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Próxima
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

