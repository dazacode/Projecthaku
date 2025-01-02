import { supabase, supabaseAdmin } from './supabase';
import { SubscriptionPlan, UserSubscription, SubscriptionFeatures } from '../types/subscription';

export const subscriptionFeatures: SubscriptionFeatures = {
  'non-google': {
    messages_per_month: 5,
    character_limit: 50,
    music_player: 'none',
    translation_features: 'basic',
    backgrounds: 'none',
    additional_features: ['Simple English-to-Japanese translation only']
  },
  free: {
    messages_per_month: 50,
    character_limit: 250,
    music_player: 'limited',
    translation_features: 'full',
    backgrounds: 'default',
    additional_features: [
      'Full translation features',
      'Basic music player (one station)',
      'Default backgrounds',
      'Discord community support'
    ]
  },
  pro: {
    messages_per_month: 10000,
    character_limit: 70000,
    music_player: 'full',
    translation_features: 'full',
    backgrounds: 'custom',
    additional_features: [
      'Full music player (all stations)',
      'Custom backgrounds',
      'Priority Discord support',
      'All Free plan features'
    ]
  },
  max: {
    messages_per_month: 20000,
    character_limit: 70000,
    music_player: 'premium',
    translation_features: 'full',
    backgrounds: 'custom',
    additional_features: [
      'Premium AI model access',
      'Early access to new features',
      'Custom music playlists',
      'Gift Pro subscription to two friends',
      'Direct support via email',
      'All Pro features'
    ]
  }
};

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  console.log('Getting subscription for user:', userId);
  // Get the most recent subscription for the user
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function createFreeSubscription(userId: string): Promise<void> {
  console.log('Creating free subscription for user:', userId);
  
  // First check if subscription exists
  const { data: existingSub } = await supabase
    .from('user_subscriptions')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!existingSub) {
    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan: 'free' as SubscriptionPlan,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
}

export async function updateSubscription(
  userId: string,
  plan: SubscriptionPlan
): Promise<void> {
  console.log('Starting subscription update for user:', userId, 'to plan:', plan);
  
  // Get the most recent subscription
  const { data: existingSub } = await supabaseAdmin
    .from('user_subscriptions')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingSub) {
    // Update the existing subscription
    const { error: updateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({
        plan,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSub.id); // Use the specific subscription ID

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }
  } else {
    // Create new subscription if none exists
    const { error: insertError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      throw insertError;
    }
  }

  console.log('Subscription update completed successfully');
}

export function getFeatures(plan: SubscriptionPlan) {
  return subscriptionFeatures[plan];
}
