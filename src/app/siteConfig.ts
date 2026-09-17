export const siteConfig = {
  name: "ParadeDB",
  url: "https://www.paradedb.com", // (canonical host)
  description:
    "Just use Postgres. ParadeDB makes text and vector search, filters, facets, and joins fast in Postgres. Home of the pg_search extension.",
  gtmId: "GTM-KMGRG564",
  baseLinks: {
    home: "/",
    blog: "/blog",
    cloud: "/cloud",
    contact: "/contact",
    customers: "/customers",
    resources: "/learn",
    brand: "/brand",
  },
};

export type SiteConfig = typeof siteConfig;
