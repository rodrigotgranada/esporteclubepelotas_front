export type BillingPeriod = 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  billingPeriod: BillingPeriod;
  advantages: string[];
  badgeText?: string | null;
  highlighted: boolean;
  displayOrder: number;
  whatsappOverride?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMembershipPlanInput {
  name: string;
  slug?: string;
  description?: string;
  price: number;
  billingPeriod: BillingPeriod;
  advantages: string[];
  badgeText?: string;
  highlighted?: boolean;
  displayOrder?: number;
  whatsappOverride?: string;
  active?: boolean;
}

export type UpdateMembershipPlanInput = Partial<CreateMembershipPlanInput>;

export type MembershipLeadStatus = 'NOVO' | 'CONTATADO' | 'CONVERTIDO' | 'CANCELADO';

export interface MembershipLead {
  id: string;
  planId: string;
  planName?: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  cpf?: string | null;
  status: MembershipLeadStatus;
  notes?: string | null;
  createdAt: string;
}

export interface CreateMembershipLeadInput {
  planId: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  notes?: string;
}

export interface UpdateMembershipLeadStatusInput {
  status: MembershipLeadStatus;
  notes?: string;
}

// --- Sincronização ElevenTickets & Base de Sócios ---

export interface EleventicketsImportSummary {
  totalRows: number;
  usersUpdated: number;
  usersActivated: number;
  usersDeactivated: number;
  cacheInserted: number;
  manualOverridesPreserved: number;
  errorsCount: number;
  errorMessages: string[];
}

export interface EleventicketsSummary {
  totalActiveMembers: number;
  totalInactiveMembers: number;
  totalManualOverrides: number;
  totalCachePending: number;
  lastImportedAt: string | null;
}

export interface EleventicketsMember {
  userId: string;
  name: string;
  email: string;
  cpf: string;
  avatarUrl?: string;
  roleName: string;
  eleventicketsId: string;
  isSocio: boolean;
  planName: string;
  status: string;
  syncMode: 'AUTO' | 'MANUAL_OVERRIDE';
  overrideReason?: string;
  overrideAt?: string;
  socioSince?: string;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface ManualSocioOverridePayload {
  isSocio: boolean;
  status: string;
  reason: string;
}
