#!/bin/bash
# V3 whois checker (extended TLD support)
set -u
cd "$(dirname "$0")"

INPUT="top500-v3.txt"
OUT_AVAIL="available-v3.txt"
OUT_TAKEN="taken-v3.txt"
OUT_ERROR="errors-v3.txt"
OUT_RAW="raw-results-v3.txt"

: > "$OUT_AVAIL"
: > "$OUT_TAKEN"
: > "$OUT_ERROR"
: > "$OUT_RAW"

check_domain() {
  local domain="$1"
  local tld="${domain##*.}"
  local server
  case "$tld" in
    com|net) server="whois.verisign-grs.com" ;;
    art)     server="whois.nic.art" ;;
    io)      server="whois.nic.io" ;;
    co)      server="whois.nic.co" ;;
    xyz)     server="whois.nic.xyz" ;;
    design)  server="whois.nic.design" ;;
    studio)  server="whois.nic.studio" ;;
    ink)     server="whois.nic.ink" ;;
    app)     server="whois.nic.google" ;;
    dev)     server="whois.nic.google" ;;
    page)    server="whois.nic.google" ;;
    me)      server="whois.nic.me" ;;
    gallery) server="whois.nic.gallery" ;;
    works)   server="whois.nic.works" ;;
    guide)   server="whois.nic.guide" ;;
    press)   server="whois.nic.press" ;;
    blog)    server="whois.nic.blog" ;;
    space)   server="whois.nic.space" ;;
    place)   server="whois.nic.place" ;;
    house)   server="whois.nic.house" ;;
    life)    server="whois.nic.life" ;;
    rocks)   server="whois.nic.rocks" ;;
    zone)    server="whois.nic.zone" ;;
    club)    server="whois.nic.club" ;;
    shop)    server="whois.nic.shop" ;;
    store)   server="whois.nic.store" ;;
    *)       server="" ;;
  esac

  local response
  if [ -n "$server" ]; then
    response=$(whois -h "$server" "$domain" 2>&1)
  else
    response=$(whois "$domain" 2>&1)
  fi

  if echo "$response" | grep -qiE "no match|not found|no data found|available|is free"; then
    echo "AVAILABLE|$domain" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_AVAIL"
  elif echo "$response" | grep -qiE "^[[:space:]]*domain name:|^domain name:|registrar:|creation date:|registrant|Name Server:|status: clientTransferProhibited"; then
    echo "TAKEN|$domain" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_TAKEN"
  else
    echo "UNKNOWN|$domain|$(echo "$response" | head -1 | tr -d '\r' | head -c 60)" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_ERROR"
  fi
}

export -f check_domain
export OUT_AVAIL OUT_TAKEN OUT_ERROR OUT_RAW

total=$(wc -l < "$INPUT" | tr -d ' ')
echo "Checking $total domains with 12 parallel workers..."
start=$(date +%s)

cat "$INPUT" | xargs -n 1 -P 12 -I {} bash -c 'check_domain "$@"' _ {}

end=$(date +%s)
elapsed=$((end - start))

avail=$(wc -l < "$OUT_AVAIL" | tr -d ' ')
taken=$(wc -l < "$OUT_TAKEN" | tr -d ' ')
errors=$(wc -l < "$OUT_ERROR" | tr -d ' ')

echo ""
echo "Done in ${elapsed}s"
echo "  Available: $avail"
echo "  Taken:     $taken"
echo "  Unknown:   $errors"
