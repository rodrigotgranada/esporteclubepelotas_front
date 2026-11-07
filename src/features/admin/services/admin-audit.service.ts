import { api } from '@/services/api';

export interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  entityId?: string;
  actorId?: string;
  actorEmail?: string;
  actorName?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  data: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminAuditService = {
  getLogs: async (params?: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    actorEmail?: string;
    search?: string;
  }): Promise<AuditLogsResponse> => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },
};

