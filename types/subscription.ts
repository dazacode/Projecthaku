export type SubscriptionPlan = 'free' | 'pro' | 'max' | 'non-google';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  billing_interval?: 'monthly' | 'annual';
}

export interface PlanFeatures {
  messages_per_month: number;
  character_limit: number;
  music_player: 'none' | 'limited' | 'full' | 'premium';
  translation_features: 'basic' | 'full';
  backgrounds: 'none' | 'default' | 'custom';
  additional_features?: string[];
}

export interface SubscriptionFeatures {
  'non-google': PlanFeatures;
  free: PlanFeatures;
  pro: PlanFeatures;
  max: PlanFeatures;
}
