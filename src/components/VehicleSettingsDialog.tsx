import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Car, FileText, Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  license_number: string | null;
  vehicle_details: string | null;
  experience: string | null;
  created_at: string;
}

interface VehicleSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const VehicleSettingsDialog = ({ open, onOpenChange, profile, onProfileUpdate }: VehicleSettingsDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    license_number: profile.license_number || '',
    vehicle_details: profile.vehicle_details || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          license_number: formData.license_number,
          vehicle_details: formData.vehicle_details,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      onOpenChange(false);
      toast({
        title: "Vehicle settings updated",
        description: "Your vehicle information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating vehicle settings:', error);
      toast({
        title: "Error updating vehicle settings",
        description: "There was a problem updating your vehicle information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car size={20} />
            Vehicle Settings
          </DialogTitle>
          <DialogDescription>
            Update your vehicle information and license details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license_number" className="flex items-center gap-2">
              <FileText size={16} />
              License Number
            </Label>
            <Input
              id="license_number"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              placeholder="Enter your license number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle_details" className="flex items-center gap-2">
              <Car size={16} />
              Vehicle Details
            </Label>
            <Textarea
              id="vehicle_details"
              value={formData.vehicle_details}
              onChange={(e) => setFormData({ ...formData, vehicle_details: e.target.value })}
              placeholder="e.g., 2020 Toyota Camry, Silver, License Plate: ABC123"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSettingsDialog;
