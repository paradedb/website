/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.paradedb.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://docs.paradedb.com/sitemap.xml"],
  },
};
