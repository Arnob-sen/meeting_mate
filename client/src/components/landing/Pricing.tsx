"use client";

import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started quickly and effortlessly",
    features: [
      "Ideal for individuals or small teams",
      "Access basic AI meeting summaries",
      "Search meetings with keywords",
      "Limited monthly usage",
      "Basic support"
    ],
    buttonGradient: "from-gray-500 to-gray-600",
    borderColor: "border-gray-200",
  },
  {
    name: "Pro",
    price: "$12",
    description: "Unlock more insights and efficiency",
    features: [
      "Perfect for growing teams",
      "Smarter AI summaries & insights",
      "Advanced keyword & topic search",
      "Priority processing",
      "Advanced analytics",
      "Team collaboration"
    ],
    buttonGradient: "from-blue-400 to-blue-600",
    borderColor: "border-blue-200",
  },
  {
    name: "Enterprise",
    price: "$49",
    description: "Maximize team productivity",
    features: [
      "Designed for large enterprises",
      "Advanced analytics & AI tools",
      "Team-wide collaboration features",
      "Priority support & onboarding",
      "Custom integrations",
      "Dedicated account manager"
    ],
    buttonGradient: "from-purple-400 to-purple-600",
    borderColor: "border-purple-200",
  },
];

export function Pricing() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="pricing" 
      className="relative py-32 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-blue-50/30" />
      
      <div className="relative max-w-7xl mx-auto">
        <div 
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your needs today — upgrade anytime as you grow.
          </p>
        </div>

        <div 
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`relative h-full rounded-2xl border-2 ${plan.borderColor} shadow-lg bg-white p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "$0" && (
                      <span className="text-gray-500 ml-1">/month</span>
                    )}
                  </div>
                  {plan.price === "$0" && (
                    <p className="text-gray-500 text-sm mt-1">Free forever</p>
                  )}
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 flex-grow mb-8">
                  {plan.features.map((feature) => (
                    <li 
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/payment" className="w-full">
                  <button
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${plan.buttonGradient} hover:shadow-xl hover:-translate-y-1 active:scale-95`}
                  >
                    Select Plan
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-sm text-gray-500">
            All plans include a 14-day free trial
          </p>
        </div>
      </div>
    </section>
  );
}