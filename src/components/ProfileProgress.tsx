
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';
import StripeConnectButton from './StripeConnectButton';
import { useAuth } from "@/contexts/AuthContext";
import { useStripeAccount } from "@/hooks/useStripeAccount";

interface ProfileProgressProps {
  profile: any;
  hasStripeConnected: boolean;
}

const ProfileProgress = ({ profile, hasStripeConnected: _ }: ProfileProgressProps) => {
  const { user } = useAuth();
  const { stripeAccount, loading, refetch } = useStripeAccount(user?.id);

  // Add debugging logs
  useEffect(() => {
    console.log('ProfileProgress - stripeAccount:', stripeAccount);
    console.log('ProfileProgress - loading:', loading);
    console.log('ProfileProgress - onboarding_complete:', stripeAccount?.onboarding_complete);
  }, [stripeAccount, loading]);

  // Auto-refresh when component mounts to check latest status
  useEffect(() => {
    if (user?.id) {
      console.log('ProfileProgress - Auto-refreshing Stripe account status');
      refetch();
    }
  }, [user?.id, refetch]);

  const checklistItems = [
    {
      id: 'basic_info',
      label: 'Basic Information',
      completed: !!(profile?.first_name && profile?.last_name),
      description: 'First and last name'
    },
    {
      id: 'contact',
      label: 'Contact Details',
      completed: !!profile?.phone,
      description: 'Phone number'
    },
    {
      id: 'license',
      label: 'License Information',
      completed: !!profile?.license_number,
      description: 'Valid license number'
    },
    {
      id: 'vehicle',
      label: 'Vehicle Details',
      completed: !!profile?.vehicle_details,
      description: 'Vehicle information'
    },
    {
      id: 'stripe',
      label: 'Payment Setup',
      completed: !!stripeAccount?.onboarding_complete,
      description: 'Stripe payment integration'
    }
  ];

  const completedItems = checklistItems.filter(item => item.completed).length;
  const totalItems = checklistItems.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-chauffer-black">Profile Completeness</h3>
        <span className="text-sm text-chauffer-gray-500">
          {completedItems}/{totalItems} completed
        </span>
      </div>
      
      <Progress value={progressPercentage} className="mb-4" />

      <div className="space-y-3 mb-4">
        {checklistItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            {item.completed ? (
              <CheckCircle size={16} className="text-chauffer-mint" />
            ) : (
              <Circle size={16} className="text-chauffer-gray-400" />
            )}
            <div className="flex-1">
              <span className={`text-sm font-medium ${
                item.completed ? 'text-chauffer-black' : 'text-chauffer-gray-500'
              }`}>
                {item.label}
              </span>
              <p className="text-xs text-chauffer-gray-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p>Debug: Stripe Account ID: {stripeAccount?.stripe_account_id || 'None'}</p>
        <p>Debug: Onboarding Complete: {stripeAccount?.onboarding_complete ? 'Yes' : 'No'}</p>
        <p>Debug: Loading: {loading ? 'Yes' : 'No'}</p>
      </div>
      
      <StripeConnectButton
        onboardingComplete={!!stripeAccount?.onboarding_complete}
        onOnboarded={refetch}
      />
    </Card>
  );
};

export default ProfileProgress;
