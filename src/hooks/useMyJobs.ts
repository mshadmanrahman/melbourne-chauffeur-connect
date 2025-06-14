
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useMyJobs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [tab, setTab] = useState<"posted" | "claimed">("claimed");

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

  // Realtime updates
  useEffect(() => {
    if (!user) return;

    // Use a unique channel name per user to avoid double subscribe issues
    const channelName = `realtime:public:jobs:${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (_payload) => {
          queryClient.invalidateQueries({ queryKey: ["my-claimed-jobs"] });
          queryClient.invalidateQueries({ queryKey: ["my-posted-jobs"] });
        }
      );

    // Subscribe & track the returned promise for handling errors (if desired)
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, queryClient]);

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

  return {
    user,
    postedJobs,
    loadingPosted,
    claimedJobs,
    loadingClaimed,
    startJobMutation,
    completeJobMutation,
    cancelJobMutation,
    cancelModalOpen,
    setCancelModalOpen,
    selectedJobId,
    setSelectedJobId,
    cancelReason,
    setCancelReason,
    tab,
    setTab,
    handleStartJob,
    handleCompleteJob,
    handleCancelJob,
    openCancelModal,
  };
};

