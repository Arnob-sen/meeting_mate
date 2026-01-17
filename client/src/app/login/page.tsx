"use client";

import { LoginForm } from "@/components/auth/auth-forms";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <LoginForm />
    </div>
  );
}
