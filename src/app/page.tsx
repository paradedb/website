import Benefits from "@/components/ui/Benefits";
import Cta from "@/components/ui/Cta";
import Hero from "@/components/ui/Hero";
import HowItWorks from "@/components/ui/HowItWorks";
import Managed from "@/components/ui/Managed";
import OpenSource from "@/components/ui/OpenSource";
import SearchAnalytics from "@/components/ui/SearchAnalytics";
import SearchFeatures from "@/components/ui/SearchFeatures";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden px-2 md:px-0">
      <Hero />
      <HowItWorks />
      <SearchFeatures />
      <Benefits />
      <SearchAnalytics />
      <Managed />
      <OpenSource />
      <Cta />
    </main>
  );
}
