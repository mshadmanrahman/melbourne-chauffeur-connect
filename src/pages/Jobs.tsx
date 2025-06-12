
import React, { useState } from 'react';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import JobDetailsModal from '@/components/JobDetailsModal';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface JobsProps {
  onAuthRequired?: () => void;
}

const Jobs = ({ onAuthRequired }: JobsProps) => {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
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
    },
    {
      id: '4',
      pickup: 'Melbourne Central Station',
      dropoff: 'Crown Towers Hotel',
      time: '2024-06-13T08:15:00',
      payout: 55,
      posterRating: 4.7,
      posterName: 'Emma Thompson',
      vehicleType: 'Luxury',
      status: 'available' as const
    },
    {
      id: '5',
      pickup: 'Tullamarine Airport',
      dropoff: 'South Yarra',
      time: '2024-06-13T12:30:00',
      payout: 75,
      posterRating: 4.9,
      posterName: 'James Wilson',
      status: 'available' as const
    }
  ]);

  const handleJobClick = (job: any) => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

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

        {/* Job Stats */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-chauffer-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-chauffer-black">{jobs.filter(j => j.status === 'available').length}</p>
              <p className="text-sm text-chauffer-gray-500">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-chauffer-mint">${jobs.reduce((sum, job) => sum + job.payout, 0)}</p>
              <p className="text-sm text-chauffer-gray-500">Total Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-chauffer-black">{jobs.filter(j => j.vehicleType === 'Luxury').length}</p>
              <p className="text-sm text-chauffer-gray-500">Luxury</p>
            </div>
          </div>
        </div>

        {/* Job Feed */}
        <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-1 md:gap-4 md:space-y-0">
          {jobs.map(job => (
            <div key={job.id} onClick={() => handleJobClick(job)} className="cursor-pointer">
              <JobCard
                {...job}
                onClaim={handleClaimJob}
                onAuthRequired={onAuthRequired}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <Button variant="outline" className="w-full mt-4 md:max-w-xs md:mx-auto md:block">
          Load More Jobs
        </Button>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onClaim={handleClaimJob}
      />
    </div>
  );
};

export default Jobs;
