"use client";

import { useEffect } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { legal } from "@/lib/links";
import { cx, focusRing } from "@/lib/utils";
import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const COOKIE_NAME = "paradedb_cookie_consent";
const BUTTON_CLASSES =
  "min-h-10 flex-1 cursor-pointer rounded-none border px-4 py-2 text-xs font-medium transition-colors sm:flex-none";

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
      containerClasses="fixed inset-x-0 bottom-0 z-[9999] flex flex-col items-start justify-between gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 text-xs leading-relaxed text-slate-600 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-6 sm:px-[max(3rem,calc((100vw-1344px)/2))] sm:text-[13px] dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-400"
      contentClasses="min-w-0 max-w-4xl flex-1"
      buttonWrapperClasses="flex w-full shrink-0 gap-2 sm:w-auto"
      buttonClasses={cx(
        BUTTON_CLASSES,
        focusRing,
        "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20",
      )}
      declineButtonClasses={cx(
        BUTTON_CLASSES,
        focusRing,
        "border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900",
      )}
      customContainerAttributes={{
        role: "region",
        "aria-label": "Cookie preferences",
      }}
      enableDeclineButton
      buttonText="Accept"
      declineButtonText="Decline"
      expires={365}
      extraCookieOptions={{ sameSite: "lax" }}
      onAccept={() => updateConsent(true)}
      onDecline={() => updateConsent(false)}
    >
      We use cookies to analyze site usage and improve your experience.
      Declining limits tracking to anonymous, cookieless data.{" "}
      <Link
        href={legal.PRIVACY}
        className="underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-900 dark:decoration-slate-600 dark:hover:text-slate-200"
      >
        Privacy Policy
      </Link>
    </CookieConsent>
  );
}
