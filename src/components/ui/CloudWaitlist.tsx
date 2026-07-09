"use client";

import { useState } from "react";
import { RiLoader2Fill, RiMailSendLine } from "@remixicon/react";

type Status = "idle" | "loading" | "success" | "error";

// Waitlister form action endpoint (https://waitlister.me/docs/form-action-endpoint):
// a keyless browser POST, protected by the domain whitelist configured in the
// Waitlister dashboard plus per-IP rate limits. The waitlist key is public by
// nature — it's visible in every signup request.
const SIGNUP_ACTION = process.env.NEXT_PUBLIC_WAITLISTER_KEY
  ? `https://waitlister.me/s/${process.env.NEXT_PUBLIC_WAITLISTER_KEY}`
  : "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Attribution forwarded with the signup, read at submit time. Waitlister
// stores unknown fields (the UTMs, referrer) as subscriber metadata;
// `referred_by` is the ?ref= code Waitlister appends to subscribers'
// referral links, and is what credits the referrer.
function attribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    referred_by: params.get("ref") ?? undefined,
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    referrer: document.referrer || undefined,
  };
}

export default function CloudWaitlist() {
  const [email, setEmail] = useState("");
  const [building, setBuilding] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!SIGNUP_ACTION) {
      setStatus("error");
      setMessage(
        "The waitlist is temporarily unavailable. Please try again later.",
      );
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(SIGNUP_ACTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          // Free-text "what are you building" — lands in the subscriber's
          // custom_fields metadata in Waitlister.
          building: building.trim() || undefined,
          ...attribution(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      // Waitlister's message is state-aware (new signup vs confirmation
      // already sent vs already registered) — surface it when present.
      const apiMessage =
        typeof data.message === "string" ? data.message.trim() : "";
      if (!res.ok || data.success !== true) {
        setStatus("error");
        setMessage(apiMessage || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(apiMessage);
      window.dispatchEvent(new Event("cloud-waitlist:success"));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    // Double opt-in: they're only on the list once they click the emailed
    // link. Prefer Waitlister's message (it distinguishes a fresh signup from
    // a resend / already-registered email); fall back to our own copy.
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2.5 border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white">
        <RiMailSendLine className="size-5 shrink-0" />
        {message ||
          "Almost there — check your inbox and click the confirmation link to secure your spot."}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md"
      noValidate
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* "Work email" is a nudge only — deliberately not enforced. */}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@company.com"
          autoComplete="email"
          aria-label="Work email address"
          className="flex-1 border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-indigo-200/80 hover:border-white/40 focus:border-white/70 focus:bg-white/15"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-50 disabled:opacity-60"
        >
          {status === "loading" && (
            <RiLoader2Fill className="size-4 animate-spin" />
          )}
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      <textarea
        value={building}
        onChange={(e) => {
          setBuilding(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="What are you building? (optional)"
        aria-label="What are you building? (optional)"
        rows={2}
        maxLength={500}
        className="mt-3 w-full resize-none border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-indigo-200/80 hover:border-white/40 focus:border-white/70 focus:bg-white/15"
      />
      {status === "error" && (
        <p className="mt-2 text-left text-sm text-red-200">{message}</p>
      )}
    </form>
  );
}
