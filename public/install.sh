#!/bin/bash

# ---------------------------------------------------------
# Hi, savvy user! Thanks for reading the source.
#
# This script spins up ParadeDB locally via Docker.
# It will:
#   1. Check that Docker is installed and running
#   2. Pull the latest ParadeDB image (or reuse an existing one)
#   3. Start a container with a persistent volume
#   4. Wait for Postgres to be ready
#   5. Drop you straight into a psql session
#
# Nothing is installed on your system outside of the ParadeDB
# Docker image and associated volume.
#
# To uninstall, just run: docker rm -f paradedb && docker volume rm paradedb_data
# ---------------------------------------------------------

# Exit on subcommand errors
set -Eeuo pipefail

SILENT=false
for arg in "$@"; do
  case "$arg" in
    -y|--yes) SILENT=true ;;
  esac
done

CONTAINER_NAME="paradedb"
VOLUME_NAME="paradedb_data"
IMAGE="paradedb/paradedb:latest"
PG_USER="postgres"
PG_PASSWORD="paradedb"
PG_DATABASE="paradedb"

# Color support
if [ -t 1 ] && [ "$(tput colors 2>/dev/null)" -ge 8 ] 2>/dev/null; then
  RED=$'\033[0;31m'
  GREEN=$'\033[0;32m'
  CYAN=$'\033[0;36m'
  PURPLE=$'\033[38;5;99m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  RED=''
  GREEN=''
  CYAN=''
  PURPLE=''
  BOLD=''
  RESET=''
fi

LOG=$(mktemp)
trap 'rm -f "$LOG"' EXIT

print_connect_cmd() {
  printf "    %sdocker exec -it %s psql -U %s -d %s%s\n" "$CYAN" "$CONTAINER_NAME" "$PG_USER" "$PG_DATABASE" "$RESET"
}

run_with_spinner() {
  MSG="$1"
  shift
  "$@" > "$LOG" 2>&1 &
  PID=$!
  i=0
  while kill -0 "$PID" 2>/dev/null; do
    dots=$(( i % 3 + 1 ))
    case $dots in
      1) printf "\r  %s.  " "$MSG" ;;
      2) printf "\r  %s.. " "$MSG" ;;
      3) printf "\r  %s..." "$MSG" ;;
    esac
    i=$(( i + 1 ))
    sleep 0.4
  done
  if wait "$PID"; then
    printf "\r  %s... %sdone!%s\n" "$MSG" "$GREEN" "$RESET"
  else
    printf "\r  %s... %sfailed!%s\n" "$MSG" "$RED" "$RESET"
    echo ""
    printf "  %sError: %s failed.%s Details:\n" "$RED" "$MSG" "$RESET" >&2
    sed 's/^/    /' "$LOG" >&2
    exit 1
  fi
}

printf "%s%s" "$PURPLE" "$BOLD"
cat << 'BANNER'

  |||||||| |||||||| |||||||| |||||
  |||||||| |||||||| |||||||| |||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| ||||||||
  |||||||| |||||||| |||||||| |||||||||||||||
  |||||||| |||||||| ||||||||  ||||||||||||||
  |||||||| |||||||| ||||||||   |||||||||||||
  |||||||| |||||||| ||||||||     |||||||||||
  |||||||| |||||||| ||||||||           |||||

BANNER
printf "%s" "$RESET"
printf "  %sWelcome to ParadeDB%s (%shttps://paradedb.com%s)!\n" "$BOLD" "$RESET" "$CYAN" "$RESET"
echo ""
echo "  We bring you simple, Elastic-quality search for Postgres."
echo "  That includes everything you expect from a search engine: full-text, hybrid, and faceted search."
echo "  All right inside Postgres with no extra infrastructure, and no ETL pipelines."
echo ""
echo "  This script will:"
echo "    1. Pull the latest ParadeDB Docker image"
echo "    2. Start a container named '$CONTAINER_NAME' with a persistent volume ($VOLUME_NAME)"
echo "    3. Expose PostgreSQL on port 5432"
echo "    4. Drop you into a psql session"
echo ""
echo "  Nothing is installed on your system outside of Docker."
echo "  To uninstall later: docker rm -f $CONTAINER_NAME && docker volume rm $VOLUME_NAME"
echo ""
echo "  Tip: Run with -y or --yes to skip this prompt next time."
echo ""
printf "  %sIf you find ParadeDB useful, a star on GitHub means the world to us:%s\n" "$BOLD" "$RESET"
printf "  %shttps://github.com/paradedb/paradedb%s\n" "$CYAN" "$RESET"
echo ""

if [ "$SILENT" = false ]; then
  printf "  Continue? [Y/n] "
  read -r REPLY </dev/tty
  case "$REPLY" in
    [nN]*) echo "Aborted."; exit 0 ;;
  esac
  echo
fi

if ! command -v docker > /dev/null 2>&1; then
  printf "  %sError: Docker is not installed.%s To use ParadeDB, install it from https://docs.docker.com/get-docker/\n" "$RED" "$RESET" >&2
  exit 1
fi

if ! docker info > /dev/null 2>&1; then
  printf "  %sError: Docker is not running.%s Please start Docker and try again.\n" "$RED" "$RESET" >&2
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
  if docker ps --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    printf "  %sParadeDB is already running.%s\n" "$GREEN" "$RESET"
    echo ""
    echo "  To connect, run:"
    print_connect_cmd
    echo ""
  else
    printf "  %sFound existing ParadeDB container.%s\n" "$BOLD" "$RESET"
    echo "  To start it, run: docker start $CONTAINER_NAME"
    echo ""
  fi
  exit 0
else
  if docker volume ls --format '{{.Name}}' | grep -q "^$VOLUME_NAME$"; then
    printf "  %sError: Found existing %s volume, exiting...%s\n" "$RED" "$VOLUME_NAME" "$RESET" >&2
    echo ""
    exit 1
  fi

  run_with_spinner "Pulling ParadeDB Docker image" docker pull "$IMAGE"

  run_with_spinner "Starting ParadeDB" docker run -d --name "$CONTAINER_NAME" -e POSTGRES_USER="$PG_USER" -e POSTGRES_PASSWORD="$PG_PASSWORD" -e POSTGRES_DB="$PG_DATABASE" -v "$VOLUME_NAME:/var/lib/postgresql/" -p 5432:5432 "$IMAGE"
fi

wait_for_postgres() {
  local retries=0
  local max_retries=10
  until docker exec "$CONTAINER_NAME" pg_isready -U "$PG_USER" -d "$PG_DATABASE" > /dev/null 2>&1; do
    retries=$((retries + 1))
    if [ "$retries" -ge "$max_retries" ]; then
      echo "PostgreSQL did not become ready after ${max_retries} attempts."
      return 1
    fi
    sleep 3
  done
}

run_with_spinner "Waiting for PostgreSQL to be ready" wait_for_postgres

echo ""
printf "  %s%sParadeDB is ready!%s\n" "$GREEN" "$BOLD" "$RESET"
echo ""
echo "  To reconnect later, run:"
print_connect_cmd
echo ""
printf "  Get started with the docs: %shttps://docs.paradedb.com%s\n" "$CYAN" "$RESET"
echo ""
printf "  %sLaunching psql...%s\n" "$BOLD" "$RESET"
echo ""
echo ""
docker exec -it "$CONTAINER_NAME" psql -U "$PG_USER" -d "$PG_DATABASE" </dev/tty
