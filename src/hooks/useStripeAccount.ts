
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useStripeAccount(userId?: string) {
  const [stripeAccount, setStripeAccount] = useState<{
    stripe_account_id?: string;
    onboarding_complete?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(userId ? true : false);

  const fetchStripeAccount = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("stripe_accounts")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      setStripeAccount(null);
    } else {
      setStripeAccount(data || null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchStripeAccount();
  }, [fetchStripeAccount]);

  return { stripeAccount, loading, refetch: fetchStripeAccount };
}
