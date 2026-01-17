"use client";

import { useState } from "react";
import { RegisterForm, VerifyOtpForm } from "@/components/auth/auth-forms";

export default function RegisterPage() {
  const [emailForVerification, setEmailForVerification] = useState<
    string | null
  >(null);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      {!emailForVerification ? (
        <RegisterForm
          onRegisterSuccess={(email) => setEmailForVerification(email)}
        />
      ) : (
        <VerifyOtpForm email={emailForVerification} />
      )}
    </div>
  );
}
