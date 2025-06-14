
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function log(msg: string, data?: any) {
  console.log(`[stripe-onboard] ${msg}${data ? ": " + JSON.stringify(data) : ""}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: auth } = await supabase.auth.getUser(token);
    const user = auth?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: corsHeaders,
      });
    }
    const userId = user.id;
    const userEmail = user.email;

    // Check for existing Stripe account
    let { data: existing, error: existingErr } = await supabase
      .from("stripe_accounts")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
    let stripeAccountId: string | undefined = existing?.stripe_account_id;

    if (!stripeAccountId) {
      // Create Stripe Express account (as individual driver)
      const account = await stripe.accounts.create({
        country: "SE",
        type: "express",
        email: userEmail,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
      });
      stripeAccountId = account.id;
      // Save in Supabase
      const { error: upsertErr } = await supabase.from("stripe_accounts").upsert({
        id: userId,
        stripe_account_id: stripeAccountId,
        onboarding_complete: false,
        updated_at: new Date().toISOString(),
      });
      if (upsertErr) log("Upsert error", upsertErr);
      log("Created Stripe Connect Express account", { stripeAccountId });
    } else {
      log("Stripe account exists", { stripeAccountId });
    }

    // Always create an onboarding link (regardless of status—for Stripe testing)
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const onboardingLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/profile`,
      return_url: `${origin}/profile`,
      type: "account_onboarding",
    });

    // Fetch account status and update onboarding_complete
    const account = await stripe.accounts.retrieve(stripeAccountId);
    const onboardingComplete =
      (Array.isArray(account.requirements?.currently_due) &&
        account.requirements.currently_due.length === 0)
        ? true
        : false;

    // Save onboarding status in Supabase if changed
    if (existing?.onboarding_complete !== onboardingComplete) {
      const { error: onboardUpdErr } = await supabase.from("stripe_accounts").update({
        onboarding_complete: onboardingComplete,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);
      if (onboardUpdErr) log("Onboarding update error", onboardUpdErr);
    }

    return new Response(JSON.stringify({
      stripe_account_id: stripeAccountId,
      onboarding_complete: onboardingComplete,
      onboarding_url: onboardingLink.url,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    log("ERROR", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
