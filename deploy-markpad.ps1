param(
  [string]$VaultPluginsPath = "D:\Notes\.obsidian\plugins",
  [string[]]$AdditionalVaultPluginsPaths = @("D:\Notes\abécédaire\.obsidian\plugins"),
  [string]$PluginId = "markpad",
  [ValidateSet("all", "server", "web", "plugin")]
  [string]$Target = "all",
  [switch]$SkipDocker,
  [switch]$SkipNpmInstall,
  [switch]$DeployPluginAfterServiceBuild
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

function Ensure-EnvFile {
  param([string]$RootPath)
  $envPath = Join-Path $RootPath ".env"
  if (-not (Test-Path $envPath)) {
    Write-Step "Creation de .env a partir de .env.example"
    Copy-Item ".\.env.example" ".\.env" -Force
    Write-Host "Fichier .env cree automatiquement. Ajuste les valeurs si necessaire." -ForegroundColor Yellow
  }
}

function Deploy-PluginToVault {
  param(
    [string]$RootPath,
    [string]$VaultPath,
    [string]$PluginName
  )
  Write-Step "Preparation du plugin Obsidian"
  $pluginSourceDir = Join-Path $RootPath "plugin"
  $pluginTargetDir = Join-Path $VaultPath $PluginName

  if (-not (Test-Path $VaultPath)) {
    throw "Chemin du vault introuvable: $VaultPath"
  }

  New-Item -ItemType Directory -Path $pluginTargetDir -Force | Out-Null

  $filesToCopy = @(
    "main.js",
    "manifest.json",
    "versions.json"
  )

  foreach ($file in $filesToCopy) {
    $source = Join-Path $pluginSourceDir $file
    if (-not (Test-Path $source)) {
      throw "Fichier plugin manquant apres build: $source"
    }
    Copy-Item $source (Join-Path $pluginTargetDir $file) -Force
  }

  Write-Host "Plugin deploye dans: $pluginTargetDir" -ForegroundColor Green
}

function Deploy-PluginToVaults {
  param(
    [string]$RootPath,
    [string]$PrimaryVaultPath,
    [string[]]$ExtraVaultPaths,
    [string]$PluginName
  )

  $allVaults = @($PrimaryVaultPath) + @($ExtraVaultPaths)
  $allVaults = $allVaults | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique

  foreach ($vault in $allVaults) {
    Deploy-PluginToVault -RootPath $RootPath -VaultPath $vault -PluginName $PluginName
  }
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

Write-Step "Validation des prerequis"
Assert-Command "npm"
if (-not $SkipDocker) {
  Assert-Command "docker"
}

if (-not (Test-Path ".\package.json")) {
  throw "Le script doit etre lance a la racine du projet markpad (package.json introuvable)."
}

if (-not $SkipNpmInstall) {
  Invoke-Step "Installation des dependances npm (workspaces)" "npm install"
}

switch ($Target) {
  "all" {
    Invoke-Step "Build du monorepo" "npm run build"
    if (-not $SkipDocker) {
      Ensure-EnvFile -RootPath $scriptRoot
      Invoke-Step "Build + lancement de toute la stack Docker" "docker compose up --build -d"
    }
    Deploy-PluginToVaults -RootPath $scriptRoot -PrimaryVaultPath $VaultPluginsPath -ExtraVaultPaths $AdditionalVaultPluginsPaths -PluginName $PluginId
  }
  "server" {
    Invoke-Step "Build du service server" "npm run -w server build"
    if (-not $SkipDocker) {
      Ensure-EnvFile -RootPath $scriptRoot
      Invoke-Step "Rebuild + restart du service server uniquement" "docker compose up --build -d server"
    }
    if ($DeployPluginAfterServiceBuild) {
      Invoke-Step "Build du plugin" "npm run -w plugin build"
      Deploy-PluginToVaults -RootPath $scriptRoot -PrimaryVaultPath $VaultPluginsPath -ExtraVaultPaths $AdditionalVaultPluginsPaths -PluginName $PluginId
    }
  }
  "web" {
    Invoke-Step "Build du service web" "npm run -w web build"
    if (-not $SkipDocker) {
      Ensure-EnvFile -RootPath $scriptRoot
      Invoke-Step "Rebuild + restart du service web uniquement" "docker compose up --build -d web"
    }
    if ($DeployPluginAfterServiceBuild) {
      Invoke-Step "Build du plugin" "npm run -w plugin build"
      Deploy-PluginToVaults -RootPath $scriptRoot -PrimaryVaultPath $VaultPluginsPath -ExtraVaultPaths $AdditionalVaultPluginsPaths -PluginName $PluginId
    }
  }
  "plugin" {
    Invoke-Step "Build du plugin" "npm run -w plugin build"
    Deploy-PluginToVaults -RootPath $scriptRoot -PrimaryVaultPath $VaultPluginsPath -ExtraVaultPaths $AdditionalVaultPluginsPaths -PluginName $PluginId
  }
  default {
    throw "Target inconnu: $Target"
  }
}

Write-Step "Termine"
if (-not $SkipDocker -and $Target -ne "plugin") {
  Write-Host "Services Docker actifs. Verifie avec: docker compose ps" -ForegroundColor Green
  Write-Host "Logs serveur (SMTP, erreurs): docker compose logs -f server" -ForegroundColor DarkGray
  Write-Host "Sante API: curl http://localhost:1234/healthz  (smtpConfigured doit etre true si SMTP est renseigne)" -ForegroundColor DarkGray
}
