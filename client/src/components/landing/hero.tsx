"use client";

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
      <h1 className="text-5xl md:text-6xl font-bold text-foreground max-w-4xl">
        BORING MEETINGS? NEVER AGAIN
      </h1>

      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
        Hello from MeetingMate — your AI-powered meeting sidekick
      </p>

      <div className="relative mt-12 w-full max-w-4xl mx-auto">
        <img
          src="/Assets/onlineMeeting.jpg"
          alt="Online meeting illustration"
          className="w-full h-auto rounded-xl shadow-lg"
        />

        <img
          src="/Assets/aiChatbox.jpeg"
          alt="Secondary image"
          className="absolute right-0 bottom-0 w-1/2 h-auto rounded-xl shadow-xl -translate-y-12 translate-x-6"
        />
      </div>

      <h2 className="mt-16 md:mt-24 text-3xl md:text-4xl font-semibold text-foreground max-w-3xl leading-snug">
        CHECK OUT THE TOOLS THAT TURN BORING MEETINGS TO BRILLIANT
      </h2>
    </section>
  );
}
