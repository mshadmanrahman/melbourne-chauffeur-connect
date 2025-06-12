
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Star } from 'lucide-react';

interface Job {
  id: string;
  pickup: string;
  dropoff: string;
  time: string;
  payout: number;
  posterRating: number;
  posterName: string;
  vehicleType?: string;
}

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const JobCard = ({ job, onClick }: JobCardProps) => {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chauffer-mint rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {job.posterName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-chauffer-black">{job.posterName}</p>
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-chauffer-gray-500">{job.posterRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-chauffer-black">${job.payout}</p>
            <p className="text-sm text-chauffer-gray-500">after 10% fee</p>
          </div>
        </div>

        {/* Route */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-3 h-3 bg-chauffer-mint rounded-full"></div>
              <div className="w-px h-6 bg-chauffer-gray-200"></div>
              <MapPin size={12} className="text-chauffer-gray-500" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-medium text-chauffer-black">{job.pickup}</p>
              <p className="text-chauffer-gray-500">{job.dropoff}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-sm text-chauffer-gray-500">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{formatDate(job.time)} • {formatTime(job.time)}</span>
          </div>
          {job.vehicleType && (
            <span className="px-3 py-1 bg-chauffer-gray-100 rounded-full">
              {job.vehicleType}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
