#!/bin/bash
set -e
# Single-process build wrapper — the entry point behind `npm run build`.
#
# WHY THIS EXISTS (2026-09-05, card mtohx0krb9ggai): deploy.sh acquires the
# build/deploy mutex (scripts/deploy-lock.sh) and THEN calls `npm run build` —
# so the build was only locked when entered THROUGH deploy.sh. A bare
# `npm run build` (which is what package.json's own "build" script used to be:
# `astro check && astro build && node scripts/make-worker.mjs`, no lock at all)
# was the door the mutex never covered. Measured live: two sessions ran it
# ~8s apart on 2026-09-05, both builds wiped each other's dist/chunks/ mid-run,
# ~9 minutes of compute lost, both exited 1 after printing "✓ Completed" —
# silent-success-then-failure, the dangerous direction.
#
# NOT a naive npm prebuild/postbuild hook: those are SEPARATE process
# invocations in sequence, so a lock acquired in `prebuild` (with its own EXIT
# trap) releases the moment `prebuild` exits — before `build` even starts. And
# `postbuild` never runs if `build` fails, leaking the lock exactly when it
# matters most. Doing lock+build+release in ONE script (this file) means the
# EXIT trap set by acquire_deploy_lock fires correctly on success OR failure,
# with no cross-process gap.
#
# RE-ENTRANCY: when invoked FROM deploy.sh, DEPLOY_LOCK_HELD=1 is already
# exported (deploy-lock.sh sets it as the last step of acquire_deploy_lock,
# and `export` in a sourced function persists in deploy.sh's shell — inherited
# by this script as a child process). Acquiring a second lock here would
# self-deadlock: deploy.sh already holds LOCK_DIR and would wait on itself for
# the full LOCK_WAIT_MIN. So: skip acquisition when already held; acquire it
# ourselves only for a bare `npm run build` invocation.
if [ "${DEPLOY_LOCK_HELD:-0}" != "1" ]; then
  export DEPLOY_LOCK_STAGE=build
  source "$(dirname "$0")/deploy-lock.sh"
  acquire_deploy_lock
fi

astro check
astro build
node scripts/verify-mediavine-exclusions.mjs
node scripts/make-worker.mjs
