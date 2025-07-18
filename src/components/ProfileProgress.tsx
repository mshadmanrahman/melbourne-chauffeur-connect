
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-refresh when component mounts to check latest status
  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  // Check if Stripe onboarding is complete (handle both boolean and string values)
  const isStripeComplete = Boolean(stripeAccount?.onboarding_complete) && 
    (stripeAccount?.onboarding_complete === true || String(stripeAccount?.onboarding_complete) === "true");

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
      completed: isStripeComplete,
      description: 'Stripe payment integration'
    }
  ];

  const completedItems = checklistItems.filter(item => item.completed).length;
  const totalItems = checklistItems.length;
  const progressPercentage = (completedItems / totalItems) * 100;
  const isProfileComplete = completedItems === totalItems;

  // Auto-collapse when profile is complete, but allow manual expansion
  useEffect(() => {
    if (isProfileComplete) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [isProfileComplete]);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-chauffer-black">Profile Completeness</h3>
          {isProfileComplete && (
            <CheckCircle size={16} className="text-chauffer-mint" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-chauffer-gray-500">
            {completedItems}/{totalItems} completed
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 h-auto group"
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-chauffer-gray-500 group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown size={16} className="text-chauffer-gray-500 group-hover:text-white transition-colors" />
            )}
          </Button>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="mb-4" />

      {isExpanded && (
        <>
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
          
          <StripeConnectButton
            onboardingComplete={isStripeComplete}
            onOnboarded={refetch}
          />
        </>
      )}

      {!isExpanded && isProfileComplete && (
        <p className="text-sm text-chauffer-gray-600">
          Your profile is complete! Click to view details.
        </p>
      )}
    </Card>
  );
};

export default ProfileProgress;
