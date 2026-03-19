#!/bin/sh
# Validate review output against schemas/review-score.schema.json
# Usage: ./scripts/validate-review-output.sh [path-to.json]
# Default: examples/validated-review-output.json

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SCHEMA="$REPO_ROOT/schemas/review-score.schema.json"
DATA="${1:-$REPO_ROOT/examples/validated-review-output.json}"

if [ ! -f "$SCHEMA" ]; then
  echo "Error: Schema not found at $SCHEMA"
  exit 1
fi

if [ ! -f "$DATA" ]; then
  echo "Error: Data file not found at $DATA"
  exit 1
fi

echo "Validating $DATA against $SCHEMA..."
npx --yes ajv validate -s "$SCHEMA" -d "$DATA"
echo "Validation passed."
