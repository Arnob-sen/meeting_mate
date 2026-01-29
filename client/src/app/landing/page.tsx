import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Explore } from "@/components/landing/Explore";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Explore />
      <Footer />
    </main>
  );
}
