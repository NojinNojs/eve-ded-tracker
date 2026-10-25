#!/usr/bin/env bash
# Boots the production build and asserts the page actually renders.
# Usage: bun run build && bun run test:smoke
set -uo pipefail

PORT="${PORT:-3199}"
BASE="http://127.0.0.1:${PORT}"
LOG="$(mktemp)"
FAILED=0

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
  fi
  rm -f "$LOG"
}
trap cleanup EXIT

echo "→ starting next on :${PORT}"
PORT="$PORT" bun run start >"$LOG" 2>&1 &
SERVER_PID=$!

for _ in $(seq 1 40); do
  if curl -fsS -o /dev/null "${BASE}/" 2>/dev/null; then break; fi
  sleep 0.5
done

if ! curl -fsS -o /dev/null "${BASE}/"; then
  echo "✗ server never answered on :${PORT}"
  tail -20 "$LOG"
  exit 1
fi

check() {
  local label="$1" url="$2" needle="$3"
  local body
  body="$(curl -fsS "$url")" || { echo "✗ ${label}: request failed"; FAILED=1; return; }
  if grep -q "$needle" <<<"$body"; then
    echo "ok   ${label}"
  else
    echo "✗ ${label}: missing '${needle}'"
    FAILED=1
  fi
}

check "landing renders"        "${BASE}/"                    "DED Tracker"
check "hero headline present"  "${BASE}/"                    "Your DEDs pay"
check "sign-in route linked"   "${BASE}/"                    "/auth/login"
check "demo ledger present"    "${BASE}/"                    "SAMPLE DATA"
check "insight strip present"  "${BASE}/"                    "Win rate"
check "html lang is set"       "${BASE}/"                    "<html lang=\"en\""

status=$(curl -s -o /dev/null -w '%{http_code}' "${BASE}/auth/login")
if [[ "$status" == "307" || "$status" == "302" || "$status" == "200" ]]; then
  echo "ok   /auth/login responds (${status})"
else
  echo "✗ /auth/login returned ${status}"
  FAILED=1
fi

if grep -qi "Application error\|Internal Server Error" <<<"$(curl -fsS "${BASE}/")"; then
  echo "✗ page contains an error string"
  FAILED=1
fi

if [[ "$FAILED" -eq 0 ]]; then
  echo "smoke: all checks passed"
else
  echo "smoke: failures above"
  tail -30 "$LOG"
fi
exit "$FAILED"
