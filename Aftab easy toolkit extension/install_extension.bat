@echo off
echo ============================================================
echo   Installing Easy Toolkit Extension for Adobe After Effects
echo ============================================================
echo.

:: 1. Enable PlayerDebugMode for all CEP versions (CC 2015 - 2026+)
echo [1/3] Enabling Adobe CEP Debug Mode...
reg add "HKCU\Software\Adobe\CSXS.6" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.7" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.8" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f >nul 2>&1
echo       Done!

:: 2. Target Directory
echo [2/3] Setting up CEP extensions directory...
set "TARGET_DIR=%APPDATA%\Adobe\CEP\extensions\Easy Toolkit"
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

:: 3. Copy files
echo [3/3] Copying extension files...
xcopy /E /Y /I "%~dp0CSXS" "%TARGET_DIR%\CSXS" >nul
xcopy /E /Y /I "%~dp0css" "%TARGET_DIR%\css" >nul
xcopy /E /Y /I "%~dp0js" "%TARGET_DIR%\js" >nul
xcopy /E /Y /I "%~dp0jsx" "%TARGET_DIR%\jsx" >nul
xcopy /E /Y /I "%~dp0assets" "%TARGET_DIR%\assets" >nul
copy /Y "%~dp0index.html" "%TARGET_DIR%\" >nul
copy /Y "%~dp0.debug" "%TARGET_DIR%\" >nul

echo.
echo ============================================================
echo   SUCCESS: Easy Toolkit installed successfully!
echo   Open After Effects - Window - Extensions - Easy Toolkit
echo ============================================================
echo.
pause
