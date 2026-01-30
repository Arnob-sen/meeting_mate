"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Main Heading */}
        <div 
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto">
            <span className="text-gray-900">Boring Meetings?</span>
            <br />
            <span className="text-blue-600">Never Again</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div 
          className={`mt-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Hello from <span className="font-semibold text-blue-600">MeetingMate</span> — your AI-powered meeting sidekick
          </p>
        </div>

        {/* Main Image Container */}
        <div 
          className={`relative mt-12 w-full max-w-5xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative">
            {/* Subtle Glow Effect */}
            <div className="absolute -inset-4 bg-blue-100 rounded-2xl blur-xl opacity-30" />
            
            {/* Main Image */}
            <img
              src="/Assets/onlineMeeting.jpg"
              alt="Online meeting illustration"
              className="relative w-full h-auto rounded-xl shadow-lg ring-1 ring-gray-200 object-cover"
            />

            {/* Floating AI Chatbox Image */}
            <div 
              className={`absolute right-0 bottom-0 w-[40%] transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-6 translate-y-6'
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-blue-100 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                <img
                  src="/Assets/aiChatbox.jpeg"
                  alt="AI Chatbox interface"
                  className="relative w-full h-auto rounded-lg shadow-lg ring-1 ring-gray-200 transform -translate-y-8 translate-x-4 hover:-translate-y-10 hover:translate-x-5 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Heading */}
        <div 
          className={`mt-20 md:mt-24 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
        </div>
      </div>

      {/* Very subtle background elements */}
      <div className="absolute top-1/4 left-5 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-10" />
      <div className="absolute bottom-1/4 right-5 w-64 h-64 bg-gray-100 rounded-full mix-blend-multiply filter blur-2xl opacity-10" />
    </section>
  );
}