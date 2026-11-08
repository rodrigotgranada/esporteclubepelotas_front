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
