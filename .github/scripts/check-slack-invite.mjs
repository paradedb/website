// .github/scripts/check-slack-invite.mjs
//
// Health-check the public Slack invite redirect (https://paradedb.com/slack).
// Dead and live invites both return a byte-identical 200 app-shell and render
// "valid" vs "no longer active" client-side, so we load the page in a browser
// and read the DOM rather than curling.
//
// Invites auto-deactivate after ~400 joins regardless of the "never expire"
// setting, so this WILL fire periodically. Then generate a new invite in the
// Slack admin and swap the destination in next.config.mjs.

import { chromium } from "playwright";
import { appendFileSync } from "node:fs";

const LIVE_URL = "https://paradedb.com/slack";

// A known-DEAD invite kept as a calibration canary: every run must flag it as
// dead. If it reads "alive", detection is silently broken (own alert below).
const DEAD_CANARY =
  "https://join.slack.com/t/paradedbcommunity/shared_invite/zt-32abtyjg4-yoYoi~RPh9MSW8tDbl0BQw";

// Lowercased substrings Slack shows on an expired/invalid invite. Broad on
// purpose — a false "dead" just triggers a manual look; a missed death blocks
// new users silently.
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

// Shown when Slack's bot wall blocks us (see the launch call). Detecting it
// lets us report a clear regression instead of a bogus "alive".
const UNSUPPORTED_BROWSER_PHRASE = "your browser is not supported";

async function classify(context, label, url, screenshotPath) {
  const t0 = Date.now();
  console.log(`[${label}] loading ${url} ...`);
  const page = await context.newPage();
  try {
    // networkidle times out (Slack holds long-lived connections), so settle.
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
      // Blocked before the real invite page — neither dead nor alive is trusted.
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

// Real Google Chrome, NOT bundled headless Chromium. Slack's bot wall 403s any
// client whose Client Hints brand isn't "Google Chrome" (Chromium reports
// "HeadlessChrome"/"Chromium") and serves the unsupported-browser page instead
// of the invite. The CI workflow installs this channel (see the .yml). Don't
// set a custom userAgent — Playwright derives the brand from it and re-blocks.
const browser = await chromium.launch({ channel: "chrome" });
// Pin English: Slack localizes by geo/IP, and our DEAD_PHRASES are English-only.
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
    // Hit the bot wall — detector is blind. Slack likely tightened the gate.
    status = "detector_broken";
    reason =
      "Slack served its 'your browser is not supported' page instead of the " +
      "invite page, so neither link could be classified. Confirm the probe still " +
      'launches real Google Chrome (channel: "chrome") in ' +
      ".github/scripts/check-slack-invite.mjs and that Chrome is installed in CI. " +
      "Until fixed, this monitor cannot be trusted to catch a real outage.";
  } else if (canary.dead !== true) {
    // Canary not flagged dead — Slack likely changed their expired-page wording.
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

// Fail only on actionable states. "inconclusive" (transient network) retries.
if (status === "dead" || status === "detector_broken") {
  process.exitCode = 1;
}
