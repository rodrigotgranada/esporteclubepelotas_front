export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  unsubscribeReason?: string | null;
  unsubscribedAt?: string | null;
  createdAt: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
  name?: string;
}
