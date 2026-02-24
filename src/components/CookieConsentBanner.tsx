"use client";

import { useEffect } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { legal } from "@/lib/links";
import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const COOKIE_NAME = "paradedb_cookie_consent";

function updateConsent(granted: boolean) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

export default function CookieConsentBanner() {
  useEffect(() => {
    const cookieValue = getCookieConsentValue(COOKIE_NAME);
    if (cookieValue === "true") {
      updateConsent(true);
    } else if (cookieValue === "false") {
      updateConsent(false);
    }
  }, []);

  return (
    <CookieConsent
      cookieName={COOKIE_NAME}
      disableStyles
      location="bottom"
      containerClasses="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col items-center justify-between gap-4 bg-slate-900 px-6 py-4 text-sm text-slate-200 shadow-lg sm:flex-row sm:gap-6"
      contentClasses="flex-1"
      buttonWrapperClasses="flex shrink-0 gap-3"
      buttonClasses="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      declineButtonClasses="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-600"
      enableDeclineButton
      declineButtonText="Decline"
      expires={365}
      extraCookieOptions={{ sameSite: "lax" }}
      onAccept={() => updateConsent(true)}
      onDecline={() => updateConsent(false)}
    >
      We use cookies to analyze site usage and improve your experience.
      Declining limits tracking to anonymous, cookieless data.{" "}
      <Link href={legal.PRIVACY} className="underline hover:text-white">
        Privacy Policy
      </Link>
    </CookieConsent>
  );
}
