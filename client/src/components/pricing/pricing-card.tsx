"use client";

import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  onSelect: () => void;
  billingPeriod?: string;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  badge,
  onSelect,
  billingPeriod,
}: PricingCardProps) {
  const Icon = name === "Lifetime" ? Crown : name === "Pro" ? Zap : Sparkles;

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg",
        highlighted
          ? "border-primary bg-primary/5 shadow-xl scale-105"
          : "bg-card",
      )}
    >
      {badge && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-md">
            {badge}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              highlighted
                ? "bg-primary text-primary-foreground"
                : "bg-secondary",
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{price}</span>
            {billingPeriod && (
              <span className="text-muted-foreground">/{billingPeriod}</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5">
                <Check className="w-5 h-5 text-primary shrink-0" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={onSelect}
          className={cn(
            "w-full py-6 text-base font-semibold",
            highlighted
              ? "bg-primary hover:bg-primary/90"
              : "bg-secondary hover:bg-secondary/80",
          )}
        >
          {price === "$0" ? "Get Started" : "Upgrade Now"}
        </Button>
      </div>
    </div>
  );
}
