<#
.SYNOPSIS
    Ransom Note Pro - PowerShell Installer
    Enables CEP PlayerDebugMode and installs the extension for all AE versions.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         RANSOM NOTE PRO - INSTALLATION SCRIPT             " -ForegroundColor Yellow
Write-Host "                 Created by Aftab Musrraf                  " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Enable PlayerDebugMode in Registry
Write-Host "`n[1/3] Enabling CEP PlayerDebugMode for all CSXS versions..." -ForegroundColor Green
4..25 | ForEach-Object {
    $regPath = "HKCU:\Software\Adobe\CSXS.$_"
    if (!(Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "PlayerDebugMode" -Value "1" -Force
}
Write-Host " -> PlayerDebugMode enabled in registry for CSXS 4 through 25." -ForegroundColor Gray

# 2. Copy extension to AppData CEP extensions (both bundle ID and display name)
$cepBase = Join-Path $env:APPDATA "Adobe\CEP\extensions"
$targetBundle = Join-Path $cepBase "com.aftab.ransomnotepro"
$targetName = Join-Path $cepBase "Ransom note pro"
$sourceDir = Join-Path $PSScriptRoot "extension"

Write-Host "`n[2/3] Installing CEP Extension to:`n $targetBundle`n $targetName" -ForegroundColor Green

if (!(Test-Path $cepBase)) {
    New-Item -ItemType Directory -Path $cepBase -Force | Out-Null
}

# Install to com.aftab.ransomnotepro
if (Test-Path $targetBundle) {
    Remove-Item -Path $targetBundle -Recurse -Force
}
New-Item -ItemType Directory -Path $targetBundle -Force | Out-Null
Copy-Item -Path "$sourceDir\*" -Destination $targetBundle -Recurse -Force

# Install to Ransom note pro
if (Test-Path $targetName) {
    Remove-Item -Path $targetName -Recurse -Force
}
New-Item -ItemType Directory -Path $targetName -Force | Out-Null
Copy-Item -Path "$sourceDir\*" -Destination $targetName -Recurse -Force

if ((Test-Path (Join-Path $targetBundle "CSXS\manifest.xml")) -and (Test-Path (Join-Path $targetBundle "index.html"))) {
    Write-Host " -> Extension installed and verified successfully!" -ForegroundColor Green
} else {
    Write-Host " -> Error: Failed to copy extension files." -ForegroundColor Red
}

# 3. Check if AfterFX is running
Write-Host "`n[3/3] Checking After Effects process..." -ForegroundColor Green
$aeProcess = Get-Process AfterFX -ErrorAction SilentlyContinue
if ($aeProcess) {
    Write-Host " [!] Adobe After Effects is currently running!" -ForegroundColor Yellow
    Write-Host "     Please RESTART After Effects so it can detect the new extension." -ForegroundColor Yellow
} else {
    Write-Host " -> After Effects is ready to launch." -ForegroundColor Gray
}

# 4. Completion
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "                 INSTALLATION COMPLETE!                   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "To use Ransom Note Pro in Adobe After Effects:" -ForegroundColor Yellow
Write-Host " 1. Launch or Restart Adobe After Effects."
Write-Host " 2. In the top menu, click: Window > Extensions > Ransom Note Pro."
Write-Host " 3. Or run the standalone script: File > Scripts > Run Script File... and choose:"
Write-Host "    $(Join-Path $PSScriptRoot 'standalone\Ransom Note Pro - ScriptUI.jsx')`n"
