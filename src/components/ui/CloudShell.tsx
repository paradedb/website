import { DarkModeOverlay } from "@/components/ui/DarkModeOverlay";
import AsciiCloud from "@/components/ui/AsciiCloud";

// The /cloud page chrome (indigo hero, drifting dither, hatch band, vertical
// rules). Children render inside the centered column.
export default function CloudShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex w-full flex-col bg-indigo-600 sm:min-h-screen">
      {/* Subtle dark-mode tint, matching the homepage hero */}
      <DarkModeOverlay />

      {/* Full-bleed drifting dither behind everything, fading out to the sides */}
      <AsciiCloud />

      <section className="relative mx-auto flex w-full max-w-[1440px] flex-1 items-start px-4 sm:items-center md:px-12">
        {/* Top shaded region, lifted from the homepage hero chrome */}
        <div className="absolute top-[64px] md:top-[80px] left-4 md:left-12 right-4 md:right-12 z-20">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-b border-white/20 bg-indigo-700/20 opacity-60" />
        </div>

        {/* Horizontal line below top shaded region - constrained to vertical lines */}
        <div className="absolute top-[96px] md:top-[128px] left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />

        <div className="relative z-20 mx-auto flex w-full flex-col items-center px-6 pb-16 pt-36 text-center sm:mt-28 sm:px-0 sm:py-32">
          {children}
        </div>

        {/* Global vertical lines, matching the homepage hero chrome */}
        <div className="pointer-events-none absolute top-[64px] bottom-0 left-4 z-30 w-px bg-white/20 md:top-[80px] md:left-12" />
        <div className="pointer-events-none absolute top-[64px] bottom-0 right-4 z-30 w-px bg-white/20 md:top-[80px] md:right-12" />
      </section>
    </main>
  );
}
