"use client";

import { User, Bell, Shield, Palette } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const sections = [
    {
      title: "Profile",
      description: "Change your public information",
      icon: User,
    },
    {
      title: "Notifications",
      description: "Manage alerts and emails",
      icon: Bell,
    },
    { title: "Security", description: "Update password and 2FA", icon: Shield },
    {
      title: "Appearance",
      description: "Switch between light and dark mode",
      icon: Palette,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and app preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="hover:bg-secondary/20 transition-colors cursor-pointer border-none shadow-sm bg-secondary/10"
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border shadow-sm">
                <section.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
              <Button variant="ghost">Edit</Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="pt-8 border-t flex items-center justify-between">
        <div>
          <p className="font-semibold text-destructive">Danger Zone</p>
          <p className="text-sm text-muted-foreground">
            Deactivate or delete your account
          </p>
        </div>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
}
