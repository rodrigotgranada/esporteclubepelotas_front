import { useMemo } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { STORE_TEXTS } from '../constants/store.constants';

export const useStorePage = () => {
  const { settings } = useSettingsStore();

  const storeName = useMemo(
    () => settings?.storeName?.trim() || STORE_TEXTS.FALLBACK_STORE_NAME,
    [settings?.storeName]
  );

  const storeDescription = useMemo(
    () => settings?.storeDescription?.trim() || STORE_TEXTS.FALLBACK_STORE_DESC,
    [settings?.storeDescription]
  );

  const isOnlineActive = useMemo(
    () => Boolean(settings?.storeIsOnlineActive),
    [settings?.storeIsOnlineActive]
  );

  const externalUrl = useMemo(
    () => settings?.storeExternalUrl?.trim() || '',
    [settings?.storeExternalUrl]
  );

  const instagramUrl = useMemo(
    () => settings?.storeInstagramUrl?.trim() || 'https://www.instagram.com/lojadolobo/',
    [settings?.storeInstagramUrl]
  );

  const whatsappNumber = useMemo(
    () => settings?.storeWhatsappNumber?.trim() || '',
    [settings?.storeWhatsappNumber]
  );

  const whatsappMessage = useMemo(
    () => settings?.storeWhatsappMessage?.trim() || STORE_TEXTS.FALLBACK_WHATSAPP_MESSAGE,
    [settings?.storeWhatsappMessage]
  );

  const whatsappLink = useMemo(() => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (!cleanNumber) return '#';
    const textParam = encodeURIComponent(whatsappMessage);
    return `https://wa.me/${cleanNumber}?text=${textParam}`;
  }, [whatsappNumber, whatsappMessage]);

  const formattedWhatsapp = useMemo(() => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (cleanNumber.length === 13 && cleanNumber.startsWith('55')) {
      const ddd = cleanNumber.slice(2, 4);
      const part1 = cleanNumber.slice(4, 9);
      const part2 = cleanNumber.slice(9);
      return `+55 (${ddd}) ${part1}-${part2}`;
    }
    if (cleanNumber.length === 11) {
      const ddd = cleanNumber.slice(0, 2);
      const part1 = cleanNumber.slice(2, 7);
      const part2 = cleanNumber.slice(7);
      return `(${ddd}) ${part1}-${part2}`;
    }
    return whatsappNumber;
  }, [whatsappNumber]);

  const openingHours = useMemo(
    () => settings?.storeOpeningHours?.trim() || STORE_TEXTS.FALLBACK_HOURS,
    [settings?.storeOpeningHours]
  );

  const address = useMemo(
    () => settings?.storeAddress?.trim() || STORE_TEXTS.FALLBACK_ADDRESS,
    [settings?.storeAddress]
  );

  const hasMemberDiscount = useMemo(
    () => (settings?.storeHasMemberDiscount !== undefined ? settings.storeHasMemberDiscount : true),
    [settings?.storeHasMemberDiscount]
  );

  const memberDiscountText = useMemo(
    () => settings?.storeMemberDiscountText?.trim() || STORE_TEXTS.FALLBACK_MEMBER_DISCOUNT,
    [settings?.storeMemberDiscountText]
  );

  const mapsUrl = useMemo(() => {
    const query = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [address]);

  return {
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
  };
};
