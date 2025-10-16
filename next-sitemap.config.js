const fs = require("fs");
const path = require("path");

function getContentLastMod(urlPath) {
  try {
    // Convert URL path to filesystem path
    let contentPath;
    if (urlPath.startsWith("/blog/")) {
      const slug = urlPath.replace("/blog/", "");
      contentPath = path.join(
        process.cwd(),
        "src/app/blog",
        slug,
        "metadata.json",
      );
    } else if (urlPath.startsWith("/learn/")) {
      const slug = urlPath.replace("/learn/", "");
      contentPath = path.join(
        process.cwd(),
        "src/app/learn",
        slug,
        "metadata.json",
      );
    } else {
      return new Date().toISOString();
    }

    const metadata = JSON.parse(fs.readFileSync(contentPath, "utf8"));
    return metadata.updated || metadata.date || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function getMostRecentContentDate(contentType) {
  try {
    const contentDir = path.join(process.cwd(), "src/app", contentType);
    let mostRecentDate = null;

    // Recursively find all metadata.json files
    function findMetadataFiles(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
          // Recursively search subdirectories
          findMetadataFiles(fullPath);
        } else if (item.name === "metadata.json") {
          // Found a metadata file
          try {
            const metadata = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            const itemDate = new Date(metadata.updated || metadata.date);

            if (!mostRecentDate || itemDate > mostRecentDate) {
              mostRecentDate = itemDate;
            }
          } catch {
            // Skip invalid metadata files
            continue;
          }
        }
      }
    }

    findMetadataFiles(contentDir);

    return mostRecentDate
      ? mostRecentDate.toISOString()
      : new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.paradedb.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.6, // Set 0.6 as the default
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
  transform: async (config, path) => {
    // Homepage - highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
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

    // Everything else uses default 0.6
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority, // 0.6
      lastmod: new Date().toISOString(),
    };
  },
};
