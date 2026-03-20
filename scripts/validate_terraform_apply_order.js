#!/usr/bin/env node
/**
 * Validates Terraform apply-order rules per docs/terraform-apply-order.md.
 * Flags aws_cloudtrail without depends_on on S3 bucket policy.
 *
 * Usage: node scripts/validate_terraform_apply_order.js [path]
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

function extractCloudTrailBlock(content) {
  const idx = content.indexOf('resource "aws_cloudtrail"');
  if (idx === -1) return null;
  let depth = 0;
  let start = -1;
  for (let i = idx; i < content.length; i++) {
    if (content[i] === "{") {
      if (depth === 0) start = i + 1;
      depth++;
    } else if (content[i] === "}") {
      depth--;
      if (depth === 0) return content.slice(start, i);
    }
  }
  return null;
}

function checkCloudTrailDependsOn(content, filePath) {
  const findings = [];
  const block = extractCloudTrailBlock(content);
  if (!block) return findings;

  const hasDependsOn = /depends_on\s*=\s*\[/.test(block);
  const hasBucketPolicyInDependsOn =
    hasDependsOn && /aws_s3_bucket_policy[\s.]/.test(block);

  if (!hasDependsOn) {
    findings.push({
      file: filePath,
      rule: "CloudTrail without depends_on on S3 bucket policy",
      message:
        "aws_cloudtrail must have depends_on = [aws_s3_bucket.cloudtrail, aws_s3_bucket_policy.cloudtrail, aws_s3_bucket_public_access_block.cloudtrail]",
    });
  } else if (!hasBucketPolicyInDependsOn) {
    findings.push({
      file: filePath,
      rule: "CloudTrail depends_on must include aws_s3_bucket_policy",
      message:
        "depends_on must include aws_s3_bucket_policy.cloudtrail (or equivalent) to avoid InsufficientS3BucketPolicyException",
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
    if (content.includes("aws_cloudtrail")) {
      const findings = checkCloudTrailDependsOn(content, path.relative(process.cwd(), f));
      allFindings.push(...findings);
    }
  }

  if (allFindings.length === 0) {
    console.log("validate:terraform: OK (no CloudTrail without depends_on found)");
    process.exit(0);
  }

  console.error("validate:terraform: FAIL");
  for (const f of allFindings) {
    console.error(`  ${f.file}: ${f.rule}`);
    console.error(`    ${f.message}`);
  }
  process.exit(1);
}

main();
