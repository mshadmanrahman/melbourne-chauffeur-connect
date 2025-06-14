import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Clock, DollarSign, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useStripeAccount } from '@/hooks/useStripeAccount';

const PostJob = () => {
  const { user } = useAuth();
  const { stripeAccount, loading: stripeLoading, refetch } = useStripeAccount(user?.id);
  const [stripeBtnLoading, setStripeBtnLoading] = useState(false);

  // hasStripeSetup is true when onboarding_complete
  const hasStripeSetup = !!stripeAccount?.onboarding_complete;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    payout: '',
    vehicleType: '',
    notes: ''
  });

  useEffect(() => {
    // Check if user has Stripe payment setup
    // This would normally check against a database or Stripe API
    setHasStripeSetup(false);
  }, [user]);

  const handleStripeSetup = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to set up payments.",
        variant: "destructive"
      });
      return;
    }
    setStripeBtnLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-onboard");
      if (error || !data) {
        toast({
          title: "Stripe error",
          description: error?.message || "Failed to connect to Stripe.",
          variant: "destructive"
        });
        return;
      }
      if (data.onboarding_url) {
        window.open(data.onboarding_url, "_blank");
        setTimeout(refetch, 6000); // Poll for completion after a delay
      } else {
        toast({
          title: "Stripe error",
          description: "Could not generate onboarding link.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({ title: "Stripe Error", description: String(err), variant: "destructive" });
    } finally {
      setStripeBtnLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a job.",
        variant: "destructive"
      });
      return;
    }

    if (!hasStripeSetup) {
      toast({
        title: "Payment Setup Required",
        description: "You must set up payment details before posting a job.",
        variant: "destructive"
      });
      return;
    }

    // Basic validation
    if (!formData.pickup || !formData.dropoff || !formData.date || !formData.time || !formData.payout) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Combine date and time into UTC timestamp string for Supabase
    const isoTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    const newJob = {
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      time: isoTime,
      payout: Number(formData.payout),
      vehicle_type: formData.vehicleType || null,
      notes: formData.notes || null,
      poster_id: user.id
    };

    const { error } = await supabase
      .from('jobs')
      .insert([newJob]);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
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

  if (!user) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50">
        <Header title="Post a Job" showNotifications={false} />
        <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-2xl md:mx-auto">
          <Card className="p-8 text-center">
            <AlertCircle size={48} className="text-chauffer-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-chauffer-black mb-2">Login Required</h2>
            <p className="text-chauffer-gray-500 mb-4">
              You must be logged in to post a job. Please log in or create an account to continue.
            </p>
            <Button className="bg-chauffer-mint hover:bg-chauffer-mint/90">
              Login to Continue
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Post a Job" showNotifications={false} />

      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-2xl md:mx-auto">
        {!hasStripeSetup && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <CreditCard className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 flex items-center flex-wrap gap-1">
              You need to set up payment details before posting jobs.
              <Button
                variant="link"
                className="text-orange-600 p-0 ml-1 h-auto flex items-center"
                onClick={handleStripeSetup}
                disabled={stripeBtnLoading || stripeLoading}
              >
                {stripeBtnLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} /> Setting up ...
                  </>
                ) : (
                  <>Set up payments now</>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
              disabled={!hasStripeSetup || loading}
            >
              {loading ? 'Posting...' : !hasStripeSetup ? 'Set Up Payments First' : 'Post Job'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;

// (NOTE: This file is getting long! After this change, consider splitting or refactoring it for maintainability.)
