#!/bin/bash
# Parallel domain availability checker using direct WHOIS queries.
# Input: top300.txt (one domain per line)
# Output: available.txt, taken.txt, errors.txt

set -u
cd "$(dirname "$0")"

INPUT="top300.txt"
OUT_AVAIL="available.txt"
OUT_TAKEN="taken.txt"
OUT_ERROR="errors.txt"
OUT_RAW="raw-results.txt"

: > "$OUT_AVAIL"
: > "$OUT_TAKEN"
: > "$OUT_ERROR"
: > "$OUT_RAW"

check_domain() {
  local domain="$1"
  local tld="${domain##*.}"
  local server
  case "$tld" in
    com) server="whois.verisign-grs.com" ;;
    net) server="whois.verisign-grs.com" ;;
    art) server="whois.nic.art" ;;
    *)   server="" ;;
  esac

  local response
  if [ -n "$server" ]; then
    response=$(whois -h "$server" "$domain" 2>&1)
  else
    response=$(whois "$domain" 2>&1)
  fi

  # Classify
  if echo "$response" | grep -qiE "no match|not found|no data found|available|free"; then
    echo "AVAILABLE|$domain" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_AVAIL"
  elif echo "$response" | grep -qiE "^[[:space:]]*domain name:|registrar:|creation date:|registrant"; then
    echo "TAKEN|$domain" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_TAKEN"
  else
    echo "UNKNOWN|$domain" >> "$OUT_RAW"
    echo "$domain" >> "$OUT_ERROR"
  fi
}

export -f check_domain
export OUT_AVAIL OUT_TAKEN OUT_ERROR OUT_RAW

echo "Starting availability check on $(wc -l < "$INPUT" | tr -d ' ') domains..."
start=$(date +%s)

# Run 12 parallel jobs
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
