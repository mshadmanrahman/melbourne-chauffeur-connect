
import React from 'react';
import { Button } from '@/components/ui/button';
import JobCard from './JobCard';
import { useAuth } from '@/contexts/AuthContext';

interface FeaturedJobsSectionProps {
  onAuthRequired?: () => void;
  onViewAllJobs: () => void;
}

const FeaturedJobsSection = ({ onAuthRequired, onViewAllJobs }: FeaturedJobsSectionProps) => {
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

  const handleJobClick = () => {
    if (!user) {
      onAuthRequired?.();
    } else {
      // Navigate to job details - will be implemented later
      console.log('Navigate to job details');
    }
  };

  return (
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
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={handleJobClick}
            />
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onViewAllJobs}
            className="bg-chauffer-mint hover:bg-chauffer-mint/90 text-white px-8 py-3"
          >
            View All Available Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobsSection;
