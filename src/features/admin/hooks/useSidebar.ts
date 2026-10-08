import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { startTransition } from 'react';
import { Home, Users, Settings, Layers, Shield } from 'lucide-react';
import { SIDEBAR_TEXTS } from '../ui/components/Sidebar.constants';

export const useSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  const navItems = [
    { label: SIDEBAR_TEXTS.NAV.DASHBOARD, href: '/gestao', icon: Home },
    { label: SIDEBAR_TEXTS.NAV.USERS, href: '/gestao/users', icon: Users },
    { label: SIDEBAR_TEXTS.NAV.SETTINGS, href: '/gestao/settings', icon: Settings },
  ];

  if ((user?.role?.name || user?.role) === 'OWNER') {
    navItems.splice(2, 0, { label: SIDEBAR_TEXTS.NAV.MODULES, href: '/gestao/modules', icon: Layers });
    navItems.splice(3, 0, { label: SIDEBAR_TEXTS.NAV.ROLES, href: '/gestao/roles', icon: Shield });
  }

  const checkIsActive = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return href === '/gestao' ? pathname === '/gestao' : isActive;
  };

  return {
    navItems,
    handleLogout,
    checkIsActive,
  };
};
