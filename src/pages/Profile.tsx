
import React, { useState } from 'react';
import Header from '@/components/Header';
import ProfileProgress from '@/components/ProfileProgress';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileStats from '@/components/ProfileStats';
import ProfileVehicleInfo from '@/components/ProfileVehicleInfo';
import ProfileAccountInfo from '@/components/ProfileAccountInfo';
import ProfileAchievements from '@/components/ProfileAchievements';
import ProfileSettings from '@/components/ProfileSettings';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 flex items-center justify-center">
        <p className="text-chauffer-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  if (isEditing) {
    return <ProfileEditForm onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Profile" />
      
      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-4xl md:mx-auto">
        <div className="space-y-6">
          {/* Profile Progress */}
          <ProfileProgress />
          
          {/* Profile Header */}
          <ProfileHeader />
          
          {/* Profile Stats */}
          <ProfileStats />
          
          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ProfileVehicleInfo />
              <ProfileAchievements />
            </div>
            <div className="space-y-6">
              <ProfileAccountInfo />
            </div>
          </div>
          
          {/* Profile Settings */}
          <ProfileSettings onEditProfile={() => setIsEditing(true)} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
