# RETENTION — ColorCombinations (Retention Oracle v1)

Append-only. Retention Oracle projections and post-ship calibration (v17.2).

Baseline: unknown until Plausible operator activation unlocks measurement.
Primary window: 7-day return rate.

## Calibration

Schema: `timestamp | task_id | archetype | projected_delta_7d_% | confidence | actual_7d_% | actual_30d_% | ratio | notes`

2026-04-17 15:56 | pillar-guide-wada-primer | new_feature_usefulness | +0.010 | 0.3 | TBD | TBD | — | Pillar guide is acquisition-mostly but adds reference value for returning designers. Reach = visitors who find via SERP (estimated 10-30% of overall traffic once ranked). Cold confidence.
2026-04-17 15:36 | palette-of-the-day | core_loop_improvement | +1.80 | 0.3 | TBD | TBD | — | Daily-rotation hook targeting designers who want a reference ritual. Reach = 100% of homepage visitors (above-fold). Cold confidence until baseline lands.

## Archetype Multipliers (local calibration)

<!-- Self-calibrating after ≥10 entries per archetype. Bootstrapped from brain defaults. -->

core_loop_improvement: +0.060 (brain default)
onboarding_polish: +0.040 (brain default)
delight_detail: +0.015 (brain default)
dark_pattern_anything: -1.00 (hard-reject, immutable per I-23)

## Corrections

<!-- None -->
