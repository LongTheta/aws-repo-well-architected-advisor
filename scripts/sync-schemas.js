#!/usr/bin/env node
/**
 * Sync canonical schemas to skill pack. Eliminates drift between duplicate schema copies.
 * Canonical source: schemas/review-score.schema.json
 * Target: skills/aws-well-architected-pack/scoring/review-score.schema.json
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");
const CANONICAL = path.join(REPO_ROOT, "schemas", "review-score.schema.json");
const TARGET = path.join(REPO_ROOT, "skills", "aws-well-architected-pack", "scoring", "review-score.schema.json");

const content = fs.readFileSync(CANONICAL, "utf-8");
const schema = JSON.parse(content);
schema.title = "AWS Well-Architected Pack Review Score";
schema.description = "Schema for review output. Synced from schemas/review-score.schema.json. Run npm run sync:schemas to update.";
fs.writeFileSync(TARGET, JSON.stringify(schema, null, 2), "utf-8");
console.log("Synced schemas/review-score.schema.json → skills/aws-well-architected-pack/scoring/review-score.schema.json");
