"use client";

import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_EVENT,
} from "@/lib/cookieConsent";
import { GoogleTagManager } from "@next/third-parties/google";
import { useEffect, useState } from "react";
import { getCookieConsentValue } from "react-cookie-consent";

function hasAnalyticsConsent() {
  return getCookieConsentValue(COOKIE_CONSENT_COOKIE_NAME) === "true";
}

export default function AnalyticsLoader({ gtmId }: { gtmId: string }) {
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);

  useEffect(() => {
    setIsAnalyticsEnabled(hasAnalyticsConsent());

    const onConsentChange = () => {
      setIsAnalyticsEnabled(hasAnalyticsConsent());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
    };
  }, []);

  if (!isAnalyticsEnabled) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
