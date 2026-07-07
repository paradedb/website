// Submits waitlist signups to the self-hosted double opt-in waitlist API
// (SAM stack on james.international), server-to-server with a shared secret.
//
// Trust model (see the waitlist repo's README): this route is the ONE
// legitimate caller of the API. Bot/humanness filtering is THIS side's job;
// the API enforces per-email send caps and token semantics regardless. The
// end user's IP is forwarded explicitly in the body (`client_ip`) because
// the API only ever sees this server's egress IP on the connection.
//
// Config: WAITLIST_API_URL (the API's base URL, no trailing slash) and
// WAITLIST_API_KEY (the X-Waitlist-Key shared secret, from SSM parameter
// /waitlist/signup-key).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalString = (v: unknown, max = 512): string | undefined =>
  typeof v === "string" && v.trim().length > 0
    ? v.trim().slice(0, max)
    : undefined;

export async function POST(request: Request) {
  const apiUrl = process.env.WAITLIST_API_URL;
  const apiKey = process.env.WAITLIST_API_KEY;

  let body: {
    email?: unknown;
    utm_source?: unknown;
    utm_medium?: unknown;
    utm_campaign?: unknown;
    referrer?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!apiUrl || !apiKey) {
    console.error(
      "Cloud waitlist: WAITLIST_API_URL / WAITLIST_API_KEY not configured.",
    );
    return Response.json(
      { error: "The waitlist is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  // First entry of X-Forwarded-For is the client (Vercel/standard proxies).
  // The API validates the syntax and stores null rather than reject.
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const clientIp = xff.split(",")[0]?.trim() || undefined;

  try {
    const apiRes = await fetch(`${apiUrl}/waitlist`, {
      method: "POST",
      headers: {
        "X-Waitlist-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        client_ip: clientIp,
        tags: ["cloud-waitlist"],
        metadata: { signup_source: "website" },
        // First-touch attribution, forwarded from the browser when present.
        utm_source: optionalString(body.utm_source, 64),
        utm_medium: optionalString(body.utm_medium, 64),
        utm_campaign: optionalString(body.utm_campaign, 64),
        referrer: optionalString(body.referrer),
      }),
    });

    if (!apiRes.ok) {
      // The API returns identical 200s for new/duplicate/rate-limited, so
      // any non-OK here is a real problem (bad key, validation, outage).
      const detail = await apiRes.text().catch(() => "");
      console.error("Cloud waitlist: API submit failed", apiRes.status, detail);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Cloud waitlist: API request threw", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
