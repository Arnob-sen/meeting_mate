"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Paddle: any;
  }
}

export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Paddle.js script
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    script.onload = () => {
      if (window.Paddle) {
        try {
          window.Paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
            environment:
              process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox",
          });
          setIsLoaded(true);
          console.log("✅ Paddle.js initialized");
        } catch (error) {
          console.error("Failed to initialize Paddle:", error);
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}
