
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Play, X, CheckCircle } from "lucide-react";

type JobStatus = "active" | "in_progress" | "completed" | "cancelled" | "claimed" | string;

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "claimed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface MyJobCardProps {
  job: any;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

const MyJobCard: React.FC<MyJobCardProps> = ({ job, onStart, onComplete, onCancel }) => (
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
                {new Date(job.time).toLocaleString("en-AU")}
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
        {job.status === "active" && (
          <>
            <Button
              size="sm"
              onClick={() => onStart(job.id)}
              className="bg-chauffer-mint hover:bg-chauffer-mint/90"
            >
              <Play size={14} className="mr-1" />
              Start
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(job.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </>
        )}
        {job.status === "in_progress" && (
          <Button
            size="sm"
            onClick={() => onComplete(job.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle size={14} className="mr-1" />
            Complete
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default MyJobCard;

