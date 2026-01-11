"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { meetingsService } from "@/services/meetings.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  ChevronDown,
  Filter,
  History as HistoryIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import formatRagResponse from "@/lib/ragResponse";
import { Meeting, ChatMessage, ChatSource } from "@/types/meeting";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  createdAt?: string;
}

interface ChatInterfaceProps {
  initialMeetingId?: string;
}

export function ChatInterface({ initialMeetingId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setStatusLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    initialMeetingId || "all"
  );
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch meetings for the selector
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await meetingsService.getAllMeetings();
        setMeetings(data);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
      }
    };
    fetchMeetings();
  }, []);

  // Load chat history
  const loadHistory = useCallback(
    async (before?: string, replace = false) => {
      setIsHistoryLoading(true);
      try {
        const history = await meetingsService.getChatHistory(
          20,
          before,
          selectedMeetingId === "all" ? undefined : selectedMeetingId
        );

        const formattedHistory = history.map((m: ChatMessage) => ({
          id: m._id,
          role: m.role,
          content: m.content,
          sources: m.sources,
          createdAt: m.createdAt,
        }));

        if (replace) {
          setMessages(formattedHistory.reverse());
        } else {
          setMessages((prev) => [...formattedHistory.reverse(), ...prev]);
        }

        setHasMore(history.length === 20);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [selectedMeetingId]
  );

  // Initial load or when meeting selection changes
  useEffect(() => {
    loadHistory(undefined, true).then(() => {
      // Small timeout to ensure DOM is updated before scrolling
      setTimeout(() => scrollToBottom("auto"), 100);
    });
  }, [selectedMeetingId, loadHistory, scrollToBottom]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStatusLoading(true);

    try {
      const response = await meetingsService.chatWithMeetings(
        userMessage.content,
        selectedMeetingId === "all" ? undefined : selectedMeetingId
      );
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatRagResponse(response.answer),
        sources: response.sources,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => scrollToBottom(), 50);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error while searching your meetings. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (messages.length > 0 && hasMore) {
      loadHistory(messages[0].createdAt);
    }
  };

  return (
    <Card className="w-full flex flex-col shadow-2xl border-none h-full rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b bg-primary/5 pb-4 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Meeting Brain</CardTitle>
              <CardDescription className="text-xs">
                AI-powered meeting assistant
              </CardDescription>
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 border border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                className="bg-transparent text-xs font-medium focus:outline-none appearance-none pr-6 cursor-pointer"
              >
                <option value="all">🧠 All Meetings</option>
                {meetings.map((m) => (
                  <option key={m._id} value={m._id}>
                    📁 {m.clientName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20"
      >
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoadMore}
              disabled={isHistoryLoading}
              className="text-xs text-muted-foreground hover:text-primary gap-2"
            >
              {isHistoryLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <HistoryIcon className="w-3 h-3" />
              )}
              Load earlier messages
            </Button>
          </div>
        )}

        {messages.length === 0 && !isHistoryLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12 text-primary" />
            <div className="max-w-[200px]">
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">
                Ask a question about your{" "}
                {selectedMeetingId === "all" ? "meetings" : "meeting"} to start
                the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card border text-foreground rounded-tl-none"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div
                    className={cn(
                      "mt-3 text-[10px] font-semibold uppercase tracking-widest pt-2 border-t",
                      message.role === "user"
                        ? "border-primary-foreground/20 text-primary-foreground/70"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    Context: {message.sources.length} meetings analyzed
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-secondary text-secondary-foreground border">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in duration-300">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-card border rounded-2xl rounded-tl-none px-5 py-3 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-6 pt-2 bg-linear-to-t from-card to-transparent border-t">
        <form onSubmit={handleSubmit} className="relative group">
          <Input
            placeholder={
              selectedMeetingId === "all"
                ? "Ask anything about past meetings..."
                : "Ask about this meeting..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full h-14 pl-6 pr-16 rounded-2xl bg-secondary/80 border-none shadow-inner focus-visible:ring-primary/30 transition-all text-sm font-medium"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-wider font-semibold opacity-70">
          ✨ Artificial Intelligence Powering Your Meeting Insights
        </p>
      </div>
    </Card>
  );
}
