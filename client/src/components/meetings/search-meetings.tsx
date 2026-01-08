"use client";

import { useState } from "react";
import { meetingsService } from "@/services/meetings.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { MeetingCard } from "./meeting-card";
import { useQuery } from "@tanstack/react-query";

export function SearchMeetings() {
  const [query, setQuery] = useState("");
  // Use debouncing to avoid API calls on every keystroke
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
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search meetings (e.g. 'budget discussion', 'project deadline')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {debouncedQuery && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Search Results for &quot;{debouncedQuery}&quot;
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
            >
              Clear
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {!isLoading && results && results.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No matching meetings found.</p>
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="space-y-4">
              {results.map((meeting) => (
                // @ts-ignore - similarity is added by search
                <div key={meeting._id} className="relative group">
                  {/* @ts-ignore */}
                  {meeting.similarity && (
                    <div className="absolute -top-2 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full z-10 font-mono">
                      {/* @ts-ignore */}
                      Match: {Math.round(meeting.similarity * 100)}%
                    </div>
                  )}
                  <MeetingCard meeting={meeting} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
