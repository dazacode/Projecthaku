import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from '../hooks/useSubscription';
import { updateSubscription } from '../lib/subscription';
import { SubscriptionPlan } from '../types/subscription';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { useSession } from 'next-auth/react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Plan {
  name: SubscriptionPlan;
  title: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    name: 'free',
    title: 'Free Plan',
    monthlyPrice: '$0/month',
    annualPrice: 'Free',
    features: [
      '50 messages per month',
      '250 characters per message',
      'Basic music player (one station)',
      'Default backgrounds',
      'Discord community support',
      'Full translation features'
    ]
  },
  {
    name: 'pro',
    title: 'Pro Plan',
    monthlyPrice: '$5/month',
    annualPrice: '$40/year',
    recommended: true,
    features: [
      '10,000 messages per month',
      '70,000 characters per message',
      'Full music player (all stations)',
      'Custom backgrounds',
      'Priority Discord support',
      'All Free plan features'
    ]
  },
  {
    name: 'max',
    title: 'Max Plan',
    monthlyPrice: '$30/month',
    annualPrice: '$240/year',
    features: [
      '20,000 messages per month',
      'Premium AI model access',
      'Early access to new features',
      'Custom music playlists',
      'Gift Pro subscription to two friends',
      'Direct support via email',
      'All Pro features included'
    ]
  }
];

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const { subscription, loading, mutate } = useSubscription();
  const { data: session } = useSession();
  const [updating, setUpdating] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    try {
      setUpdating(true);
      if (session?.user?.email) {
        // Get Supabase user ID from auth.users table
        const { data: { users }, error: userError } = await supabaseAdmin
          .auth.admin.listUsers();

        const userData = users.find(user => user.email === session.user.email);

        if (userError || !userData) {
          console.error('Error getting user ID:', userError);
          return;
        }

        console.log('Found user ID:', userData.id);
        await updateSubscription(userData.id, plan);
        await mutate();
      } else {
        console.error('No user email found in session');
        console.log('Session data:', session);
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setUpdating(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Choose Your Plan</DialogTitle>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={cn("text-sm", !isAnnual && "text-foreground", isAnnual && "text-muted-foreground")}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={cn("text-sm", isAnnual && "text-foreground", !isAnnual && "text-muted-foreground")}>
              Annual <span className="text-primary">(Save 20%)</span>
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-lg p-6 bg-card",
                "border-2 transition-all duration-200",
                plan.recommended ? "border-primary" : "border-border hover:border-primary/50",
                subscription?.plan === plan.name && "ring-2 ring-primary"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary rounded-full text-xs text-primary-foreground">
                  RECOMMENDED
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
              <div className="text-3xl font-bold mb-6">
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {subscription?.plan === plan.name ? (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.recommended ? "default" : "outline"}
                  disabled={updating}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {updating ? "Upgrading..." : "Upgrade"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
