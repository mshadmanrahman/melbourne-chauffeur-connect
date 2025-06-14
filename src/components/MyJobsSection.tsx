
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, DollarSign, Play, X, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'claimed': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MyJobsSection = () => {
  const { user } = useAuth();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [tab, setTab] = useState<'posted' | 'claimed'>('claimed');

  // Fetch jobs posted by this user
  const { data: postedJobs = [], isLoading: loadingPosted } = useQuery({
    queryKey: ['my-posted-jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('poster_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user
  });

  // Fetch jobs claimed by this user
  const { data: claimedJobs = [], isLoading: loadingClaimed } = useQuery({
    queryKey: ['my-claimed-jobs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('claimed_by', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user
  });

  // Actions (currently just toast; add DB logic later if desired)
  const handleStartJob = (jobId: string) => {
    toast({
      title: "Job Started",
      description: "You have started the job. Safe driving!",
    });
  };

  const handleCompleteJob = (jobId: string) => {
    toast({
      title: "Job Completed",
      description: "Job completed successfully! Payment will be processed shortly.",
    });
  };

  const handleCancelJob = () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Cancel Reason Required",
        description: "Please provide a reason for cancelling the job.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Job Cancelled",
      description: "The job has been cancelled and the poster has been notified.",
    });
    setCancelModalOpen(false);
    setCancelReason('');
    setSelectedJobId(null);
  };

  const openCancelModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setCancelModalOpen(true);
  };

  const renderJobs = (jobs: any[]) => (
    jobs.length === 0 ? (
      <Card className="p-8 text-center">
        <p className="text-chauffer-gray-500">No jobs found.</p>
      </Card>
    ) : (
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-chauffer-mint mt-1" />
                    <div>
                      <p className="font-medium text-sm">{job.pickup}</p>
                      <p className="text-sm text-chauffer-gray-500">to {job.dropoff}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-chauffer-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>
                        {new Date(job.time).toLocaleString('en-AU')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign size={14} />
                      <span className="font-medium text-chauffer-mint">
                        ${job.payout}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {job.status === 'active' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStartJob(job.id)}
                      className="bg-chauffer-mint hover:bg-chauffer-mint/90"
                    >
                      <Play size={14} className="mr-1" />
                      Start
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCancelModal(job.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X size={14} className="mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
                {job.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteJob(job.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-chauffer-black">My Jobs</h2>
      <Tabs value={tab} onValueChange={v => setTab(v as 'posted' | 'claimed')}>
        <TabsList>
          <TabsTrigger value="claimed">Jobs I Claimed</TabsTrigger>
          <TabsTrigger value="posted">Jobs I Posted</TabsTrigger>
        </TabsList>
        <TabsContent value="claimed" className="mt-3">
          {loadingClaimed ? (
            <p>Loading...</p>
          ) : (
            renderJobs(claimedJobs)
          )}
        </TabsContent>
        <TabsContent value="posted" className="mt-3">
          {loadingPosted ? (
            <p>Loading...</p>
          ) : (
            renderJobs(postedJobs)
          )}
        </TabsContent>
      </Tabs>
      {/* Cancel Job Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancelReason">Reason for cancellation *</Label>
              <Textarea
                id="cancelReason"
                placeholder="Please provide a reason for cancelling this job..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleCancelJob}
                variant="destructive"
                className="flex-1"
              >
                Cancel Job
              </Button>
              <Button
                variant="outline"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1"
              >
                Keep Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyJobsSection;
