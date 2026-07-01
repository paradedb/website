"use client";

import { useState } from "react";
import { RiCheckLine, RiLoader2Fill } from "@remixicon/react";

type Status = "idle" | "loading" | "success" | "error";

export default function CloudWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/cloud-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      window.dispatchEvent(new Event("cloud-waitlist:success"));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2.5 border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white">
        <RiCheckLine className="size-5 shrink-0" />
        You&apos;re on the list. We&apos;ll be in touch the moment ParadeDB
        Cloud is ready.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
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
          aria-label="Email address"
          className="flex-1 border border-white/25 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-indigo-200 focus:border-white/70"
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
      {status === "error" && (
        <p className="mt-2 text-left text-sm text-red-200">{message}</p>
      )}
    </form>
  );
}
