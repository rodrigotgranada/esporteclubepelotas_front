export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  createdAt: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
  name?: string;
}

