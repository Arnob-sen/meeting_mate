'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Meeting } from '@/types/meeting';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{meeting.clientName}</CardTitle>
          <Badge
            variant={
              meeting.summary.sentiment === 'Positive' ? 'default' : 'secondary'
            }
          >
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
            {meeting.summary.keyPoints.slice(0, 3).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-50 p-3 rounded-md">
          <span className="font-semibold text-gray-900">Follow-up:</span>
          <p className="text-gray-600 mt-1">
            {meeting.summary.followUps[0] || 'No actions detected'}
          </p>
        </div>

        <details className="cursor-pointer text-blue-600 text-xs mt-2">
          <summary>View Full Transcript</summary>
          <p className="mt-2 text-gray-500 bg-gray-50 p-2 rounded whitespace-pre-wrap">
            {meeting.transcription}
          </p>
        </details>
      </CardContent>
    </Card>
  );
}

