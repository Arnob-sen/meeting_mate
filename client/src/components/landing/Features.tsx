"use client";

import { useState, useEffect } from "react";

export function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: "Instant Meeting Summaries",
      image: "/Assets/feature-summary.png",
      alt: "Instant Meeting Summaries",
      items: [
        {
          title: "AI-Powered Summaries",
          description: "Get concise, accurate meeting summaries with key decisions, action items, and takeaways."
        },
        {
          title: "Smart Keywords & Topics",
          description: "Automatically extract and categorize topics, making it easy to find what matters."
        },
        {
          title: "Automatically Organized",
          description: "Access tagged meetings with topics, keywords, and categories so you can find exactly what you need in seconds."
        },
        {
          title: "Real-Time Transcription",
          description: "Instantly transcribe your recordings with automated speaker detection and labeling."
        }
      ]
    },
    {
      title: "Conversational Memory",
      image: "/Assets/feature-search.jpg",
      alt: "Conversational Memory",
      items: [
        {
          title: "Keyword Searching",
          description: "Ask questions in natural language and find exact moments, making meeting history instantly accessible."
        },
        {
          title: "Smart Chatbot",
          description: "Experience the advantage of a personal chatbot designed to elevate your performance."
        },
        {
          title: "Suggestion & Analysis",
          description: "Unlock intelligent, context-aware analysis that empowers smarter decisions."
        },
        {
          title: "Quick Filters",
          description: "Access a filtering system that enables you to locate meetings or notes based on time and product."
        }
      ]
    },
    {
      title: "Built for Every Team",
      image: "/Assets/feature-teams.jpeg",
      alt: "Teams using MeetingMate",
      items: [
        {
          title: "Product Managers",
          description: "Never miss a feature request or user insight buried in customer calls."
        },
        {
          title: "Developer Teams",
          description: "Reference technical decisions and architecture discussions instantly."
        },
        {
          title: "Sales & Marketing",
          description: "Track customer commitments and follow-ups across all client meetings."
        },
        {
          title: "Executive Boards",
          description: "Get high-level summaries and spot trends across all team discussions."
        }
      ]
    }
  ];

  return (
    <section
      id="features"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          className={`text-center mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className = "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform your meetings into actionable insights
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="md:w-1/3">
            <div className="space-y-2">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    activeTab === index
                      ? "bg-white shadow-lg shadow-blue-100 border-l-4 border-blue-500 translate-x-2"
                      : "hover:bg-white/50 hover:translate-x-1"
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">{feature.title}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Content */}
          <div className="md:w-2/3">
            <div className="relative">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    activeTab === index
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible absolute top-0 left-0 translate-y-4'
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div
                        className={`transition-all duration-700 delay-200 ${
                          activeTab === index
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-95'
                        } ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}
                      >
                        <div className="relative">
                          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
                          <img
                            src={feature.image}
                            alt={feature.alt}
                            className="relative w-full rounded-2xl shadow-2xl ring-2 ring-white/50 object-cover h-[400px] transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </div>
                      </div>

                      {/* Feature Items */}
                      <div className={`space-y-6 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <h3
                          className={`text-3xl font-bold text-gray-900 transition-all duration-500 delay-100 ${
                            activeTab === index
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 translate-x-4'
                          }`}
                        >
                          {feature.title}
                        </h3>
                        
                        <div className="space-y-6">
                          {feature.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className={`group transition-all duration-300 hover:translate-x-2 ${
                                activeTab === index
                                  ? `opacity-100 translate-x-0 delay-${(itemIndex + 1) * 100}`
                                  : 'opacity-0 translate-x-4'
                              }`}
                              style={{
                                transitionDelay: activeTab === index ? `${itemIndex * 100}ms` : '0ms'
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform duration-300 group-hover:bg-blue-600" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                    {item.title}
                                  </h4>
                                  <p className="mt-1 text-gray-600 leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Indicator */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTab === index
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}