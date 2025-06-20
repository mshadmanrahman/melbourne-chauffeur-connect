
import React from 'react';
import { Card } from '@/components/ui/card';

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

interface ProfileVehicleInfoProps {
  profile: UserProfile;
}

const ProfileVehicleInfo = ({ profile }: ProfileVehicleInfoProps) => {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-chauffer-black mb-3">Vehicle Information</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-chauffer-gray-500 text-sm">Vehicle</span>
          <div className="text-chauffer-black font-medium">{profile.vehicle_details || 'Not specified'}</div>
        </div>
        <div className="space-y-1">
          <span className="text-chauffer-gray-500 text-sm">License</span>
          <div className="text-chauffer-black font-medium">{profile.license_number || 'Not verified'}</div>
        </div>
        <div className="space-y-1">
          <span className="text-chauffer-gray-500 text-sm">Insurance</span>
          <div className="text-chauffer-black font-medium">Not verified</div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileVehicleInfo;
