"use client";

import { siteConfig } from "@/app/siteConfig";
import { GoogleTagManager } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

import { legal } from "@/lib/links";
import Link from "next/link";

export default function CookieConsentBanner() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    if (getCookieConsentValue("paradedb_cookie_consent") === "true") {
      setConsentGiven(true);
    }
  }, []);

  return (
    <>
      {consentGiven && <GoogleTagManager gtmId={siteConfig.gtmId} />}
      <CookieConsent
        cookieName="paradedb_cookie_consent"
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
        onAccept={() => setConsentGiven(true)}
      >
        We use cookies to analyze site usage and improve your experience.{" "}
        <Link href={legal.PRIVACY} className="underline hover:text-white">
          Privacy Policy
        </Link>
      </CookieConsent>
    </>
  );
}
