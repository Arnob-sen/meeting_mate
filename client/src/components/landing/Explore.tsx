"use client";

import { ChevronDown, Star, Users, MessageSquare, Zap, TrendingUp, Award, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function Explore() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="explore"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-gray-50/50" />
      
      <div className="relative max-w-7xl mx-auto">
        <div 
          className={`grid md:grid-cols-2 gap-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <FAQSection />

          <CommunitySection />
        </div>
      </div>
    </section>
  );
}

/*FAQ*/

function FAQSection() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
        <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Have Questions?</h3>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        <FAQItem
          question="What is MeetingMate?"
          answer="MeetingMate is an AI-powered meeting intelligence platform that records, transcribes, summarizes, and organizes meetings so teams never lose important insights."
        />

        <FAQItem
          question="How to get started with the first meeting?"
          answer="Upload your recorded meeting or connect your meeting platform. MeetingMate automatically analyzes the content and delivers summaries, action items, and insights."
        />

        <FAQItem
          question="Which meeting platforms does it support?"
          answer="MeetingMate supports Zoom, Google Meet, Microsoft Teams, and all major audio or video file formats."
        />

        <FAQItem
          question="How quickly are summaries available after a meeting?"
          answer="Summaries are typically available within minutes after processing, depending on meeting length."
        />

        <FAQItem
          question="How accurate is the real-time transcription?"
          answer="Our AI delivers highly accurate transcriptions with speaker detection and contextual understanding."
        />

        <FAQItem
          question="Can past decisions or action items be found quickly?"
          answer="Yes. Use keyword search or natural language queries to instantly find decisions, action items, and key discussion points."
        />
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`rounded-xl border border-gray-200 p-5 bg-white transition-all duration-300 hover:shadow-md hover:border-blue-200 group ${
        isOpen ? 'shadow-sm border-blue-300 bg-blue-50/30' : ''
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left cursor-pointer"
      >
        <span className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
          isOpen ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'
        }`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
        }`}>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'mt-4 opacity-100' : 'mt-0 max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-700 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

/*COMMUNITY*/

function CommunitySection() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
        <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Community Love</h3>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
        Trusted by Teams
      </h2>

      {/* STATS TABS WITH ICONS */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value="20+"
          label="Active Teams"
          description="Growing community"
        />

        <StatCard
          icon={<Zap className="w-5 h-5" />}
          value="4.8x"
          label="Faster"
          description="Meeting efficiency"
        />

        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          value="94%"
          label="Accuracy"
          description="Transcription rate"
        />
      </div>

      {/* ACHIEVEMENT BADGES */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <BadgeCard
          icon={<Star className="w-4 h-4" />}
          title="Top Rated"
          description="On Product Hunt"
        />
        <BadgeCard
          icon={<Award className="w-4 h-4" />}
          title="Editor's Choice"
          description="AI Tools 2024"
        />
      </div>

      {/* REVIEWS */}
      <div className="space-y-6">
        <ReviewCard
          icon={<CheckCircle className="w-4 h-4" />}
          text="Since adopting MeetingMate, our meeting workflows are faster and more efficient. The accuracy of the transcriptions and quality of the summaries, combined with an intuitive interface, make it an invaluable productivity tool."
          author="Sam Altman"
          role="CEO, Open AI"
        />

        <ReviewCard
          icon={<MessageSquare className="w-4 h-4" />}
          text="An excellent solution for fast meeting summaries. Recording is simple, and the summaries are delivered within minutes. Highly recommended, particularly with the free plan."
          author="Liang Wenfeng"
          role="Product Manager"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  description
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5 text-center bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110">
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-semibold text-blue-600">{label}</p>
      </div>
      <p className="text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}

function BadgeCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center text-purple-600">
          {icon}
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  icon,
  text,
  author,
  role
}: {
  icon?: React.ReactNode;
  text: string;
  author: string;
  role?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative rounded-xl border border-gray-200 p-6 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient accent line */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-70'
      }`} />
      
      <div className="pl-4">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <span className="text-lg font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">"</span>
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4">
          {text}
        </p>
        
        <div className={`pt-4 border-t transition-all duration-300 ${
          isHovered ? 'border-blue-200' : 'border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{author}</p>
              {role && (
                <p className="text-sm text-gray-500 mt-1">{role}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background pattern on hover */}
      <div className={`absolute right-4 bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`} />
    </div>
  );
}