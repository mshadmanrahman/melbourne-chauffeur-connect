
import React from 'react';
import { Card } from '@/components/ui/card';

const ProfileStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 text-center">
        <p className="text-xl md:text-2xl font-semibold text-chauffer-black">0</p>
        <p className="text-xs text-chauffer-gray-500">Total Jobs</p>
      </Card>
      <Card className="p-4 text-center">
        <p className="text-xl md:text-2xl font-semibold text-chauffer-mint">New</p>
        <p className="text-xs text-chauffer-gray-500">Rating</p>
      </Card>
      <Card className="p-4 text-center">
        <p className="text-xl md:text-2xl font-semibold text-chauffer-black">0</p>
        <p className="text-xs text-chauffer-gray-500">Days</p>
      </Card>
    </div>
  );
};

export default ProfileStats;
