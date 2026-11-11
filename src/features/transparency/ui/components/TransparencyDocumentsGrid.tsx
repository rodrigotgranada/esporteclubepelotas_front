'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Badge, Button, Spinner } from '@/shared/ui/components';
import { FileText, Download } from 'lucide-react';
import { TransparencyDocument } from '../../types/transparency.types';
import { TRANSPARENCY_TEXTS } from '../../constants/transparency.constants';

interface TransparencyDocumentsGridProps {
  documents: TransparencyDocument[];
  isLoading: boolean;
}

export function TransparencyDocumentsGrid({ documents, isLoading }: TransparencyDocumentsGridProps) {
  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size={32} className="text-amber-400" />
        <Text className="text-sm text-gray-400">{TRANSPARENCY_TEXTS.LOADING_DOCUMENTS}</Text>
      </LayoutContainer>
    );
  }

  if (documents.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-800 bg-[#071126]/50 p-8 text-center">
        <FileText size={48} className="text-gray-600 mb-3" />
        <Text className="text-base text-gray-400">{TRANSPARENCY_TEXTS.EMPTY_DOCUMENTS}</Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <LayoutContainer
          key={doc.id}
          className="flex flex-col justify-between rounded-xl border border-gray-800 bg-[#0B1B3D]/60 p-6 shadow-md transition-all hover:border-amber-400/40 hover:shadow-lg"
        >
          <LayoutContainer className="mb-4">
            <LayoutContainer className="flex items-center justify-between gap-2 mb-3">
              <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-semibold">
                {doc.category}
              </Badge>
              <Badge className="bg-gray-800 text-gray-300 text-xs font-bold">
                {doc.year}
              </Badge>
            </LayoutContainer>

            <Title level="h4" className="text-lg font-bold text-white mb-2 line-clamp-2">
              {doc.title}
            </Title>

            {doc.description && (
              <Text className="text-xs text-gray-400 line-clamp-3">
                {doc.description}
              </Text>
            )}
          </LayoutContainer>

          <LayoutContainer className="pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
            <Text className="text-xs text-gray-400">
              {doc.fileSize ? `PDF • ${doc.fileSize}` : 'PDF Oficial'}
            </Text>

            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5 border-amber-400/40 text-amber-400 hover:bg-amber-400/10 text-xs font-semibold"
              >
                <Download size={14} />
                <Text as="span">{TRANSPARENCY_TEXTS.DOWNLOAD_FILE}</Text>
              </Button>
            </a>
          </LayoutContainer>
        </LayoutContainer>
      ))}
    </LayoutContainer>
  );
}

