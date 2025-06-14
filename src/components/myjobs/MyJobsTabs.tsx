
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyJobsList from "./MyJobsList";
import JobCancelDialog from "./JobCancelDialog";
import { useMyJobs } from "@/hooks/useMyJobs";

const MyJobsTabs = () => {
  const {
    postedJobs,
    loadingPosted,
    claimedJobs,
    loadingClaimed,
    startJobMutation,
    completeJobMutation,
    cancelJobMutation,
    cancelModalOpen,
    setCancelModalOpen,
    cancelReason,
    setCancelReason,
    handleStartJob,
    handleCompleteJob,
    handleCancelJob,
    openCancelModal,
    tab,
    setTab,
  } = useMyJobs();

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

