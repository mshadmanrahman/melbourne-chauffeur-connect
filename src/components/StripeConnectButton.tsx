
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
      if (data.onboarding_url) {
        window.open(data.onboarding_url, "_blank");
        // Poll for completion after a delay (emulate user returning)
        setTimeout(onOnboarded, 5000);
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

  return (
    <Button
      variant={onboardingComplete ? "secondary" : "default"}
      onClick={handleConnect}
      disabled={loading}
    >
      {loading && (
        <Loader2 className="animate-spin mr-2" size={16} />
      )}
      {onboardingComplete ? "Stripe Connected" : "Connect with Stripe"}
    </Button>
  );
}
