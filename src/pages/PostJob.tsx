
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PostJob = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    payout: '',
    vehicleType: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.pickup || !formData.dropoff || !formData.date || !formData.time || !formData.payout) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Job Posted!",
      description: "Your job has been posted and is now visible to other chauffeurs",
    });

    // Reset form
    setFormData({
      pickup: '',
      dropoff: '',
      date: '',
      time: '',
      payout: '',
      vehicleType: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Post a Job" showNotifications={false} />
      
      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-2xl md:mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin size={20} className="text-chauffer-mint" />
                <h3 className="font-semibold text-chauffer-black">Trip Details</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="pickup">Pickup Location *</Label>
                  <Input
                    id="pickup"
                    placeholder="e.g. Crown Casino, Melbourne"
                    value={formData.pickup}
                    onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dropoff">Drop-off Location *</Label>
                  <Input
                    id="dropoff"
                    placeholder="e.g. Melbourne Airport"
                    value={formData.dropoff}
                    onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Time Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock size={20} className="text-chauffer-mint" />
                <h3 className="font-semibold text-chauffer-black">Schedule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign size={20} className="text-chauffer-mint" />
                <h3 className="font-semibold text-chauffer-black">Payment</h3>
              </div>
              
              <div>
                <Label htmlFor="payout">Payout Amount (AUD) *</Label>
                <Input
                  id="payout"
                  type="number"
                  placeholder="85"
                  value={formData.payout}
                  onChange={(e) => setFormData({ ...formData, payout: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-chauffer-gray-500 mt-1">
                  You keep 10% commission when the job is completed
                </p>
              </div>
            </div>

            {/* Vehicle Requirements */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select vehicle type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-chauffer-mint hover:bg-chauffer-mint/90 text-white h-12"
            >
              Post Job
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
