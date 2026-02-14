#!/bin/sh
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
