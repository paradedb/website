import type { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';

    if (userAgent.startsWith("curl/")) {
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

const scriptContent = `#!/bin/bash

ARCH=\$(uname -m)
LATEST_RELEASE_TAG=\$(curl -s "https://api.github.com/repos/paradedb/paradedb/releases/latest" | jq -r .tag_name)
LATEST_RELEASE_VERSION="\${LATEST_RELEASE_TAG#v}"

EXIT_MSG="\n\nIf you'd like to stay up to date with everything about ParadeDB\nJoin our slack channel: https://join.slack.com/t/paradedbcommunity/shared_invite/zt-217mordsh-ielS6BiZf7VW3rqKBFgAlQ \nGitHub: https://github.com/paradedb/paradedb"

set -Eeuo pipefail

function commandExists() {
  command -v "\$1" >/dev/null 2>&1
}

installDockerDepsLinux() {
  echo "Which type of distro are you using?(Required to install dependencies)"
  OPTIONS=("Debian Based" "RHEL Based" "Arch Based")

  select opt in "\${OPTIONS[@]}"
  do
    case \$opt in
      "Debian Based")
        sudo apt-get install docker -y || false
        sudo systemctl enable --now docker
        break ;;
      "RHEL Based")
        sudo dnf install docker -y || false
        sudo systemctl enable --now docker
        break ;;
      "Arch Based")
        sudo pacman -Su docker || false
        sudo systemctl enable --now docker
        break ;;
      *)
        break ;;
    esac
  done
}

installDocker() {
  pguser="myuser"
  pgpass="mypassword"
  dbname="paradedb"

  if [[ "\$OSTYPE" == "msys" ]] || [[ "\$OSTYPE" == "cygwin" ]]; then
    if ! commandExists docker; then
      echo -e "\nPlease install Docker first and get back to the setup!"
      exit 1
    fi
  else
    if ! commandExists docker; then
      echo "Docker not found. Starting installation..."
      if [[ "\$OSTYPE" == "darwin"* ]]; then
        echo -e "Please install docker from: https://docs.docker.com/desktop/install/mac-install/ before proceeding with the installation."
        echo -e "\$EXIT_MSG"
        exit 0
      elif [[ "\$OSTYPE" == "linux-gnu"* ]]; then
        installDockerDepsLinux
        echo "Successfully Installed Docker ✅"
      else
        echo "Unsupported OS type: \$OSTYPE"
        exit 1
      fi
    fi
  fi

  docker_version=\$(docker --version)
  echo "Docker version: \$docker_version ..."
  if docker info >/dev/null 2>&1; then
    echo "Docker daemon is running. Pulling image..."
  else
    echo "Docker daemon is not running. Please run it to pull the ParadeDB image."
    exit 1
  fi

  read -r -p "Username for Database (default: myuser): " tmp_pguser
  if [[ -n "\$tmp_pguser" ]]; then
    pguser="\$tmp_pguser"
  fi

  read -r -p "Password for Database (default: mypassword): " tmp_pgpass
  if [[ -n "\$tmp_pgpass" ]]; then
    pgpass="\$tmp_pgpass"
  fi

  read -r -p "Name for your database (default: paradedb): " tmp_dbname
  if [[ -n "\$tmp_dbname" ]]; then
    dbname="\$tmp_dbname"
  fi

  if docker inspect "paradedb" > /dev/null 2>&1; then
    echo -e "We found a previous paradedb container on your system.\nWe need to remove it to continue this setup."
    read -r -p "Would you like to remove it? [y/N] " response
    case "\$response" in
      [yY][eE][sS]|[yY])
        docker stop paradedb || true
        docker rm paradedb || true
        echo "Successfully Removed Container ✅"
    esac
  fi

  echo "Pulling Docker Image for Parade DB: docker pull paradedb/paradedb"
  docker pull paradedb/paradedb || { echo "Failed to pull Docker image"; exit 1; }
  echo -e "Pulled Successfully ✅\n"

  echo -e "Would you like to add a Docker volume to your database?\nA docker volume will ensure that your ParadeDB Postgres database is stored across Docker restarts.\nNote that you will need to manually update ParadeDB versions on your volume via: https://docs.paradedb.com/upgrading.\nIf you're only testing, we do not recommend adding a volume."

  volume_opts=("Yes" "No(Default)")

  select vopt in "\${volume_opts[@]}"
  do
    case \$vopt in
      "Yes")
        echo "Adding volume at: /var/lib/postgresql/data"
        docker run \
          --name paradedb \
          -e POSTGRES_USER="\$pguser" \
          -e POSTGRES_PASSWORD="\$pgpass" \
          -e POSTGRES_DB="\$dbname" \
          -v paradedb_data:/var/lib/postgresql/data/ \
          -p 5432:5432 \
          -d \
          paradedb/paradedb:latest || { echo "Failed to start Docker container. Please check if an existing container is active or not."; exit 1; }
        break ;;
      *)
        docker run \
          --name paradedb \
          -e POSTGRES_USER="\$pguser" \
          -e POSTGRES_PASSWORD="\$pgpass" \
          -e POSTGRES_DB="\$dbname" \
          -p 5432:5432 \
          -d \
          paradedb/paradedb:latest || { echo "Failed to start Docker container. Please check if an existing container is active or not."; exit 1; }
        break ;;
    esac
  done
  echo "Docker Container started ✅"

  echo -e "\n\nTo use paradedb execute the command: docker exec -it paradedb psql \$dbname -U \$pguser"
}

# ... (rest of the script continues in similar fashion)

echo -e "=========================================================\n"

echo -e "Hi there!

Welcome to ParadeDB, an open-source alternative to Elasticsearch built on Postgres.\nThis script will guide you through installing ParadeDB.

ParadeDB is available as a Kubernetes Helm chart, a Docker image, and as prebuilt binaries for Debian-based and Red Hat-based Linux distributions.\nHow would you like to install ParadeDB?"

echo -e "=========================================================\n"

OPTIONS=("🐳Latest Docker Image" "⬇️ Stable Binary")

select opt in "\${OPTIONS[@]}"
do
  case \$opt in
    "🐳Latest Docker Image")
      installDocker
      echo -e "Installation Successful!\n"
      break ;;
    "⬇️ Stable Binary")
      echo "Stable"
      installBinary
      echo -e "Installation Successful!\n"
      break ;;
    *)
      echo -e "No option selected, exiting setup.\n"
      break ;;
  esac
done

echo -e "\$EXIT_MSG"
`;
