'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';

export interface DashboardStats {
  total: number;
  active: number;
  blocked: number;
  pending: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    blocked: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [totalRes, activeRes, blockedRes, pendingRes] = await Promise.allSettled([
        adminService.getUsers({ limit: 1 }),
        adminService.getUsers({ limit: 1, status: 'ACTIVE' }),
        adminService.getUsers({ limit: 1, status: 'BLOCKED' }),
        adminService.getUsers({ limit: 1, status: 'PENDING' }),
      ]);

      setStats({
        total: totalRes.status === 'fulfilled' ? totalRes.value?.total || 0 : 0,
        active: activeRes.status === 'fulfilled' ? activeRes.value?.total || 0 : 0,
        blocked: blockedRes.status === 'fulfilled' ? blockedRes.value?.total || 0 : 0,
        pending: pendingRes.status === 'fulfilled' ? pendingRes.value?.total || 0 : 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    reload: loadStats,
  };
};

