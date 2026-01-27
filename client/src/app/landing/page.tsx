import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Footer/>
    </main>
  );
}
