import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { meetingsService } from "@/services/meetings.service";
import type { CreateMeetingRequest, Meeting } from "@/types/meeting";
import { toast } from "sonner";

const MEETINGS_QUERY_KEY = ["meetings"] as const;

/**
 * Hook to fetch all meetings
 */
export function useMeetings() {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEY,
    queryFn: () => meetingsService.getAllMeetings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once on failure
    // Ensure we always have an array as default
    select: (data) => (Array.isArray(data) ? data : []),
  });
}

/**
 * Hook to poll a meeting's status until it's COMPLETED
 */
export function usePollMeetingStatus(meetingId?: string) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!meetingId) return;

    // Show persistent toast
    toastIdRef.current = toast.loading(
      "🎙️ Processing meeting... This may take a few minutes.",
      {
        duration: Infinity,
      }
    );

    const poll = async () => {
      const meeting = await meetingsService.getMeetingById(meetingId);

      if (meeting?.status === "COMPLETED") {
        stopPolling();
        queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
        toast.success("Meeting processed successfully!");
      } else if (meeting?.status === "FAILED") {
        stopPolling();
        toast.error("Meeting processing failed. Please try again.");
      }
    };

    // Poll every 5 seconds
    intervalRef.current = setInterval(poll, 30000); //30 seconds

    return () => stopPolling();
  }, [meetingId, queryClient, stopPolling]);

  return { stopPolling };
}

/**
 * Hook to create a new meeting
 */
export function useCreateMeeting(
  onProcessingStart?: (meeting: Meeting) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) =>
      meetingsService.createMeeting(data),
    onSuccess: (meeting) => {
      // Add the new "PROCESSING" meeting to the cache immediately
      queryClient.setQueryData<Meeting[]>(MEETINGS_QUERY_KEY, (old) => {
        return old ? [meeting, ...old] : [meeting];
      });

      // Call the callback to start polling
      if (onProcessingStart) {
        onProcessingStart(meeting);
      }
    },
    onError: (error: unknown) => {
      console.error("Failed to process meeting:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process meeting. Please try again.";
      toast.error(errorMessage);
    },
  });
}
