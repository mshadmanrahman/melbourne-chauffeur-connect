
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useJobMutations(queryKeyPosted: any, queryKeyClaimed: any, setCancelModalOpen?: (b: boolean) => void, setCancelReason?: (s: string) => void, setSelectedJobId?: (s: string | null) => void) {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: queryKeyClaimed });
      queryClient.invalidateQueries({ queryKey: queryKeyPosted });
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
      queryClient.invalidateQueries({ queryKey: queryKeyClaimed });
      queryClient.invalidateQueries({ queryKey: queryKeyPosted });
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
      setCancelModalOpen && setCancelModalOpen(false);
      setCancelReason && setCancelReason("");
      setSelectedJobId && setSelectedJobId(null);
      queryClient.invalidateQueries({ queryKey: queryKeyClaimed });
      queryClient.invalidateQueries({ queryKey: queryKeyPosted });
    },
    onError: () => {
      toast({
        title: "Failed to Cancel",
        description: "Something went wrong cancelling this job.",
        variant: "destructive",
      });
    },
  });

  return { startJobMutation, completeJobMutation, cancelJobMutation };
}
