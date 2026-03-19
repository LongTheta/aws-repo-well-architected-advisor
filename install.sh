#!/usr/bin/env bash
# AWS Well-Architected Pack — Install script
# Installs OpenCode config, skills, schemas, and optional pre-push hook.
# Usage: ./install.sh [--target opencode|cursor] [--dest DIR] [--hooks] [--help]

set -e

TARGET="opencode"  # opencode | cursor | claude
DEST=""
INSTALL_HOOKS=false
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
  cat <<EOF
AWS Well-Architected Pack — Install

Usage: ./install.sh [options]

Options:
  --target opencode|cursor   Target harness (default: opencode)
  --dest DIR                 Destination directory (default: current dir)
  --hooks                    Install pre-push hook for quality gate
  --help                     Show this help

Examples:
  ./install.sh                          # Install for OpenCode in current dir
  ./install.sh --target cursor           # Add Cursor rules for AWS pack
  ./install.sh --dest ../my-repo --hooks # Install into another repo with hooks
EOF
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --target) TARGET="$2"; shift 2 ;;
    --dest)   DEST="$2"; shift 2 ;;
    --hooks)  INSTALL_HOOKS=true; shift ;;
    --help)   usage; exit 0 ;;
    *)        echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

DEST="${DEST:-.}"
DEST="$(cd "$DEST" 2>/dev/null || echo "$DEST")"
DEST_ABS="$(cd "$DEST" 2>/dev/null && pwd || realpath "$DEST" 2>/dev/null || echo "$DEST")"

echo "[AWS Pack] Installing to $DEST_ABS (target: $TARGET)"

# OpenCode
mkdir -p "$DEST_ABS/.opencode"
for item in plugins tools commands; do
  [ -d "$REPO_ROOT/.opencode/$item" ] && cp -r "$REPO_ROOT/.opencode/$item" "$DEST_ABS/.opencode/"
done
for f in opencode.json README.md MIGRATION.md package.json; do
  [ -f "$REPO_ROOT/.opencode/$f" ] && cp "$REPO_ROOT/.opencode/$f" "$DEST_ABS/.opencode/"
done
echo "  - .opencode/ (plugin, tools, commands)"

# Skills
mkdir -p "$DEST_ABS/skills"
cp -r "$REPO_ROOT/skills/aws-well-architected-pack" "$DEST_ABS/skills/"
echo "  - skills/aws-well-architected-pack/"

# Schemas
mkdir -p "$DEST_ABS/schemas"
cp "$REPO_ROOT/schemas/"*.json "$DEST_ABS/schemas/" 2>/dev/null || true
echo "  - schemas/"

# Docs
mkdir -p "$DEST_ABS/docs"
for f in RULES.md docs/OPERATING-MODEL.md docs/scoring-model.md docs/command-to-skill-mapping.md docs/LEGACY-SKILLS.md; do
  [ -f "$REPO_ROOT/$f" ] && cp "$REPO_ROOT/$f" "$DEST_ABS/$(dirname $f)/" 2>/dev/null || true
done
[ -f "$REPO_ROOT/RULES.md" ] && cp "$REPO_ROOT/RULES.md" "$DEST_ABS/" 2>/dev/null || true
echo "  - RULES.md, docs/"

# Cursor
if [[ "$TARGET" == "cursor" || "$TARGET" == "claude" ]]; then
  mkdir -p "$DEST_ABS/.cursor/rules"
  cat > "$DEST_ABS/.cursor/rules/aws-well-architected.md" <<'RULES'
---
description: AWS Well-Architected Pack — evidence-based architecture review
globs: ["**/*.tf", "**/*.tfvars", "**/*.yaml", "**/*.yml", "**/Dockerfile", "**/.github/**"]
alwaysApply: false
---

- Use skills/aws-well-architected-pack for AWS architecture review
- Evidence tags: Observed, Inferred, Missing Evidence
- Never assume compliance without evidence
- Run repo-discovery → architecture-inference → security-review → scoring
- Output per schemas/review-score.schema.json
RULES
  echo "  - .cursor/rules/aws-well-architected.md"
fi

# Claude Code
if [[ "$TARGET" == "claude" ]]; then
  mkdir -p "$DEST_ABS/.claude/agents"
  cp -r "$REPO_ROOT/.claude/"* "$DEST_ABS/.claude/" 2>/dev/null || true
  echo "  - .claude/ (CLAUDE.md, agents)"
fi

# Pre-push hook
if $INSTALL_HOOKS; then
  mkdir -p "$DEST_ABS/.git/hooks"
  cp "$REPO_ROOT/hooks/pre-push" "$DEST_ABS/.git/hooks/pre-push"
  chmod +x "$DEST_ABS/.git/hooks/pre-push"
  echo "  - .git/hooks/pre-push"
fi

# Plugin deps
if command -v bun &>/dev/null; then
  (cd "$DEST_ABS/.opencode" && bun install) && echo "  - .opencode deps (bun)"
elif command -v npm &>/dev/null; then
  (cd "$DEST_ABS/.opencode" && npm install) && echo "  - .opencode deps (npm)"
else
  echo "  - Run 'cd .opencode && bun install' (or npm install) to install plugin deps"
fi

echo "[AWS Pack] Done. Run: opencode run \"/repo-assess\""
if $INSTALL_HOOKS; then
  echo "  Pre-push hook installed. Set AWS_PACK_ENFORCE_QUALITY_GATE=true to enforce."
fi
