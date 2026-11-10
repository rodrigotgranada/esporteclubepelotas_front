import { Metadata } from 'next';
import { AdminOpponentsFeature } from '@/features/opponents';

export const metadata: Metadata = {
  title: 'Clubes Adversários | Painel Administrativo',
  description: 'Gestão de catálogo oficial de clubes adversários, escudos, cidades e estádios sede.',
};

export default function GestaoClubesPage() {
  return <AdminOpponentsFeature />;
}

