"use client";

import {
  NewSessionCard,
  MeetingsList,
  SearchMeetings,
} from "@/components/meetings";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">🎙️ AI Sales CRM</h1>

      <SearchMeetings />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Recorder Section */}
        <div className="md:col-span-1 space-y-4">
          <NewSessionCard />
        </div>

        {/* MIDDLE: Meeting History List */}
        <div className="md:col-span-1">
          <MeetingsList />
        </div>

        {/* RIGHT: Chat RAG */}
        <div className="md:col-span-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
