import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  if (userAgent.startsWith("curl/")) {
    const response = await fetch("https://raw.githubusercontent.com/destrex271/paradedb/refs/heads/feature/setup_script/deploy.sh")
    const scriptContent = await response.text()
    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}

