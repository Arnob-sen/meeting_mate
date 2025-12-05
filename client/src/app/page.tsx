'use client';

import { NewSessionCard, MeetingsList } from '@/components/meetings';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">🎙️ AI Sales CRM</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Recorder Section */}
        <div className="md:col-span-1 space-y-4">
          <NewSessionCard />
        </div>

        {/* RIGHT: Meeting History List */}
        <div className="md:col-span-2">
          <MeetingsList />
        </div>
      </div>
    </div>
  );
}