import CodeExample from "@/components/ui/CodeExample"
import Cta from "@/components/ui/Cta"
import Features from "@/components/ui/Features"
import { GlobalDatabase } from "@/components/ui/GlobalDatabase"
import Hero from "@/components/ui/Hero"
import LogoCloud from "@/components/ui/LogoCloud"
import SearchAnalytics from "@/components/ui/SearchAnalytics"

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <LogoCloud />
      <SearchAnalytics />
      <GlobalDatabase />
      <CodeExample />
      <Features />
      <Cta />
    </main>
  )
}
