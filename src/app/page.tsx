import HeroV3 from "@/components/ui/HeroV3";
import HowItWorks from "@/components/ui/HowItWorks";
import SearchFeatures from "@/components/ui/SearchFeatures";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import PreFooterCta from "@/components/ui/PreFooterCta";
import { codeToTokens } from "shiki";

const dockerCode = `docker run --name paradedb -e POSTGRES_PASSWORD=password paradedb/paradedb
docker exec -it paradedb psql -U postgres`;

export default async function Home() {
  const lightTokens = await codeToTokens(dockerCode, {
    lang: "bash",
    theme: "github-light",
  });

  const darkTokens = await codeToTokens(dockerCode, {
    lang: "bash",
    theme: "one-dark-pro",
  });

  return (
    <main className="flex flex-col overflow-hidden px-0">
      <HeroV3
        lightTokens={lightTokens.tokens}
        darkTokens={darkTokens.tokens}
        code={dockerCode}
      />
      <SearchFeatures />
      <HowItWorks />
      <SocialProof />
      <CommunityProof />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
