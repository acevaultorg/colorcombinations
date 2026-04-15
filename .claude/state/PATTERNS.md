# PATTERNS.md — ColorCombinations

Durable record of execution patterns, error categories, and the
Mistake Loop landing zone. Append-only per I-7; oldest half archives
to `.claude/state/ARCHIVE.md` when this file crosses 100 lines.

**Seeded:** 2026-04-15 by CSIL proposal M-2026-04-15-01 (sovereign
cycle 1) to enable Mistake Loop persistence (I-9).

## 20 most-frequent execution patterns

_Populated as sessions accumulate. Format: pattern-name | archetype |
hit-count | last-observed | canonical-fix (if codified as a rule)._

(empty — first sovereign cycle, no repeated patterns yet)

## Failure modes

_Each entry: category | what-went-wrong | root-cause | fix-applied |
rule-written-at (if promoted). Append only when the same category
hits ≥ 3 times; at that point a rule must also ship under
`.claude/rules/[category].md`._

(empty)

## Last 10 execution events

_Rolling log of the last 10 non-trivial execution events (build
failures, specialist auto-fixes, circuit breaker opens, etc.).
Oldest drops off as newer arrives._

(empty)

## Assumption-without-read log

_Specific anti-pattern per `rules/forced-data-compound.md` §
Enforcement. When the main session skips a Behavior Log write in
Checkpoint, log here + address._

(empty)

## Tool-misuse log

_`rg` overuse where Grep tool would do; `Bash cat` where Read would do;
etc. Per `rules/safety.md`._

(empty)
