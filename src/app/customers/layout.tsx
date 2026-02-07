import type { Metadata } from "next";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "See how companies use ParadeDB to power search in Postgres. Read case studies from teams that replaced Elasticsearch with a single Postgres extension.",
  openGraph: {
    title: "Customers",
    description:
      "See how companies use ParadeDB to power search in Postgres. Read case studies from teams that replaced Elasticsearch with a single Postgres extension.",
    url: `${siteConfig.url}/customers`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customers",
    description:
      "See how companies use ParadeDB to power search in Postgres. Read case studies from teams that replaced Elasticsearch with a single Postgres extension.",
    creator: "@paradedb",
  },
  alternates: {
    canonical: `${siteConfig.url}/customers`,
  },
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
