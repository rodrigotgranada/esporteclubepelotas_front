'use client';

import { useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { useMembershipLink } from '@/features/membership/hooks/useMembershipLink';
import { useGlobalSearch } from '@/features/search';

export const usePublicNavigationDrawer = (isOpen: boolean, onClose: () => void) => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const { isLoaded: isModulesLoaded, isModuleActive, fetchModules } = useSystemModulesStore();
  const membershipLink = useMembershipLink();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const drawerSearch = useGlobalSearch(5);
  const { handleClear: clearDrawerSearch } = drawerSearch;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearDrawerSearch();
    } else if (!isModulesLoaded) {
      fetchModules();
    }
  }, [isOpen, isModulesLoaded, fetchModules, clearDrawerSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  const modules = {
    idols: isModulesLoaded ? isModuleActive('idols') : true,
    football: isModulesLoaded ? isModuleActive('football') : true,
    matches: isModulesLoaded ? isModuleActive('matches') : true,
    youth: isModulesLoaded ? isModuleActive('youth') : true,
    female: isModulesLoaded ? isModuleActive('female') : true,
    stadium: isModulesLoaded ? isModuleActive('stadium') : true,
    history: isModulesLoaded ? isModuleActive('history') : true,
    anthem: isModulesLoaded ? isModuleActive('anthem') : true,
    symbols: isModulesLoaded ? isModuleActive('symbols') : true,
    kits: isModulesLoaded ? isModuleActive('kits') : true,
    store: isModulesLoaded ? isModuleActive('store') : true,
    membership: isModulesLoaded ? isModuleActive('membership') : true,
    news: isModulesLoaded ? isModuleActive('news') : true,
    transparency: isModulesLoaded ? isModuleActive('transparency') : true,
  };

  return {
    mounted,
    user,
    settings,
    membershipLink,
    drawerSearch,
    modules,
    handleLogout,
  };
};

