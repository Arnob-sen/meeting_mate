"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { meetingsService } from "@/services/meetings.service";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MeetingCard } from "./meeting-card";
import { Loader2, Inbox, RefreshCw } from "lucide-react";
import { Meeting } from "@/types/meeting";

interface MeetingsListProps {
  onSelect?: (meeting: Meeting) => void;
  selectedId?: string;
}

export function MeetingsList({ onSelect, selectedId }: MeetingsListProps) {
  const queryClient = useQueryClient();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMeetings = useCallback(async (before?: string, append = false) => {
    if (append) setIsMoreLoading(true);
    else setIsLoading(true);

    try {
      const data = await meetingsService.getAllMeetings(5, before);
      if (append) {
        setMeetings((prev) => [...prev, ...data]);
      } else {
        setMeetings(data);
      }
      setHasMore(data.length === 5);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Subscribe to React Query cache invalidations for auto-refresh
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.query.queryKey[0] === "meetings") {
        // Refetch when the meetings cache is invalidated
        fetchMeetings();
      }
    });

    return () => unsubscribe();
  }, [queryClient, fetchMeetings]);

  const handleLoadMore = () => {
    if (meetings.length > 0) {
      fetchMeetings(meetings[meetings.length - 1].createdAt, true);
    }
  };

  const handleRefresh = () => {
    fetchMeetings();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Recent History
        </h2>
        <div className="flex items-center gap-2">
          {meetings.length > 0 && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
              {meetings.length} Sessions
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-6 w-6 rounded-full"
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 pr-4 -mr-4">
        {isLoading && meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-3" />
            <p className="text-xs">Finding your meetings...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-2xl p-6 text-center">
            <p className="text-xs font-medium text-destructive">Error</p>
            <p className="text-[10px] text-muted-foreground mt-1">{error}</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-2xl p-6 text-center bg-secondary/5">
            <Inbox className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-xs font-medium">No meetings captured yet</p>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                onClick={() => onSelect?.(meeting)}
                isActive={selectedId === meeting._id}
              />
            ))}

            {hasMore && (
              <div className="pt-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isMoreLoading}
                  className="w-full text-[10px] h-8 font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 transition-all"
                >
                  {isMoreLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : null}
                  Load More Meetings
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
