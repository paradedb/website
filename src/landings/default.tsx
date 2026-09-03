import Hero from "@/components/ui/Hero";
import LogoWall from "@/components/ui/LogoWall";
import PerformanceSection from "@/components/ui/PerformanceSection";
import Architecture from "@/components/ui/Architecture";
import PostgresNative from "@/components/ui/PostgresNative";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default function DefaultLanding() {
  return (
    <main className="flex flex-col overflow-x-clip px-0">
      <Hero />
      <LogoWall />
      <div id="performance">
        <PerformanceSection />
      </div>
      <div id="architecture">
        <Architecture />
      </div>
      <div id="foundation">
        <PostgresNative />
      </div>
      <div id="customers">
        <SocialProof />
      </div>
      <div id="community">
        <CommunityProof />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <PreFooterCta />
    </main>
  );
}
