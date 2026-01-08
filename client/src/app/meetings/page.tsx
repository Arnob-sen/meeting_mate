"use client";

import { useState } from "react";
import { MeetingsList } from "@/components/meetings";
import { SearchMeetings } from "@/components/meetings";
import { MeetingDetailView } from "@/components/meetings/meeting-detail-view";
import { Search } from "lucide-react";
import { Meeting } from "@/types/meeting";

export default function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Meetings</h1>
        <p className="text-muted-foreground">
          Manage and search through your entire meeting history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {!selectedMeeting && (
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Search
              </h3>
              <SearchMeetings
                onSelect={(m) => setSelectedMeeting(m)}
                selectedId=""
              />
            </div>
          </div>
        )}

        <div className={selectedMeeting ? "lg:col-span-12" : "lg:col-span-8"}>
          <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[600px]">
            {selectedMeeting ? (
              <MeetingDetailView
                meeting={selectedMeeting}
                onClose={() => setSelectedMeeting(null)}
              />
            ) : (
              <MeetingsList
                onSelect={(m) => setSelectedMeeting(m)}
                selectedId=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
