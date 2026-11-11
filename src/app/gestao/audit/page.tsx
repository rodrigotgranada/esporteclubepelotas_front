import { Metadata } from 'next';
import { AdminAuditFeature } from '@/features/admin/ui/pages/audit/AdminAuditFeature';

export const metadata: Metadata = {
  title: 'Trilha de Auditoria | Painel Administrativo | E.C. Pelotas',
  description: 'Histórico de eventos, acessos e alterações de dados do sistema.',
};

export default function GestaoAuditPage() {
  return <AdminAuditFeature />;
}

