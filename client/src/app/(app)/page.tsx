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
import { cn } from "@/lib/utils";

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
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, Arnob
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Your workspace is ready — {meetingsArray.length} meetings analyzed
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border rounded-2xl px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-all"
          >
            <div
              className={cn(
                stat.bg,
                stat.color,
                "p-3 rounded-xl group-hover:scale-110 transition-transform"
              )}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT – Capture + Search */}
        {!selectedMeeting && (
          <div className="lg:col-span-4 space-y-6">
            {/* Capture */}
            <div className="bg-card border rounded-2xl p-1 shadow-sm">
              <NewSessionCard />
            </div>

            {/* AI Search */}
            <div className="bg-card border rounded-2xl p-5 h-[340px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4" />
                <h3 className="text-sm font-semibold">AI Meeting Search</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <SearchMeetings
                  onSelect={(m) => setSelectedMeeting(m)}
                  selectedId=""
                />
              </div>
            </div>
          </div>
        )}

        {/* CENTER – History / Detail */}
        <div
          className={cn(
            "transition-all",
            selectedMeeting ? "lg:col-span-8" : "lg:col-span-4"
          )}
        >
          <div className="bg-card border rounded-2xl h-[890px] p-5">
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

        {/* RIGHT – Chatbot */}
        {!selectedMeeting && (
          <div className="lg:col-span-4">
            <div className="bg-card border rounded-2xl h-[760px] overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
