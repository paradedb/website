"use client";

import dynamic from "next/dynamic";

const CookieConsentBanner = dynamic(
  () => import("@/components/CookieConsentBanner"),
  { ssr: false },
);

export default function CookieConsentLoader() {
  return <CookieConsentBanner />;
}
