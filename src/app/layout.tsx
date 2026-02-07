import Footer from "@/components/ui/Footer";
import { Navigation } from "@/components/ui/Navbar";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import CookieConsentLoader from "@/components/CookieConsentLoader";
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
    default: "ParadeDB — Simple, Elastic-Quality Search for Postgres",
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
    title: "ParadeDB — Simple, Elastic-Quality Search for Postgres",
    description: siteConfig.description,
    siteName: "ParadeDB",
    images: "/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParadeDB — Simple, Elastic-Quality Search for Postgres",
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
      <body
        className={`${inter.className} min-h-screen overflow-x-hidden antialiased bg-background text-foreground selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-300`}
      >
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          enableSystem={true}
        >
          <div className="relative mx-auto w-full max-w-[1440px]">
            <Navigation />
          </div>
          {children}
          <Footer />
          <CookieConsentLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}
