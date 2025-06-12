
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Edit, LogOut } from 'lucide-react';

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

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
  onSignOut: () => void;
}

const ProfileHeader = ({ profile, onEdit, onSignOut }: ProfileHeaderProps) => {
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-chauffer-mint rounded-full flex items-center justify-center">
          <span className="text-white text-xl md:text-2xl font-semibold">
            {initials}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold text-chauffer-black">{fullName}</h2>
          <div className="flex items-center space-x-1 mt-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-medium text-chauffer-black">New Driver</span>
            <span className="text-chauffer-gray-500">(0 jobs)</span>
          </div>
          <div className="flex items-center space-x-1 mt-2 text-sm text-chauffer-gray-500">
            <MapPin size={14} />
            <span>Australia</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
