"use client";

import ThemedImage from "./ThemedImage";

export default function HeroImage() {
  return (
    <section aria-label="Hero Image of the website" className="flow-root">
      <div className="rounded-2xl bg-slate-50/40 p-2 ring-1 ring-inset ring-slate-200/50">
        <div className="rounded-xl bg-white ring-1 ring-slate-900/5">
          <ThemedImage
            lightSrc="/images/hero-light.webp"
            darkSrc="/images/hero-dark.webp"
            alt="A preview of the Database web app"
            width={2400}
            height={1600}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
