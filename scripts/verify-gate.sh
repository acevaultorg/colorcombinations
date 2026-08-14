#!/bin/bash
# Gesture-token gate verification — colorcombinations.org /go/b/* (2026-08-14)
# Probes production. Notes: (a) leak grep matches HARVESTABLE strings only —
# amazon.* URLs / tag= / atob — NOT the brand word "Amazon" in button copy;
# (b) geo can't be spoofed via curl (CF overwrites CF-IPCountry) — NL correctly
# gets .com + own -20 tag (Global Earning covers NL); AT∈EU_ROUTED is code-read;
# (c) invalid-ISBN probe must be checksum-INVALID: 1234567890 (mod-11=1) —
# 9999999999 is checksum-VALID and correctly redirects.
U="https://colorcombinations.org/go/b/0300179359"; P=0; F=0
ck(){ [ "$1" = "$2" ] && { P=$((P+1)); echo "✅ $3"; } || { F=$((F+1)); echo "🔴 $3 (got: $1, want: $2)"; }; }
b=$(curl -s -H 'Referer: https://colorcombinations.org/' "$U")
ck "$(echo "$b" | grep -ciE 'amazon\.[a-z]|tag=|colorcombinations-20|atob\(')" 0 "1. spoofed-referer interstitial has zero harvestable strings"
ck "$(curl -s "$U" | grep -ciE 'amazon\.[a-z]|tag=|colorcombinations-20|atob\(')" 0 "2. no-referer interstitial clean"
T=$(node -e 'process.stdout.write(Date.now().toString(36))')
ck "$(curl -s -o /dev/null -w '%{redirect_url}' -H "Cookie: cc_g=$T" "$U")" "https://www.amazon.com/dp/0300179359?tag=colorcombinations-20" "3. fresh cookie → tagged 302"
ck "$(curl -s -o /dev/null -w '%{redirect_url}' "$U?t=$T")" "https://www.amazon.com/dp/0300179359?tag=colorcombinations-20" "4. fresh ?t= → tagged 302"
ck "$(curl -s -o /dev/null -w '%{http_code}' "$U?t=1")" 200 "5. stale ?t= → interstitial, no 302"
ck "$(curl -s -o /dev/null -w '%{redirect_url}' -H "Cookie: cc_g=$T" "https://colorcombinations.org/go/b/1234567890")" "https://colorcombinations.org/" "6. checksum-invalid ISBN → home, never amazon"
ck "$(curl -s https://colorcombinations.org/amazon-track.js | grep -c 'cc_g=')" 1 "7. tracker mints cc_g"
ck "$(curl -s -o /dev/null -w '%{http_code}' https://colorcombinations.org/api/subscribe)" 405 "8. functions alive (subscribe 405s bare GET = method-checked, not 404-dead)"
echo "PASS=$P FAIL=$F"; exit $F
