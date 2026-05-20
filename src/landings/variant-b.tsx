/**
 * Variant B — example landing page (starter template).
 *
 * This is a copy of the default landing with the sections reordered, purely to
 * demonstrate how to test an alternate page. Edit it freely, or duplicate this
 * file to create a new variant, then register it in `index.ts`.
 *
 * Preview it at /preview/variant-b without changing the live homepage.
 */
import Hero from "@/components/ui/Hero";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import HowItWorks from "@/components/ui/HowItWorks";
import AgentReady from "@/components/ui/AgentReady";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default function VariantBLanding() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <Hero />
      {/* Social proof pulled up directly under the hero in this variant */}
      <SocialProof />
      <SearchFeatures />
      <HowItWorks />
      <CommunityProof />
      <AgentReady />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
