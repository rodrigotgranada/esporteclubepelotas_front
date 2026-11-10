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
    isOnlineActive,
    externalUrl,
    instagramUrl,
    whatsappNumber,
    whatsappLink,
    formattedWhatsapp,
    openingHours,
    address,
    hasMemberDiscount,
    memberDiscountText,
    mapsUrl,
  } = useStorePage();

  return (
    <LayoutContainer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 sm:gap-10">
      {/* 1. Hero Section */}
      <StoreHero storeName={storeName} storeDescription={storeDescription} />

      {/* 2. Member Discount Card (Conditionally shown if hasMemberDiscount is true) */}
      <StoreMemberDiscountCard
        hasMemberDiscount={hasMemberDiscount}
        memberDiscountText={memberDiscountText}
      />

      {/* 3. Online Store Card */}
      <StoreOnlineCard
        isOnlineActive={isOnlineActive}
        externalUrl={externalUrl}
        whatsappLink={whatsappLink}
      />

      {/* 4. Official Channels (WhatsApp & Instagram) */}
      <StoreChannelsGrid
        whatsappNumber={whatsappNumber}
        whatsappLink={whatsappLink}
        formattedWhatsapp={formattedWhatsapp}
        instagramUrl={instagramUrl}
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

