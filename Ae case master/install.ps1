# AE Case Master - PowerShell Universal Installer
# Created by Aftab Musrraf

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       AE CASE MASTER - UNIVERSAL INSTALLER            " -ForegroundColor Yellow
Write-Host "       Created by Aftab Musrraf                        " -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$extId = "com.aftab.aecasemaster"
$targetDir = Join-Path $env:APPDATA "Adobe\CEP\extensions\$extId"
$sourceDir = $PSScriptRoot

Write-Host "[*] Configuring Adobe PlayerDebugMode registry keys..." -ForegroundColor White

for ($v = 5; $v -le 16; $v++) {
    $regPath = "HKCU:\Software\Adobe\CSXS.$v"
    if (!(Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
    }
    Set-ItemProperty -Path $regPath -Name "PlayerDebugMode" -Value "1" -Force
}

Write-Host "[OK] PlayerDebugMode enabled for CSXS 5 through 16!" -ForegroundColor Green

Write-Host ""
Write-Host "[*] Target Directory: $targetDir" -ForegroundColor White

if (Test-Path $targetDir) {
    Remove-Item -Path $targetDir -Recurse -Force
}
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

Write-Host "[*] Copying extension components..." -ForegroundColor White

Copy-Item -Path (Join-Path $sourceDir "CSXS") -Destination $targetDir -Recurse -Force
Copy-Item -Path (Join-Path $sourceDir "css") -Destination $targetDir -Recurse -Force
Copy-Item -Path (Join-Path $sourceDir "js") -Destination $targetDir -Recurse -Force
Copy-Item -Path (Join-Path $sourceDir "jsx") -Destination $targetDir -Recurse -Force
Copy-Item -Path (Join-Path $sourceDir "index.html") -Destination $targetDir -Force
Copy-Item -Path (Join-Path $sourceDir "AE_Case_Master.jsx") -Destination $targetDir -Force
Copy-Item -Path (Join-Path $sourceDir ".debug") -Destination $targetDir -Force

Write-Host "[OK] Extension installed successfully!" -ForegroundColor Green

# Optional: Install ScriptUI Panel into detected AE versions if permissions allow
$aeBase = "C:\Program Files\Adobe"
if (Test-Path $aeBase) {
    $aeFolders = Get-ChildItem -Path $aeBase -Directory -Filter "*After Effects*"
    foreach ($f in $aeFolders) {
        $scriptUIPerPath = Join-Path $f.FullName "Support Files\Scripts\ScriptUI Panels"
        if (Test-Path $scriptUIPerPath) {
            try {
                Copy-Item -Path (Join-Path $sourceDir "AE_Case_Master.jsx") -Destination $scriptUIPerPath -Force -ErrorAction Stop
                Write-Host "[OK] ScriptUI panel copied to: $($f.Name)" -ForegroundColor Green
            } catch {
                Write-Host "[i] Note: To copy ScriptUI panel to Program Files for $($f.Name), run installer as Administrator." -ForegroundColor Gray
            }
        }
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "               INSTALLATION COMPLETE!                   " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "1. Restart Adobe After Effects if currently open." -ForegroundColor White
Write-Host "2. Launch After Effects." -ForegroundColor White
Write-Host "3. Navigate to: Window > Extensions > AE Case Master" -ForegroundColor Yellow
Write-Host "4. (Optional) Run AE_Case_Master.jsx via File > Scripts > Run Script File..." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

