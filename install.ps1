# AWS Well-Architected Pack — Install script (PowerShell)
# Installs OpenCode config, skills, schemas, and optional pre-push hook.
# Usage: .\install.ps1 [-Target opencode|cursor] [-Dest DIR] [-Hooks] [-Help]

param(
    [ValidateSet("opencode", "cursor", "claude")]
    [string]$Target = "opencode",
    [string]$Dest = ".",
    [switch]$Hooks,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Write-Usage {
    @"
AWS Well-Architected Pack — Install

Usage: .\install.ps1 [options]

Options:
  -Target opencode|cursor|claude   Target harness (default: opencode)
  -Dest DIR                 Destination directory (default: current dir)
  -Hooks                    Install pre-push hook for quality gate
  -Help                     Show this help

Examples:
  .\install.ps1                          # Install for OpenCode in current dir
  .\install.ps1 -Target cursor           # Add Cursor rules for AWS pack
  .\install.ps1 -Dest ..\my-repo -Hooks   # Install into another repo with hooks
"@
}

if ($Help) { Write-Usage; exit 0 }

try { $DestAbs = (Resolve-Path $Dest -ErrorAction Stop).Path } catch { $DestAbs = Join-Path (Get-Location) $Dest }

Write-Host "[AWS Pack] Installing to $DestAbs (target: $Target)"

# OpenCode
$opencodeDest = Join-Path $DestAbs ".opencode"
New-Item -ItemType Directory -Force -Path $opencodeDest | Out-Null
Copy-Item -Path "$RepoRoot\.opencode\*" -Destination $opencodeDest -Recurse -Force
Write-Host "  - .opencode/ (plugin, tools, commands)"

# Skills
$skillsDest = Join-Path $DestAbs "skills"
New-Item -ItemType Directory -Force -Path $skillsDest | Out-Null
Copy-Item -Path "$RepoRoot\skills\aws-well-architected-pack" -Destination $skillsDest -Recurse -Force
Write-Host "  - skills/aws-well-architected-pack/"

# Schemas
$schemasDest = Join-Path $DestAbs "schemas"
New-Item -ItemType Directory -Force -Path $schemasDest | Out-Null
Copy-Item -Path "$RepoRoot\schemas\*.json" -Destination $schemasDest -Force -ErrorAction SilentlyContinue
Write-Host "  - schemas/"

# Docs
$docsDest = Join-Path $DestAbs "docs"
New-Item -ItemType Directory -Force -Path $docsDest | Out-Null
@("RULES.md", "docs\OPERATING-MODEL.md", "docs\scoring-model.md", "docs\command-to-skill-mapping.md", "docs\LEGACY-SKILLS.md") | ForEach-Object {
    if (Test-Path "$RepoRoot\$_") {
        $targetDir = Split-Path (Join-Path $DestAbs $_) -Parent
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
        Copy-Item -Path "$RepoRoot\$_" -Destination (Join-Path $DestAbs $_) -Force
    }
}
if (Test-Path "$RepoRoot\RULES.md") { Copy-Item "$RepoRoot\RULES.md" $DestAbs -Force }
Write-Host "  - RULES.md, docs/"

# Cursor
if ($Target -in @("cursor", "claude")) {
    $cursorRules = Join-Path $DestAbs ".cursor\rules"
    New-Item -ItemType Directory -Force -Path $cursorRules | Out-Null
    if (Test-Path (Join-Path $RepoRoot ".cursor\rules")) {
        Copy-Item -Path "$RepoRoot\.cursor\rules\*.md" -Destination $cursorRules -Force
    }
    Write-Host "  - .cursor/rules/"
}

# Claude Code
if ($Target -eq "claude") {
    $claudeDest = Join-Path $DestAbs ".claude"
    New-Item -ItemType Directory -Force -Path $claudeDest | Out-Null
    Copy-Item -Path "$RepoRoot\.claude\*" -Destination $claudeDest -Recurse -Force
    Write-Host "  - .claude/ (CLAUDE.md, agents)"
}

# Pre-push hook
if ($Hooks) {
    $hooksDest = Join-Path $DestAbs ".git\hooks"
    New-Item -ItemType Directory -Force -Path $hooksDest | Out-Null
    Copy-Item -Path "$RepoRoot\hooks\pre-push" -Destination (Join-Path $hooksDest "pre-push") -Force
    Write-Host "  - .git/hooks/pre-push"
}

# Plugin deps
$bun = Get-Command bun -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($bun) {
    Push-Location (Join-Path $DestAbs ".opencode"); bun install; Pop-Location
    Write-Host "  - .opencode deps (bun)"
} elseif ($npm) {
    Push-Location (Join-Path $DestAbs ".opencode"); npm install; Pop-Location
    Write-Host "  - .opencode deps (npm)"
} else {
    Write-Host "  - Run 'cd .opencode && bun install' (or npm install) to install plugin deps"
}

Write-Host "[AWS Pack] Done. Run: opencode run `"/repo-assess`""
if ($Hooks) {
    Write-Host "  Pre-push hook installed. Set AWS_PACK_ENFORCE_QUALITY_GATE=true to enforce."
}
