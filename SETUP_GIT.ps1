# Eenmalig: git-repo voor organisatie-lakmoesproef (standalone)
# Gebruik in PowerShell:
#   cd C:\Users\876409\organisatie-lakmoesproef
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   .\SETUP_GIT.ps1
#
# Vul hier je echte GitHub-repo-URL in (HTTPS, zonder < >):
$RemoteUrl = "https://github.com/rvodde-cyber/JOUW-REPO-NAAM.git"

Set-Location $PSScriptRoot
$ErrorActionPreference = "Continue"

# Voorkom per ongeluk repo in verkeerde map
if (-not (Test-Path ".\package.json") -or -not (Test-Path ".\vite.config.ts")) {
  Write-Host "FOUT: voer dit script uit in de map organisatie-lakmoesproef (met package.json en vite.config.ts)."
  exit 1
}

if ($RemoteUrl -match "JOUW-REPO-NAAM") {
  Write-Host "FOUT: pas bovenin SETUP_GIT.ps1 de variabele `$RemoteUrl aan naar je echte GitHub-repo."
  exit 1
}

if (-not (Test-Path ".\.git")) {
  git init
}

git add .
git status

$msg = Read-Host "Commit message [Initial: organisatie lakmoesproef standalone]"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Initial: organisatie lakmoesproef standalone" }

$pending = git diff --cached --quiet 2>$null; $staged = $LASTEXITCODE -ne 0
if ($staged) {
  git commit -m $msg
} else {
  Write-Host "(Niets nieuws om te committen — overslaan.)"
}

git branch -M main

# PowerShell: geen 'git remote get-url' gebruiken met $ErrorActionPreference Stop — geeft fout als origin ontbreekt
$remotes = @(git remote 2>$null)
if ($remotes -contains "origin") {
  git remote set-url origin $RemoteUrl
  Write-Host "Remote 'origin' bijgewerkt."
} else {
  git remote add origin $RemoteUrl
  Write-Host "Remote 'origin' toegevoegd."
}

Write-Host ""
Write-Host "Pushen naar GitHub (inlog/token kan gevraagd worden)..."
git push -u origin main
