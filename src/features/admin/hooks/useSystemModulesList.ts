import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';
import { toast } from 'react-hot-toast';
import { SYSTEM_MODULES_FEATURE_TEXTS } from '../ui/pages/modules/SystemModulesFeature.constants';

export const useSystemModulesList = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadModules = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getSystemModules();
      setModules(res);
    } catch (error) {
      console.error(error);
      toast.error(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ERROR_LOAD);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleToggleStatus = async (module: any) => {
    try {
      await adminService.updateSystemModuleStatus(module._id, !module.isActive);
      const actionText = !module.isActive ? SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ACTIVATED : SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.DEACTIVATED;
      toast.success(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.SUCCESS_TOGGLE(module.name, actionText));
      loadModules();
    } catch (error) {
      toast.error(SYSTEM_MODULES_FEATURE_TEXTS.MESSAGES.ERROR_TOGGLE);
    }
  };

  return {
    modules,
    isLoading,
    loadModules,
    handleToggleStatus,
  };
};
