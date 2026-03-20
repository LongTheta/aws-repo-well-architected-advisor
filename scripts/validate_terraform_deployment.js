#!/usr/bin/env node
/**
 * Validates Terraform deployment readiness per docs/terraform-deployment-checklist.md.
 * Checks: backend, secrets in state, S3/CloudTrail uniqueness, skip_final_snapshot.
 *
 * Usage: node scripts/validate_terraform_deployment.js [path]
 *   path: directory containing .tf files (default: examples/terraform-sample)
 */

const fs = require("fs");
const path = require("path");

const targetPath = process.argv[2] || path.join(__dirname, "..", "examples", "terraform-sample");

function findTfFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== ".terraform") {
      files.push(...findTfFiles(full));
    } else if (e.isFile() && e.name.endsWith(".tf")) {
      files.push(full);
    }
  }
  return files;
}

function scanAll(content, filePath) {
  const findings = [];
  const rel = path.relative(process.cwd(), filePath);

  // 1. Backend: should have backend "s3" or "gcs" or equivalent for remote state
  if (content.includes("terraform {") && !/backend\s+["']s3["']/.test(content) && !/backend\s+["']gcs["']/.test(content)) {
    findings.push({
      id: "DEPLOY-BACKEND",
      severity: "medium",
      message: "No remote backend (s3/gcs) configured. Local state risks loss; no locking. Add backend \"s3\" {} with -backend-config.",
      file: rel,
    });
  }

  // 2. Secrets in state: random_password for RDS
  if (content.includes("aws_db_instance") && /random_password\.\w+\.result/.test(content)) {
    findings.push({
      id: "DEPLOY-SECRETS-STATE",
      severity: "high",
      message: "RDS password from random_password stored in Terraform state. For prod, use Secrets Manager or SSM SecureString. See docs/compliance-mapping.md.",
      file: rel,
    });
  }

  // 3. S3/CloudTrail bucket without random_id
  const s3BucketMatch = content.match(/resource\s+["']aws_s3_bucket["']\s+[\w"']+\s*\{[^}]*bucket\s*=\s*["']([^"']+)["']/);
  if (s3BucketMatch) {
    const bucketName = s3BucketMatch[1];
    if (!content.includes("random_id") || !bucketName.includes("${") || !/random_id\.\w+\.hex/.test(content)) {
      // Check if this specific bucket uses random_id in its name
      const bucketBlock = content.substring(content.indexOf(s3BucketMatch[0]), content.indexOf(s3BucketMatch[0]) + 500);
      if (!/random_id|\.hex/.test(bucketBlock)) {
        findings.push({
          id: "DEPLOY-UNIQUE-S3",
          severity: "medium",
          message: "S3 bucket name may not be globally unique. Use random_id suffix: bucket = \"${var.project}-assets-${random_id.suffix.hex}\"",
          file: rel,
        });
      }
    }
  }

  // 4. CloudTrail bucket without random_id (if CloudTrail present)
  if (content.includes("aws_cloudtrail") && content.includes("aws_s3_bucket")) {
    const cloudtrailBucketMatch = content.match(/bucket\s*=\s*["']?\$\{([^}]+)\}["']?/);
    if (cloudtrailBucketMatch && !content.includes("random_id")) {
      findings.push({
        id: "DEPLOY-UNIQUE-CLOUDTRAIL",
        severity: "medium",
        message: "CloudTrail S3 bucket name should include random_id for global uniqueness.",
        file: rel,
      });
    }
  }

  // 5. skip_final_snapshot = true (production risk)
  if (content.includes("aws_db_instance") && /skip_final_snapshot\s*=\s*true/.test(content)) {
    findings.push({
      id: "DEPLOY-RDS-SNAPSHOT",
      severity: "medium",
      message: "skip_final_snapshot = true — no backup on destroy. For prod, set false. See docs/terraform-production-guardrails.md.",
      file: rel,
    });
  }

  return findings;
}

function main() {
  const absPath = path.resolve(targetPath);
  const files = findTfFiles(absPath);
  const allFindings = [];

  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    allFindings.push(...scanAll(content, f));
  }

  // Dedupe by id+file
  const seen = new Set();
  const unique = allFindings.filter((f) => {
    const key = `${f.id}:${f.file}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (unique.length === 0) {
    console.log("validate:terraform:deploy: OK");
    process.exit(0);
  }

  console.error("validate:terraform:deploy: FAIL");
  for (const f of unique) {
    console.error(`  [${f.severity}] ${f.file}: ${f.message}`);
  }
  process.exit(1);
}

main();
