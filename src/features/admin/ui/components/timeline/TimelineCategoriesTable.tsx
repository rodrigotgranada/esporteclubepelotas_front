'use client';

import React from 'react';
import {
  LayoutContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  IconButton,
  Text,
  Title,
  Spinner,
} from '@/shared/ui/components';
import { Edit2, Trash2, Layers } from 'lucide-react';
import { TimelineCategoryData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';
import { renderCategoryIconComponent } from './TimelineCategoryModal';

interface TimelineCategoriesTableProps {
  categories: TimelineCategoryData[];
  isLoading: boolean;
  onEdit: (category: TimelineCategoryData) => void;
  onDelete: (category: TimelineCategoryData) => void;
}

export const TimelineCategoriesTable: React.FC<TimelineCategoriesTableProps> = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.CATEGORIES_TABLE;

  if (isLoading) {
    return (
      <LayoutContainer className="p-12 flex items-center justify-center bg-surface border border-border rounded-2xl">
        <Spinner text="Carregando categorias..." />
      </LayoutContainer>
    );
  }

  if (categories.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center bg-surface border border-border rounded-2xl">
        <Layers className="w-12 h-12 text-text-muted mx-auto mb-3" />
        <Title level="h3" className="text-lg font-bold text-text-primary mb-1">
          {texts.EMPTY_TITLE}
        </Title>
        <Text className="text-text-secondary text-sm max-w-md mx-auto">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{texts.COL_NAME}</TableHead>
            <TableHead className="w-48">{texts.COL_SLUG}</TableHead>
            <TableHead className="w-36 text-center">{texts.COL_COUNT}</TableHead>
            <TableHead className="w-24 text-center">{texts.COL_ORDER}</TableHead>
            <TableHead className="w-28 text-center">{texts.COL_STATUS}</TableHead>
            <TableHead className="w-24 text-right">{texts.COL_ACTIONS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => {
            const catKey = cat.id || cat._id || cat.slug;
            return (
              <TableRow key={catKey}>
                <TableCell>
                  <LayoutContainer className="flex items-center gap-2.5">
                    <LayoutContainer className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      {renderCategoryIconComponent(cat.icon, 'w-4 h-4 text-primary')}
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <Text className="font-bold text-text-primary text-sm">{cat.name}</Text>
                      {cat.description && (
                        <Text className="text-xs text-text-secondary line-clamp-1 mt-0.5">{cat.description}</Text>
                      )}
                    </LayoutContainer>
                  </LayoutContainer>
                </TableCell>
                <TableCell>
                  <Text className="text-xs font-mono text-text-secondary bg-background/60 px-2 py-0.5 rounded border border-border/60 inline-block">
                    {cat.slug}
                  </Text>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="primary" className="text-xs font-bold">
                    {cat.eventsCount || 0} marco(s)
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Text className="text-xs text-text-secondary font-mono">{cat.displayOrder || 0}</Text>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={cat.isActive ? 'success' : 'default'} className="text-xs">
                    {cat.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <LayoutContainer className="flex items-center justify-end gap-1.5">
                    <IconButton
                      icon={<Edit2 className="w-4 h-4" />}
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(cat)}
                      title="Editar categoria"
                    />
                    <IconButton
                      icon={<Trash2 className="w-4 h-4" />}
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(cat)}
                      title="Excluir/Inativar categoria"
                    />
                  </LayoutContainer>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </LayoutContainer>
  );
};
