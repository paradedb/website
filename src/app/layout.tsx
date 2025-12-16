import Footer from "@/components/ui/Footer";
import { Navigation } from "@/components/ui/Navbar";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { siteConfig } from "./siteConfig";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  // Homepage title & global template for all other pages
  title: {
    default: "ParadeDB — The Transactional Elasticsearch Alternative",
    template: "%s | ParadeDB",
  },
  description: siteConfig.description,
  keywords: [
    "Postgres",
    "search",
    "analytics",
    "ETL",
    "Elasticsearch",
    "OLAP",
    "transactional",
    "ACID",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "ParadeDB — The Transactional Elasticsearch Alternative",
    description: siteConfig.description,
    siteName: "ParadeDB",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParadeDB — The Transactional Elasticsearch Alternative",
    description: siteConfig.description,
    images: "/twitter-image.png",
  },
  icons: {
    icon: "/favicon.ico",
  },

  // Canonical for the homepage (resolved against metadataBase)
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-KMGRG564" />
      <body
        className={`${inter.className} min-h-screen overflow-x-hidden antialiased bg-white selection:bg-indigo-100 selection:text-indigo-700`}
      >
        <ThemeProvider defaultTheme="light" attribute="class">
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
