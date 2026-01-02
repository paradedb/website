import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { Navigation } from "@/components/ui/Navbar";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import Image from "next/image";

export default function HeroV2() {
  return (
    <div className="px-2 md:px-12 w-full mx-auto pt-12">
      <section className="ring-1 ring-gray-200 mt-4 overflow-hidden flex flex-col bg-white">
        <Navigation />
        <div className="relative flex flex-col lg:flex-row items-center justify-between px-8 md:px-12 py-20">
          {/* Text Content */}
          <div className="relative z-20 flex flex-col items-start w-full lg:w-[70%] shrink-0">
            <h1 className="text-6xl md:text-[5.2rem] font-semibold tracking-tighter text-indigo-900 leading-[0.85] uppercase">
              The <span className="text-scanlines">Fastest</span> Way<br/>to Add <span className="text-scanlines">Search</span><br/>to Postgres
            </h1>
            <p className="mt-8 text-lg max-w-lg text-gray-700">
              You need better search, not the burden of Elasticsearch. ParadeDB is
              the modern Elasticsearch alternative built as a Postgres extension.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full sm:w-auto">
              <Button className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 border-1 border-indigo-400 rounded-none h-10">
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <Button
                asChild
                variant="light"
                className="text-md hover:group bg-transparent hover:bg-transparent border-0 h-10 px-4"
              >
                <Link
                  href={documentation.BASE}
                  className="text-indigo-900 ring-1 ring-gray-200 sm:ring-0 flex items-center gap-2"
                  target="_blank"
                >
                  Documentation
                  <ArrowAnimated
                    className="stroke-indigo-900"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image - Positioned to overlap/come out of text */}
          <div className="absolute top-3/8 right-[20%] lg:right-[12%] -translate-y-1/2 w-[60%] lg:w-[55%] h-full hidden lg:block pointer-events-none z-10 mix-blend-multiply opacity-90">
            <div className="relative w-full h-full">
              <Image
                src="/splash_hero_v2.png"
                alt="ParadeDB Splash Plane"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>

          {/* Mobile Image */}
          <div className="w-full mt-12 lg:hidden">
             <div className="relative w-full aspect-[4/3]">
              <Image
                src="/splash_hero_v2.png"
                alt="ParadeDB Splash Plane"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-0 border-t border-gray-100">
          <LogoCloud variant="white" />
        </div>
      </section>
    </div>
  );
}
