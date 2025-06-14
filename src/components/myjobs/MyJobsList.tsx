
import React from "react";
import { Card } from "@/components/ui/card";
import MyJobCard from "./MyJobCard";

interface MyJobsListProps {
  jobs: any[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

const MyJobsList: React.FC<MyJobsListProps> = ({
  jobs, onStart, onComplete, onCancel
}) => {
  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center">
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
        />
      ))}
    </div>
  );
};

export default MyJobsList;

