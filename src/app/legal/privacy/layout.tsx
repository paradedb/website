import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ParadeDB Privacy Policy — how we collect, use, and safeguard the information you provide to us.",
  alternates: { canonical: "/legal/privacy" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
