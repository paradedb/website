import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export default async function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (userAgent.startsWith("curl/")) {
    const scriptContent = await readFile(
      join(process.cwd(), "public", "install.sh"),
      "utf-8",
    );
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
