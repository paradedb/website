import Hero from "@/components/ui/Hero";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import AgentReady from "@/components/ui/AgentReady";
import PreFooterCta from "@/components/ui/PreFooterCta";
import TextWall from "@/components/ui/TextWall";

export default function DefaultLanding() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <Hero />
      <TextWall />
      <SearchFeatures />
      <SocialProof />
      <CommunityProof />
      <AgentReady />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
