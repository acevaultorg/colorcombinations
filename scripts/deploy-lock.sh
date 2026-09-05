#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-lock.sh — shared build/deploy mutex for this working tree.
#
# WHY (task mtogsn1jaallda, ported from dormbyschool 35f23aa60 / cabinpets 8b2bb12):
# multiple autopilot sessions run concurrently in the SAME checkout, and this repo's
# own deploy-truth.md § "Two builds on one dist/" DIRECTLY OBSERVED two Astro builds
# racing on the same dist/ on 2026-09-02 (caught by `ps` before either finished — the
# race was live, not inferred). An unserialized `astro build`/`npm run build` (wipes
# dist/) racing a chunked deploy (reads dist/ for tens of minutes) ships a torn
# artifact, and a Pages deploy REPLACES the live directory — a torn read ships live.
# macOS has no flock(1); we use the atomic-mkdir lock pattern.
#
# SCOPE NOTE (2026-09-05, this repo only): CI is the canonical deploy path here
# (package.json _deploy_note, corrected 2026-09-03) — GitLab runners build in
# isolated containers and never contend for this lock. This lock protects the LOCAL
# fallback path (`./deploy.sh` / `npm run deploy`), which is what raced on 2026-09-02
# and remains a real path any session can still invoke when CI is unavailable.
#
# Usage (sourced):   source "$(dirname "$0")/scripts/deploy-lock.sh"; acquire_deploy_lock
# Lock is auto-released on script exit (EXIT trap). Waits up to LOCK_WAIT_MIN
# (default 90) minutes for a live holder; dead-pid locks are reaped instantly.
# ─────────────────────────────────────────────────────────────────────────────
LOCK_DIR="${TMPDIR:-/tmp}/colorcombinations-build-deploy.lock"
LOCK_WAIT_MIN="${LOCK_WAIT_MIN:-90}"

acquire_deploy_lock() {
  local waited=0 max_s=$((LOCK_WAIT_MIN * 60))
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    local holder
    holder=$(cat "$LOCK_DIR/pid" 2>/dev/null || echo "")
    if [ -n "$holder" ] && ! kill -0 "$holder" 2>/dev/null; then
      echo "⚠ reaping stale lock (dead pid $holder)" >&2
      rm -rf "$LOCK_DIR"
      continue
    fi
    # A lock dir can exist with NO pid file: the tiny window between mkdir and
    # `echo "$$" > pid` below, OR a session that crashed/was killed between those
    # two lines. holder is then always empty, so the dead-pid check above never
    # fires and this loop would hang the FULL LOCK_WAIT_MIN even with nothing
    # actually holding it. If the pid file is still missing 20s after the dir
    # was created, it's orphaned, not mid-acquire.
    if [ -z "$holder" ]; then
      local dir_age
      dir_age=$(( $(date +%s) - $(stat -f %m "$LOCK_DIR" 2>/dev/null || stat -c %Y "$LOCK_DIR" 2>/dev/null || echo 0) ))
      if [ "$dir_age" -ge 20 ]; then
        echo "⚠ reaping orphaned pidless lock (${dir_age}s old, no pid file written)" >&2
        rm -rf "$LOCK_DIR"
        continue
      fi
    fi
    if [ "$waited" -ge "$max_s" ]; then
      echo "✗ build/deploy lock held by pid ${holder:-?} for >${LOCK_WAIT_MIN}min — aborting." >&2
      echo "  (another session is building/deploying this tree; retry later or investigate)" >&2
      exit 3
    fi
    [ $((waited % 300)) -eq 0 ] && echo "… waiting for build/deploy lock (held by pid ${holder:-?}, ${waited}s)" >&2
    sleep 15; waited=$((waited + 15))
  done
  echo "$$" > "$LOCK_DIR/pid"
  echo "${DEPLOY_LOCK_STAGE:-unknown}" > "$LOCK_DIR/stage"
  trap 'rm -rf "$LOCK_DIR"' EXIT
}
