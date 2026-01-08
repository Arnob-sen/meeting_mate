"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, ChevronRight } from "lucide-react";
import { Meeting } from "@/types/meeting";
import { cn } from "@/lib/utils";

interface MeetingCardProps {
  meeting: Meeting;
  onClick?: () => void;
  isActive?: boolean;
}

export function MeetingCard({ meeting, onClick, isActive }: MeetingCardProps) {
  const date = new Date(meeting.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative border-none transition-all duration-200 cursor-pointer rounded-xl",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "p-2 rounded-xl border transition-colors shadow-sm",
              isActive
                ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                : "bg-card group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
            )}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-lg truncate pr-2">
                {meeting.clientName}
              </h4>
              <Badge
                variant="outline"
                className={cn(
                  "border-emerald-500/20",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                    : "bg-emerald-500/10 text-emerald-600"
                )}
              >
                Analyzed
              </Badge>
            </div>

            <div
              className={cn(
                "flex items-center gap-4 text-xs",
                isActive
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {meeting.summary ? "Summary ready" : "Transcript only"}
              </span>
            </div>

            {meeting.summary?.keyPoints &&
              meeting.summary.keyPoints.length > 0 && (
                <p
                  className={cn(
                    "mt-2 text-xs line-clamp-1 italic",
                    isActive
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  &quot;{meeting.summary.keyPoints[0]}&quot;
                </p>
              )}
          </div>

          <ChevronRight
            className={cn(
              "w-5 h-5 transition-all self-center",
              isActive
                ? "text-primary-foreground translate-x-1"
                : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
