// Submits waitlist signups to a HubSpot form via the Forms Submission API.
// Configure with HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID (both found in
// HubSpot: Marketing -> Forms -> your form -> Share / embed code). No secret
// token is required for this endpoint. For an EU data-residency portal, set
// HUBSPOT_REGION=eu.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formGuid = process.env.HUBSPOT_FORM_GUID;

  let body: { email?: unknown };
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

  if (!portalId || !formGuid) {
    console.error(
      "Cloud waitlist: HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID not configured.",
    );
    return Response.json(
      { error: "The waitlist is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  // Pass the HubSpot tracking cookie through for lead attribution, if present.
  const cookies = request.headers.get("cookie") ?? "";
  const hutk = cookies.match(/hubspotutk=([^;]+)/)?.[1];

  const host =
    process.env.HUBSPOT_REGION === "eu"
      ? "api-eu1.hsforms.com"
      : "api.hsforms.com";
  const endpoint = `https://${host}/submissions/v3/integration/submit/${portalId}/${formGuid}`;

  try {
    const hsRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [{ objectTypeId: "0-1", name: "email", value: email }],
        context: {
          pageUri: "https://www.paradedb.com/cloud",
          pageName: "ParadeDB Cloud — Join the waitlist",
          ...(hutk ? { hutk } : {}),
        },
      }),
    });

    if (!hsRes.ok) {
      const detail = await hsRes.text().catch(() => "");
      console.error("Cloud waitlist: HubSpot submit failed", hsRes.status, detail);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Cloud waitlist: HubSpot request threw", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
