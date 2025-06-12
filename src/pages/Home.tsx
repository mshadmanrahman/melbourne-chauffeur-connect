import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Star, Users, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HomeProps {
  onAuthRequired?: () => void;
}

const Home = ({ onAuthRequired }: HomeProps) => {
  const { user } = useAuth();

  // Mock featured jobs for demonstration
  const featuredJobs = [
    {
      id: '1',
      pickup: 'Crown Casino, Melbourne',
      dropoff: 'Melbourne Airport (Terminal 3)',
      time: '2024-06-12T14:30:00',
      payout: 85,
      posterRating: 4.8,
      posterName: 'Michael Chen',
      vehicleType: 'Luxury'
    },
    {
      id: '2',
      pickup: 'Collins Street, CBD',
      dropoff: 'Brighton Beach Hotel',
      time: '2024-06-12T16:45:00',
      payout: 45,
      posterRating: 4.6,
      posterName: 'Sarah Williams'
    }
  ];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewAllJobs = () => {
    // This will be handled by the parent component's navigation
    window.location.hash = '#jobs';
  };

  const handleJobClick = () => {
    if (!user) {
      onAuthRequired?.();
    } else {
      // Navigate to job details - will be implemented later
      console.log('Navigate to job details');
    }
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-chauffer-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-chauffer-black leading-tight">
              Melbourne's Premier
              <br />
              <span className="text-chauffer-mint">Chauffeur Network</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-chauffer-gray-500 max-w-3xl mx-auto leading-relaxed">
              Connect professional chauffeurs with clients who need premium transportation services
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
                  onClick={onAuthRequired}
                >
                  Get Started as Driver
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-chauffer-black text-chauffer-black hover:bg-chauffer-black hover:text-white text-lg px-8 py-4"
                  onClick={onAuthRequired}
                >
                  Post a Job
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
                  onClick={handleViewAllJobs}
                >
                  View Available Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-chauffer-mint/10 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-chauffer-mint/5 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-chauffer-mint/10 rounded-full"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users size={48} className="text-chauffer-mint mb-4" />
              <h3 className="text-3xl font-bold text-chauffer-black mb-2">500+</h3>
              <p className="text-chauffer-gray-500">Active Chauffeurs</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={48} className="text-chauffer-mint mb-4" />
              <h3 className="text-3xl font-bold text-chauffer-black mb-2">98%</h3>
              <p className="text-chauffer-gray-500">Job Success Rate</p>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign size={48} className="text-chauffer-mint mb-4" />
              <h3 className="text-3xl font-bold text-chauffer-black mb-2">$150k+</h3>
              <p className="text-chauffer-gray-500">Paid to Drivers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="py-16 bg-chauffer-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-chauffer-black mb-4">
              Featured Jobs
            </h2>
            <p className="text-xl text-chauffer-gray-500 max-w-2xl mx-auto">
              Premium transportation opportunities available now
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleJobClick}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-chauffer-mint rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {job.posterName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-chauffer-black">{job.posterName}</p>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-chauffer-gray-500">{job.posterRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-chauffer-black">${job.payout}</p>
                      <p className="text-sm text-chauffer-gray-500">after 10% fee</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-3 h-3 bg-chauffer-mint rounded-full"></div>
                        <div className="w-px h-6 bg-chauffer-gray-200"></div>
                        <MapPin size={12} className="text-chauffer-gray-500" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-chauffer-black">{job.pickup}</p>
                        <p className="text-chauffer-gray-500">{job.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-chauffer-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{formatDate(job.time)} • {formatTime(job.time)}</span>
                    </div>
                    {job.vehicleType && (
                      <span className="px-3 py-1 bg-chauffer-gray-100 rounded-full">
                        {job.vehicleType}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleViewAllJobs}
              className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white px-8 py-3"
            >
              View All Available Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-chauffer-black mb-4">
              How ChaufferLink Works
            </h2>
            <p className="text-xl text-chauffer-gray-500 max-w-2xl mx-auto">
              Simple, secure, and professional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-chauffer-black mb-2">Browse Jobs</h3>
              <p className="text-chauffer-gray-500">
                View available transportation requests from verified clients in your area
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-chauffer-black mb-2">Claim & Complete</h3>
              <p className="text-chauffer-gray-500">
                Accept jobs that fit your schedule and provide premium service
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-chauffer-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-chauffer-black mb-2">Get Paid</h3>
              <p className="text-chauffer-gray-500">
                Receive instant payment after job completion through our secure system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-chauffer-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-chauffer-gray-100 mb-8">
            Join Melbourne's most trusted chauffeur network today
          </p>
          
          {!user ? (
            <Button 
              size="lg" 
              className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
              onClick={onAuthRequired}
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white text-lg px-8 py-4 shadow-lg"
              onClick={handleViewAllJobs}
            >
              Start Browsing Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
