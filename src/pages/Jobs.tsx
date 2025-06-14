
import React, { useState } from 'react';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import JobDetailsModal from '@/components/JobDetailsModal';
import MyJobsSection from '@/components/MyJobsSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface JobsProps {
  onAuthRequired?: () => void;
}

const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Dummy data for demonstration
const dummyJobs = [
  {
    id: 'dummy-1',
    pickup: 'Crown Casino, Melbourne VIC 3006',
    dropoff: 'Melbourne Airport Terminal 1, Tullamarine VIC 3045',
    time: '2024-06-15T14:30:00',
    payout: 95,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-1'
  },
  {
    id: 'dummy-2',
    pickup: 'Collins Street, Melbourne CBD',
    dropoff: 'Brighton Beach Hotel, Brighton VIC',
    time: '2024-06-15T16:45:00',
    payout: 45,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-2'
  },
  {
    id: 'dummy-3',
    pickup: 'Flinders Street Station, Melbourne VIC',
    dropoff: 'St Kilda Football Club, Moorabbin VIC',
    time: '2024-06-15T10:15:00',
    payout: 35,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-3'
  },
  {
    id: 'dummy-4',
    pickup: 'Melbourne Central Station, Melbourne VIC',
    dropoff: 'RMIT University, Brunswick VIC',
    time: '2024-06-15T08:30:00',
    payout: 25,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-4'
  },
  {
    id: 'dummy-5',
    pickup: 'The Ritz-Carlton Melbourne',
    dropoff: 'Royal Botanic Gardens Melbourne',
    time: '2024-06-15T12:00:00',
    payout: 65,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-5'
  },
  {
    id: 'dummy-6',
    pickup: 'Southern Cross Station, Melbourne VIC',
    dropoff: 'Docklands Stadium, Melbourne VIC',
    time: '2024-06-15T19:30:00',
    payout: 30,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-6'
  },
  {
    id: 'dummy-7',
    pickup: 'Queen Victoria Market, Melbourne VIC',
    dropoff: 'Melbourne Zoo, Parkville VIC',
    time: '2024-06-16T09:00:00',
    payout: 40,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-7'
  },
  {
    id: 'dummy-8',
    pickup: 'Park Hyatt Melbourne',
    dropoff: 'Melbourne Cricket Ground (MCG)',
    time: '2024-06-16T15:20:00',
    payout: 75,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-8'
  },
  {
    id: 'dummy-9',
    pickup: 'Chapel Street, Prahran VIC',
    dropoff: 'Chadstone Shopping Centre, Malvern East VIC',
    time: '2024-06-16T11:15:00',
    payout: 28,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-9'
  },
  {
    id: 'dummy-10',
    pickup: 'Melbourne Airport Terminal 3',
    dropoff: 'Crown Towers Melbourne',
    time: '2024-06-16T18:45:00',
    payout: 85,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-10'
  },
  {
    id: 'dummy-11',
    pickup: 'Federation Square, Melbourne VIC',
    dropoff: 'University of Melbourne, Parkville VIC',
    time: '2024-06-17T07:45:00',
    payout: 32,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-11'
  },
  {
    id: 'dummy-12',
    pickup: 'Eureka Tower, Southbank VIC',
    dropoff: 'St Kilda Beach, St Kilda VIC',
    time: '2024-06-17T13:30:00',
    payout: 38,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-12'
  },
  {
    id: 'dummy-13',
    pickup: 'Grand Hyatt Melbourne',
    dropoff: 'Flemington Racecourse, Flemington VIC',
    time: '2024-06-17T14:00:00',
    payout: 55,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-13'
  },
  {
    id: 'dummy-14',
    pickup: 'Richmond Station, Richmond VIC',
    dropoff: 'Yarra Valley, Healesville VIC',
    time: '2024-06-17T10:30:00',
    payout: 120,
    status: 'available',
    vehicle_type: 'luxury',
    poster_id: 'dummy-user-14'
  },
  {
    id: 'dummy-15',
    pickup: 'Melbourne Convention Centre, South Wharf VIC',
    dropoff: 'Tullamarine Airport, Terminal 2',
    time: '2024-06-17T16:15:00',
    payout: 78,
    status: 'available',
    vehicle_type: 'standard',
    poster_id: 'dummy-user-15'
  }
];

const Jobs = ({ onAuthRequired }: JobsProps) => {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const claimJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error('Not authenticated');
      // Update job's claimed_by and status in DB
      const { error } = await supabase
        .from('jobs')
        .update({
          claimed_by: user.id,
          status: 'claimed',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Job Claimed!",
        description: `You've successfully claimed this job.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'Could not claim job',
        variant: 'destructive'
      });
    }
  });

  const handleJobClick = (job: any) => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleClaimJob = (jobId: string) => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    // Only allow claiming real jobs, not dummy data
    if (jobId.startsWith('dummy-')) {
      toast({
        title: 'Demo Job',
        description: 'This is demo data. Please post a real job to test the claiming feature.',
        variant: 'default'
      });
      setIsDetailsModalOpen(false);
      return;
    }
    claimJobMutation.mutate(jobId);
    setIsDetailsModalOpen(false);
  };

  // Combine real jobs with dummy data, filter logic for "Available" tab jobs
  const allJobs = [...jobs, ...dummyJobs];
  const availableJobs = allJobs.filter((job: any) =>
    job.status === 'available' && job.poster_id !== user?.id
  );

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Jobs" />
      <div className="px-4 md:px-8 py-4 pb-20 md:pb-8 max-w-4xl md:mx-auto">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="available">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="space-y-4">
            {/* Filters (not yet wired to DB data) */}
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
                  <p className="text-2xl font-bold text-chauffer-black">{availableJobs.length}</p>
                  <p className="text-sm text-chauffer-gray-500">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chauffer-mint">
                    ${availableJobs.reduce((sum, job: any) => sum + (job.payout || 0), 0)}
                  </p>
                  <p className="text-sm text-chauffer-gray-500">Total Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-chauffer-black">
                    {availableJobs.filter((j: any) => (j.vehicle_type?.toLowerCase() === 'luxury')).length}
                  </p>
                  <p className="text-sm text-chauffer-gray-500">Luxury</p>
                </div>
              </div>
            </div>
            {/* Job Feed */}
            <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-1 md:gap-4 md:space-y-0">
              {isLoading ? (
                <p>Loading jobs...</p>
              ) : isError ? (
                <p className="text-red-600">Error loading jobs.</p>
              ) : (
                availableJobs.map((job: any) => (
                  <div key={job.id} onClick={() => handleJobClick(job)} className="cursor-pointer">
                    <JobCard
                      {...job}
                      id={job.id}
                      pickup={job.pickup}
                      dropoff={job.dropoff}
                      time={job.time}
                      payout={job.payout}
                      status={job.status === 'claimed' ? 'claimed' : 'available'}
                      posterRating={4.8} // Dummy, see note below
                      posterName={"N/A"}  // Dummy, need to join with profiles if needed
                      vehicleType={job.vehicle_type || undefined}
                      onClaim={handleClaimJob}
                      onAuthRequired={onAuthRequired}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Load More */}
            <Button variant="outline" className="w-full mt-4 md:max-w-xs md:mx-auto md:block" disabled>
              Load More Jobs
            </Button>
          </TabsContent>
          <TabsContent value="my-jobs">
            {user ? (
              <MyJobsSection />
            ) : (
              <div className="text-center py-8">
                <p className="text-chauffer-gray-500 mb-4">Please log in to view your jobs</p>
                <Button onClick={onAuthRequired}>Log In</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
