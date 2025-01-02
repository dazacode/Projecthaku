import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types/subscription';
import { getUserSubscription, createFreeSubscription } from '../lib/subscription';
import { useSession } from 'next-auth/react';

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  async function loadSubscription() {
    try {
      if (session?.user?.email) {
        // Get user data directly from the session
        const userId = session.user.id;
        
        if (userId) {
          let userSub = await getUserSubscription(userId);
          
          // If no subscription exists, create a free one
          if (!userSub) {
            await createFreeSubscription(userId);
            userSub = await getUserSubscription(userId);
          }
          
          setSubscription(userSub);
        }
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscription();
  }, [session]);

  const mutate = () => {
    return loadSubscription();
  };

  return { subscription, loading, mutate };
}
