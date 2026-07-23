#!/usr/bin/env bash
# ============================================================================
# SonarQube Deterministic Scanner - Orchestrator
# ============================================================================
# Detects available tools and runs the best scanner cascade.
# Output: findings.json in the specified output directory.
#
# Usage: ./scan.sh <project_root> [output_dir]
#
# Exit codes:
#   0 - scan completed successfully
#   1 - invalid arguments
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${1:?Usage: scan.sh <project_root> [output_dir]}"
OUTPUT_DIR="${2:-$PROJECT_ROOT}"
FINDINGS_FILE="$OUTPUT_DIR/findings.json"

# Resolve absolute paths
PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"
mkdir -p "$OUTPUT_DIR"

# ============================================================================
# Tool Detection
# ============================================================================

HAS_SEMGREP=false
HAS_SG=false
HAS_DOCKER=false
HAS_RG=false

command -v semgrep &>/dev/null && HAS_SEMGREP=true
command -v sg &>/dev/null && HAS_SG=true
command -v docker &>/dev/null && HAS_DOCKER=true
command -v rg &>/dev/null && HAS_RG=true

# If no rg, try to use grep as fallback (much slower)
if [ "$HAS_RG" = false ]; then
  echo "WARNING: ripgrep (rg) not found. Scanner will be significantly slower." >&2
fi

# ============================================================================
# Decide Scanner Strategy
# ============================================================================

SCANNER="rg"  # default/baseline

if [ "$HAS_SEMGREP" = true ]; then
  SCANNER="semgrep"
elif [ "$HAS_SG" = true ]; then
  SCANNER="sg"
elif [ "$HAS_DOCKER" = true ]; then
  # Try semgrep via docker
  if docker image inspect semgrep/semgrep &>/dev/null 2>&1; then
    SCANNER="semgrep-docker"
  fi
fi

echo "Scanner strategy: $SCANNER (rg=${HAS_RG}, sg=${HAS_SG}, semgrep=${HAS_SEMGREP}, docker=${HAS_DOCKER})" >&2

# ============================================================================
# Run rg-based scan (always runs as baseline)
# ============================================================================

RG_FINDINGS="$OUTPUT_DIR/.rg-findings.json"
bash "$SCRIPT_DIR/scan-rg.sh" "$PROJECT_ROOT" "$RG_FINDINGS"

# ============================================================================
# Run AST-level scan if available
# ============================================================================

AST_FINDINGS="$OUTPUT_DIR/.ast-findings.json"

case "$SCANNER" in
  sg)
    sg scan --rule "$SCRIPT_DIR/sg-rules/" --json "$PROJECT_ROOT" > "$AST_FINDINGS" 2>/dev/null || echo '[]' > "$AST_FINDINGS"
    ;;
  semgrep)
    semgrep --config "$SCRIPT_DIR/sg-rules/" --json --quiet "$PROJECT_ROOT" > "$AST_FINDINGS" 2>/dev/null || echo '[]' > "$AST_FINDINGS"
    ;;
  semgrep-docker)
    docker run --rm -v "$PROJECT_ROOT:/src" -v "$SCRIPT_DIR/sg-rules:/rules" \
      semgrep/semgrep semgrep --config /rules --json --quiet /src > "$AST_FINDINGS" 2>/dev/null || echo '[]' > "$AST_FINDINGS"
    ;;
  *)
    echo '[]' > "$AST_FINDINGS"
    ;;
esac

# ============================================================================
# Merge findings (rg-based is the primary, AST augments)
# For now, just use rg findings as the main output.
# AST findings will be merged in a future iteration.
# ============================================================================

cp "$RG_FINDINGS" "$FINDINGS_FILE"

# Cleanup temp files
rm -f "$RG_FINDINGS" "$AST_FINDINGS"

echo "Scan complete: $FINDINGS_FILE" >&2
echo "$FINDINGS_FILE"
