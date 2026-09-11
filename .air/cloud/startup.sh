#!/usr/bin/env bash
set -euo pipefail

PORT=5173
LOG_FILE=/tmp/social-sandbox-vite.log

healthcheck() {
  local attempts=0
  echo "Waiting for Vite to serve the application on port ${PORT}..."
  while true; do
    if curl --fail --silent --show-error "http://127.0.0.1:${PORT}/" | grep -q '<div id="root"></div>'; then
      echo "Application is ready on port ${PORT}."
      return 0
    fi

    attempts=$((attempts + 1))
    if (( attempts % 5 == 0 )); then
      echo "Still waiting for Vite (attempt ${attempts}); recent server output:"
      tail -n 20 "${LOG_FILE}" 2>/dev/null || true
    fi
    sleep 1
  done
}

echo "Installing locked npm dependencies..."
npm ci

echo "Building the TypeScript and Vite application..."
npm run build

echo "Starting Vite development server on port ${PORT}..."
npm run dev -- --host 0.0.0.0 --port "${PORT}" --strictPort >"${LOG_FILE}" 2>&1 &

if [ "${AIR_STARTUP_MODE:-}" = "warmup" ]; then
  healthcheck
fi
