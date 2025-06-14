
import { usePostedJobs } from "./usePostedJobs";
import { useClaimedJobs } from "./useClaimedJobs";
import { useJobMutations } from "./useJobMutations";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useMyJobs = () => {
  const { user } = useAuth();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [tab, setTab] = useState<"posted" | "claimed">("claimed");
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const posted = usePostedJobs();
  const claimed = useClaimedJobs();

  const { startJobMutation, completeJobMutation, cancelJobMutation } =
    useJobMutations(
      ["my-posted-jobs", user?.id],
      ["my-claimed-jobs", user?.id],
      setCancelModalOpen,
      setCancelReason,
      setSelectedJobId
    );

  // Realtime updates
  useEffect(() => {
    if (!user) {
      // Clean up when user logs out
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
      return;
    }

    // Don't create a new channel if we already have one subscribed
    if (isSubscribedRef.current && channelRef.current) {
      return;
    }

    // Clean up any existing channel before creating a new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

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
          posted.refetch?.();
          claimed.refetch?.();
        }
      );

    const subscribeToChannel = async () => {
      try {
        await channel.subscribe();
        channelRef.current = channel;
        isSubscribedRef.current = true;
        console.log("Successfully subscribed to jobs realtime channel");
      } catch (e) {
        console.error("Supabase channel subscribe exception", e);
        isSubscribedRef.current = false;
      }
    };

    subscribeToChannel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [user?.id, posted.refetch, claimed.refetch]);

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
    postedJobs: posted.data ?? [],
    loadingPosted: posted.isLoading,
    claimedJobs: claimed.data ?? [],
    loadingClaimed: claimed.isLoading,
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
