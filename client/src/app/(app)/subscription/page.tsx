"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Crown, Share2, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SubscriptionPage() {
  const [subscriptionTier, setSubscriptionTier] = useState("FREE");
  const [minutesUsed, setMinutesUsed] = useState(125);
  const [monthlyLimit, setMonthlyLimit] = useState(300);
  const [bonusMinutes, setBonusMinutes] = useState(60);
  const [referralCode, setReferralCode] = useState("ABC123XY");

  const percentUsed = (minutesUsed / monthlyLimit) * 100;
  const totalAvailable = monthlyLimit - minutesUsed + bonusMinutes;

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan and track your usage
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-primary/50 bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {subscriptionTier === "LIFETIME" ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : subscriptionTier === "PRO" ? (
                  <Sparkles className="w-6 h-6 text-primary" />
                ) : (
                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {subscriptionTier === "FREE"
                    ? "Free Plan"
                    : subscriptionTier === "PRO"
                      ? "Pro Plan"
                      : "Lifetime Pack"}
                </CardTitle>
                <CardDescription>
                  {subscriptionTier === "FREE"
                    ? "300 minutes per month"
                    : subscriptionTier === "PRO"
                      ? "2,000 minutes per month"
                      : "500 lifetime minutes"}
                </CardDescription>
              </div>
            </div>
            {subscriptionTier === "FREE" && (
              <Link href="/pricing">
                <Button className="bg-primary hover:bg-primary/90">
                  Upgrade Plan
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                {minutesUsed} / {monthlyLimit} minutes used
              </span>
              <span className="text-muted-foreground">
                {percentUsed.toFixed(0)}%
              </span>
            </div>
            <Progress value={percentUsed} className="h-3" />
            {bonusMinutes > 0 && (
              <p className="text-sm text-primary mt-2">
                + {bonusMinutes} bonus minutes available
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalAvailable}</p>
              <p className="text-xs text-muted-foreground">Minutes Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{monthlyLimit - minutesUsed}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {subscriptionTier === "FREE" ? "7" : "∞"}
              </p>
              <p className="text-xs text-muted-foreground">Days History</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Card (Free Tier Only) */}
      {subscriptionTier === "FREE" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Refer Friends, Get Bonus Minutes</CardTitle>
                <CardDescription>
                  Earn +60 minutes for each friend who signs up (max 5
                  referrals)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 bg-secondary/50 rounded-lg px-4 py-3 font-mono text-sm">
                {window.location.origin}/?ref={referralCode}
              </div>
              <Button onClick={copyReferralLink} variant="outline">
                Copy Link
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You've referred{" "}
              <span className="font-semibold text-foreground">0</span> friends.{" "}
              {bonusMinutes > 0 && `Earned ${bonusMinutes} bonus minutes!`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Billing History (Pro/Lifetime Only) */}
      {subscriptionTier !== "FREE" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>View your past payments</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {subscriptionTier === "LIFETIME"
                        ? "Lifetime Pack"
                        : "Pro Plan - Annual"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Jan 28, 2026
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {subscriptionTier === "LIFETIME" ? "$49.00" : "$144.00"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-center py-4">
                No more transactions
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manage Subscription */}
      {subscriptionTier === "PRO" && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Your subscription renews on February 28, 2027
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Update Payment Method
              </Button>
              <Button variant="destructive" className="flex-1">
                Cancel Subscription
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cancellation takes effect at the end of your billing period
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
