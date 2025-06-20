
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeAccount } from '@/hooks/useStripeAccount';
import StripeConnectButton from './StripeConnectButton';
import { CreditCard, CheckCircle, XCircle, Settings, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PaymentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentSettingsDialog = ({ open, onOpenChange }: PaymentSettingsDialogProps) => {
  const { user } = useAuth();
  const { stripeAccount, loading, refetch } = useStripeAccount(user?.id);
  const [portalLoading, setPortalLoading] = useState(false);

  const isStripeComplete = Boolean(stripeAccount?.onboarding_complete) && 
    (stripeAccount?.onboarding_complete === true || String(stripeAccount?.onboarding_complete) === "true");

  const handleManagePaymentMethods = async () => {
    if (!user) return;
    
    setPortalLoading(true);
    try {
      console.log('Opening Stripe Customer Portal...');
      const { data, error } = await supabase.functions.invoke('stripe-customer-portal');
      
      if (error) {
        console.error('Customer portal error:', error);
        toast({
          title: "Unable to open payment management",
          description: error.message || "Please try again or contact support.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        // Open Stripe Customer Portal in a new tab
        window.open(data.url, '_blank');
        toast({
          title: "Payment management opened",
          description: "Manage your payment methods in the new tab.",
        });
      } else if (data?.error) {
        console.error('Portal error response:', data);
        
        if (data.setupUrl) {
          // Show specific error for Stripe setup required
          toast({
            title: "Stripe Setup Required",
            description: "Please set up your Stripe Customer Portal configuration first.",
            variant: "destructive",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(data.setupUrl, '_blank')}
              >
                Open Stripe Dashboard
              </Button>
            ),
          });
        } else {
          toast({
            title: "Error",
            description: data.message || data.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Unable to generate payment management link.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Customer portal error:', err);
      toast({
        title: "Error opening payment management",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Payment Settings
          </DialogTitle>
          <DialogDescription>
            Manage your payment methods and earnings setup.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Stripe Connection Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Stripe Integration</h3>
              <Badge variant={isStripeComplete ? "default" : "secondary"}>
                {isStripeComplete ? (
                  <CheckCircle size={12} className="mr-1" />
                ) : (
                  <XCircle size={12} className="mr-1" />
                )}
                {isStripeComplete ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {isStripeComplete 
                ? "Your Stripe account is connected and ready to receive payments."
                : "Connect your Stripe account to receive payments for completed jobs."
              }
            </p>
            
            <StripeConnectButton
              onboardingComplete={isStripeComplete}
              onOnboarded={refetch}
            />
          </Card>

          {/* Payment Methods Management */}
          {isStripeComplete && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Payment Methods</h3>
                <Settings size={16} className="text-muted-foreground" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Manage your payment methods, billing information, and view payment history through Stripe's secure portal.
              </p>
              
              <Button 
                onClick={handleManagePaymentMethods}
                disabled={portalLoading}
                className="w-full"
                variant="outline"
              >
                {portalLoading ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </>
                )}
              </Button>
            </Card>
          )}

          {/* Setup Instructions */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-blue-500" />
              <h3 className="font-medium">Setup Instructions</h3>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• First, ensure your Stripe account is properly connected</p>
              <p>• You may need to set up Stripe Customer Portal in your dashboard</p>
              <p>• Visit your Stripe dashboard → Settings → Customer Portal</p>
              <p>• All payment data is handled securely by Stripe</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="mt-3"
              onClick={() => window.open('https://dashboard.stripe.com/settings/billing/portal', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Stripe Dashboard
            </Button>
          </Card>

          {/* Payment Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Payment Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className={isStripeComplete ? "text-green-600" : "text-orange-600"}>
                  {isStripeComplete ? "Active" : "Setup Required"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span>Stripe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payout Schedule:</span>
                <span>Daily</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSettingsDialog;
