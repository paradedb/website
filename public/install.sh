#!/bin/bash

# ---------------------------------------------------------
# Hi, savvy user! Thanks for reading the source.
#
# This script spins up ParadeDB locally via Docker.
# It will:
#   1. Check that Docker is installed and running
#   2. Pull the latest ParadeDB image (or reuse an existing one)
#   3. Start a container with a persistent volume (paradedb_data)
#   4. Wait for Postgres to be ready
#   5. Drop you straight into a psql session
#
# Nothing is installed on your system outside of the ParadeDB
# Docker image and associated volume.
# To uninstall, just run: docker rm -f paradedb && docker volume rm paradedb_data
# ---------------------------------------------------------

# Exit on subcommand errors
set -Eeuo pipefail

CONTAINER_NAME="paradedb"
IMAGE="paradedb/paradedb:latest"
PG_USER="postgres"
PG_PASSWORD="paradedb"
PG_DATABASE="paradedb"

spinner() {
  MSG="$1"
  PID="$2"
  i=0
  while kill -0 "$PID" 2>/dev/null; do
    dots=$(( i % 3 + 1 ))
    case $dots in
      1) printf "\r%s.  " "$MSG" ;;
      2) printf "\r%s.. " "$MSG" ;;
      3) printf "\r%s..." "$MSG" ;;
    esac
    i=$(( i + 1 ))
    sleep 0.4
  done
  wait "$PID"
  printf "\r%s... done!\n" "$MSG"
}

echo "Welcome to ParadeDB! This script will set up a local instance of ParadeDB using Docker."

if ! command -v docker > /dev/null 2>&1; then
  echo "Error: Docker is not installed. To use ParadeDB, install it from https://docs.docker.com/get-docker/" >&2
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again." >&2
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
  if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    echo "ParadeDB is already running, exiting..."
  else
    echo "Found existing ParadeDB container, exiting..."
  fi
  exit 0
else
  if docker volume ls --format '{{.Name}}' | grep -q "^paradedb_data$"; then
    echo "Found existing paradedb_data volume, exiting..."
    exit 0
  fi

  docker pull "$IMAGE" > /dev/null 2>&1 &
  spinner "Pulling ParadeDB Docker image" $!

  docker run -d --name "$CONTAINER_NAME" -e POSTGRES_USER="$PG_USER" -e POSTGRES_PASSWORD="$PG_PASSWORD" -e POSTGRES_DB="$PG_DATABASE" -v paradedb_data:/var/lib/postgresql/ -p 5432:5432 "$IMAGE" > /dev/null 2>&1 &
  spinner "Starting ParadeDB" $!
fi

RETRIES=0
MAX_RETRIES=10
until docker exec "$CONTAINER_NAME" pg_isready -U "$PG_USER" > /dev/null 2>&1; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "Error: PostgreSQL did not become ready after ${MAX_RETRIES} attempts." >&2
    exit 1
  fi
  sleep 3
done

docker exec -it "$CONTAINER_NAME" psql -U "$PG_USER" -d "$PG_DATABASE" </dev/tty
