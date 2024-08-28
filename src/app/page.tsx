import Benefits from "@/components/ui/Benefits"
import Cta from "@/components/ui/Cta"
import Hero from "@/components/ui/Hero"
import LogoCloud from "@/components/ui/LogoCloud"
import Managed from "@/components/ui/Managed"
import OpenSource from "@/components/ui/OpenSource"
import SearchAnalytics from "@/components/ui/SearchAnalytics"

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden px-4 md:px-0">
      <Hero />
      <LogoCloud />
      <SearchAnalytics />
      <Benefits />
      <Managed />
      <OpenSource />
      {/* <Architecture /> */}
      <Cta />
    </main>
  )
}
