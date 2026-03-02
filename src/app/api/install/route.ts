import { readFileSync } from "fs";
import { join } from "path";

const scriptPath = join(process.cwd(), "scripts", "install.sh");

export async function GET(request: Request) {
  const script = readFileSync(scriptPath, "utf-8");

  // Fire GA4 Measurement Protocol event (fire-and-forget)
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (measurementId && apiSecret) {
    const ua = request.headers.get("user-agent") ?? "";
    fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: crypto.randomUUID(),
          events: [
            {
              name: "install_script_download",
              params: {
                source: "curlbash",
                user_agent: ua.slice(0, 100),
              },
            },
          ],
        }),
      },
    ).catch(() => {});
  }

  return new Response(script, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
