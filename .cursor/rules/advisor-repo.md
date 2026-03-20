---
description: AWS Repo Well-Architected Advisor — when editing advisor repo files
globs: ["docs/**", "schemas/**", ".opencode/**", "AGENTS.md", "RULES.md", "CONTRIBUTING.md", "opencode.json"]
alwaysApply: false
---

# Advisor Repo Context

Canonical guidance: `docs/core-ai-guidance.md`. This rule applies when editing the advisor's own docs, schemas, or config.

## Repo Purpose

This is the AWS Repo Well-Architected Advisor. It evaluates repositories against AWS Well-Architected, NIST 800-series, and DoD Zero Trust/DevSecOps. Keep docs consistent with `docs/core-ai-guidance.md`.

## Key Files

- `docs/core-ai-guidance.md` — Canonical AI guidance (single source of truth)
- `AGENTS.md` — OpenCode agent definitions
- `.claude/CLAUDE.md` — Claude Code instructions
- `.cursor/rules/aws-well-architected.md` — Cursor rule for IaC review
- `opencode.json`, `.opencode/opencode.json` — Commands, agents, instructions
- `schemas/review-score.schema.json` — Review output schema

## When Updating AI Guidance

1. Update `docs/core-ai-guidance.md` first
2. Sync AGENTS.md, .claude/CLAUDE.md, .cursor/rules/aws-well-architected.md to match
3. Preserve tool-specific conventions (OpenCode agents, Claude project instructions, Cursor globs)

## Evidence and Federal Mode

All findings: evidence_type (observed, inferred, missing, contradictory, unverifiable). Federal mode: allowed claims only; never "compliant", "certified", "FedRAMP authorized".
