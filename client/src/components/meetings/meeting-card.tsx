"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Meeting } from "@/types/meeting";

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
              meeting.summary.sentiment === "Positive" ? "default" : "secondary"
            }
          >
            {meeting.summary.sentiment}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(meeting.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div>
          <span className="font-semibold text-gray-900">Key Points:</span>
          <ul className="list-disc ml-5 text-gray-600 mt-1">
            {meeting.summary.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {meeting.summary.decisions.length > 0 && (
          <div>
            <span className="font-semibold text-gray-900">Decisions:</span>
            <ul className="list-disc ml-5 text-gray-600 mt-1">
              {meeting.summary.decisions.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-slate-50 p-3 rounded-md">
          <span className="font-semibold text-gray-900">Follow-ups:</span>
          <ul className="list-disc ml-5 text-gray-600 mt-1">
            {meeting.summary.followUps.length > 0 ? (
              meeting.summary.followUps.map((f, i) => <li key={i}>{f}</li>)
            ) : (
              <li>No actions detected</li>
            )}
          </ul>
        </div>

        <details className="cursor-pointer text-blue-600 text-xs">
          <summary>View Full Transcript</summary>
          <p className="mt-2 text-gray-500 bg-gray-50 p-2 rounded whitespace-pre-wrap">
            {meeting.transcription}
          </p>
        </details>
      </CardContent>
    </Card>
  );
}
