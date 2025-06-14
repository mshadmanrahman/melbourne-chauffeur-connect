import React from "react";
import { Card } from "@/components/ui/card";
import MyJobCard from "./MyJobCard";

interface MyJobsListProps {
  jobs: any[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  loadingAction?: boolean;
}

const MyJobsList: React.FC<MyJobsListProps> = ({
  jobs, onStart, onComplete, onCancel, loadingAction = false
}) => {
  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center rounded-lg">
        <p className="text-chauffer-gray-500">No jobs found.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <MyJobCard
          key={job.id}
          job={job}
          onStart={onStart}
          onComplete={onComplete}
          onCancel={onCancel}
          loadingAction={loadingAction}
        />
      ))}
    </div>
  );
};

export default MyJobsList;
