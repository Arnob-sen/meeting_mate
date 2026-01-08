"use client";

import { Meeting } from "@/types/meeting";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, History, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface } from "@/components/chat/chat-interface";

interface MeetingDetailViewProps {
  meeting: Meeting;
  onClose: () => void;
}

export function MeetingDetailView({
  meeting,
  onClose,
}: MeetingDetailViewProps) {
  const date = new Date(meeting.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {meeting.clientName}
            </h2>
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20"
            >
              Analyzed
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            {date}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Tabs defaultValue="summary" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger
            value="summary"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="transcript"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Transcript
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <TabsContent
            value="summary"
            className="h-full m-0 focus-visible:ring-0"
          >
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {/* Key Points */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Key Discussion Points
                  </h3>
                  <div className="grid gap-2">
                    {meeting.summary?.keyPoints.map((point, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-secondary/30 border border-transparent hover:border-border transition-colors"
                      >
                        <p className="text-sm leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Decisions */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Decisions Made
                  </h3>
                  <div className="grid gap-2">
                    {meeting.summary?.decisions.map((decision, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-primary/5 border border-primary/10"
                      >
                        <p className="text-sm font-medium">{decision}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Follow ups */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-500" />
                    Action Items
                  </h3>
                  <div className="grid gap-2">
                    {meeting.summary?.followUps.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border shadow-sm"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-primary/20 shrink-0" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="transcript"
            className="h-full m-0 focus-visible:ring-0"
          >
            <ScrollArea className="h-full pr-4">
              <div className="p-6 rounded-2xl bg-secondary/20 border border-dashed text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground font-mono">
                {meeting.transcription}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="h-full m-0 focus-visible:ring-0">
            <ChatInterface />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
