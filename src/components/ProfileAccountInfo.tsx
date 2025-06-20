
import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from '@supabase/supabase-js';

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

interface ProfileAccountInfoProps {
  profile: UserProfile;
  user: User;
}

const ProfileAccountInfo = ({ profile, user }: ProfileAccountInfoProps) => {
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-AU');

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-chauffer-black mb-3">Account Information</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-chauffer-gray-500 text-sm">Email</span>
          <div className="text-chauffer-black font-medium break-all">{user?.email}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-chauffer-gray-500 text-sm">Phone</span>
            <div className="text-chauffer-black font-medium">{profile.phone || 'Not specified'}</div>
          </div>
          <div className="space-y-1">
            <span className="text-chauffer-gray-500 text-sm">Member Since</span>
            <div className="text-chauffer-black font-medium">{memberSince}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileAccountInfo;
