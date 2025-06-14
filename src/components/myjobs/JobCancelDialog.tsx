
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface JobCancelDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reason: string;
  onReasonChange: (s: string) => void;
  onCancelJob: () => void;
}

const JobCancelDialog: React.FC<JobCancelDialogProps> = ({
  open, onOpenChange, reason, onReasonChange, onCancelJob,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Job</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cancelReason">Reason for cancellation *</Label>
          <Textarea
            id="cancelReason"
            placeholder="Please provide a reason for cancelling this job..."
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={onCancelJob}
            variant="destructive"
            className="flex-1"
          >
            Cancel Job
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Keep Job
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default JobCancelDialog;
