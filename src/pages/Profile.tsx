
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, MapPin, Calendar, Award } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+61 4XX XXX XXX',
    rating: 4.8,
    totalJobs: 156,
    joinDate: '2023-03-15',
    location: 'Melbourne, VIC',
    vehicleType: 'BMW 7 Series',
    achievements: ['Top Performer', 'Reliable Driver', '100+ Rides']
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Profile" showNotifications={false} />
      
      <div className="px-4 py-6 pb-20">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-chauffer-black">{user.name}</h2>
              <div className="flex items-center space-x-1 mt-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-medium text-chauffer-black">{user.rating}</span>
                <span className="text-chauffer-gray-500">({user.totalJobs} jobs)</span>
              </div>
              <div className="flex items-center space-x-1 mt-2 text-sm text-chauffer-gray-500">
                <MapPin size={14} />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-semibold text-chauffer-black">{user.totalJobs}</p>
            <p className="text-xs text-chauffer-gray-500">Total Jobs</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-semibold text-chauffer-mint">{user.rating}</p>
            <p className="text-xs text-chauffer-gray-500">Rating</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-semibold text-chauffer-black">2.1</p>
            <p className="text-xs text-chauffer-gray-500">Years</p>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award size={20} className="text-chauffer-mint" />
            <h3 className="font-semibold text-chauffer-black">Achievements</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.achievements.map((achievement, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-chauffer-mint/10 text-chauffer-mint text-sm rounded-full"
              >
                {achievement}
              </span>
            ))}
          </div>
        </Card>

        {/* Vehicle Info */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-chauffer-black mb-3">Vehicle Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">Vehicle</span>
              <span className="text-chauffer-black">{user.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">License</span>
              <span className="text-chauffer-black">Verified ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">Insurance</span>
              <span className="text-chauffer-black">Active ✓</span>
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-chauffer-black mb-3">Account Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">Email</span>
              <span className="text-chauffer-black">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">Phone</span>
              <span className="text-chauffer-black">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chauffer-gray-500">Member Since</span>
              <span className="text-chauffer-black">
                {new Date(user.joinDate).toLocaleDateString('en-AU')}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full">
            Vehicle Settings
          </Button>
          <Button variant="outline" className="w-full">
            Help & Support
          </Button>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
