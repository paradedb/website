"use client";

import { cx } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";
import { DatabaseLogo } from "./DatabaseLogo";

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

  // Fetch SVG and set explicit pixel dimensions for reliable canvas rendering
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
      className="text-[11px] font-medium px-2.5 py-1 border border-white/20 text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer bg-white/5"
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
    <div className="overflow-hidden transition-all duration-300 border border-white/20 hover:border-white/40">
      {/* Preview area */}
      <div
        className={cx(
          "flex items-center justify-center",
          bgClass,
          previewClass || "px-4 py-5",
        )}
      >
        <img
          src={svgPath}
          alt={label}
          className={cx("h-auto", svgClass || "w-full")}
        />
      </div>
      {/* Hatched divider */}
      <div className="h-1.5 w-full bg-diagonal-hatch-white border-y border-white/20 bg-indigo-700/20 opacity-60" />
      {/* Footer */}
      <div className="flex items-center justify-center px-3 py-2 bg-indigo-700/30">
        <span className="sr-only">{label}</span>
        <div className="flex gap-1">
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

interface LogoDownloadProps {
  open: boolean;
}

export function LogoDownload({ open }: LogoDownloadProps) {
  const [showPopover, setShowPopover] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!showPopover) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setShowPopover(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPopover(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showPopover]);

  return (
    <div className="group relative flex items-center" ref={triggerRef}>
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="cursor-pointer"
        aria-label="Brand assets"
      >
        <span className="sr-only">Company logo</span>
        <DatabaseLogo
          className={cx(
            "w-28 sm:w-32 transition-colors",
            !open ? "brightness-0 invert" : "dark:brightness-0 dark:invert",
          )}
        />
      </button>
      <span
        className={cx(
          "absolute -bottom-5 left-0 text-[10px] font-medium tracking-wide transition-all duration-200 pointer-events-none whitespace-nowrap",
          "opacity-0 group-hover:opacity-100 translate-y-0.5 group-hover:translate-y-0",
          showPopover && "!opacity-0",
          !open ? "text-white/60" : "text-indigo-400/60 dark:text-white/40",
        )}
      >
        [ Brand Assets ]
      </span>

      {/* Popover — portaled to body to escape overflow-hidden navbar */}
      {showPopover &&
        mounted &&
        createPortal(
          <div
            ref={popoverRef}
            className={cx(
              "fixed top-[100px] md:top-[136px] left-4 md:left-12 z-[60]",
              "w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)]",
              "bg-[#5549ea] border-x border-b border-white/20",
              "animate-slide-down-and-fade",
              "overflow-hidden",
            )}
          >
            {/* Left & right vertical frame lines */}
            <div className="absolute top-0 bottom-0 left-3 w-px bg-white/10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-3 w-px bg-white/10 pointer-events-none" />

            {/* Top hatched bar */}
            <div className="h-3 w-full bg-diagonal-hatch-white border-b border-white/20 bg-indigo-700/20 opacity-60" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-white/20">
              <p className="text-sm font-semibold text-white tracking-tight">
                Brand Assets
              </p>
            </div>

            {/* Logo variant cards */}
            <div className="px-5 py-4">
              <p className="text-[11px] font-medium text-white/50 mb-2 uppercase tracking-wider">
                Full Logo
              </p>
              <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Hatched divider */}
            <div className="h-3 w-full bg-diagonal-hatch-white border-y border-white/20 bg-indigo-700/20 opacity-60" />

            {/* Logomark section */}
            <div className="px-5 py-4">
              <p className="text-[11px] font-medium text-white/50 mb-2 uppercase tracking-wider">
                Logomark
              </p>
              <div className="grid grid-cols-3 gap-3">
                <LogoVariantCard
                  label="Purple"
                  svgPath="/brand/paradedb-logomark-light.svg"
                  bgClass="bg-white"
                  previewClass="px-3 py-2"
                  svgClass="w-8"
                  logoWidth={114}
                  logoHeight={82}
                  filenamePrefix="paradedb-logomark-purple"
                />
                <LogoVariantCard
                  label="Black"
                  svgPath="/brand/paradedb-logomark-black.svg"
                  bgClass="bg-white"
                  previewClass="px-3 py-2"
                  svgClass="w-8"
                  logoWidth={114}
                  logoHeight={82}
                  filenamePrefix="paradedb-logomark-black"
                />
                <LogoVariantCard
                  label="White"
                  svgPath="/brand/paradedb-logomark-white.svg"
                  bgClass="bg-slate-950"
                  previewClass="px-3 py-2"
                  svgClass="w-8"
                  logoWidth={114}
                  logoHeight={82}
                  filenamePrefix="paradedb-logomark-white"
                />
              </div>
            </div>

            {/* Bottom hatched bar */}
            <div className="h-3 w-full bg-diagonal-hatch-white border-t border-white/20 bg-indigo-700/20 opacity-60" />
          </div>,
          document.body,
        )}
    </div>
  );
}
