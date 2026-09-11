#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORKSPACE_DIR"

ENV_FILE="$HOME/.social-sandbox-backend-test.env"
PROFILE_MARKER='# social-sandbox-backend-test environment'
printf '%s\n' 'export VITE_API_URL=http://localhost:8081' >"$ENV_FILE"

profile=""
for candidate in "$HOME/.bash_profile" "$HOME/.bash_login" "$HOME/.profile"; do
  if [ -f "$candidate" ]; then
    profile="$candidate"
    break
  fi
done
if [ -z "$profile" ]; then
  profile="$HOME/.profile"
  : >"$profile"
fi
for shell_profile in "$profile" "$HOME/.bashrc"; do
  touch "$shell_profile"
  if ! grep -Fqx "$PROFILE_MARKER" "$shell_profile"; then
    {
      printf '\n%s\n' "$PROFILE_MARKER"
      printf '[ -f "%s" ] && . "%s"\n' "$ENV_FILE" "$ENV_FILE"
    } >>"$shell_profile"
  fi
done

export VITE_API_URL=http://localhost:8081

echo 'Installing JavaScript dependencies'
npm ci
echo 'Creating Python virtual environment'
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
echo 'Priming frontend production build and test caches'
npm run build
npm test

VITE_CONFIG="$WORKSPACE_DIR/.air/cloud/vite.air.config.mjs"
cat >"$VITE_CONFIG" <<EOF
import { mergeConfig } from 'vite';
import baseConfig from '${WORKSPACE_DIR}/vite.config.ts';

export default mergeConfig(baseConfig, { server: { allowedHosts: true } });
EOF

echo 'Starting FastAPI backend on port 8081'
nohup .venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8081 > /tmp/social-sandbox-backend.log 2>&1 &
echo 'Starting Vite frontend on port 5173'
nohup npm run start:frontend -- --config "$VITE_CONFIG" > /tmp/social-sandbox-frontend.log 2>&1 &

healthcheck() {
  while true; do
    if curl -fsS http://localhost:8081/api/health | grep -Fq '"service":"social-sandbox-backend-test"' \
      && curl -fsS -H 'Host: forwarded.example.test' http://localhost:5173/ | grep -Fq 'AIRC-506 Wrong Backend Repro'; then
      echo 'Backend and frontend are ready.'
      return 0
    fi
    echo 'Waiting for backend and frontend readiness...'
    sleep 2
  done
}

if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then
  healthcheck
fi
