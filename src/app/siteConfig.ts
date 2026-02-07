export const siteConfig = {
  name: "ParadeDB",
  url: "https://www.paradedb.com", // (canonical host)
  description:
    "You want better search, not the burden of Elasticsearch. ParadeDB is the modern Elastic alternative built as a Postgres extension.",
  gtmId: "GTM-KMGRG564",
  baseLinks: {
    home: "/",
    pricing: "/pricing",
    blog: "/blog",
    resources: "/learn",
  },
};

export type SiteConfig = typeof siteConfig;
