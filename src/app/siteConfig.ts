export const siteConfig = {
  name: "ParadeDB",
  url: "https://www.paradedb.com", // (canonical host)
  description:
    "ParadeDB is the open-source, ACID-compliant Elasticsearch alternative built entirely on Postgres.",
  baseLinks: {
    home: "/",
    pricing: "/pricing",
    blog: "/blog",
    resources: "/learn",
  },
};

export type SiteConfig = typeof siteConfig;
