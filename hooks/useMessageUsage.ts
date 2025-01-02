import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSubscription } from './useSubscription';
import { useAdmin } from './useAdmin';

export interface MessageUsage {
  count: number;
  limit: number;
  percentage: number;
}

export function useMessageUsage() {
  const { data: session } = useSession();
  const { subscription } = useSubscription();
  const { isAdminEnabled } = useAdmin();
  const [usage, setUsage] = useState<MessageUsage>({ count: 0, limit: 50, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const fetchMessageCount = async () => {
    if (!session?.user?.email) return;

    // If admin mode is enabled, set unlimited usage
    if (isAdminEnabled) {
      setUsage({
        count: 0,
        limit: 10000,
        percentage: 0
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch message count');
      }
      const data = await response.json();

      const limit = subscription?.plan === 'free' ? 50 
        : subscription?.plan === 'pro' ? 10000 
        : subscription?.plan === 'max' ? 20000 
        : 50;

      setUsage({
        count: data.count,
        limit,
        percentage: (data.count / limit) * 100
      });
    } catch (error) {
      console.error('Error fetching message count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch count when session, subscription, or admin mode changes
  useEffect(() => {
    if (session?.user?.email) {
      fetchMessageCount();
    }
  }, [session?.user?.email, subscription?.plan, isAdminEnabled]);

  const incrementCount = async () => {
    if (!session?.user?.email) return;
    
    // Skip incrementing count in admin mode
    if (isAdminEnabled) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to increment message count');
      }

      const data = await response.json();
      setUsage(prev => ({
        ...prev,
        count: data.count,
        percentage: (data.count / prev.limit) * 100
      }));

      return data.count;
    } catch (error) {
      console.error('Error incrementing message count:', error);
      throw error;
    }
  };

  const hasReachedLimit = !isAdminEnabled && usage.count >= usage.limit;
  const remainingMessages = usage.limit - usage.count;

  return {
    usage,
    loading,
    incrementCount,
    remainingMessages,
    hasReachedLimit,
    refreshCount: fetchMessageCount
  };
}
