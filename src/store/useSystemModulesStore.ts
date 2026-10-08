import { create } from 'zustand';

export interface SystemModuleData {
  _id: string | any;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

interface SystemModulesState {
  modules: SystemModuleData[];
  isLoading: boolean;
  isLoaded: boolean;
  fetchModules: (force?: boolean) => Promise<void>;
  isModuleActive: (slug: string) => boolean;
}

export const useSystemModulesStore = create<SystemModulesState>((set, get) => ({
  modules: [],
  isLoading: false,
  isLoaded: false,
  fetchModules: async (force?: boolean) => {
    if ((get().isLoaded && !force) || get().isLoading) return;
    set({ isLoading: true });
    try {
      const { adminService } = await import('@/features/admin/services/admin.service');
      const data = await adminService.getSystemModules();
      set({ modules: data, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch system modules:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  isModuleActive: (slug: string) => {
    const { modules } = get();
    const mod = modules.find(m => m.slug === slug);
    return mod ? mod.isActive : false;
  }
}));
