
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useJobNotifications() {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const handledJobIds = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("realtime:public:jobs:notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          const job = payload.new;
          // Only notify if relevant: jobs posted/claimed by user (and skip repeated events)
          if (
            (job.poster_id === user.id || job.claimed_by === user.id) &&
            !handledJobIds.current.has(job.id)
          ) {
            handledJobIds.current.add(job.id);
            setHasUnread(true);
            // Show toast on job status change
            let desc = "";
            switch (job.status) {
              case "in_progress":
                desc = "Your job is now in progress.";
                break;
              case "completed":
                desc = "A job has been completed!";
                break;
              case "cancelled":
                desc = "A job was cancelled.";
                break;
              case "claimed":
                desc = "A job has been claimed!";
                break;
              default:
                desc = "There's an update to one of your jobs.";
            }
            toast({
              title: "Job Update",
              description: desc,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Mark notifications as read (used when bell is clicked)
  const markAsRead = () => setHasUnread(false);

  return { hasUnread, markAsRead };
}
