# Eenmalig: git-repo voor organisatie-lakmoesproef (standalone)
# Gebruik: rechtsklik -> Run with PowerShell, OF in PowerShell:
#   Set-ExecutionPolicy -Scope Process Bypass; .\SETUP_GIT.ps1
#
# Vul hier je echte GitHub-repo-URL in (HTTPS, zonder < >):
$RemoteUrl = "https://github.com/rvodde-cyber/JOUW-REPO-NAAM.git"

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Voorkom per ongeluk repo in verkeerde map
if (-not (Test-Path ".\package.json") -or -not (Test-Path ".\vite.config.ts")) {
  Write-Host "FOUT: voer dit script uit in de map organisatie-lakmoesproef (met package.json en vite.config.ts)."
  exit 1
}

if (-not (Test-Path ".\.git")) {
  git init
}

git add .
git status

$msg = Read-Host "Commit message [Initial: organisatie lakmoesproef standalone]"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Initial: organisatie lakmoesproef standalone" }
git commit -m $msg

git branch -M main

$hasOrigin = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  git remote add origin $RemoteUrl
} else {
  git remote set-url origin $RemoteUrl
}

Write-Host ""
Write-Host "Nu pushen (vraagt om inlog/token als dat nodig is):"
Write-Host "  git push -u origin main"
Write-Host ""
git push -u origin main
