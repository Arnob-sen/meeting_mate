"use client";

import { useState } from "react";
import {
  NewSessionCard,
  MeetingsList,
  SearchMeetings,
} from "@/components/meetings";
import { MeetingDetailView } from "@/components/meetings/meeting-detail-view";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Users, Clock, Calendar, Zap, Sparkles, Search } from "lucide-react";
import { useMeetings } from "@/hooks/use-meetings";
import { Meeting } from "@/types/meeting";

export default function Dashboard() {
  const { data: meetings } = useMeetings();
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const meetingsArray = Array.isArray(meetings) ? meetings : [];

  const stats = [
    {
      label: "Total Meetings",
      value: meetingsArray.length,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Hours Recorded",
      value: (meetingsArray.length * 0.5).toFixed(1),
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Participants",
      value: meetingsArray.length * 2,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "AI Insights",
      value: meetingsArray.length * 5,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome back, Arnob!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            You have {meetingsArray.length} recorded meetings and 4 new AI
            insights since yesterday.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Recorder & Search (Lg: 4/12) */}
        {!selectedMeeting && (
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-card border rounded-2xl p-1 shadow-sm overflow-hidden">
              <NewSessionCard />
            </div>
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Search History
              </h3>
              <SearchMeetings
                onSelect={(m) => setSelectedMeeting(m)}
                selectedId=""
              />
            </div>
          </div>
        )}

        {/* MIDDLE/RIGHT: Content Area */}
        <div className={selectedMeeting ? "lg:col-span-8" : "lg:col-span-4"}>
          <div className="bg-card border rounded-2xl p-6 shadow-sm h-full min-h-[600px]">
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

        {/* RIGHT: Chat RAG (Only if no meeting is selected or in sidebar-like mode) */}
        {!selectedMeeting && (
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <ChatInterface />
          </div>
        )}
      </div>
    </div>
  );
}
