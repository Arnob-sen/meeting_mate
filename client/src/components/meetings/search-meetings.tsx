"use client";

import { useState } from "react";
import { meetingsService } from "@/services/meetings.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X, Sparkles } from "lucide-react";
import { MeetingCard } from "./meeting-card";
import { useQuery } from "@tanstack/react-query";

import { Meeting } from "@/types/meeting";

interface SearchMeetingsProps {
  onSelect?: (meeting: Meeting) => void;
  selectedId?: string;
}

export function SearchMeetings({ onSelect, selectedId }: SearchMeetingsProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleSearch = () => {
    setDebouncedQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => meetingsService.searchMeetings(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <div className="w-full">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Ask AI to find meetings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-11 pr-12 h-12 rounded-xl bg-secondary/50 border-none focus-visible:ring-primary/20 transition-all font-medium"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="h-8 rounded-lg"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Go"}
          </Button>
        </div>
      </div>

      {debouncedQuery && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              AI Found {results?.length || 0} Matches
            </h3>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-12 bg-secondary/20 rounded-2xl border border-dashed text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm">Searching your meeting brain...</p>
            </div>
          )}

          {!isLoading && results && results.length === 0 && (
            <div className="text-center p-12 bg-secondary/20 rounded-2xl border border-dashed">
              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-medium">
                No meetings match that context.
              </p>
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="space-y-3">
              {results.map((meeting) => (
                <div key={meeting._id} className="relative group">
                  {/* @ts-expect-error - similarity is added to the meeting object in search results */}
                  {meeting.similarity && (
                    <div className="absolute -top-1.5 -right-1 z-10">
                      <div className="px-2 py-0.5 rounded-md bg-primary text-[10px] font-bold text-primary-foreground shadow-sm uppercase tracking-tighter">
                        {/* @ts-expect-error - similarity is added to the meeting object in search results */}
                        {Math.round(meeting.similarity * 100)}% Match
                      </div>
                    </div>
                  )}
                  <MeetingCard
                    meeting={meeting}
                    onClick={() => onSelect?.(meeting)}
                    isActive={selectedId === meeting._id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
