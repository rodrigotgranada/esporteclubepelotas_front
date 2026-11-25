'use client';

import React from 'react';
import { ShoppingBag, ExternalLink, WifiOff, XCircle } from 'lucide-react';
import { LayoutContainer, Title, Text, Badge, Button, Spinner } from '@/shared/ui/components';
import { PROFILE_TEXTS } from '../../../constants';
import { useProfileStoreOrders } from '../../../hooks/useProfileStoreOrders';

const formatBrl = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDateBrt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING_WHATSAPP':
      return { label: PROFILE_TEXTS.STORE_STATUS_PENDING_WHATSAPP, variant: 'warning' as const };
    case 'NEGOTIATING':
      return { label: PROFILE_TEXTS.STORE_STATUS_NEGOTIATING, variant: 'primary' as const };
    case 'CONFIRMED_PAID':
      return { label: PROFILE_TEXTS.STORE_STATUS_CONFIRMED_PAID, variant: 'success' as const };
    case 'CANCELLED':
      return { label: PROFILE_TEXTS.STORE_STATUS_CANCELLED, variant: 'danger' as const };
    case 'EXPIRED':
      return { label: PROFILE_TEXTS.STORE_STATUS_EXPIRED, variant: 'default' as const };
    default:
      return { label: status, variant: 'default' as const };
  }
};

export const StoreOrdersTab = () => {
  const {
    orders,
    storeOnline,
    offlineMessage,
    isLoading,
    cancellingCode,
    isOpeningStore,
    handleCancelOrder,
    handleOpenStore,
  } = useProfileStoreOrders();

  return (
    <LayoutContainer className="space-y-6 animate-in fade-in duration-300">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <LayoutContainer className="space-y-1">
          <Title level="h2" className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ShoppingBag size={22} className="text-primary" />
            {PROFILE_TEXTS.STORE_ORDERS_TITLE}
          </Title>
          <Text className="text-sm text-text-secondary">{PROFILE_TEXTS.STORE_ORDERS_SUBTITLE}</Text>
        </LayoutContainer>

        <Button
          variant="primary"
          size="sm"
          disabled={isOpeningStore}
          onClick={handleOpenStore}
          rightIcon={<ExternalLink size={14} />}
        >
          {PROFILE_TEXTS.STORE_ORDERS_BTN_OPEN_STORE}
        </Button>
      </LayoutContainer>

      {isLoading ? (
        <LayoutContainer className="py-10 flex justify-center">
          <Spinner />
        </LayoutContainer>
      ) : !storeOnline ? (
        <LayoutContainer className="p-6 rounded-xl border border-warning/30 bg-warning/10 space-y-2 text-center">
          <WifiOff className="w-8 h-8 text-warning mx-auto" />
          <Title level="h3" className="text-base font-bold text-text-primary">
            {PROFILE_TEXTS.STORE_ORDERS_OFFLINE_TITLE}
          </Title>
          <Text className="text-xs text-text-secondary">
            {offlineMessage || PROFILE_TEXTS.STORE_ORDERS_OFFLINE_FALLBACK}
          </Text>
        </LayoutContainer>
      ) : orders.length === 0 ? (
        <LayoutContainer className="p-8 rounded-xl border border-border bg-background/50 text-center space-y-2">
          <ShoppingBag className="w-8 h-8 text-primary mx-auto opacity-75" />
          <Text className="text-sm text-text-secondary">{PROFILE_TEXTS.STORE_ORDERS_EMPTY}</Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="space-y-4">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const canCancel =
              order.status === 'PENDING_WHATSAPP' || order.status === 'NEGOTIATING';
            return (
              <LayoutContainer
                key={order.id}
                className="p-4 rounded-xl border border-border bg-background/60 space-y-3"
              >
                <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <LayoutContainer className="space-y-1">
                    <LayoutContainer className="flex flex-wrap items-center gap-2">
                      <Text as="span" className="text-sm font-extrabold text-text-primary">
                        {order.orderCode}
                      </Text>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </LayoutContainer>
                    <Text className="text-xs text-text-secondary">
                      {formatDateBrt(order.createdAt)}
                      {order.expiresAt && canCancel
                        ? ` · ${PROFILE_TEXTS.STORE_ORDERS_EXPIRES_LABEL} ${formatDateBrt(order.expiresAt)}`
                        : ''}
                    </Text>
                  </LayoutContainer>

                  <Text as="span" className="text-base font-extrabold text-primary">
                    {PROFILE_TEXTS.STORE_ORDERS_TOTAL_LABEL} {formatBrl(order.totalAmount)}
                  </Text>
                </LayoutContainer>

                <LayoutContainer className="space-y-1">
                  {order.items.map((item, idx) => (
                    <Text key={`${order.id}-${item.sku}-${idx}`} className="text-xs text-text-primary">
                      {item.quantity}x {item.productName} ({item.sizeLabel} · {item.sku}) —{' '}
                      {formatBrl(item.lineTotal)}
                    </Text>
                  ))}
                </LayoutContainer>

                {canCancel && (
                  <LayoutContainer className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={cancellingCode === order.orderCode}
                      onClick={() => handleCancelOrder(order.orderCode)}
                      leftIcon={<XCircle size={14} />}
                      className="text-[#ea580c]"
                    >
                      {cancellingCode === order.orderCode
                        ? PROFILE_TEXTS.STORE_ORDERS_CANCELLING
                        : PROFILE_TEXTS.STORE_ORDERS_CANCEL_BTN}
                    </Button>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
