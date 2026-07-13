export const siteConfig = {
  name: "ParadeDB",
  url: "https://www.paradedb.com", // (canonical host)
  description:
    "One Postgres for your application data, full-text search, vector retrieval, and aggregations. Home of the pg_search extension.",
  gtmId: "GTM-KMGRG564",
  baseLinks: {
    home: "/",
    blog: "/blog",
    cloud: "/cloud",
    customers: "/customers",
    resources: "/learn",
    brand: "/brand",
  },
};

export type SiteConfig = typeof siteConfig;
