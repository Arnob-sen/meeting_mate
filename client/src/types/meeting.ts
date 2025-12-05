export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  followUps: string[];
  sentiment: string;
}

export interface Meeting {
  _id: string;
  clientName: string;
  transcription: string;
  summary: MeetingSummary;
  createdAt: string;
}

export interface CreateMeetingRequest {
  file: File | Blob;
  clientName: string;
}

