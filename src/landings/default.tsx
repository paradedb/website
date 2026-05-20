import Hero from "@/components/ui/Hero";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import HowItWorks from "@/components/ui/HowItWorks";
import AgentReady from "@/components/ui/AgentReady";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default function DefaultLanding() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <Hero />
      <SearchFeatures />
      <HowItWorks />
      <SocialProof />
      <CommunityProof />
      <AgentReady />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
