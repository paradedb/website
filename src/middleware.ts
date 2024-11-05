import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // If the user agent is curl, return the deploy script
  if (userAgent.startsWith("curl/")) {
    const response = await fetch("https://raw.githubusercontent.com/paradedb/paradedb/refs/heads/main/deploy.sh")
    const scriptContent = await response.text()
    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }
}

export const config = {
  matcher: '/',
}
