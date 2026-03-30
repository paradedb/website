"use client";

import { cx } from "@/lib/utils";

async function downloadSvg(svgPath: string, filename: string) {
  const res = await fetch(svgPath);
  const svgText = await res.text();
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadPng(
  svgPath: string,
  filename: string,
  width: number,
  height: number,
) {
  const scale = 3;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const res = await fetch(svgPath);
  let svgText = await res.text();
  svgText = svgText
    .replace(/width="[^"]*"/, `width="${canvas.width}"`)
    .replace(/height="[^"]*"/, `height="${canvas.height}"`);

  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, "image/png");
  };

  img.src = url;
}

function DownloadButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-medium px-3 py-1.5 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white/90 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer bg-white dark:bg-white/5"
    >
      {label}
    </button>
  );
}

function LogoVariantCard({
  label,
  svgPath,
  bgClass,
  previewClass,
  svgClass,
  logoWidth,
  logoHeight,
  filenamePrefix,
}: {
  label: string;
  svgPath: string;
  bgClass: string;
  previewClass?: string;
  svgClass?: string;
  logoWidth: number;
  logoHeight: number;
  filenamePrefix: string;
}) {
  return (
    <div className="overflow-hidden transition-all duration-300 border border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40">
      <div
        className={cx(
          "flex items-center justify-center",
          bgClass,
          previewClass || "px-6 py-8",
        )}
      >
        <img
          src={svgPath}
          alt={label}
          className={cx("h-auto", svgClass || "w-full max-w-[280px]")}
        />
      </div>
      <div className="h-1.5 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-white/20 dark:bg-diagonal-hatch-white dark:bg-indigo-700/20 opacity-60" />
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-indigo-700/30">
        <span className="text-xs font-medium text-slate-500 dark:text-white/60">
          {label}
        </span>
        <div className="flex gap-1.5">
          <DownloadButton
            label="SVG"
            onClick={() => downloadSvg(svgPath, `${filenamePrefix}.svg`)}
          />
          <DownloadButton
            label="PNG"
            onClick={() =>
              downloadPng(
                svgPath,
                `${filenamePrefix}.png`,
                logoWidth,
                logoHeight,
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function BrandPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Brand Assets
      </h1>
      <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
        Download ParadeDB logos and brand assets for use in your content.
      </p>

      <section className="mt-12">
        <h2 className="text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider mb-4">
          Full Logo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LogoVariantCard
            label="Light"
            svgPath="/brand/paradedb-logo-light.svg"
            bgClass="bg-white"
            logoWidth={639}
            logoHeight={82}
            filenamePrefix="paradedb-logo-light"
          />
          <LogoVariantCard
            label="White"
            svgPath="/brand/paradedb-logo-dark.svg"
            bgClass="bg-slate-950"
            logoWidth={639}
            logoHeight={82}
            filenamePrefix="paradedb-logo-dark"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xs font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider mb-4">
          Logomark
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <LogoVariantCard
            label="Purple"
            svgPath="/brand/paradedb-logomark-light.svg"
            bgClass="bg-white"
            previewClass="px-6 py-6"
            svgClass="w-12"
            logoWidth={114}
            logoHeight={82}
            filenamePrefix="paradedb-logomark-purple"
          />
          <LogoVariantCard
            label="Black"
            svgPath="/brand/paradedb-logomark-black.svg"
            bgClass="bg-white"
            previewClass="px-6 py-6"
            svgClass="w-12"
            logoWidth={114}
            logoHeight={82}
            filenamePrefix="paradedb-logomark-black"
          />
          <LogoVariantCard
            label="White"
            svgPath="/brand/paradedb-logomark-white.svg"
            bgClass="bg-slate-950"
            previewClass="px-6 py-6"
            svgClass="w-12"
            logoWidth={114}
            logoHeight={82}
            filenamePrefix="paradedb-logomark-white"
          />
        </div>
      </section>
    </div>
  );
}
