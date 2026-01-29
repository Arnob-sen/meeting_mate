"use client";

import { Upload, Brain, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload Your Meeting",
      description: "Simply drag and drop your recorded video or audio files. You can also provide meeting link."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Analysis & Extract",
      description: "Our advanced AI processes your meetings and generates summaries, key insights, and action items."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Search & Chat",
      description: "Ask questions and search to get instant, accurate answers across all your meetings."
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50" />
      
      <div className="relative max-w-6xl mx-auto">
        <div 
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
            Turn your meetings into searchable, actionable insights in three simple steps.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line - Desktop only */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 -translate-y-1/2" />
          
          {/* Steps Grid */}
          <div className="grid gap-8 lg:gap-16 lg:grid-cols-3 items-start">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Step
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  stepNumber={index + 1}
                  delay={index * 200}
                  isVisible={isVisible}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Step Card */
function Step({
  icon,
  title,
  description,
  stepNumber,
  delay = 0,
  isVisible
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
  delay?: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${
        isHovered ? 'border-blue-200' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(2rem)'
      }}
    >
      {/* Step Number Badge*/}
      <div className="absolute -top-4 -left-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold">{stepNumber}</span>
        </div>
      </div>

      {/* Icon Container */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:from-blue-100 group-hover:to-blue-200 ${
        isHovered ? 'scale-110' : ''
      }`}>
        <div className="text-blue-600 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Hover Indicator */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-full transition-all duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
}