#!/bin/bash
# AE Case Master - macOS Universal Installer
# Created by Aftab Musrraf

echo "========================================================"
echo "       AE CASE MASTER - MAC INSTALLER                   "
echo "       Created by Aftab Musrraf                         "
echo "========================================================"
echo ""

EXT_ID="com.aftab.aecasemaster"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/$EXT_ID"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[*] Enabling PlayerDebugMode in macOS defaults..."
for v in {5..16}; do
    defaults write com.adobe.CSXS.$v PlayerDebugMode 1
done
echo "[OK] Adobe CEP Debug Mode enabled!"

echo ""
echo "[*] Creating target directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "[*] Copying extension files..."
cp -R "$SCRIPT_DIR/CSXS" "$TARGET_DIR/"
cp -R "$SCRIPT_DIR/css" "$TARGET_DIR/"
cp -R "$SCRIPT_DIR/js" "$TARGET_DIR/"
cp -R "$SCRIPT_DIR/jsx" "$TARGET_DIR/"
cp "$SCRIPT_DIR/index.html" "$TARGET_DIR/"
cp "$SCRIPT_DIR/.debug" "$TARGET_DIR/"

echo "[OK] Files copied successfully!"

# Check for ScriptUI Panels in Applications
for appDir in /Applications/Adobe\ After\ Effects*; do
    if [ -d "$appDir/Scripts/ScriptUI Panels" ]; then
        cp "$SCRIPT_DIR/AE_Case_Master.jsx" "$appDir/Scripts/ScriptUI Panels/"
        echo "[OK] ScriptUI panel installed to $appDir"
    fi
done

echo ""
echo "========================================================"
echo "               INSTALLATION COMPLETE!                   "
echo "========================================================"
echo "1. Restart Adobe After Effects."
echo "2. Open Window > Extensions > AE Case Master"
echo "========================================================"
