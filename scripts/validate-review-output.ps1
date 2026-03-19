# Validate review output against schemas/review-score.schema.json
# Usage: .\scripts\validate-review-output.ps1 [path-to.json]
# Default: examples/validated-review-output.json

param([string]$DataPath)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$Schema = Join-Path $RepoRoot "schemas/review-score.schema.json"
$DefaultData = Join-Path $RepoRoot "examples/validated-review-output.json"
$Data = if ($DataPath) { $DataPath } else { $DefaultData }

if (-not (Test-Path $Schema)) {
    Write-Error "Schema not found at $Schema"
    exit 1
}

if (-not (Test-Path $Data)) {
    Write-Error "Data file not found at $Data"
    exit 1
}

Write-Host "Validating $Data against $Schema..."
npx --yes ajv validate -s $Schema -d $Data
Write-Host "Validation passed."
