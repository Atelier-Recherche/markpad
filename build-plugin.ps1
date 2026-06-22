param(
  [string]$VaultPluginsPath = "D:\Notes\.obsidian\plugins",
  [string]$PluginId = "markpad",
  [switch]$SkipNpmInstall
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-Command {
  param([string]$CommandName)
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "Commande manquante: '$CommandName'. Installe-la puis relance le script."
  }
}

function Invoke-Step {
  param(
    [string]$Title,
    [string]$Command
  )
  Write-Step $Title
  Write-Host "PS> $Command" -ForegroundColor DarkGray
  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Echec de la commande: $Command"
  }
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

Write-Step "Validation des prerequis"
Assert-Command "npm"

if (-not (Test-Path ".\package.json")) {
  throw "Le script doit etre lance a la racine du projet markpad (package.json introuvable)."
}

$pluginTargetDir = Join-Path $VaultPluginsPath $PluginId
if (-not (Test-Path $VaultPluginsPath)) {
  throw "Chemin du vault introuvable: $VaultPluginsPath"
}

if (-not $SkipNpmInstall) {
  Invoke-Step "Installation des dependances npm (workspaces)" "npm install"
}

Invoke-Step "Build @markpad/collab-note" "npm run -w @markpad/collab-note build"
Invoke-Step "Build du plugin" "npm run -w plugin build"

Write-Step "Copie vers le vault Obsidian"
New-Item -ItemType Directory -Path $pluginTargetDir -Force | Out-Null

$pluginSourceDir = Join-Path $scriptRoot "plugin"
foreach ($file in @("main.js", "manifest.json", "versions.json")) {
  $source = Join-Path $pluginSourceDir $file
  if (-not (Test-Path $source)) {
    throw "Fichier plugin manquant apres build: $source"
  }
  Copy-Item $source (Join-Path $pluginTargetDir $file) -Force
}

Write-Step "Termine"
Write-Host "Plugin deploye dans: $pluginTargetDir" -ForegroundColor Green
Write-Host "Dans Obsidian : recharger le plugin (desactiver/reactiver ou redemarrer l'app)." -ForegroundColor DarkGray
