"use client";

import { useState } from "react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useCreateMeeting } from "@/hooks/use-meetings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mic, Square, Save, Loader2, Monitor, Radio } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewSessionCard() {
  const {
    isRecording,
    startRecording,
    startSystemRecording,
    stopRecording,
    audioBlob,
    recordingTime,
    formatTime,
    resetRecording,
  } = useAudioRecorder();
  const [clientName, setClientName] = useState("");
  const createMeetingMutation = useCreateMeeting();

  const handleProcess = () => {
    if (!audioBlob) {
      toast.error("Please record audio first");
      return;
    }

    if (!clientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    createMeetingMutation.mutate(
      {
        file: audioBlob,
        clientName: clientName.trim(),
      },
      {
        onSuccess: () => {
          setClientName("");
          resetRecording();
        },
      }
    );
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">New Session</CardTitle>
            <CardDescription>Capture audio for analysis</CardDescription>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 animate-pulse text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3" />
              Live
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">
            Client Name
          </label>
          <Input
            placeholder="e.g. Acme Corp Strategic Call"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="h-11 rounded-xl bg-secondary/30 border-none focus-visible:ring-primary/20"
          />
        </div>

        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300",
            isRecording
              ? "border-red-500/50 bg-red-500/5"
              : "border-muted-foreground/20 bg-secondary/10"
          )}
        >
          {isRecording && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10 pointer-events-none">
              {/* Visualizer effect would go here */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-red-500 to-transparent animate-pulse" />
            </div>
          )}

          <div
            className={cn(
              "text-5xl font-mono font-bold tracking-tighter mb-6",
              isRecording ? "text-red-600" : "text-foreground"
            )}
          >
            {formatTime(recordingTime)}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {!isRecording ? (
              <>
                <Button
                  onClick={startRecording}
                  className="rounded-full px-6 h-12 shadow-lg shadow-primary/20"
                >
                  <Mic className="mr-2 h-5 w-5" /> Offline Meeting
                </Button>
                <Button
                  onClick={startSystemRecording}
                  variant="outline"
                  className="rounded-full px-6 h-12 bg-card border-2"
                >
                  <Monitor className="mr-2 h-5 w-5" /> Online Meeting
                </Button>
              </>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="rounded-full px-8 h-12 animate-in zoom-in-95 duration-200"
              >
                <Square className="mr-2 h-5 w-5 fill-current" /> Stop & Finalize
              </Button>
            )}
          </div>
        </div>

        {audioBlob && !isRecording && (
          <Button
            onClick={handleProcess}
            disabled={createMeetingMutation.isPending}
            className="w-full h-12 rounded-xl text-lg font-semibold bg-primary hover:primary/90 shadow-xl shadow-primary/20 group"
          >
            {createMeetingMutation.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
            {createMeetingMutation.isPending
              ? "Transcribing with AI..."
              : "Generate Summary & Insights"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
