import { create } from 'zustand';
import { api } from '@/services/api';

export interface SystemModuleData {
  id?: string;
  _id?: string;
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
      const response = await api.get('/system-modules');
      const list = Array.isArray(response.data) ? response.data : [];
      set({ modules: list, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch system modules:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  isModuleActive: (slug: string) => {
    const { modules, isLoaded } = get();
    // Se ainda não carregou, por padrão assume ativo para não quebrar primeira renderização
    if (!isLoaded || modules.length === 0) return true;
    const mod = modules.find((m) => m.slug === slug);
    if (!mod) return true;
    const active = mod.isActive ?? (mod as any).active;
    return active !== undefined ? Boolean(active) : true;
  },
}));
