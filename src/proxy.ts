import { NextRequest, NextResponse } from "next/server";

const INSTALL_SCRIPT = `#!/bin/sh
set -e

CONTAINER_NAME="paradedb"
IMAGE="paradedb/paradedb:latest"
USER="myuser"
PASSWORD="mypassword"
DATABASE="paradedb"

spinner() {
  MSG="$1"
  PID="$2"
  i=0
  while kill -0 "$PID" 2>/dev/null; do
    dots=$(( i % 3 + 1 ))
    case $dots in
      1) printf "\\r%s.  " "$MSG" ;;
      2) printf "\\r%s.. " "$MSG" ;;
      3) printf "\\r%s..." "$MSG" ;;
    esac
    i=$(( i + 1 ))
    sleep 0.4
  done
  wait "$PID"
  printf "\\r%s... done!\\n" "$MSG"
}

if ! command -v docker > /dev/null 2>&1; then
  echo "Error: Docker is not installed. Install it from https://docs.docker.com/get-docker/" >&2
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again." >&2
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
  if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    echo "ParadeDB is already running."
  else
    docker start "$CONTAINER_NAME" > /dev/null 2>&1
    echo "Starting existing ParadeDB container..."
  fi
else
  docker pull "$IMAGE" > /dev/null 2>&1 &
  spinner "Pulling ParadeDB" $!

  docker run -d --name "$CONTAINER_NAME" -e POSTGRES_USER="$USER" -e POSTGRES_PASSWORD="$PASSWORD" -e POSTGRES_DB="$DATABASE" -v paradedb_data:/var/lib/postgresql/ -p 5432:5432 "$IMAGE" > /dev/null 2>&1 &
  spinner "Starting ParadeDB" $!
fi

until docker exec "$CONTAINER_NAME" pg_isready -U "$USER" -d "$DATABASE" > /dev/null 2>&1; do
  sleep 1
done

echo ""
docker exec -it "$CONTAINER_NAME" psql -U "$USER" -d "$DATABASE" </dev/tty
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
