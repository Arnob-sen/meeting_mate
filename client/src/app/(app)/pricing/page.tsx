"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/pricing-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    Paddle: any;
  }
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "annual",
  );

  const openCheckout = (priceId: string, planName: string) => {
    if (!window.Paddle) {
      toast.error(
        "Payment system initializing... Please try again in a moment.",
      );
      return;
    }

    try {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "en",
          successUrl: `${window.location.origin}/subscription?success=true&plan=${planName}`,
        },
        customData: {
          email: "user@example.com", // TODO: Get from auth context
        },
      });
    } catch (error) {
      console.error("Paddle checkout error:", error);
      toast.error("Failed to open checkout. Please try again.");
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "The Hook",
      features: [
        "300 Minutes / month (~5-7 meetings)",
        "Real-time Transcription",
        "AI Summaries",
        "Talk to Meeting Chat (10 queries/meeting)",
        "7-Day History Retention",
        "Refer a friend: +60 minutes each (max +300)",
      ],
      highlighted: false,
      onSelect: () =>
        toast.success(
          "You're already on the Free tier! Upload your first meeting to get started.",
        ),
    },
    {
      name: "Pro",
      price: billingPeriod === "monthly" ? "$15" : "$12",
      description: "The No-Brainer",
      features: [
        billingPeriod === "monthly"
          ? "2,000 Minutes / month (~33 hours)"
          : "2,000 Minutes / month (~33 hours) - Save $36/year",
        "Unlimited Talk to Meeting Chat",
        "Unlimited History Retention",
        "Advanced Action Items",
        "Export to Notion/Trello",
        "Download Transcripts (PDF/DOCX)",
        "Priority Support",
      ],
      highlighted: true,
      badge: "MOST POPULAR",
      billingPeriod: billingPeriod === "monthly" ? "mo" : "mo",
      onSelect: () =>
        openCheckout(
          billingPeriod === "monthly"
            ? process.env.NEXT_PUBLIC_PADDLE_PRODUCT_PRO_MONTHLY!
            : process.env.NEXT_PUBLIC_PADDLE_PRODUCT_PRO_ANNUAL!,
          billingPeriod === "monthly" ? "Pro Monthly" : "Pro Annual",
        ),
    },
    {
      name: "Lifetime",
      price: "$49",
      description: "The Power Pack",
      features: [
        "500 Never-Expire Minutes",
        "Perfect for backup credits",
        "All Free tier features",
        '"Early Adopter" Badge',
        "Priority on Feature Roadmap",
        "One-time payment, no recurring fees",
      ],
      highlighted: false,
      billingPeriod: "one-time",
      onSelect: () =>
        openCheckout(
          process.env.NEXT_PUBLIC_PADDLE_PRODUCT_LIFETIME!,
          "Lifetime Pack",
        ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start for free. Upgrade when you need more. No surprises, just
          transparent pricing.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span
            className={
              billingPeriod === "monthly"
                ? "font-semibold"
                : "text-muted-foreground"
            }
          >
            Monthly
          </span>
          <Button
            variant="outline"
            className="relative w-14 h-8 rounded-full p-0 border-2"
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "annual" : "monthly",
              )
            }
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-primary transition-transform ${
                billingPeriod === "annual" ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </Button>
          <div className="flex items-center gap-2">
            <span
              className={
                billingPeriod === "annual"
                  ? "font-semibold"
                  : "text-muted-foreground"
              }
            >
              Annual
            </span>
            <span className="text-sm text-primary font-medium px-2 py-1 bg-primary/10 rounded">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto text-left space-y-4">
          <details className="p-4 rounded-lg bg-secondary/50">
            <summary className="font-semibold cursor-pointer">
              What counts as a "minute"?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Each minute of audio/video you upload for transcription counts as
              1 minute toward your monthly allowance.
            </p>
          </details>
          <details className="p-4 rounded-lg bg-secondary/50">
            <summary className="font-semibold cursor-pointer">
              Can I cancel anytime?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes! Pro subscriptions can be canceled anytime. You'll retain
              access until the end of your billing period.
            </p>
          </details>
          <details className="p-4 rounded-lg bg-secondary/50">
            <summary className="font-semibold cursor-pointer">
              How does the referral system work?
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your unique referral link. When someone signs up and uploads
              their first meeting, you both get +60 bonus minutes (max 5
              referrals = +300 minutes).
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
