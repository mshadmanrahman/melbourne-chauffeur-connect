
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileSettingsProps {
  onEditProfile: () => void;
}

const ProfileSettings = ({ onEditProfile }: ProfileSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onEditProfile}
      >
        Edit Profile
      </Button>
      <Button variant="outline" className="w-full">
        Payment Settings
      </Button>
      <Button variant="outline" className="w-full">
        Vehicle Settings
      </Button>
      <Button variant="outline" className="w-full">
        Help & Support
      </Button>
    </div>
  );
};

export default ProfileSettings;
