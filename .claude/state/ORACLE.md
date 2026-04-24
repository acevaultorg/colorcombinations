# ORACLE.md — Revenue Oracle v1 (ColorCombinations)
# Seeded: 2026-04-19 (cold start — no actuals yet)

## Config
project: colorcombinations.org
model: hybrid (affiliate + PWYW + future ads)
currency: USD
weekly_baseline: 0
confidence: 0.2

## Archetype Multipliers (cold start defaults)
affiliate_book_click: 0.03
affiliate_book_convert: 0.90
pwyw_bundle_download: 0.35
adsense_content_site: 1.00
design_tool_affiliate: 0.50
affiliate_inventory_expansion: 0.15

## Calibration
# timestamp | task | archetype | projected_$/wk | actual_$/wk_d7 | actual_$/wk_d30 | ratio
2026-04-19 09:20 | shop-wada-vol2 | affiliate_inventory_expansion | 0.50-2.00 (post-activation) | TBD | TBD | n/a — Bookshop/Amazon affiliates placeholder

## Corrections
# (none)
