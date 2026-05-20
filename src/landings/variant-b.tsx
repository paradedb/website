/**
 * Variant B — example landing page (starter template).
 *
 * A condensed, proof-led alternative to the default landing: it leads with
 * customer quotes and community proof directly under the hero, then jumps
 * straight to pricing, dropping the deeper feature / how-it-works sections.
 * It is intentionally very different from `default` so the swap is obvious.
 *
 * Edit it freely, or duplicate this file to create a new variant and register
 * it in `index.ts`. Preview it at /preview/variant-b.
 */
import Hero from "@/components/ui/Hero";
import SocialProof from "@/components/ui/SocialProof";
import CommunityProof from "@/components/ui/CommunityProof";
import Pricing from "@/components/ui/Pricing";
import PreFooterCta from "@/components/ui/PreFooterCta";

export default function VariantBLanding() {
  return (
    <main className="flex flex-col overflow-hidden px-0">
      <Hero />
      <SocialProof />
      <CommunityProof />
      <Pricing />
      <PreFooterCta />
    </main>
  );
}
