#!/bin/bash
set -e

# The local/fallback deploy path for colorcombinations.org.
#
# CI IS CANONICAL (package.json _deploy_note, corrected 2026-09-03) — pushing to
# main lets .gitlab-ci.yml build + deploy on an isolated GitLab runner, which never
# contends with anything on this machine. This script exists for the case CI names
# explicitly: "a fallback ONLY when CI is unavailable" — chunked-upload deploy runs
# from a local checkout instead, and that path DOES contend with other sessions in
# the same working tree.

# Refuse to deploy from a checkout that is BEHIND origin — a Pages deploy REPLACES
# the live directory, so rebuilding a stale checkout doesn't skip missing commits,
# it REVERTS them. Blocks first, before any build work. Override: SKIP_GIT_GUARD=1
node "$(dirname "$0")/scripts/predeploy-git-guard.mjs"

# ── BUILD/DEPLOY MUTEX (2026-09-05, ported from dormbyschool 35f23aa60 / cabinpets
# 8b2bb12, task mtogsn1jaallda) ───────────────────────────────────────────────────
# This repo's own deploy-truth.md § "Two builds on one dist/" DIRECTLY OBSERVED two
# Astro builds racing on the same dist/ on 2026-09-02 (caught live via `ps` before
# either finished — not inferred from commit timing). `npm run build` below wipes
# and rewrites ./dist while a chunked upload elsewhere could be reading it; a torn
# read then ships live. macOS has no flock(1); scripts/deploy-lock.sh is the
# atomic-mkdir lock, copy-forked per repo with its own LOCK_DIR name.
#
# TRAP HAZARD, READ BEFORE EDITING: acquire_deploy_lock registers `trap 'rm -rf
# "$LOCK_DIR"' EXIT`, and bash EXIT traps are NOT cumulative — the last one
# registered WINS. Any later `trap ... EXIT` in this file MUST repeat the lock
# cleanup verbatim (see the combined trap a few lines below) or the lock leaks on
# every run, which is worse than no lock: the next session then waits the full
# LOCK_WAIT_MIN (90min) on a dead holder.
export DEPLOY_LOCK_STAGE=deploy
source "$(dirname "$0")/scripts/deploy-lock.sh"
acquire_deploy_lock

# In-lock freshness re-check: the guard above ran BEFORE the lock, and
# acquire_deploy_lock can legitimately wait up to LOCK_WAIT_MIN (90) minutes for a
# sibling session whose whole purpose is usually to push. A guard that passed 90
# minutes ago proves nothing about the tree we are about to build and upload.
node "$(dirname "$0")/scripts/predeploy-git-guard.mjs" || {
  echo "✗ DEPLOY ABORTED — origin moved while this run waited for the lock." >&2
  echo "  Fix:  git pull --rebase && ./deploy.sh" >&2
  exit 4
}

trap 'rm -rf "$LOCK_DIR"' EXIT

# The exact chain package.json's own "deploy" script runs (kept in sync deliberately
# — do not drift the two). Run directly rather than via `npm run deploy`, because
# `npm run deploy` would auto-fire the `predeploy` npm hook a SECOND time (npm's
# pre<script> convention), re-running git-guard + verify-beacon-coverage after the
# lock is already held for no benefit.
npm run build
# Every Amazon link tracked (p= + placement) and gated — refuses the upload otherwise (card muksgphls3y3tw).
node scripts/amazon-tracking-guard.mjs
node scripts/verify-deploy-integrity.mjs --pre
# Replays every built /go/ href through the gate's tokened branch (functions + dist/_worker.js) offline, like a real click (card mukyo88cc41xy0).
node scripts/verify-gate-offline.mjs || { echo "OFFLINE GATE CHECK FAILED" >&2; exit 7; }
: "${CF_PAGES_TOKEN:?CF_PAGES_TOKEN required for a Pages deploy}"
CF_BATCH_MB=6 python3 scripts/cf-pages-chunked-deploy.py
node scripts/verify-deploy-integrity.mjs --post
npm run indexnow
