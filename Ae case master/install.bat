@echo off
setlocal enabledelayedexpansion
title AE Case Master - Universal Installer

echo ========================================================
echo        AE CASE MASTER - 1-CLICK INSTALLER
echo        Created by Aftab Musrraf
echo ========================================================
echo.

set "EXT_ID=com.aftab.aecasemaster"
set "CEP_DIR=%APPDATA%\Adobe\CEP\extensions\%EXT_ID%"
set "SRC_DIR=%~dp0"

echo [*] Enabling Adobe CEP Debug Mode for all versions...
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.5" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.6" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.7" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.8" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.14" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.15" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.16" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo [OK] Adobe CEP Debug Mode enabled!

echo.
echo [*] Installing Extension to:
echo     %CEP_DIR%

if not exist "%CEP_DIR%" (
    mkdir "%CEP_DIR%"
)

echo [*] Copying extension files...
xcopy /E /Y /I "%SRC_DIR%CSXS" "%CEP_DIR%\CSXS" >nul
xcopy /E /Y /I "%SRC_DIR%css" "%CEP_DIR%\css" >nul
xcopy /E /Y /I "%SRC_DIR%js" "%CEP_DIR%\js" >nul
xcopy /E /Y /I "%SRC_DIR%jsx" "%CEP_DIR%\jsx" >nul
copy /Y "%SRC_DIR%index.html" "%CEP_DIR%\" >nul
copy /Y "%SRC_DIR%AE_Case_Master.jsx" "%CEP_DIR%\" >nul
copy /Y "%SRC_DIR%.debug" "%CEP_DIR%\" >nul

echo [OK] Extension files copied successfully!

echo.
echo ========================================================
echo        INSTALLATION COMPLETE!
echo ========================================================
echo.
echo How to open AE Case Master in After Effects:
echo   1. If After Effects is running, restart it.
echo   2. Open After Effects.
echo   3. Go to top menu: Window ^> Extensions ^> AE Case Master
echo.
echo Bonus: You can also use the standalone ScriptUI panel
echo        by running AE_Case_Master.jsx via:
echo        File ^> Scripts ^> Run Script File...
echo ========================================================
echo.
pause
