import { useState, useEffect, useCallback, useRef } from 'react';
import { adminService } from '../services/admin.service';
import { toast } from 'react-hot-toast';
import { SYSTEM_MODULES_FEATURE_TEXTS } from '../ui/pages/modules/SystemModulesFeature.constants';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useSystemModulesList = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const togglingIdsRef = useRef<Set<string>>(new Set());
  const { fetchModules } = useSystemModulesStore();

  const loadModules = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const res = await adminService.getSystemModules();
      setModules(res || []);
    } catch (error) {
      console.error(error);
      if (!options?.silent) {
        toast.error(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ERROR_LOAD);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  useRealtimeEvents('system-modules', () => {
    loadModules({ silent: true });
    fetchModules(true);
  });

  const handleToggleStatus = async (module: any) => {
    const moduleId = module?._id || module?.id;
    if (!moduleId || togglingIdsRef.current.has(moduleId)) return;

    togglingIdsRef.current.add(moduleId);
    try {
      await adminService.updateSystemModuleStatus(moduleId, !module.isActive);
      const actionText = !module.isActive
        ? SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ACTIVATED
        : SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.DEACTIVATED;
      toast.success(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.SUCCESS_TOGGLE(module.name, actionText));
      await loadModules({ silent: true });
      fetchModules(true);
    } catch {
      toast.error(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ERROR_TOGGLE);
    } finally {
      togglingIdsRef.current.delete(moduleId);
    }
  };

  return {
    modules,
    isLoading,
    loadModules,
    handleToggleStatus,
  };
};
