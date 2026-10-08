import { Metadata } from 'next';
import { AdminLayout } from '@/features/admin/ui/layouts/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin - E.C. Pelotas',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
