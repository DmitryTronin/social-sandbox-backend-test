#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORKSPACE_DIR"

if [ "${AIR_STARTUP_MODE:-}" = "warmup" ]; then
  WARMUP=1
else
  WARMUP=
fi

healthcheck() {
  local attempt=0

  until curl --fail --silent --show-error -H 'Host: forwarded.example.test' http://127.0.0.1:5173/ | grep -q 'AIRC-506 Wrong Backend Repro'; do
    attempt=$((attempt + 1))
    printf 'Waiting for Vite frontend (attempt %s)\n' "$attempt"
    sleep 2
  done

  until curl --fail --silent --show-error http://127.0.0.1:8081/api/health | grep -q '"service":"social-sandbox-backend-test"'; do
    attempt=$((attempt + 1))
    printf 'Waiting for FastAPI backend (attempt %s)\n' "$attempt"
    sleep 2
  done

  printf 'Frontend and backend health checks passed.\n'
}

printf 'Installing frontend dependencies.\n'
# The fixture lockfile lacks optional esbuild platform packages that newer npm
# versions require. Resolve them into node_modules without changing product files.
npm install --no-save --package-lock=false

printf 'Installing backend dependencies.\n'
python3 -m venv .venv
.venv/bin/pip install --requirement requirements.txt

if [ -n "${WARMUP:-}" ]; then
  printf 'Priming the frontend build cache.\n'
  npm run build
fi

printf 'Starting backend and frontend services.\n'
nohup .venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8081 > /tmp/social-sandbox-backend.log 2>&1 &

VITE_CONFIG="$WORKSPACE_DIR/.air/cloud/vite.air.config.mjs"
cat > "$VITE_CONFIG" <<EOF
import { mergeConfig } from 'vite';
import baseConfig from '${WORKSPACE_DIR}/vite.config.ts';

export default mergeConfig(baseConfig, { server: { allowedHosts: true } });
EOF
nohup npm run start:frontend -- --config "$VITE_CONFIG" > /tmp/social-sandbox-frontend.log 2>&1 &

if [ -n "${WARMUP:-}" ]; then
  healthcheck
fi
