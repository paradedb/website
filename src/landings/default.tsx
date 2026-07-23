import Hero from "@/components/ui/Hero";
import Architecture from "@/components/ui/Architecture";
import SearchFeatures from "@/components/ui/SearchFeatures";
import PostgresNative from "@/components/ui/PostgresNative";
import Benchmark from "@/components/ui/Benchmark";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import AgentReady from "@/components/ui/AgentReady";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default function DefaultLanding() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <Hero />
      <div id="architecture">
        <Architecture />
      </div>
      <div id="features">
        <SearchFeatures />
      </div>
      <div id="postgres">
        <PostgresNative />
      </div>
      <div id="benchmarks">
        <Benchmark />
      </div>
      <div id="customers">
        <SocialProof />
      </div>
      <div id="community">
        <CommunityProof />
      </div>
      <div id="agents">
        <AgentReady />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <PreFooterCta />
    </main>
  );
}
