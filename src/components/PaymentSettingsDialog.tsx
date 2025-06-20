
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeAccount } from '@/hooks/useStripeAccount';
import StripeConnectButton from './StripeConnectButton';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface PaymentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentSettingsDialog = ({ open, onOpenChange }: PaymentSettingsDialogProps) => {
  const { user } = useAuth();
  const { stripeAccount, loading, refetch } = useStripeAccount(user?.id);

  const isStripeComplete = Boolean(stripeAccount?.onboarding_complete) && 
    (stripeAccount?.onboarding_complete === true || String(stripeAccount?.onboarding_complete) === "true");

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

          {/* Additional Settings */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Additional Settings</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Payments are processed through Stripe Connect</p>
              <p>• Earnings are automatically transferred to your bank account</p>
              <p>• Transaction fees may apply as per Stripe's pricing</p>
              <p>• You can view detailed payment history in your Stripe dashboard</p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSettingsDialog;
