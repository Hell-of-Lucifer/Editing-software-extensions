@echo off
setlocal enabledelayedexpansion

title Ransom Note Pro - Installer
echo =====================================================================
echo                RANSOM NOTE PRO - 1-CLICK INSTALLER
echo                Created by Aftab Musrraf
echo =====================================================================
echo.

:: 1. Enable PlayerDebugMode in Windows Registry for all CSXS versions (4 to 25)
echo [1/3] Enabling Adobe CEP PlayerDebugMode in Registry (CSXS 4 - 25)...
for %%V in (4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25) do (
    reg add "HKCU\Software\Adobe\CSXS.%%V" /v PlayerDebugMode /t REG_SZ /d "1" /f >nul 2>&1
)
echo      [OK] PlayerDebugMode enabled successfully.
echo.

:: 2. Target Directories for CEP Extension
set "CEP_BASE=%APPDATA%\Adobe\CEP\extensions"
set "TARGET_BUNDLE=%CEP_BASE%\com.aftab.ransomnotepro"
set "TARGET_NAME=%CEP_BASE%\Ransom note pro"

echo [2/3] Installing CEP Extension to:
echo      "%TARGET_BUNDLE%"
echo      "%TARGET_NAME%"

if not exist "%CEP_BASE%" (
    mkdir "%CEP_BASE%" >nul 2>&1
)

:: Install to Bundle ID folder (com.aftab.ransomnotepro)
if exist "%TARGET_BUNDLE%" (
    rmdir /s /q "%TARGET_BUNDLE%" >nul 2>&1
)
mkdir "%TARGET_BUNDLE%" >nul 2>&1

:: Copy contents using robocopy / xcopy wildcard
robocopy "%~dp0extension" "%TARGET_BUNDLE%" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul 2>&1
if not exist "%TARGET_BUNDLE%\CSXS\manifest.xml" (
    xcopy /E /I /Y "%~dp0extension\*" "%TARGET_BUNDLE%\" >nul 2>&1
)

:: Install to Name folder (Ransom note pro) for maximum AE compatibility
if exist "%TARGET_NAME%" (
    rmdir /s /q "%TARGET_NAME%" >nul 2>&1
)
mkdir "%TARGET_NAME%" >nul 2>&1

robocopy "%~dp0extension" "%TARGET_NAME%" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul 2>&1
if not exist "%TARGET_NAME%\CSXS\manifest.xml" (
    xcopy /E /I /Y "%~dp0extension\*" "%TARGET_NAME%\" >nul 2>&1
)

:: Verify Installation
if exist "%TARGET_BUNDLE%\CSXS\manifest.xml" (
    echo      [OK] Extension files copied and verified successfully!
) else (
    echo      [ERROR] Could not copy extension files. Please check permissions.
)
echo.

:: 3. Check if After Effects is running
echo [3/3] Checking Adobe After Effects status...
tasklist /fi "imagename eq AfterFX.exe" 2>nul | find /i "AfterFX.exe" >nul
if not errorlevel 1 (
    echo.
    echo   ***************************************************************
    echo   [IMPORTANT] Adobe After Effects is currently running!
    echo   Please RESTART After Effects so it can load the new extension.
    echo   ***************************************************************
) else (
    echo      [OK] After Effects is ready to launch.
)

echo.
echo =====================================================================
echo                        INSTALLATION COMPLETE!
echo =====================================================================
echo.
echo  How to open Ransom Note Pro in Adobe After Effects:
echo  --------------------------------------------------
echo  1. Launch or Restart Adobe After Effects.
echo  2. In the top menu bar, click:
echo     Window ^> Extensions ^> Ransom Note Pro
echo.
echo  Alternative (Standalone ScriptUI Panel):
echo  - In After Effects: File ^> Scripts ^> Run Script File...
echo    Select: "%~dp0standalone\Ransom Note Pro - ScriptUI.jsx"
echo =====================================================================
echo.
pause
