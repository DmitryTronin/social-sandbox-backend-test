#!/usr/bin/env bash
set -euo pipefail

WARMUP=
if [ "${AIR_STARTUP_MODE:-}" = "warmup" ]; then
  WARMUP=1
fi

cd "$(dirname "$0")/../.."

echo "Installing JavaScript dependencies"
npm install

echo "Building application"
npm run build

healthcheck() {
  echo "Waiting for the Vite application to become ready"
  until curl --fail --silent --show-error -H 'Host: localhost' http://127.0.0.1:3000/ | grep -q '<div id="root">'; do
    echo "Application is not ready yet; retrying"
    sleep 2
  done
  echo "Application healthcheck passed"
}

echo "Starting Vite development server"
nohup npm run dev -- --host 0.0.0.0 --port 3000 >/tmp/social-sandbox-vite.log 2>&1 &

if [ -n "${WARMUP:-}" ]; then
  healthcheck
fi
