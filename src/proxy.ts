import { NextRequest, NextResponse } from "next/server";

const INSTALL_SCRIPT = `#!/bin/sh
set -e

CONTAINER_NAME="paradedb"
IMAGE="paradedb/paradedb"
PASSWORD="password"

if ! command -v docker > /dev/null 2>&1; then
  echo "Error: Docker is not installed. Install it from https://docs.docker.com/get-docker/" >&2
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again." >&2
  exit 1
fi

echo "Starting ParadeDB..."
if ! docker run -d --name "$CONTAINER_NAME" -e POSTGRES_PASSWORD="$PASSWORD" "$IMAGE" > /dev/null 2>&1; then
  echo "Error: Failed to start container. A container named '$CONTAINER_NAME' may already exist." >&2
  echo "Run 'docker rm -f $CONTAINER_NAME' to remove it, then try again." >&2
  exit 1
fi

echo "Waiting for PostgreSQL to be ready..."
until docker exec "$CONTAINER_NAME" pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "Connecting to ParadeDB..."
docker exec -it "$CONTAINER_NAME" psql -U postgres
`;

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  if (userAgent.startsWith("curl/")) {
    return new NextResponse(INSTALL_SCRIPT, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
