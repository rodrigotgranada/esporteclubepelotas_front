import { Metadata } from 'next';
import { AdminSymbolsFeature } from '@/features/admin/ui/pages/symbols/AdminSymbolsFeature';

export const metadata: Metadata = {
  title: 'Símbolos & Mascote | Painel Administrativo',
  description: 'Gestão do mascote oficial, acervo de escudos históricos, pavilhão e cores do Esporte Clube Pelotas.',
};

export default function GestaoSimbolosPage() {
  return <AdminSymbolsFeature />;
}
