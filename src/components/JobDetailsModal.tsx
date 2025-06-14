import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Clock, DollarSign, Star, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JobDetailsModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (jobId: string) => void;
}

const JobDetailsModal = ({ job, isOpen, onClose, onClaim }: JobDetailsModalProps) => {
  if (!job) return null;
  const handleClaim = () => {
    onClaim(job.id);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] p-3 xs:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg xs:text-xl">Job Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Route Information */}
          <Card className="p-3 xs:p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin size={20} className="text-chauffer-mint" />
              <h3 className="font-semibold">Route</h3>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-chauffer-gray-500">Pickup:</span>
                <p className="font-medium">{job.pickup}</p>
              </div>
              <div>
                <span className="text-sm text-chauffer-gray-500">Drop-off:</span>
                <p className="font-medium">{job.dropoff}</p>
              </div>
            </div>
          </Card>

          {/* Time & Payment */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <Card className="p-3 xs:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={16} className="text-chauffer-mint" />
                <h4 className="font-medium">Schedule</h4>
              </div>
              <p className="text-chauffer-black">
                {new Date(job.time).toLocaleDateString('en-AU')}
              </p>
              <p className="text-chauffer-black">
                {new Date(job.time).toLocaleTimeString('en-AU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </Card>

            <Card className="p-3 xs:p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign size={16} className="text-chauffer-mint" />
                <h4 className="font-medium">Payment</h4>
              </div>
              <p className="text-2xl font-bold text-chauffer-mint">${job.payout}</p>
              <p className="text-xs text-chauffer-gray-500">AUD</p>
            </Card>
          </div>

          {/* Job Poster Info */}
          <Card className="p-3 xs:p-4">
            <div className="flex items-center space-x-2 mb-3">
              <User size={20} className="text-chauffer-mint" />
              <h3 className="font-semibold">Job Poster</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{job.posterName}</p>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm">{job.posterRating}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Vehicle Requirements */}
          {job.vehicleType && (
            <Card className="p-3 xs:p-4">
              <h3 className="font-semibold mb-2">Vehicle Requirements</h3>
              <span className="px-3 py-1 bg-chauffer-mint/10 text-chauffer-mint text-sm rounded-full">
                {job.vehicleType}
              </span>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2">
            <Button
              onClick={handleClaim}
              className="flex-1 bg-chauffer-mint hover:bg-chauffer-mint/90 text-base py-3"
              disabled={job.status === 'claimed'}
            >
              {job.status === 'claimed' ? 'Already Claimed' : 'Claim Job'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 text-base py-3">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
