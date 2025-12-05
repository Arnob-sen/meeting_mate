'use client';

import { useState } from 'react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useMeetings, useCreateMeeting } from '@/hooks/use-meetings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Square, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { isRecording, startRecording, stopRecording, audioBlob, recordingTime, formatTime, resetRecording } = useAudioRecorder();
  const [clientName, setClientName] = useState('');
  
  // TanStack Query hooks
  const { data: meetings = [], isLoading: isLoadingMeetings } = useMeetings();
  const createMeetingMutation = useCreateMeeting();

  const handleProcess = async () => {
    if (!audioBlob) {
      toast.error('Please record audio first');
      return;
    }
    
    if (!clientName.trim()) {
      toast.error('Please enter a client name');
      return;
    }

    createMeetingMutation.mutate(
      {
        file: audioBlob,
        clientName: clientName.trim(),
      },
      {
        onSuccess: () => {
          // Reset UI on success
          setClientName('');
          resetRecording();
        },
      },
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">🎙️ AI Sales CRM</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT: Recorder Section */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>New Session</CardTitle>
              <CardDescription>Record your client meeting</CardDescription>
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
                    <Button onClick={startRecording} variant="destructive" className="w-32 rounded-full">
                      <Mic className="mr-2 h-4 w-4" /> Record
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="outline" className="w-32 rounded-full border-red-500 text-red-500 hover:bg-red-50">
                      <Square className="mr-2 h-4 w-4" /> Stop
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
                  {createMeetingMutation.isPending ? 'Transcribing (AI)...' : 'Process & Save'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Meeting History List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Meetings</h2>
          <ScrollArea className="h-[600px] pr-4">
            {isLoadingMeetings ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : meetings.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p>No meetings yet. Record your first meeting to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                <Card key={meeting._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{meeting.clientName}</CardTitle>
                      <Badge variant={meeting.summary.sentiment === 'Positive' ? 'default' : 'secondary'}>
                        {meeting.summary.sentiment}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div>
                      <span className="font-semibold text-gray-900">Key Points:</span>
                      <ul className="list-disc ml-5 text-gray-600 mt-1">
                        {meeting.summary.keyPoints.slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-md">
                      <span className="font-semibold text-gray-900">Follow-up:</span>
                      <p className="text-gray-600 mt-1">{meeting.summary.followUps[0] || "No actions detected"}</p>
                    </div>

                    <details className="cursor-pointer text-blue-600 text-xs mt-2">
                      <summary>View Full Transcript</summary>
                      <p className="mt-2 text-gray-500 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {meeting.transcription}
                      </p>
                    </details>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

      </div>
    </div>
  );
}