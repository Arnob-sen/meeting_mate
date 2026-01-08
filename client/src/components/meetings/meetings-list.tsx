"use client";

import { useMeetings } from "@/hooks/use-meetings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MeetingCard } from "./meeting-card";
import { Loader2, Inbox } from "lucide-react";
import { Meeting } from "@/types/meeting";

interface MeetingsListProps {
  onSelect?: (meeting: Meeting) => void;
  selectedId?: string;
}

export function MeetingsList({ onSelect, selectedId }: MeetingsListProps) {
  const { data: meetings, isLoading, error } = useMeetings();

  const meetingsArray = Array.isArray(meetings) ? meetings : [];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Recent History
      </h2>
      <ScrollArea className="flex-1 pr-4 -mr-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm">Loading your meetings...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <span className="text-destructive font-bold text-xl">!</span>
            </div>
            <p className="text-sm font-medium">Failed to load meetings</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error instanceof Error ? error.message : "Unknown server error"}
            </p>
          </div>
        ) : meetingsArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl p-8 text-center bg-secondary/10">
            <Inbox className="h-10 w-10 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-medium">No meetings yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Tap &quot;Offline Meeting&quot; to start capturing your first
              session.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {meetingsArray.map((meeting) => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                onClick={() => onSelect?.(meeting)}
                isActive={selectedId === meeting._id}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
