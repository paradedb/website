import dynamic from "next/dynamic";
import HeroV3 from "@/components/ui/HeroV3";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import { LazySection } from "@/components/ui/LazySection";

const HowItWorks = dynamic(() => import("@/components/ui/HowItWorks"));
const PreFooterCta = dynamic(() => import("@/components/ui/PreFooterCta"));

export default async function Home() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <HeroV3 />
      <SearchFeatures />
      <LazySection minHeight="800px">
        <HowItWorks />
      </LazySection>
      <SocialProof />
      <CommunityProof />
      <Pricing />
      <LazySection minHeight="500px">
        <PreFooterCta />
      </LazySection>
    </main>
  );
}
