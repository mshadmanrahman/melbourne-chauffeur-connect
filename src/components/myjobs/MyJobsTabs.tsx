
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyJobsList from "./MyJobsList";
import JobCancelDialog from "./JobCancelDialog";
import { toast } from "@/hooks/use-toast";

const MyJobsTabs = () => {
  const { user } = useAuth();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [tab, setTab] = useState<"posted" | "claimed">("claimed");

  const queryClient = useQueryClient();

  // Fetch jobs posted by this user
  const { data: postedJobs = [], isLoading: loadingPosted } = useQuery({
    queryKey: ["my-posted-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("poster_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Fetch jobs claimed by this user
  const { data: claimedJobs = [], isLoading: loadingClaimed } = useQuery({
    queryKey: ["my-claimed-jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("claimed_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Mutations for job actions
  const startJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: "in_progress", updated_at: new Date().toISOString() })
        .eq("id", jobId)
        .select();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Job Started",
        description: "You have started the job. Safe driving!",
      });
      queryClient.invalidateQueries({ queryKey: ["my-claimed-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-posted-jobs"] });
    },
    onError: () => {
      toast({
        title: "Failed to Start",
        description: "Something went wrong starting your job. Try again.",
        variant: "destructive",
      });
    },
  });

  const completeJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", jobId)
        .select();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Job Completed",
        description: "Job completed successfully! Payment will be processed shortly.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-claimed-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-posted-jobs"] });
    },
    onError: () => {
      toast({
        title: "Failed to Complete",
        description: "Something went wrong completing this job.",
        variant: "destructive",
      });
    },
  });

  const cancelJobMutation = useMutation({
    mutationFn: async ({ jobId, reason }: { jobId: string; reason: string }) => {
      const { error } = await supabase
        .from("jobs")
        .update({
          status: "cancelled",
          notes: `Cancelled: ${reason}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", jobId)
        .select();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: "Job Cancelled",
        description: "The job has been cancelled and the poster has been notified.",
      });
      setCancelModalOpen(false);
      setCancelReason("");
      setSelectedJobId(null);
      queryClient.invalidateQueries({ queryKey: ["my-claimed-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-posted-jobs"] });
    },
    onError: () => {
      toast({
        title: "Failed to Cancel",
        description: "Something went wrong cancelling this job.",
        variant: "destructive",
      });
    },
  });

  // Handler functions
  const handleStartJob = (jobId: string) => startJobMutation.mutate(jobId);

  const handleCompleteJob = (jobId: string) => completeJobMutation.mutate(jobId);

  const handleCancelJob = () => {
    if (!cancelReason.trim() || !selectedJobId) {
      toast({
        title: "Cancel Reason Required",
        description: "Please provide a reason for cancelling the job.",
        variant: "destructive",
      });
      return;
    }
    cancelJobMutation.mutate({ jobId: selectedJobId, reason: cancelReason });
  };

  const openCancelModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setCancelModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-chauffer-black">My Jobs</h2>
      <Tabs value={tab} onValueChange={v => setTab(v as "posted" | "claimed")}>
        <TabsList>
          <TabsTrigger value="claimed">Jobs I Claimed</TabsTrigger>
          <TabsTrigger value="posted">Jobs I Posted</TabsTrigger>
        </TabsList>
        <TabsContent value="claimed" className="mt-3">
          {loadingClaimed ? (
            <p>Loading...</p>
          ) : (
            <MyJobsList
              jobs={claimedJobs}
              onStart={handleStartJob}
              onComplete={handleCompleteJob}
              onCancel={openCancelModal}
              loadingAction={
                startJobMutation.isPending ||
                completeJobMutation.isPending ||
                cancelJobMutation.isPending
              }
            />
          )}
        </TabsContent>
        <TabsContent value="posted" className="mt-3">
          {loadingPosted ? (
            <p>Loading...</p>
          ) : (
            <MyJobsList
              jobs={postedJobs}
              onStart={handleStartJob}
              onComplete={handleCompleteJob}
              onCancel={openCancelModal}
              loadingAction={
                startJobMutation.isPending ||
                completeJobMutation.isPending ||
                cancelJobMutation.isPending
              }
            />
          )}
        </TabsContent>
      </Tabs>
      <JobCancelDialog
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        reason={cancelReason}
        onReasonChange={setCancelReason}
        onCancelJob={handleCancelJob}
        loading={cancelJobMutation.isPending}
      />
    </div>
  );
};

export default MyJobsTabs;
