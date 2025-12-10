import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (userAgent.startsWith("curl/")) {
    const response = await fetch(
      "https://raw.githubusercontent.com/paradedb/paradedb/refs/heads/main/install.sh",
    );
    const scriptContent = await response.text();
    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

export const config = {
  matcher: "/",
};
