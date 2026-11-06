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
  SafeImage,
  Text,
  Title,
  Spinner,
} from '@/shared/ui/components';
import { Edit2, Trash2, Star, Calendar } from 'lucide-react';
import { TimelineEventData } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '@/features/admin/constants/admin-timeline.constants';

interface TimelineTableProps {
  events: TimelineEventData[];
  isLoading: boolean;
  onEdit: (event: TimelineEventData) => void;
  onDelete: (event: TimelineEventData) => void;
}

export const TimelineTable: React.FC<TimelineTableProps> = ({
  events,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const texts = ADMIN_TIMELINE_CONSTANTS.TABLE;

  if (isLoading) {
    return (
      <LayoutContainer className="p-12 flex items-center justify-center bg-surface border border-border rounded-2xl">
        <Spinner text="Carregando marcos históricos..." />
      </LayoutContainer>
    );
  }

  if (events.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center bg-surface border border-border rounded-2xl">
        <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
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
            <TableHead className="w-24">{texts.COL_YEAR}</TableHead>
            <TableHead className="w-20">{texts.COL_PHOTO}</TableHead>
            <TableHead>{texts.COL_TITLE}</TableHead>
            <TableHead className="w-36">{texts.COL_CATEGORY}</TableHead>
            <TableHead className="w-20 text-center">{texts.COL_ORDER}</TableHead>
            <TableHead className="w-28 text-center">{texts.COL_STATUS}</TableHead>
            <TableHead className="w-28 text-right">{texts.COL_ACTIONS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const eventKey = event.id || event._id || String(event.year);
            return (
              <TableRow key={eventKey}>
                <TableCell>
                  <LayoutContainer className="flex items-center gap-2">
                    <Badge variant="primary" className="font-black text-sm px-2.5 py-1">
                      {event.year}
                    </Badge>
                    {event.isHighlighted && (
                      <Star className="w-4 h-4 fill-primary text-primary shrink-0" />
                    )}
                  </LayoutContainer>
                </TableCell>
                <TableCell>
                  <LayoutContainer className="relative w-14 h-10 rounded-lg overflow-hidden bg-background border border-border/80">
                    <SafeImage
                      src={event.imageUrl || '/pelotas-logo.png'}
                      alt={event.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                      fallbackSrc="/pelotas-logo.png"
                    />
                  </LayoutContainer>
                </TableCell>
                <TableCell>
                  <LayoutContainer className="flex flex-col max-w-md">
                    <Text className="font-bold text-text-primary text-sm line-clamp-1">{event.title}</Text>
                    <Text className="text-xs text-text-secondary line-clamp-1 mt-0.5">{event.description}</Text>
                  </LayoutContainer>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="text-xs">
                    {ADMIN_TIMELINE_CONSTANTS.CATEGORIES[event.category] || event.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Text className="text-xs text-text-secondary font-mono">{event.displayOrder || 0}</Text>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={event.isActive ? 'success' : 'default'} className="text-xs">
                    {event.isActive ? texts.BADGE_ACTIVE : texts.BADGE_INACTIVE}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <LayoutContainer className="flex items-center justify-end gap-1.5">
                    <IconButton
                      icon={<Edit2 className="w-4 h-4" />}
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                    />
                    <IconButton
                      icon={<Trash2 className="w-4 h-4" />}
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(event)}
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
