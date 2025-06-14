
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  // Actions (still only showing toast; DB logic could be added later)
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
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Job Cancelled",
      description: "The job has been cancelled and the poster has been notified.",
    });
    setCancelModalOpen(false);
    setCancelReason("");
    setSelectedJobId(null);
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
      />
    </div>
  );
};

export default MyJobsTabs;
