
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

    // Create customer portal session with configuration
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    try {
      // Try to create the session with default configuration
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/profile`,
      });

      log("Customer portal session created", { sessionUrl: session.url });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (portalError: any) {
      log("Portal creation failed, trying with configuration", portalError);
      
      if (portalError.code === 'billing_portal_configuration_not_ready') {
        // Create a basic configuration first
        try {
          const configuration = await stripe.billingPortal.configurations.create({
            business_profile: {
              headline: 'Manage your billing information',
            },
            features: {
              payment_method_update: { enabled: true },
              invoice_history: { enabled: true },
            },
          });
          
          log("Created billing portal configuration", { configId: configuration.id });
          
          // Now create the session with the new configuration
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            configuration: configuration.id,
            return_url: `${origin}/profile`,
          });

          log("Customer portal session created with config", { sessionUrl: session.url });

          return new Response(JSON.stringify({ url: session.url }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        } catch (configError) {
          log("Configuration creation failed", configError);
          return new Response(JSON.stringify({ 
            error: "Unable to set up payment management. Please contact support.",
            details: "Stripe billing portal configuration failed"
          }), {
            status: 500,
            headers: corsHeaders,
          });
        }
      } else {
        // Handle other portal errors
        return new Response(JSON.stringify({ 
          error: "Unable to open payment management portal",
          details: portalError.message || "Unknown error"
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }
  } catch (err) {
    log("ERROR", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
