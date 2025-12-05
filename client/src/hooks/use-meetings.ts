import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsService } from '@/services/meetings.service';
import type { CreateMeetingRequest } from '@/types/meeting';
import { toast } from 'sonner';

const MEETINGS_QUERY_KEY = ['meetings'] as const;

/**
 * Hook to fetch all meetings
 */
export function useMeetings() {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEY,
    queryFn: () => meetingsService.getAllMeetings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new meeting
 */
export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingRequest) =>
      meetingsService.createMeeting(data),
    onSuccess: () => {
      // Invalidate and refetch meetings list
      queryClient.invalidateQueries({ queryKey: MEETINGS_QUERY_KEY });
      toast.success('Meeting processed successfully!');
    },
    onError: (error: unknown) => {
      console.error('Failed to process meeting:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to process meeting. Please try again.';
      toast.error(errorMessage);
    },
  });
}

