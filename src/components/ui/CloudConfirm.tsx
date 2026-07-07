"use client";

import { useEffect, useState } from "react";
import { RiMailCheckLine, RiErrorWarningLine } from "@remixicon/react";

// The waitlist API's base URL (public — it's the same host the confirmation
// emails link to). The confirm action is a plain cross-origin form POST:
// exempt from CORS, and on success the API 303-redirects to /cloud/confirmed.
const CONFIRM_ACTION = process.env.NEXT_PUBLIC_WAITLIST_API_URL
  ? `${process.env.NEXT_PUBLIC_WAITLIST_API_URL}/confirm`
  : "";

type View =
  | { kind: "loading" }
  | { kind: "confirm"; token: string }
  | { kind: "error"; reason: "invalid" | "expired" }
  | { kind: "missing" };

export default function CloudConfirm() {
  const [view, setView] = useState<View>({ kind: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const reason = params.get("reason");

    // Scrub the query from the address bar immediately: the token is a live
    // credential and must not linger in history or analytics page-view URLs.
    if (token || reason) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (reason === "invalid" || reason === "expired") {
      setView({ kind: "error", reason });
    } else if (token) {
      setView({ kind: "confirm", token });
    } else {
      setView({ kind: "missing" });
    }
  }, []);

  if (view.kind === "loading") {
    return <div className="h-24" aria-hidden />;
  }

  if (view.kind === "confirm") {
    return (
      <div className="mx-auto w-full max-w-md">
        <p className="mb-6 text-base text-indigo-50">
          One click to go — confirm this is your email address and
          you&apos;re on the ParadeDB Cloud waitlist.
        </p>
        {/* Deliberately a manual click, not auto-submit: the click is the
            double-opt-in consent, and email security scanners that prefetch
            links must not be able to trigger it. */}
        <form method="POST" action={CONFIRM_ACTION}>
          <input type="hidden" name="token" value={view.token} />
          <button
            type="submit"
            disabled={!CONFIRM_ACTION}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50 disabled:opacity-60"
          >
            <RiMailCheckLine className="size-4" />
            Confirm my email
          </button>
        </form>
        {!CONFIRM_ACTION && (
          <p className="mt-3 text-sm text-red-200">
            Confirmation is temporarily unavailable. Please try again later.
          </p>
        )}
      </div>
    );
  }

  const copy =
    view.kind === "error" && view.reason === "expired"
      ? {
          title: "This link has expired",
          body: "Confirmation links are valid for 48 hours. Sign up again below and we’ll send you a fresh one.",
        }
      : {
          title: "This link is invalid or has expired",
          body: "Sign up again below and we’ll send you a fresh confirmation link.",
        };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <div className="mb-6 flex items-center gap-2.5 border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white">
        <RiErrorWarningLine className="size-5 shrink-0" />
        {copy.title}
      </div>
      <p className="mb-6 text-sm text-indigo-100">{copy.body}</p>
      <a
        href="/cloud"
        className="inline-flex items-center justify-center whitespace-nowrap bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50"
      >
        Back to signup
      </a>
    </div>
  );
}
