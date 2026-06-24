// .github/scripts/check-slack-invite.mjs
//
// Health-check the public Slack invite redirect (https://paradedb.com/slack).
//
// Why a headless browser and not curl: Slack shared-invite links render their
// "valid" vs "no longer active" state CLIENT-SIDE in JavaScript. A dead link and
// a live link return a byte-identical HTML app-shell with a 200 status, so curl /
// uptime pings cannot tell them apart. We must load the page and read the DOM
// after the SPA has rendered.
//
// Slack invite links auto-deactivate after ~400 joins regardless of the
// "never expire" setting, so this WILL fire periodically. When it does, generate
// a new invite in the Slack admin and swap the destination in next.config.mjs.

import { chromium } from "playwright";
import { appendFileSync } from "node:fs";

const LIVE_URL = "https://paradedb.com/slack";

// A known-DEAD invite, kept as a calibration canary. Every run we assert the
// detector still flags this as dead. If it ever reads "alive", Slack changed
// their page wording and our detection is silently broken — which is its own
// alert-worthy failure (otherwise we'd get false "all healthy" forever).
const DEAD_CANARY =
  "https://join.slack.com/t/paradedbcommunity/shared_invite/zt-32abtyjg4-yoYoi~RPh9MSW8tDbl0BQw";

// Phrases Slack shows on an expired/invalid shared invite. Lowercased substring
// match against the rendered page text. Broad on purpose — a false "dead" just
// triggers a manual look, whereas a missed death blocks new users silently.
const DEAD_PHRASES = [
  "no longer active",
  "isn't active",
  "is not active",
  "no longer valid",
  "invite is invalid",
  "link is invalid",
  "this link has expired",
  "invite has expired",
  "has expired",
  "reactivate",
  "ask for a new link",
];

// Slack gates these invite pages behind a browser-support check. It 403s any
// client whose User-Agent Client Hints brand isn't "Google Chrome" and serves
// a "your browser is not supported" interstitial instead of the real invite
// content — silently breaking detection. We launch real Google Chrome (see the
// launch call below) to get past it; this phrase lets us detect (and clearly
// report) a regression if Slack blocks us anyway. Do NOT set a custom
// userAgent on the context: Playwright derives the client-hint brand from it,
// which reintroduces the non-"Google Chrome" brand and gets us blocked again.
const UNSUPPORTED_BROWSER_PHRASE = "your browser is not supported";

async function classify(context, label, url, screenshotPath) {
  const t0 = Date.now();
  console.log(`[${label}] loading ${url} ...`);
  const page = await context.newPage();
  try {
    // domcontentloaded + settle is more reliable than networkidle here: Slack
    // holds long-lived connections, so networkidle frequently times out.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    console.log(`[${label}] loaded, settling for render ...`);
    await page.waitForTimeout(5000);
    if (screenshotPath) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
    const text = (
      await page.evaluate(() => document.body.innerText || "")
    ).toLowerCase();
    if (text.includes(UNSUPPORTED_BROWSER_PHRASE)) {
      // Slack blocked us at the browser gate — we never saw the real invite
      // page, so neither "dead" nor "alive" is trustworthy. Surface it.
      console.log(
        `[${label}] done in ${Date.now() - t0}ms — BLOCKED (unsupported-browser page)`,
      );
      return { dead: null, matched: null, error: null, blocked: true };
    }
    const matched = DEAD_PHRASES.find((p) => text.includes(p)) || null;
    const dead = Boolean(matched);
    console.log(
      `[${label}] done in ${Date.now() - t0}ms — ${dead ? `DEAD (matched "${matched}")` : "alive"}`,
    );
    return { dead, matched, error: null, blocked: false };
  } catch (err) {
    console.log(
      `[${label}] errored after ${Date.now() - t0}ms: ${err.message}`,
    );
    return { dead: null, matched: null, error: err.message, blocked: false };
  } finally {
    await page.close();
  }
}

function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

// Launch real Google Chrome (channel: "chrome"), NOT bundled headless Chromium.
// Slack now gates the invite pages behind bot detection that 403s any client
// whose User-Agent Client Hints brand isn't "Google Chrome" — headless Chromium
// reports "HeadlessChrome"/"Chromium" and gets served a "your browser is not
// supported" interstitial instead of the real valid/expired invite content.
// Google Chrome reports the "Google Chrome" brand and is let through. The CI
// workflow installs this channel before running (see check-slack-invite.yml).
const browser = await chromium.launch({ channel: "chrome" });
// Pin the locale to English. Slack localizes these invite pages by request
// geo/IP, so a runner in a non-English region renders e.g. "Ce lien n'est plus
// actif" instead of "This link is no longer active" — and our English-only
// DEAD_PHRASES never match, silently breaking detection.
const context = await browser.newContext({
  locale: "en-US",
  extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
});
let status; // healthy | dead | detector_broken | inconclusive
let reason;

try {
  const canary = await classify(context, "canary", DEAD_CANARY, "canary.png");
  const live = await classify(context, "live", LIVE_URL, "live.png");

  console.log("Canary (known-dead) result:", JSON.stringify(canary));
  console.log("Live  (paradedb.com/slack) result:", JSON.stringify(live));

  if (canary.blocked || live.blocked) {
    // Slack served the "your browser is not supported" interstitial instead of
    // the real invite page — we never reached the content we classify on, so
    // the detector is blind. Likely Slack tightened its browser gate; confirm
    // the probe is still launching real Google Chrome (channel: "chrome") and
    // not falling back to headless Chromium.
    status = "detector_broken";
    reason =
      "Slack served its 'your browser is not supported' page instead of the " +
      "invite page, so neither link could be classified. Confirm the probe still " +
      'launches real Google Chrome (channel: "chrome") in ' +
      ".github/scripts/check-slack-invite.mjs and that Chrome is installed in CI. " +
      "Until fixed, this monitor cannot be trusted to catch a real outage.";
  } else if (canary.dead !== true) {
    // The detector can no longer recognize a link it MUST recognize as dead.
    status = "detector_broken";
    reason =
      "The known-dead canary link was NOT detected as dead. Slack likely changed " +
      "their expired-invite page wording — update DEAD_PHRASES in " +
      ".github/scripts/check-slack-invite.mjs. Until fixed, this monitor cannot " +
      "be trusted to catch a real outage.";
  } else if (live.dead === true) {
    status = "dead";
    reason =
      `The live Slack invite at ${LIVE_URL} is no longer active ` +
      `(matched: "${live.matched}"). Generate a new invite in the Slack admin and ` +
      "update the `/slack` destination in next.config.mjs.";
  } else if (live.dead === null) {
    status = "inconclusive";
    reason = `Could not load ${LIVE_URL}: ${live.error}. Will retry next run.`;
  } else {
    status = "healthy";
    reason = "The Slack invite redirect resolves to an active invite.";
  }
} finally {
  await browser.close();
}

setOutput("status", status);
setOutput("reason", reason);

console.log(`\nSTATUS: ${status}\n${reason}`);

// Fail the job for actionable states (dead invite, broken detector) so the run
// goes red and surfaces in the Actions UI / email. "inconclusive" (transient
// network) does not fail — it just logs and retries next run.
if (status === "dead" || status === "detector_broken") {
  process.exitCode = 1;
}
