@echo off
echo ========================================================
echo   Aftab Tube Downloder - After Effects Extension Setup
echo   Created by Aftab Musrraf
echo ========================================================
echo.

:: 1. Enable PlayerDebugMode for all CSXS versions
echo [*] Enabling Adobe CEP PlayerDebugMode...
reg add "HKCU\Software\Adobe\CSXS.5" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.6" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.7" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.8" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.13" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.14" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.15" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.16" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1

:: 2. Target Directory
set "TARGET=%APPDATA%\Adobe\CEP\extensions\com.aftab.tubedownloader"

echo [*] Target Directory: %TARGET%
if not exist "%TARGET%" mkdir "%TARGET%"

:: 3. Copy files
echo [*] Copying extension files...
xcopy /E /I /Y "%~dp0CSXS" "%TARGET%\CSXS\" >nul
xcopy /E /I /Y "%~dp0css" "%TARGET%\css\" >nul
xcopy /E /I /Y "%~dp0js" "%TARGET%\js\" >nul
xcopy /E /I /Y "%~dp0host" "%TARGET%\host\" >nul
xcopy /E /I /Y "%~dp0assets" "%TARGET%\assets\" >nul
xcopy /E /I /Y "%~dp0bin" "%TARGET%\bin\" >nul
copy /Y "%~dp0index.html" "%TARGET%\index.html" >nul

echo.
echo ========================================================
echo   [SUCCESS] Extension Installed Successfully!
echo.
echo   How to Open in Adobe After Effects:
echo   1. Launch or Restart Adobe After Effects
echo   2. Go to Window menu -> Extensions -> Aftab Tube Downloder
echo ========================================================
echo.
pause
