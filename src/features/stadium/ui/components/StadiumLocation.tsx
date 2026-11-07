'use client';

import React, { useState } from 'react';
import { LayoutContainer, Title, Text, Badge, Button } from '@/shared/ui/components';
import { STADIUM_TEXTS } from '../../constants/stadium.constants';
import { MapPin, Navigation, Copy, Check } from 'lucide-react';

interface StadiumLocationProps {
  address?: string;
  mapsDirectUrl?: string;
  mapsEmbedUrl?: string;
}

export const StadiumLocation: React.FC<StadiumLocationProps> = ({
  address,
  mapsDirectUrl,
  mapsEmbedUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const finalAddress =
    address ||
    'Avenida Bento Gonçalves com Gonçalves Chaves, Centro - Pelotas/RS, CEP 96015-140';
  const finalDirectUrl =
    mapsDirectUrl ||
    'https://www.google.com/maps/search/?api=1&query=Est%C3%A1dio+Boca+do+Lobo+Pelotas';
  const finalEmbedUrl =
    mapsEmbedUrl ||
    'https://maps.google.com/maps?q=Est%C3%A1dio+Boca+do+Lobo,+Pelotas+-+RS&t=&z=16&ie=UTF8&iwloc=&output=embed';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(finalAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <LayoutContainer as="section" className="w-full py-12 sm:py-16 bg-background">
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Informações de Localização (5 colunas) */}
          <LayoutContainer className="lg:col-span-5 flex flex-col gap-4">
            <Badge
              variant="default"
              size="md"
              className="w-fit inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/30 font-bold px-3 py-1"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {STADIUM_TEXTS.LOCATION_SECTION.BADGE}
            </Badge>

            <Title level="h2" className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {STADIUM_TEXTS.LOCATION_SECTION.TITLE}
            </Title>

            <Text className="text-base text-text-secondary leading-relaxed">
              {STADIUM_TEXTS.LOCATION_SECTION.SUBTITLE}
            </Text>

            {/* Card com endereço formatado */}
            <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3 shadow-sm mt-2">
              <LayoutContainer className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <LayoutContainer className="flex flex-col">
                  <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {STADIUM_TEXTS.LOCATION_SECTION.ADDRESS_LABEL}
                  </Text>
                  <Text as="span" className="text-sm sm:text-base font-semibold text-text-primary mt-0.5 leading-snug">
                    {finalAddress}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>

              {/* Botões de Ação */}
              <LayoutContainer className="flex flex-wrap gap-2 pt-2 border-t border-border/80">
                <a
                  href={finalDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[160px]"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
                  >
                    <Navigation className="w-4 h-4" />
                    <Text as="span">{STADIUM_TEXTS.LOCATION_SECTION.OPEN_MAPS}</Text>
                  </Button>
                </a>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <Text as="span" className="text-emerald-500 font-bold">Copiado!</Text>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <Text as="span">{STADIUM_TEXTS.LOCATION_SECTION.COPY_ADDRESS}</Text>
                    </>
                  )}
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Iframe Mapa Interativo (7 colunas) */}
          <LayoutContainer className="lg:col-span-7 h-[340px] sm:h-[400px] rounded-2xl overflow-hidden border border-border shadow-lg relative bg-surface">
            <iframe
              src={finalEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              title="Localização do Estádio Boca do Lobo"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
