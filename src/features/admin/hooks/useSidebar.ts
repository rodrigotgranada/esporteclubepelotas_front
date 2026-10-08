import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { startTransition, useEffect } from 'react';
import { Home, Users, Settings, Layers, Shield } from 'lucide-react';
import { SIDEBAR_TEXTS } from '../ui/components/Sidebar.constants';

export const useSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { isLoaded, fetchModules, isModuleActive } = useSystemModulesStore();
  const router = useRouter();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleLogout = () => {
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  const navItems = [
    { label: SIDEBAR_TEXTS.NAV.DASHBOARD, href: '/gestao', icon: Home, show: true },
    { label: SIDEBAR_TEXTS.NAV.USERS, href: '/gestao/users', icon: Users, show: isLoaded ? isModuleActive('users') : true },
    { label: SIDEBAR_TEXTS.NAV.SETTINGS, href: '/gestao/settings', icon: Settings, show: true },
  ];

  if ((user?.role?.name || user?.role) === 'OWNER') {
    navItems.splice(2, 0, { label: SIDEBAR_TEXTS.NAV.MODULES, href: '/gestao/modules', icon: Layers, show: true });
    navItems.splice(3, 0, { label: SIDEBAR_TEXTS.NAV.ROLES, href: '/gestao/roles', icon: Shield, show: true });
  }

  const checkIsActive = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return href === '/gestao' ? pathname === '/gestao' : isActive;
  };

  return {
    navItems: navItems.filter(item => item.show),
    handleLogout,
    checkIsActive,
  };
};
