import HeroV3 from "@/components/ui/HeroV3";
import HowItWorks from "@/components/ui/HowItWorks";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default async function Home() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <HeroV3 />
      <SearchFeatures />
      <HowItWorks />
      <SocialProof />
      <CommunityProof />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
