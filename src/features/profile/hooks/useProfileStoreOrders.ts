'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PROFILE_TEXTS } from '../constants';
import {
  storeOrdersService,
  PortalStoreOrderSummary,
} from '../services/storeOrders.service';

export const useProfileStoreOrders = () => {
  const settings = useSettingsStore((s) => s.settings);
  const [orders, setOrders] = useState<PortalStoreOrderSummary[]>([]);
  const [storeOnline, setStoreOnline] = useState(true);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);
  const [isOpeningStore, setIsOpeningStore] = useState(false);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await storeOrdersService.listMyOrders();
      setStoreOnline(response.storeOnline);
      setOfflineMessage(response.message || null);
      setOrders(response.orders || []);
    } catch {
      setStoreOnline(false);
      setOfflineMessage(PROFILE_TEXTS.STORE_ORDERS_OFFLINE_FALLBACK);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const handleCancelOrder = async (orderCode: string) => {
    setCancellingCode(orderCode);
    try {
      const updated = await storeOrdersService.cancelMyOrder(orderCode);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success(PROFILE_TEXTS.STORE_ORDERS_CANCEL_SUCCESS);
    } catch {
      toast.error(PROFILE_TEXTS.STORE_ORDERS_CANCEL_ERROR);
    } finally {
      setCancellingCode(null);
    }
  };

  const handleOpenStore = async () => {
    const baseStoreUrl = (
      settings?.storeExternalUrl ||
      process.env.NEXT_PUBLIC_STORE_URL ||
      'http://localhost:7995'
    ).replace(/\/+$/, '');

    setIsOpeningStore(true);
    try {
      const { ssoToken } = await storeOrdersService.issueSsoToken();
      window.open(`${baseStoreUrl}/sso?token=${encodeURIComponent(ssoToken)}`, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(baseStoreUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsOpeningStore(false);
    }
  };

  return {
    orders,
    storeOnline,
    offlineMessage,
    isLoading,
    cancellingCode,
    isOpeningStore,
    handleCancelOrder,
    handleOpenStore,
  };
};
