import { api } from '@/services/api';

export interface PortalStoreOrderItem {
  productName: string;
  sku: string;
  sizeLabel: string;
  colorLabel?: string;
  quantity: number;
  unitPrice: number;
  appliedPrice: number;
  lineTotal: number;
}

export interface PortalStoreOrderSummary {
  id: string;
  orderCode: string;
  channel: string;
  status: string;
  isSocioDiscountApplied: boolean;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  whatsappSummaryText?: string;
  expiresAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  createdAt: string;
  items: PortalStoreOrderItem[];
}

export interface PortalStoreOrdersResponse {
  storeOnline: boolean;
  message?: string;
  orders: PortalStoreOrderSummary[];
}

export const storeOrdersService = {
  listMyOrders: async (): Promise<PortalStoreOrdersResponse> => {
    const res = await api.get<PortalStoreOrdersResponse>('/users/me/store-orders');
    return res.data;
  },

  cancelMyOrder: async (orderCode: string, reason?: string): Promise<PortalStoreOrderSummary> => {
    const cleanCode = orderCode.replace('#', '');
    const res = await api.post<PortalStoreOrderSummary>(
      `/users/me/store-orders/${cleanCode}/cancel`,
      { reason },
    );
    return res.data;
  },

  issueSsoToken: async (): Promise<{ ssoToken: string; expiresInSeconds: number }> => {
    const res = await api.post<{ ssoToken: string; expiresInSeconds: number }>(
      '/auth/store-sso-token',
    );
    return res.data;
  },
};
