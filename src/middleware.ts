import { NextRequest, NextResponse } from "next/server";

const INSTALL_SCRIPT = `#!/bin/sh
set -e

CONTAINER_NAME="paradedb"
IMAGE="paradedb/paradedb"
PASSWORD="password"

echo "Starting ParadeDB..."
docker run -d --name "$CONTAINER_NAME" -e POSTGRES_PASSWORD="$PASSWORD" "$IMAGE" > /dev/null 2>&1

echo "Waiting for PostgreSQL to be ready..."
until docker exec "$CONTAINER_NAME" pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Connecting to ParadeDB..."
docker exec -it "$CONTAINER_NAME" psql -U postgres
`;

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  if (
    request.nextUrl.pathname === "/" &&
    ua.toLowerCase().startsWith("curl/")
  ) {
    return new NextResponse(INSTALL_SCRIPT, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
