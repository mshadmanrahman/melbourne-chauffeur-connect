
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
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-chauffer-gray-500">Vehicle</span>
          <span className="text-chauffer-black">{profile.vehicle_details || 'Not specified'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-chauffer-gray-500">License</span>
          <span className="text-chauffer-black">{profile.license_number || 'Not verified'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-chauffer-gray-500">Insurance</span>
          <span className="text-chauffer-black">Not verified</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileVehicleInfo;
