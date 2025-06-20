
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import VehicleSettingsDialog from './VehicleSettingsDialog';
import PaymentSettingsDialog from './PaymentSettingsDialog';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  license_number: string | null;
  vehicle_details: string | null;
  experience: string | null;
  created_at: string;
}

interface ProfileSettingsProps {
  onEditProfile: () => void;
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfileSettings = ({ onEditProfile, profile, onProfileUpdate }: ProfileSettingsProps) => {
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setPaymentDialogOpen(true)}
        >
          Payment Settings
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setVehicleDialogOpen(true)}
        >
          Vehicle Settings
        </Button>
        <Button variant="outline" className="w-full">
          Help & Support
        </Button>
      </div>

      <VehicleSettingsDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        profile={profile}
        onProfileUpdate={onProfileUpdate}
      />

      <PaymentSettingsDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
      />
    </>
  );
};

export default ProfileSettings;
