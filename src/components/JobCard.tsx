
import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface JobCardProps {
  id: string;
  pickup: string;
  dropoff: string;
  time: string;
  payout: number;
  posterRating: number;
  posterName: string;
  vehicleType?: string;
  status: 'available' | 'claimed' | 'completed';
  onClaim?: (jobId: string) => void;
}

const JobCard = ({ 
  id, 
  pickup, 
  dropoff, 
  time, 
  payout, 
  posterRating, 
  posterName, 
  vehicleType,
  status,
  onClaim 
}: JobCardProps) => {
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
    <Card className="p-4 mb-3 border border-chauffer-gray-200 hover:border-chauffer-mint transition-colors">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-chauffer-mint rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {posterName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm text-chauffer-black">{posterName}</p>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span className="text-xs text-chauffer-gray-500">{posterRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-chauffer-black">${payout}</p>
            <p className="text-xs text-chauffer-gray-500">after 10% fee</p>
          </div>
        </div>

        {/* Route */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-2 h-2 bg-chauffer-mint rounded-full"></div>
              <div className="w-px h-4 bg-chauffer-gray-200"></div>
              <MapPin size={8} className="text-chauffer-gray-500" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-chauffer-black font-medium">{pickup}</p>
              <p className="text-sm text-chauffer-gray-500">{dropoff}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-xs text-chauffer-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{formatDate(time)} • {formatTime(time)}</span>
            </div>
            {vehicleType && (
              <span className="px-2 py-1 bg-chauffer-gray-100 rounded-full">
                {vehicleType}
              </span>
            )}
          </div>
        </div>

        {/* Action */}
        {status === 'available' && onClaim && (
          <Button 
            onClick={() => onClaim(id)}
            className="w-full bg-chauffer-mint hover:bg-chauffer-mint/90 text-white"
          >
            Claim Job
          </Button>
        )}
        
        {status === 'claimed' && (
          <Button disabled className="w-full bg-chauffer-gray-200 text-chauffer-gray-500">
            Job Claimed
          </Button>
        )}
      </div>
    </Card>
  );
};

export default JobCard;
