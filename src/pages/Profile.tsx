
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProfileEditForm from '@/components/ProfileEditForm';
import ProfileProgress from '@/components/ProfileProgress';
import MyJobsSection from '@/components/MyJobsSection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Calendar, Award, Edit, LogOut } from 'lucide-react';
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

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-AU');

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
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Stats */}
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

                {/* Vehicle Info */}
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

                {/* Account Info */}
                <Card className="p-6">
                  <h3 className="font-semibold text-chauffer-black mb-3">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-chauffer-gray-500">Email</span>
                      <span className="text-chauffer-black">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chauffer-gray-500">Phone</span>
                      <span className="text-chauffer-black">{profile.phone || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-chauffer-gray-500">Member Since</span>
                      <span className="text-chauffer-black">{memberSince}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="jobs">
                <MyJobsSection />
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
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
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Achievements */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
