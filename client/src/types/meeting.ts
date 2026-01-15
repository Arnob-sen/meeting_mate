export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  followUps: string[];
  sentiment: string;
}

export interface Meeting {
  _id: string;
  clientName: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  transcription?: string;
  summary?: MeetingSummary;
  createdAt: string;
}

export interface CreateMeetingRequest {
  file: File | Blob;
  clientName: string;
}

export interface ChatSource {
  meetingId: string;
  similarity: number;
}

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  meetingId?: string;
  sources?: ChatSource[];
  createdAt: string;
}
