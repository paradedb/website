/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const nowISO = () => new Date().toISOString();
const ROOT_DIR = process.cwd();
const SITE_URL = "https://www.paradedb.com";

function safeReadJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getContentLastMod(urlPath) {
  try {
    let contentPath;

    if (urlPath.startsWith("/blog/")) {
      const slug = urlPath.replace("/blog/", "");
      contentPath = path.join(ROOT_DIR, "src/app/blog", slug, "metadata.json");
    } else if (urlPath.startsWith("/learn/")) {
      const slug = urlPath.replace("/learn/", "");
      contentPath = path.join(ROOT_DIR, "src/app/learn", slug, "metadata.json");
    } else {
      return nowISO();
    }

    const metadata = safeReadJSON(contentPath);
    if (!metadata) return nowISO();

    return metadata.updated || metadata.date || nowISO();
  } catch {
    return nowISO();
  }
}

function getMostRecentContentDate(contentType) {
  try {
    const contentDir = path.join(ROOT_DIR, "src/app", contentType);
    let mostRecentDate = null;

    function walk(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          walk(fullPath);
        } else if (item.name === "metadata.json") {
          const metadata = safeReadJSON(fullPath);
          if (!metadata) continue;

          const value = metadata.updated || metadata.date;
          if (!value) continue;

          const itemDate = new Date(value);
          if (!mostRecentDate || itemDate > mostRecentDate) {
            mostRecentDate = itemDate;
          }
        }
      }
    }

    walk(contentDir);

    return mostRecentDate ? mostRecentDate.toISOString() : nowISO();
  } catch {
    return nowISO();
  }
}

function buildEntry(loc, { changefreq, priority }, lastmod) {
  return {
    loc,
    changefreq,
    priority,
    lastmod: lastmod ?? nowISO(),
  };
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.6, // default for uncategorized routes
  exclude: [
    "/404",
    "/500",
    "/feed.xml",
    "*/opengraph-image.png",
    "*/twitter-image.png",
  ],
  robotsTxtOptions: {
    additionalSitemaps: ["https://docs.paradedb.com/sitemap.xml"],
  },
  /**
   * Per-path overrides for priority, changefreq, and lastmod.
   */
  transform: async (config, path) => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: nowISO(),
      };
    }

    // Blog posts - high priority
    if (path.startsWith("/blog/") && path !== "/blog") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.8,
        lastmod: getContentLastMod(path),
      };
    }

    // Blog landing page
    if (path === "/blog") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.8,
        lastmod: getMostRecentContentDate("blog"),
      };
    }

    // Learn posts - medium-high priority
    if (path.startsWith("/learn/") && path !== "/learn") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.7,
        lastmod: getContentLastMod(path),
      };
    }

    // Learn landing page
    if (path === "/learn") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.7,
        lastmod: getMostRecentContentDate("learn"),
      };
    }

    // Pricing
    if (path === "/pricing") {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.6,
        lastmod: nowISO(),
      };
    }

    // Everything else uses config defaults
    return buildEntry(path, config);
  },
};
