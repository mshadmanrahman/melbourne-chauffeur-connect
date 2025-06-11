
import React, { useState } from 'react';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Jobs = () => {
  // Mock data for demonstration
  const [jobs] = useState([
    {
      id: '1',
      pickup: 'Crown Casino, Melbourne',
      dropoff: 'Melbourne Airport (Terminal 3)',
      time: '2024-06-12T14:30:00',
      payout: 85,
      posterRating: 4.8,
      posterName: 'Michael Chen',
      vehicleType: 'Luxury',
      status: 'available' as const
    },
    {
      id: '2',
      pickup: 'Collins Street, CBD',
      dropoff: 'Brighton Beach Hotel',
      time: '2024-06-12T16:45:00',
      payout: 45,
      posterRating: 4.6,
      posterName: 'Sarah Williams',
      status: 'available' as const
    },
    {
      id: '3',
      pickup: 'St Kilda Junction',
      dropoff: 'Docklands Stadium',
      time: '2024-06-12T19:00:00',
      payout: 35,
      posterRating: 4.9,
      posterName: 'David Rodriguez',
      vehicleType: 'Standard',
      status: 'claimed' as const
    }
  ]);

  const handleClaimJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      toast({
        title: "Job Claimed!",
        description: `You've successfully claimed the job from ${job.pickup}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Available Jobs" />
      
      <div className="px-4 md:px-8 py-4 pb-20 md:pb-8 max-w-4xl md:mx-auto">
        {/* Filters */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          <Button variant="outline" size="sm" className="whitespace-nowrap border-chauffer-mint text-chauffer-mint">
            All Jobs
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Today
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            High Pay
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Luxury
          </Button>
        </div>

        {/* Job Feed */}
        <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-1 md:gap-4 md:space-y-0">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              {...job}
              onClaim={handleClaimJob}
            />
          ))}
        </div>

        {/* Load More */}
        <Button variant="outline" className="w-full mt-4 md:max-w-xs md:mx-auto md:block">
          Load More Jobs
        </Button>
      </div>
    </div>
  );
};

export default Jobs;
