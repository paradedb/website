import Cta from "@/components/ui/Cta";
import HeroV3 from "@/components/ui/HeroV3";
import HowItWorks from "@/components/ui/HowItWorks";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden px-2 md:px-0">
      <HeroV3 />
      <SearchFeatures />
      <HowItWorks />
      <SocialProof />
      <CommunityProof />
      <Cta />
    </main>
  );
}
