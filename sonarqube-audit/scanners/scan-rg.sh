#!/usr/bin/env bash
# ============================================================================
# SonarQube Deterministic Scanner - Tier 1: grep-based
# ============================================================================
# Zero-dependency scanner using grep (or ripgrep if available).
# Covers ~45% of SonarQube rules (all mechanically detectable ones).
#
# Dependencies: grep, find, bash 4+
# Optional: jq (for prettier output), rg (faster search)
#
# Usage: ./scan-rg.sh <project_root> <output_file>
# ============================================================================

set -euo pipefail

PROJECT_ROOT="${1:?Usage: scan-rg.sh <project_root> <output_file>}"
OUTPUT_FILE="${2:?Usage: scan-rg.sh <project_root> <output_file>}"

PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"

# Temp file for accumulating findings
ALL_FINDINGS=$(mktemp)

# Use rg if available, otherwise grep -rn
if command -v rg &>/dev/null; then
  SEARCH_CMD="rg"
else
  SEARCH_CMD="grep"
fi

# ============================================================================
# Helper: search for pattern and emit findings
# Args: <pattern> <include_glob> <rule_id> <severity> <category> <message>
# ============================================================================
scan_rule() {
  local pattern="$1"
  local include="$2"
  local rule_id="$3"
  local severity="$4"
  local category="$5"
  local message="$6"

  local results=""

  if [ "$SEARCH_CMD" = "rg" ]; then
    results=$(rg -n --no-heading -e "$pattern" -g "$include" "$PROJECT_ROOT" 2>/dev/null || true)
  else
    # Build find + grep command for each extension
    # Parse include glob like "*.{java,ts,js}" into find -name args
    local extensions
    extensions=$(echo "$include" | sed 's/\*\*\///g' | sed 's/\*\.//g' | tr -d '{}' | tr ',' '\n')

    local find_args=()
    local first=true
    while IFS= read -r ext; do
      [ -z "$ext" ] && continue
      if [ "$first" = true ]; then
        find_args+=(-name "*.${ext}")
        first=false
      else
        find_args+=(-o -name "*.${ext}")
      fi
    done <<< "$extensions"

    if [ ${#find_args[@]} -eq 0 ]; then
      return
    fi

    results=$(find "$PROJECT_ROOT" \( "${find_args[@]}" \) -type f -exec grep -Pn "$pattern" {} /dev/null \; 2>/dev/null || true)
  fi

  [ -z "$results" ] && return

  # Parse results (format: filepath:line:content)
  while IFS= read -r line; do
    [ -z "$line" ] && continue

    local file line_num match_text

    # Extract file:line:content
    file=$(echo "$line" | cut -d: -f1)
    line_num=$(echo "$line" | cut -d: -f2)
    match_text=$(echo "$line" | cut -d: -f3- | sed 's/^[[:space:]]*//' | cut -c1-120)

    # Validate line_num is numeric
    [[ "$line_num" =~ ^[0-9]+$ ]] || continue

    # Make path relative
    file="${file#$PROJECT_ROOT/}"

    # Escape special chars for JSON
    match_text=$(echo "$match_text" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed 's/\t/\\t/g')

    echo "{\"file\":\"$file\",\"line\":$line_num,\"rule\":\"$rule_id\",\"severity\":\"$severity\",\"category\":\"$category\",\"message\":\"$message\",\"match\":\"$match_text\",\"confidence\":\"HIGH\",\"source\":\"deterministic\"}"
  done <<< "$results"
}

# ============================================================================
# Execute all rules
# ============================================================================

echo -n "" > "$ALL_FINDINGS"

# --- BLOCKER: Security ---

# S2068 - Hard-coded credentials
scan_rule '(password|passwd|pwd|secret|apikey|api_key|token)\s*[=:]\s*["'"'"'][^\s"'"'"']{3,}' \
  '**/*.{java,ts,js,jsx,tsx,properties,yml,yaml,env,cfg,conf}' \
  'S2068' 'BLOCKER' 'security' 'Credencial ou segredo hardcoded no código-fonte' >> "$ALL_FINDINGS"

# S5131 - XSS: EL expression without escaping in JSP
scan_rule '\$\{[^}]+\}' \
  '**/*.jsp' \
  'S5131' 'BLOCKER' 'security' 'Expression Language sem escaping (potencial XSS)' >> "$ALL_FINDINGS"

# S2115 - Database password empty/missing
scan_rule 'password\s*[=:]\s*$' \
  '**/*.{properties,yml,yaml,xml,cfg,conf}' \
  'S2115' 'BLOCKER' 'security' 'Senha de banco de dados vazia ou ausente' >> "$ALL_FINDINGS"

# S4830 - Server certificates should be verified
scan_rule 'rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*["'"'"']0' \
  '**/*.{ts,js,jsx,tsx,env}' \
  'S4830' 'BLOCKER' 'security' 'Verificação de certificado SSL desabilitada' >> "$ALL_FINDINGS"

# --- CRITICAL: Security ---

# S2245 - Math.random for security
scan_rule 'Math\.random\s*\(' \
  '**/*.{ts,js,jsx,tsx}' \
  'S2245' 'CRITICAL' 'security' 'Math.random() não é criptograficamente seguro' >> "$ALL_FINDINGS"

# S2386 - Mutable public static fields
scan_rule 'public\s+static\s+(?!final)(List|Map|Set|Array|Collection)' \
  '**/*.java' \
  'S2386' 'CRITICAL' 'code-smell' 'Campo mutável public static sem final' >> "$ALL_FINDINGS"

# S3330 - Cookie without HttpOnly
scan_rule 'httponly\s*=\s*"?false|httpOnly\s*[=:]\s*false' \
  '**/*.{xml,properties,yml,yaml,java,ts,js}' \
  'S3330' 'CRITICAL' 'security' 'Cookie sem atributo HttpOnly' >> "$ALL_FINDINGS"

# S5122 - CORS wildcard
scan_rule 'Access-Control-Allow-Origin.*\*|allowedOrigins.*\*|cors.*origin.*\*' \
  '**/*.{java,xml,ts,js,properties,yml,yaml,json}' \
  'S5122' 'CRITICAL' 'security' 'CORS configurado com wildcard (*)' >> "$ALL_FINDINGS"

# --- MAJOR: Code Quality ---

# S1313 - Hard-coded IP addresses
scan_rule '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' \
  '**/*.{java,ts,js,jsx,tsx,properties,yml,yaml,xml,cfg,conf,jsp}' \
  'S1313' 'MAJOR' 'security' 'Endereço IP hardcoded' >> "$ALL_FINDINGS"

# S106 - System.out/System.err usage
scan_rule 'System\.(out|err)\.(print|println|printf|format)' \
  '**/*.java' \
  'S106' 'MAJOR' 'code-smell' 'Uso de System.out/err ao invés de logger' >> "$ALL_FINDINGS"

# S1148 - printStackTrace()
scan_rule '\.printStackTrace\s*\(' \
  '**/*.java' \
  'S1148' 'MAJOR' 'code-smell' 'Uso de printStackTrace() ao invés de logger' >> "$ALL_FINDINGS"

# S1186 - Empty method body (approximation)
scan_rule '\)\s*\{\s*\}' \
  '**/*.{java,ts,js,jsx,tsx}' \
  'S1186' 'MAJOR' 'code-smell' 'Corpo de método vazio' >> "$ALL_FINDINGS"

# S6676 - console.log usage
scan_rule 'console\.(log|warn|error|info|debug|trace)\s*\(' \
  '**/*.{ts,js,jsx,tsx}' \
  'S6676' 'MAJOR' 'code-smell' 'Uso de console.log (remover antes de produção)' >> "$ALL_FINDINGS"

# S2589 - Always true/false conditions
scan_rule '\bif\s*\(\s*(true|false)\s*\)' \
  '**/*.{java,ts,js,jsx,tsx}' \
  'S2589' 'MAJOR' 'code-smell' 'Condição sempre verdadeira ou falsa' >> "$ALL_FINDINGS"

# --- MINOR ---

# S1128 - Wildcard imports
scan_rule 'import\s+[\w.]+\.\*;' \
  '**/*.java' \
  'S1128' 'MINOR' 'code-smell' 'Import com wildcard (potencialmente não utilizado)' >> "$ALL_FINDINGS"

# --- INFO ---

# S1135 - TODO/FIXME comments
scan_rule '\b(TODO|FIXME|HACK|XXX)\b' \
  '**/*.{java,ts,js,jsx,tsx,jsp}' \
  'S1135' 'INFO' 'code-smell' 'Comentário TODO/FIXME pendente' >> "$ALL_FINDINGS"

# ============================================================================
# Build output JSON
# ============================================================================

TOTAL=$(wc -l < "$ALL_FINDINGS" | tr -d ' ')
BLOCKER=$(grep -c '"severity":"BLOCKER"' "$ALL_FINDINGS" 2>/dev/null || echo 0)
CRITICAL=$(grep -c '"severity":"CRITICAL"' "$ALL_FINDINGS" 2>/dev/null || echo 0)
MAJOR=$(grep -c '"severity":"MAJOR"' "$ALL_FINDINGS" 2>/dev/null || echo 0)
MINOR=$(grep -c '"severity":"MINOR"' "$ALL_FINDINGS" 2>/dev/null || echo 0)
INFO=$(grep -c '"severity":"INFO"' "$ALL_FINDINGS" 2>/dev/null || echo 0)

# Build final JSON
{
  echo '{'
  echo '  "meta": {'
  echo "    \"tool\": \"$SEARCH_CMD\","
  echo "    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
  echo "    \"project_root\": \"$PROJECT_ROOT\""
  echo '  },'
  echo '  "findings": ['

  if [ "$TOTAL" -gt 0 ]; then
    sed '$ ! s/$/,/' "$ALL_FINDINGS"
  fi

  echo '  ],'
  echo '  "summary": {'
  echo "    \"BLOCKER\": $BLOCKER,"
  echo "    \"CRITICAL\": $CRITICAL,"
  echo "    \"MAJOR\": $MAJOR,"
  echo "    \"MINOR\": $MINOR,"
  echo "    \"INFO\": $INFO,"
  echo "    \"total\": $TOTAL"
  echo '  }'
  echo '}'
} > "$OUTPUT_FILE"

rm -f "$ALL_FINDINGS"

echo "rg scan complete: $TOTAL findings (${BLOCKER} BLOCKER, ${CRITICAL} CRITICAL, ${MAJOR} MAJOR, ${MINOR} MINOR, ${INFO} INFO)" >&2
