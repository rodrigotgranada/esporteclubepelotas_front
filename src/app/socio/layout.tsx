import React from 'react';
import { PublicLayout } from '@/features/public/ui/layouts/PublicLayout';

export default function SocioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
