#!/usr/bin/env node
/**
 * Basic programmatic security checks.
 * Complements model-driven analysis. Scans IaC files for:
 * - missing IAM resources
 * - wildcard IAM permissions
 * - missing encryption configuration
 * - missing secrets management usage
 * - missing network isolation constructs
 *
 * Per docs/security-analysis.md. Patterns documented for Terraform, CDK, CloudFormation.
 */

const fs = require("fs");
const path = require("path");

const IAM_PATTERNS = {
  terraform: /aws_iam_role|aws_iam_instance_profile|aws_iam_role_policy/,
  cdk: /iam\.Role|iam\.ManagedPolicy|new Role\(|\.role\s*=/,
  cloudformation: /AWS::IAM::Role|AWS::IAM::ManagedPolicy|AWS::IAM::Policy/,
};

const WILDCARD_PATTERNS = [
  /["']\*["']/, // "*"
  /s3:\*|dynamodb:\*|ec2:\*|lambda:\*|iam:\*/,
  /"Resource":\s*["']\*["']/,
  /actions\s*=\s*\[["']\*["']\]/,
  /resources\s*=\s*\[["']\*["']\]/,
];

const ENCRYPTION_PATTERNS = {
  terraform: /server_side_encryption_configuration|storage_encrypted|encrypted\s*=\s*true|kms_key_id/,
  cdk: /BucketEncryption|storageEncrypted|encrypted:\s*true/,
  cloudformation: /BucketEncryption|StorageEncrypted|Encrypted|KmsKeyId/,
};

const SECRETS_PATTERNS = {
  terraform: /aws_secretsmanager_secret|aws_secretsmanager_secret_version|type\s*=\s*["']SecureString["']/,
  cdk: /secretsmanager\.Secret|fromSecureStringParameterAttributes/,
  cloudformation: /AWS::SecretsManager::Secret|Type:\s*SecureString/,
};

const NETWORK_PATTERNS = {
  terraform: /map_public_ip_on_launch\s*=\s*false|aws_vpc_endpoint|private_subnet|cidr_blocks.*10\.|cidr_blocks.*172\./,
  bad: /cidr_blocks\s*=\s*\[["']0\.0\.0\.0\/0["']\]|0\.0\.0\.0\/0/,
};

function scanFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(process.cwd(), filePath);
  const findings = [];

  const hasIam = IAM_PATTERNS.terraform.test(content) || IAM_PATTERNS.cdk.test(content) || IAM_PATTERNS.cloudformation.test(content);
  if (!hasIam && (ext === ".tf" || ext === ".ts" || ext === ".js" || filePath.includes("cloudformation") || filePath.includes("cfn"))) {
    if (content.includes("lambda") || content.includes("ecs") || content.includes("ec2") || content.includes("Lambda") || content.includes("Fargate")) {
      findings.push({
        id: "SEC-IAM-MISSING",
        title: "No IAM resources detected for workload",
        severity: "HIGH",
        category: "security",
        blocking_status: "security_blocker",
        affected_files: [rel],
        evidence: `No aws_iam_role, iam.Role, or AWS::IAM::Role found in ${rel}`,
        recommendation: "Add IAM roles for workloads; use least-privilege policies",
      });
    }
  }

  for (const re of WILDCARD_PATTERNS) {
    if (re.test(content)) {
      findings.push({
        id: "SEC-WILDCARD",
        title: "Wildcard IAM permission detected",
        severity: "MEDIUM",
        category: "security",
        blocking_status: "improvement",
        affected_files: [rel],
        evidence: `Wildcard pattern in ${rel}`,
        recommendation: "Replace with specific actions and resources",
      });
      break;
    }
  }

  const hasEncryption = Object.values(ENCRYPTION_PATTERNS).some((re) => re.test(content));
  const hasS3OrRDS = /aws_s3_bucket|aws_db_instance|s3\.Bucket|rds\.DatabaseInstance|AWS::S3::Bucket|AWS::RDS::DBInstance/.test(content);
  if (hasS3OrRDS && !hasEncryption) {
    findings.push({
      id: "SEC-ENCRYPTION",
      title: "Storage resources without encryption configuration",
      severity: "MEDIUM",
      category: "security",
      blocking_status: "improvement",
      affected_files: [rel],
      evidence: `S3/RDS/EBS resources in ${rel} without encryption config`,
      recommendation: "Add server_side_encryption_configuration, storage_encrypted, or encrypted",
    });
  }

  const hasSecrets = Object.values(SECRETS_PATTERNS).some((re) => re.test(content));
  const hasSecretsRef = /password\s*=|api_key\s*=|secret\s*=\s*["']|credential/.test(content);
  if (hasSecretsRef && !hasSecrets && (ext === ".tf" || ext === ".ts" || ext === ".yaml" || ext === ".yml")) {
    findings.push({
      id: "SEC-SECRETS",
      title: "Possible secrets reference without Secrets Manager usage",
      severity: "MEDIUM",
      category: "security",
      blocking_status: "improvement",
      affected_files: [rel],
      evidence: `Secrets-related terms in ${rel}; no aws_secretsmanager or SecureString`,
      recommendation: "Use Secrets Manager or SSM SecureString for secrets",
    });
  }

  const hasNetworkBad = NETWORK_PATTERNS.bad.test(content);
  if (hasNetworkBad) {
    findings.push({
      id: "SEC-NETWORK",
      title: "Overly permissive network rule (0.0.0.0/0)",
      severity: "HIGH",
      category: "security",
      blocking_status: "security_blocker",
      affected_files: [rel],
      evidence: `0.0.0.0/0 in ${rel}`,
      recommendation: "Restrict to specific CIDRs; use private subnets",
    });
  }

  return findings;
}

function run(dir = ".") {
  const findings = [];
  const skipDirs = new Set(["node_modules", ".git", "dist", "build", ".terraform"]);
  const root = path.resolve(dir);

  function walk(d) {
    if (!fs.existsSync(d)) return;
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (!skipDirs.has(e.name)) walk(full);
      } else if (/\.(tf|tf\.json|ts|js|yaml|yml|json)$/.test(e.name)) {
        try {
          const content = fs.readFileSync(full, "utf-8");
          findings.push(...scanFile(full, content));
        } catch (_) {}
      }
    }
  }

  walk(root);
  return findings;
}

if (require.main === module) {
  const dir = process.argv[2] || ".";
  const findings = run(dir);
  console.log(JSON.stringify(findings, null, 2));
}

module.exports = { run, scanFile };
