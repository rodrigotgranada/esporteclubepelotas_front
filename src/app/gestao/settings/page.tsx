import { Metadata } from 'next';
import { SettingsFeature } from '@/features/admin/ui/pages/settings/SettingsFeature';

export const metadata: Metadata = {
  title: 'Configurações - E.C. Pelotas',
};

export default function SettingsPage() {
  return <SettingsFeature />;
}
