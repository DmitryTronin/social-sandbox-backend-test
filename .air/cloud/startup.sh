#!/usr/bin/env bash
set -u

WARMUP=
if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then
  WARMUP=1
fi

log() { printf '[startup] %s\n' "$*"; }

log 'Installing JavaScript dependencies'
npm ci

log 'Running build and tests'
npm run build
npm test

log 'Starting Vite development server'
npm run dev -- --host 0.0.0.0 > /tmp/social-sandbox-vite.log 2>&1 &
SERVER_PID=$!

healthcheck() {
  log 'Waiting for the development server'
  while :; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
      log 'Development server exited unexpectedly'
      sed -n '1,160p' /tmp/social-sandbox-vite.log
      return 1
    fi
    response=$(curl -fsS -H 'Host: localhost' http://127.0.0.1:3000/ 2>/dev/null || true)
    if printf '%s' "$response" | grep -q '<!doctype html>\|<html'; then
      log 'Development server is ready'
      return 0
    fi
    log 'Development server is not ready yet'
    sleep 2
  done
}

# Persist project-local environment setup for login and interactive shells.
ENV_FILE="$HOME/.social-sandbox-env"
PROFILE_MARKER='# social-sandbox startup environment'
if [ ! -f "$ENV_FILE" ]; then
  umask 077
  : > "$ENV_FILE"
  printf 'export CI=true\n' >> "$ENV_FILE"
fi
for profile in "$HOME/.bash_profile" "$HOME/.bash_login" "$HOME/.profile"; do
  if [ -f "$profile" ]; then
    LOGIN_PROFILE="$profile"
    break
  fi
done
LOGIN_PROFILE="${LOGIN_PROFILE:-$HOME/.profile}"
touch "$LOGIN_PROFILE"
if ! grep -Fq "$PROFILE_MARKER" "$LOGIN_PROFILE"; then
  printf '\n%s\n[ -f "$HOME/.social-sandbox-env" ] && . "$HOME/.social-sandbox-env"\n' "$PROFILE_MARKER" >> "$LOGIN_PROFILE"
fi
touch "$HOME/.bashrc"
if ! grep -Fq "$PROFILE_MARKER" "$HOME/.bashrc"; then
  printf '\n%s\n[ -f "$HOME/.social-sandbox-env" ] && . "$HOME/.social-sandbox-env"\n' "$PROFILE_MARKER" >> "$HOME/.bashrc"
fi

if [ -n "${WARMUP:-}" ]; then
  healthcheck
fi

log 'Startup complete'
