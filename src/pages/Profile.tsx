
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

const Profile = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data.",
        });
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 flex items-center justify-center">
        <p className="text-chauffer-gray-500">Please log in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 flex items-center justify-center">
        <p className="text-chauffer-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 flex items-center justify-center">
        <p className="text-chauffer-gray-500">Profile not found</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 px-4 py-6">
        <ProfileEditForm 
          profile={profile}
          onSave={handleProfileUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Profile" />
      
      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-4xl md:mx-auto">
        <div className="space-y-6">
          {/* Profile Progress */}
          <ProfileProgress 
            profile={profile}
            hasStripeConnected={false}
          />
          
          {/* Profile Header */}
          <ProfileHeader 
            profile={profile}
            onEdit={() => setIsEditing(true)}
            onSignOut={handleSignOut}
          />
          
          {/* Profile Stats */}
          <ProfileStats />
          
          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ProfileVehicleInfo profile={profile} />
              <ProfileAchievements />
            </div>
            <div className="space-y-6">
              <ProfileAccountInfo profile={profile} user={user} />
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
