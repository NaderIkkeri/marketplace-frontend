import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ExploreSection from "@/components/landing/ExploreSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <HeroSection />
      <FeaturesSection />
      <ExploreSection />
    </main>
  );
}