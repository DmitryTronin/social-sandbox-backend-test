#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "[startup] installing dependencies"
npm install --no-audit --no-fund

echo "[startup] running build"
npm run build

healthcheck() {
  echo "[startup] waiting for Vite on port 5173"
  while ! curl -fsS http://127.0.0.1:5173/ | grep -q '<div id="root">'; do
    sleep 2
  done
  echo "[startup] HTTP healthcheck passed"
}

echo "[startup] starting Vite dev server"
nohup npm run dev -- --host 0.0.0.0 > /tmp/social-sandbox-vite.log 2>&1 &

if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then
  healthcheck
fi

echo "[startup] ready"
