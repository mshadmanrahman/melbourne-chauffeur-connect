
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProfileEditForm from '@/components/ProfileEditForm';
import ProfileProgress from '@/components/ProfileProgress';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileStats from '@/components/ProfileStats';
import ProfileVehicleInfo from '@/components/ProfileVehicleInfo';
import ProfileAccountInfo from '@/components/ProfileAccountInfo';
import ProfileAchievements from '@/components/ProfileAchievements';
import ProfileSettings from '@/components/ProfileSettings';
import MyJobsSection from '@/components/MyJobsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasStripeConnected, setHasStripeConnected] = useState(false);

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
          description: "Could not load your profile information.",
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
        description: "There was a problem signing you out.",
      });
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50">
        <Header title="Profile" showNotifications={false} />
        <div className="flex items-center justify-center h-64">
          <div className="text-chauffer-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50">
        <Header title="Profile" showNotifications={false} />
        <div className="flex items-center justify-center h-64">
          <div className="text-chauffer-gray-500">Profile not found</div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50">
        <Header title="Edit Profile" showNotifications={false} />
        <div className="px-4 md:px-8 py-6 pb-20 md:pb-8">
          <ProfileEditForm
            profile={profile}
            onSave={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Profile" showNotifications={false} />
      
      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-6xl md:mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Progress */}
            <ProfileProgress profile={profile} hasStripeConnected={hasStripeConnected} />

            {/* Profile Header */}
            <ProfileHeader 
              profile={profile}
              onEdit={() => setIsEditing(true)}
              onSignOut={handleSignOut}
            />

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <ProfileStats />
                <ProfileVehicleInfo profile={profile} />
                <ProfileAccountInfo profile={profile} user={user!} />
              </TabsContent>
              
              <TabsContent value="jobs">
                <MyJobsSection />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <ProfileSettings onEditProfile={() => setIsEditing(true)} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileAchievements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
