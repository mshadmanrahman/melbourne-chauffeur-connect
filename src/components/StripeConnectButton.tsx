
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";

export default function StripeConnectButton({
  onboardingComplete,
  onOnboarded,
}: {
  onboardingComplete: boolean;
  onOnboarded: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-onboard");
      if (error || !data) {
        console.error(error || "No data");
        toast({
          title: "Stripe error",
          description: error?.message || "Failed to connect to Stripe.",
        });
        return;
      }
      
      console.log('Stripe onboard response:', data);
      
      if (data.onboarding_url) {
        // Open in same tab instead of new tab for better redirect handling
        window.location.href = data.onboarding_url;
      } else if (data.onboarding_complete) {
        // Already complete, just refresh the status
        toast({
          title: "Stripe Connected",
          description: "Your Stripe account is already set up!",
        });
        onOnboarded();
      } else {
        toast({
          title: "Stripe error",
          description: "Could not generate onboarding link.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Stripe Error", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Call the stripe-onboard function to refresh status
      const { data, error } = await supabase.functions.invoke("stripe-onboard");
      if (error) {
        console.error('Refresh error:', error);
        toast({
          title: "Refresh failed",
          description: error.message,
        });
      } else {
        console.log('Refresh response:', data);
        onOnboarded();
        if (data.onboarding_complete) {
          toast({
            title: "Status updated",
            description: "Your Stripe connection is verified!",
          });
        }
      }
    } catch (err) {
      console.error('Refresh error:', err);
      toast({ title: "Refresh Error", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  if (onboardingComplete) {
    return (
      <div className="flex gap-2">
        <Button variant="secondary" disabled>
          Stripe Connected ✓
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <RefreshCw size={16} />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading && (
          <Loader2 className="animate-spin mr-2" size={16} />
        )}
        Connect with Stripe
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={loading}
        title="Refresh Stripe status"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <RefreshCw size={16} />
        )}
      </Button>
    </div>
  );
}
