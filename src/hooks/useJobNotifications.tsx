
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Type definition matches the jobs table
type Job = {
  id: string;
  poster_id: string;
  pickup: string;
  dropoff: string;
  time: string;
  payout: number;
  vehicle_type: string | null;
  notes: string | null;
  status: string;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
};

function triggerBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico", // Change to your app icon if needed
    });
  }
}

function requestNotificationPermissionIfNeeded() {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function useJobNotifications() {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const handledJobIds = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Use a unique channel name per user to avoid duplicate subscriptions
    const channelName = `realtime:public:jobs:notifications:${user.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          const job = payload.new as Job | undefined;
          if (
            job &&
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
            const title = "Job Update";

            toast({
              title,
              description: desc,
            });

            // Request permission on first relevant event
            requestNotificationPermissionIfNeeded();

            // Only trigger system notification if allowed
            if (typeof window !== 'undefined' && Notification.permission === "granted") {
              triggerBrowserNotification(title, desc);
            }
          }
        }
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Mark notifications as read (used when bell is clicked)
  const markAsRead = () => setHasUnread(false);

  return { hasUnread, markAsRead };
}
