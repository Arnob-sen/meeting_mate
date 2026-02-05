"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { Sparkles } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          AI Chat
          <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            Pro
          </div>
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Talk to your entire meeting history and get instant insights.
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-card border rounded-3xl overflow-hidden shadow-sm">
        <ChatInterface />
      </div>
    </div>
  );
}
