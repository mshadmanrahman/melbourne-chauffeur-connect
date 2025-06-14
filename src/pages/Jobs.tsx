
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
    claimJobMutation.mutate(jobId);
    setIsDetailsModalOpen(false);
  };

  // Filter logic for "Available" tab jobs (exclude claimed, completed, and your own claimed jobs)
  const availableJobs = jobs.filter((job: any) =>
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
