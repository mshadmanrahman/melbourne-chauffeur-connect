
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function log(msg: string, data?: any) {
  console.log(`[stripe-customer-portal] ${msg}${data ? ": " + JSON.stringify(data) : ""}`);
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

    const userEmail = user.email;
    if (!userEmail) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    log("Creating customer portal session for user", { userEmail });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
    
    // Find existing customer or create a new one
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    
    let customerId: string;
    
    if (customers.data.length === 0) {
      // Create a new customer if none exists
      log("Creating new Stripe customer", { userEmail });
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        name: user.user_metadata?.full_name || `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim() || undefined,
      });
      customerId = newCustomer.id;
      log("New customer created", { customerId });
    } else {
      customerId = customers.data[0].id;
      log("Found existing customer", { customerId });
    }

    // Create customer portal session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profile`,
    });

    log("Customer portal session created", { sessionUrl: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
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
