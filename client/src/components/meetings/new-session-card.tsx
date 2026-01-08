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
import { Mic, Square, Save, Loader2, Monitor } from "lucide-react";
import { toast } from "sonner";

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
    isSystemAudio,
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
    <Card className="border-2 border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>New Session</CardTitle>
        <CardDescription>
          {isRecording
            ? isSystemAudio
              ? "Recording System Audio..."
              : "Recording Microphone..."
            : "Record your client meeting"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Client Name (e.g. Acme Corp)"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-dashed">
          <div className="text-4xl font-mono font-bold text-slate-700 mb-4">
            {formatTime(recordingTime)}
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                variant="destructive"
                className="w-32 rounded-full"
              >
                <Mic className="mr-2 h-4 w-4" /> Record Mic
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="outline"
                className="w-32 rounded-full border-red-500 text-red-500 hover:bg-red-50"
              >
                <Square className="mr-2 h-4 w-4" /> Stop
              </Button>
            )}

            {!isRecording && (
              <Button
                onClick={startSystemRecording}
                variant="secondary"
                className="w-40 rounded-full"
              >
                <Monitor className="mr-2 h-4 w-4" /> Online Meeting
              </Button>
            )}
          </div>
        </div>

        {audioBlob && !isRecording && (
          <Button
            onClick={handleProcess}
            disabled={createMeetingMutation.isPending}
            className="w-full"
          >
            {createMeetingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {createMeetingMutation.isPending
              ? "Transcribing (AI)..."
              : "Process & Save"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
