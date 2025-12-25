import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { codeToTokens } from "shiki";
import { HeroDemo } from "./HeroDemo";
import LogoCloud from "./LogoCloud";

const code = `SELECT *, pdb.score(id) FROM animals
WHERE name &&& 'elephant' AND weight >= 4000
ORDER BY pdb.score(id) DESC;`;

export default async function Hero() {
  const { tokens } = await codeToTokens(code, {
    lang: "sql",
    theme: "github-dark-dimmed",
  });

  return (
    <div className="px-2 md:px-12">
      <section
        aria-labelledby="hero-title"
        className="ring-1 ring-indigo-100 border-3 border-indigo-50 mt-4 overflow-hidden flex flex-col"
      >
        <div
          className="relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:py-20 py-8 text-center"
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
              className="text-md mt-2 max-w-2xl animate-slide-up-fade text-indigo-950 md:mt-6 md:text-lg"
              style={{ animationDuration: "900ms" }}
            >
              You need better search, not the complexity of Elasticsearch.<br/>
              ParadeDB is the simplest way to bring the power of Elastic to Postgres.
            </p>
            <div
              className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
              style={{ animationDuration: "1100ms" }}
            >
              <Button className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 border-1 border-indigo-400 rounded-none">
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <Button
                asChild
                variant="light"
                className="text-md hover:group bg-transparent hover:bg-transparent border-0"
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
              className="relative mx-auto mt-8 sm:mt-16 flex w-full max-w-[40rem] animate-slide-up-fade justify-center px-2"
              style={{ animationDuration: "1400ms" }}
            >
              <div className="rounded-lg relative w-full h-[12.2rem] sm:h-auto overflow-hidden sm:overflow-visible flex justify-center">
                <div className="rounded-lg min-w-[35rem] sm:min-w-0 scale-[0.55] origin-top sm:w-full sm:scale-100 sm:transform-none">
                  <HeroDemo tokens={tokens} />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#4f46e5] pointer-events-none z-10" />
        </div>

        <div className="bg-[#4f46e5] z-20 relative">
          <LogoCloud />
        </div>
      </section>
    </div>
  );
}
