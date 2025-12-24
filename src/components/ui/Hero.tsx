import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { codeToTokens } from "shiki";
import { HeroDemo } from "./HeroDemo";
import LogoCloud from "./LogoCloud";

const code = `SELECT *, pdb.score(id) FROM animals
WHERE name &&& 'elephant'
ORDER BY pdb.score(id) DESC;`;

export default async function Hero() {
  const { tokens } = await codeToTokens(code, {
    lang: "sql",
    theme: "github-dark-dimmed",
  });

  return (
    <div className="px-12">
      <section
        aria-labelledby="hero-title"
        className="rounded-xl ring-1 ring-indigo-100 border-3 border-indigo-50 mt-4 overflow-hidden flex flex-col"
      >
        <div
          className="relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 pt-20 sm:pb-20 text-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(238, 242, 255, 0.6), rgba(238, 242, 255, 0.0)), url('/splash_color.png')",
          }}
        >
          <div className="flex flex-col items-center w-full relative z-20">
            <h1
              id="hero-title"
              className="inline-block animate-slide-up-fade bg-gradient-to-br from-indigo-900 to-indigo-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-indigo-900 text-transparent sm:text-6xl mt-4"
              style={{ animationDuration: "700ms" }}
            >
              <span className="text-indigo-600">Search</span> for the Modern <br />{" "}
              <span className="text-indigo-600">Postgres</span> Stack
            </h1>
            <p
              className="text-md mt-2 max-w-xl animate-slide-up-fade text-indigo-950 md:mt-6 md:text-lg"
              style={{ animationDuration: "900ms" }}
            >
              Add Elastic-quality search to your Postgres today, not next quarter.<br/>
              Zero ETL, zero Elastic clusters, zero headache.
            </p>
            <div
              className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
              style={{ animationDuration: "1100ms" }}
            >
              <Button className="text-md rounded-xl px-4 bg-indigo-600 ring-2 ring-indigo-400 border-1 border-indigo-400">
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <Button
                asChild
                variant="light"
                className="text-md hover: group rounded-full bg-transparent hover:bg-transparent"
              >
                <Link
                  href={documentation.BASE}
                  className="text-indigo-900 ring-1 ring-gray-200 sm:ring-0"
                  target="_blank"
                >
                  Documentation
                  <ArrowAnimated className="stroke-indigo-900" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div
              className="relative mx-auto ml-3 mt-16 hidden h-fit w-[40rem] max-w-3xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2 md:block"
              style={{ animationDuration: "1400ms" }}
            >
              <HeroDemo tokens={tokens} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#4f46e5] pointer-events-none" />
        </div>

        <div className="bg-[#4f46e5] z-20 relative pt-4">
          <div className="text-md mx-auto font-medium text-indigo-200 mb-8 animate-slide-up-fade text-center" style={{ animationDuration: "1500ms" }}>
            Trusted by enterprises, loved by developers
          </div>
          <LogoCloud />
        </div>
      </section>
    </div>
  );
}
