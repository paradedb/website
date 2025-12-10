"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiBracesLine,
  RiMoneyDollarCircleLine,
  RiShakeHandsLine,
  RiShieldCheckLine,
  RiStackLine,
  RiSwap2Line,
  RiGithubFill,
  RiArrowRightLine,
} from "@remixicon/react";
import { social, documentation, github, email } from "@/lib/links";
import Bilt from "@/components/ui/logos/Bilt";
import Alibaba from "@/components/ui/logos/Alibaba";
import DockerLogo from "@/components/ui/DockerLogo";
import PostgresLogo from "@/components/ui/PostgresLogo";
import { DitheredHeroGraphic, DitheredSearchGraphic, DitheredAnalyticsGraphic } from "@/components/ui/DitheredGraphics";

// --- Dither Effect Component ---
const DitherBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]" aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
        backgroundSize: "4px 4px",
      }}
    />
  </div>
);

// --- Reusable Components ---

const SectionHeader = ({ badge, title, description }: { badge?: string; title: React.ReactNode; description: string }) => (
  <div className="mb-16">
    {badge && (
      <span className="inline-block px-3 py-1 mb-4 text-xs font-mono font-bold tracking-widest text-black bg-white uppercase border border-black">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black mb-6 leading-[0.9]">
      {title}
    </h2>
    <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed">
      {description}
    </p>
  </div>
);

const GridCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="group relative border border-zinc-200 bg-white p-8 hover:bg-zinc-50 transition-colors duration-300">
    <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
       <Icon className="w-6 h-6 text-zinc-400 group-hover:text-black" />
    </div>
    <h3 className="text-xl font-bold text-black mb-3 mt-4">{title}</h3>
    <p className="text-zinc-600 leading-relaxed text-sm">{description}</p>
  </div>
);

const StatCard = ({ metric, label, description, buttonText, href, icon: Icon }: any) => (
  <div className="border border-zinc-200 bg-white p-8 flex flex-col justify-between hover:border-zinc-400 transition-colors">
    <div>
      <div className="flex items-center justify-between mb-6">
        <Icon className="w-8 h-8 text-black" />
        <span className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-black to-zinc-400">
          {metric}
        </span>
      </div>
      <h3 className="text-lg font-bold text-black mb-2">{label}</h3>
      <p className="text-zinc-600 text-sm mb-8">{description}</p>
    </div>
    <Link href={href} target="_blank" className="inline-flex items-center text-sm font-mono text-black hover:underline uppercase tracking-wide">
      {buttonText} <RiArrowRightLine className="ml-2 w-4 h-4" />
    </Link>
  </div>
);

const FeatureCard = ({ title, description, image: ImageComponent, link }: any) => (
  <div className="border border-zinc-200 bg-zinc-50 overflow-hidden group">
    <div className="p-8 border-b border-zinc-200 bg-white relative z-10">
      <h3 className="text-2xl font-bold text-black mb-2">{title}</h3>
      <p className="text-zinc-600 mb-6">{description}</p>
      <Link href={link} target="_blank" className="inline-block px-6 py-2 bg-black text-white font-bold text-sm hover:bg-zinc-800 transition-colors">
        READ DOCS
      </Link>
    </div>
    <div className="relative h-64 md:h-80 bg-zinc-100 p-8 grayscale group-hover:grayscale-0 transition-all duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_0)] [background-size:16px_16px] opacity-20"></div>
       <ImageComponent className="w-full h-full object-contain text-black" color="black" />
    </div>
  </div>
);

export default function NewLanding() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

      {/* Hero Section - White Background */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white px-4 pb-20 pt-32 text-black md:px-8 md:pb-32 md:pt-48">
        <DitherBackground />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-mono text-xs text-zinc-600">
                v0.20.0 RELEASED
              </span>
            </div>

            <h1 className="mb-8 text-5xl font-extrabold tracking-tighter text-black leading-[0.9] md:text-7xl lg:text-8xl">
              THE TRANSACTIONAL <br />
              <span className="bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-300 bg-clip-text text-transparent">
                ELASTICSEARCH
              </span>{" "}
              <br />
              ALTERNATIVE
            </h1>

            <p className="mb-12 max-w-2xl text-xl text-zinc-600 leading-relaxed md:text-2xl">
              ParadeDB is an open source, ACID-compliant search and analytics
              database. Built on Postgres for update-heavy workloads.
            </p>

            <div className="mb-16 flex flex-col gap-4 sm:flex-row">
              <Link
                href={social.CALENDLY}
                target="_blank"
                className="bg-black px-8 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-zinc-800"
              >
                BOOK A DEMO
              </Link>
              <Link
                href={documentation.BASE}
                target="_blank"
                className="flex items-center justify-center gap-2 border border-zinc-300 px-8 py-4 text-center text-lg font-bold text-black transition-colors hover:bg-zinc-100"
              >
                DOCUMENTATION
                <RiArrowRightLine className="h-5 w-5" />
              </Link>
            </div>

            <div className="w-full max-w-3xl overflow-x-auto rounded-sm border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-zinc-600">
              <div className="mb-2 flex gap-2 border-b border-zinc-200 pb-2">
                <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
              </div>
              <p className="whitespace-pre">
                <span className="text-green-600">$</span> docker run --name
                paradedb -e POSTGRES_PASSWORD=password paradedb/paradedb
              </p>
              <p className="mt-2 whitespace-pre">
                <span className="text-green-600">$</span> docker exec -it
                paradedb psql -U postgres
              </p>
            </div>
          </div>

          <div className="relative flex h-full min-h-[400px] w-full items-center justify-center lg:min-h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center opacity-90">
              <DitheredHeroGraphic
                className="h-full w-full text-black"
                color="black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-zinc-50 relative">
         <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="BENEFITS"
              title={<>YOU NEED A SEARCH DATABASE<br/><span className="text-zinc-400">NOT A SEARCH ENGINE</span></>}
              description="Elastic means fragile ETL pipelines and out-of-date results. ParadeDB runs search directly in your database, so your results always reflect reality."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-zinc-200">
              <GridCard
                icon={RiShakeHandsLine}
                title="ACID guarantees"
                description="ACID transactions guarantee that data is searchable immediately after a successful write."
              />
              <GridCard
                icon={RiShieldCheckLine}
                title="Zero data loss"
                description="Never lose data again because of a broken sync with Elastic. ParadeDB indexes always match your data."
              />
              <GridCard
                icon={RiStackLine}
                title="Reduced overhead"
                description="Eliminate complex sync tools like ETL, Kafka, and Debezium. With ParadeDB your source of truth is also where you search."
              />
              <GridCard
                icon={RiMoneyDollarCircleLine}
                title="Optimized price-performance"
                description="Elastic burns hardware. ParadeDB runs lean, written in Rust for efficiency without the cluster sprawl."
              />
              <GridCard
                icon={RiSwap2Line}
                title="Battle-tested"
                description="First class support for backups, high availability, and disaster recovery through PostgreSQL's incredible ecosystem."
              />
              <GridCard
                icon={RiBracesLine}
                title="Postgres dialect"
                description="Write queries using Postgres SQL. No need to wrangle with an unfamiliar query language."
              />
            </div>
         </div>
      </section>

      {/* Trusted / Open Source Section */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="OPEN SOURCE"
            title="TRUSTED BY THE COMMUNITY"
            description="ParadeDB has been deployed across thousands of production environments on multi-TB clusters."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={DockerLogo}
              metric="450K+"
              label="Docker deployments"
              description="Our Docker image is the easiest way to test or self-manage ParadeDB."
              buttonText="Run Docker image"
              href={documentation.DOCKER}
            />
            <StatCard
              icon={PostgresLogo}
              metric="100K+"
              label="Postgres extension installs"
              description="All our features are shipped as a Postgres extension, which means that ParadeDB can drop into any self-managed Postgres."
              buttonText="Install extension"
              href={documentation.DEPLOY_EXTENSION}
            />
            <StatCard
              icon={RiGithubFill}
              metric="8K+"
              label="Stargazers on Github"
              description="ParadeDB is one of the fastest-growing open source database projects."
              buttonText="Star ParadeDB"
              href={github.REPO}
            />
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 relative overflow-hidden bg-zinc-50">
         <DitherBackground />
         <div className="max-w-7xl mx-auto relative z-10">
           <SectionHeader
             badge="PRODUCT"
             title={<>LEGACY SEARCH IS <br/>HOLDING YOU BACK</>}
             description="ParadeDB brings Elastic-quality search capabilities and analytical performance to Postgres."
           />

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <FeatureCard
                title="Search"
                description="Supercharge Postgres' search capabilities with BM25 scoring, custom tokenizers, hybrid search, and more."
                image={DitheredSearchGraphic}
                link={documentation.SEARCH}
             />
             <FeatureCard
                title="Analytics"
                description="Enrich your search results with support for fast analytics and faceting."
                image={DitheredAnalyticsGraphic}
                link={documentation.ANALYTICS}
             />
           </div>
         </div>
      </section>

      {/* Case Studies / Managed */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-white">
         <div className="max-w-7xl mx-auto">
            <SectionHeader
              badge="CASE STUDIES"
              title="BATTLE-TESTED IN PRODUCTION"
              description="ParadeDB powers search and analytics for some of the most demanding enterprise applications."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Card 1 */}
               <div className="bg-zinc-50 p-8 border border-zinc-200 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Bilt className="h-32 w-auto grayscale" />
                  </div>
                  <div className="relative z-10">
                    <Bilt className="h-8 mb-8 text-black" />
                    <div className="text-6xl font-bold text-black mb-2">95%</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Fewer Query Timeouts</div>
                    <p className="text-zinc-800 font-medium mb-8">
                      "Bilt Reduces Postgres Query Timeouts by 95% with ParadeDB"
                    </p>
                    <Link href="/blog/case-study-bilt" target="_blank" className="text-black font-bold underline decoration-2 underline-offset-4 hover:text-zinc-600">
                      READ STORY
                    </Link>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="bg-zinc-50 p-8 border border-zinc-200 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Alibaba className="h-32 w-auto grayscale" />
                  </div>
                  <div className="relative z-10">
                    <Alibaba className="h-8 mb-8 text-[#ff6600]" />
                    <div className="text-6xl font-bold text-black mb-2">5x</div>
                    <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Read Throughput</div>
                    <p className="text-zinc-800 font-medium mb-8">
                      "Alibaba Picks ParadeDB to Bring Full Text Search to its Postgres-Based Data Warehouse"
                    </p>
                    <Link href="/blog/case-study-alibaba" target="_blank" className="text-black font-bold underline decoration-2 underline-offset-4 hover:text-zinc-600">
                      READ STORY
                    </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200 bg-zinc-50 text-center">
         <div className="max-w-4xl mx-auto">
           <div className="text-zinc-400 mb-6">
             <RiShakeHandsLine className="w-12 h-12 mx-auto" />
           </div>
           <blockquote className="text-2xl md:text-4xl font-medium text-black leading-tight mb-8">
             “Thanks to this robust database solution, our organization has streamlined data management processes, leading to increased efficiency and accuracy in our operations.”
           </blockquote>
           <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-zinc-200 rounded-full overflow-hidden relative">
                <Image
                  src="/images/testimonial.webp"
                  alt="Dima Coil"
                  width={48}
                  height={48}
                  className="object-cover grayscale"
                />
              </div>
              <div className="text-left">
                <div className="text-black font-bold">Dima Coil</div>
                <div className="text-zinc-500 text-sm">CEO Hornertools</div>
              </div>
           </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 md:px-8 bg-white relative overflow-hidden text-center">
         <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 0)", backgroundSize: "20px 20px" }}></div>
         <div className="max-w-3xl mx-auto relative z-10">
           <h2 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tighter">
             READY TO GET STARTED?
           </h2>
           <p className="text-xl text-zinc-600 mb-12">
             Start testing right away with our <Link href={documentation.BASE} className="text-black underline decoration-zinc-400 underline-offset-4 hover:decoration-black">docs</Link> or book a demo with our sales team.
           </p>

           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-8">
             <input
                type="email"
                placeholder="YOUR WORK EMAIL"
                className="w-full px-4 py-4 bg-white border border-zinc-300 text-black placeholder-zinc-500 focus:outline-none focus:border-black text-sm font-mono"
             />
             <button className="w-full sm:w-auto px-8 py-4 bg-black text-white font-bold text-sm hover:bg-zinc-800 transition-colors whitespace-nowrap">
               BOOK DEMO
             </button>
           </div>

           <p className="text-zinc-600 text-sm">
             Have a question? <Link href={email.HELLO} className="text-zinc-900 hover:text-black font-medium">Email us</Link>
           </p>
         </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-4 md:px-8 border-t border-zinc-200 bg-white text-zinc-600 text-sm font-mono flex justify-between items-center">
        <div>
          © {new Date().getFullYear()} ParadeDB.
        </div>
        <div className="flex gap-6">
           <Link href={github.REPO} target="_blank" className="hover:text-black transition-colors"><RiGithubFill className="w-5 h-5" /></Link>
        </div>
      </footer>
    </div>
  );
}
