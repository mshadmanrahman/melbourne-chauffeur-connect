
import React from 'react';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

const ProfileAchievements = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Award size={20} className="text-chauffer-mint" />
        <h3 className="font-semibold text-chauffer-black">Status</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-chauffer-mint/10 text-chauffer-mint text-sm rounded-full">
          New Member
        </span>
        <span className="px-3 py-1 bg-chauffer-mint/10 text-chauffer-mint text-sm rounded-full">
          Account Verified
        </span>
      </div>
    </Card>
  );
};

export default ProfileAchievements;
