'use client';

import React from 'react';
import { LayoutContainer } from '@/shared/ui/components';
import { useStorePage } from '../../hooks/useStorePage';
import { StoreHero } from '../components/StoreHero';
import { StoreOnlineCard } from '../components/StoreOnlineCard';
import { StoreChannelsGrid } from '../components/StoreChannelsGrid';
import { StoreMemberDiscountCard } from '../components/StoreMemberDiscountCard';
import { StorePhysicalLocationCard } from '../components/StorePhysicalLocationCard';

export const StoreFeature = () => {
  const {
    storeName,
    storeDescription,
    storeFacadeUrl,
    isOnlineActive,
    externalUrl,
    hasOnlineStore,
    instagramUrl,
    instagramHandle,
    instagramDescription,
    hasInstagram,
    whatsappNumber,
    whatsappDescription,
    whatsappLink,
    formattedWhatsapp,
    hasWhatsapp,
    openingHours,
    address,
    hasMemberDiscount,
    memberDiscountText,
    mapsUrl,
  } = useStorePage();

  return (
    <LayoutContainer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 sm:gap-10">
      {/* 1. Hero Section (com suporte a imagem de fachada) */}
      <StoreHero
        storeName={storeName}
        storeDescription={storeDescription}
        facadeImageUrl={storeFacadeUrl}
      />

      {/* 2. Member Discount Card (Exibido apenas quando tem benefício de sócio ativo) */}
      <StoreMemberDiscountCard
        hasMemberDiscount={hasMemberDiscount}
        memberDiscountText={memberDiscountText}
      />

      {/* 3. Online Store Card (Exibido apenas quando HOUVER link de loja virtual cadastrado no admin) */}
      {hasOnlineStore && (
        <StoreOnlineCard
          externalUrl={externalUrl}
          isOnlineActive={isOnlineActive}
        />
      )}

      {/* 4. Official Channels (Exibido apenas se WhatsApp ou Instagram estiver cadastrado) */}
      <StoreChannelsGrid
        whatsappNumber={whatsappNumber}
        whatsappLink={whatsappLink}
        formattedWhatsapp={formattedWhatsapp}
        whatsappDescription={whatsappDescription}
        hasWhatsapp={hasWhatsapp}
        instagramUrl={instagramUrl}
        instagramHandle={instagramHandle}
        instagramDescription={instagramDescription}
        hasInstagram={hasInstagram}
      />

      {/* 5. Physical Store & Hours */}
      <StorePhysicalLocationCard
        address={address}
        openingHours={openingHours}
        mapsUrl={mapsUrl}
      />
    </LayoutContainer>
  );
};
