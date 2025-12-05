'use client';

import { useMeetings } from '@/hooks/use-meetings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MeetingCard } from './meeting-card';
import { Loader2 } from 'lucide-react';

export function MeetingsList() {
  const { data: meetings = [], isLoading } = useMeetings();

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
      <ScrollArea className="h-[600px] pr-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>No meetings yet. Record your first meeting to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

