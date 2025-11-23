export const siteConfig = {
  name: "ParadeDB",
  url: "https://www.paradedb.com", // (canonical host)
  description:
    "ParadeDB is an open source, ACID-compliant search and analytics database. Built on Postgres for update-heavy workloads.",
  baseLinks: {
    home: "/",
    pricing: "/pricing",
    blog: "/blog",
    resources: "/learn",
  },
};

export type SiteConfig = typeof siteConfig;
