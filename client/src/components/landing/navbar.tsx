"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-background fixed top-0 left-0 z-50 shadow-md">
      <Link href="/">
        <div className="text-2xl font-bold text-primary cursor-pointer transition-opacity hover:opacity-80">
          MeetingMate
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Features
        </Link>
        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          How it works
        </Link>
        <Link href="#explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Explore
        </Link>
        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Pricing
        </Link>

        <Link href="/auth">
          <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
