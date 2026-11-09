# AE Case Master 🚀

**AE Case Master** is a professional, universal extension and dockable panel for **Adobe After Effects**, crafted by **Aftab Musrraf**.

It features an ultra-sleek, modern dark-mode UI designed to streamline and accelerate your daily motion design workflow across **all versions of Adobe After Effects** (CS6, CC 2014, CC 2017, CC 2018, CC 2019, CC 2020, CC 2021, CC 2022, CC 2023, CC 2024, CC 2025+).

---

## 🌟 Key Features

### 1. 🔤 Case Tools
Transform selected text layers instantly with full support for static and keyframed text:
- **`Sc` Sentence Case**: Capitalizes the first letter of each sentence and formats the rest cleanly.
- **`lc` lower case**: Converts entire text into lowercase.
- **`UC` UPPER CASE**: Converts entire text into uppercase.
- **`aC` aLtErNaTiNg CaSe**: Alternates casing between characters for dynamic text effects.
- **`TC` Title Case**: Capitalizes the first letter of every word.
- **`iC` InVeRsE CaSe**: Inverts current casing (swaps uppercase to lowercase and vice versa).

### 2. ✂️ Text Utilities
Clean, split, and optimize typography layers with a single click:
- **Trim Spaces**: Cleans up trailing/leading whitespace and eliminates messy double spaces.
- **Remove Breaks**: Merges multi-line paragraphs into a seamless single line.
- **Split Lines**: Breaks multi-line text into individual, properly spaced text layers along the Y-axis.
- **Merge Lines**: Merges multiple selected text layers into a single combined layer.
- **Duplicate Text**: Creates instant duplicates of selected text layers placed right above the originals.
- **Sort Lines**: Sorts lines within the selected text layers alphabetically (A to Z).

### 3. 📐 Align & Distribute
Position layers with mathematical precision based on their true visual bounding boxes:
- **Horizontal**: `LEFT`, `CENTER`, `RIGHT`, and `JUSTIFY` (Distribute evenly).
- **Vertical**: `TOP`, `MIDDLE`, and `BOTTOM`.
- Works on **all layer types**: Text, Shapes, Solids, Footages, Nulls, and Precomps.
- Single layer aligns directly to composition bounds; multiple layers align relative to their collective selection bounding box.

### 4. ⚡ Quick Actions
Essential power-user shortcuts:
- **Select All Text Layers**: Instantly isolates and selects all text layers in the active comp.
- **Rename Layers**: Smart modal with support for:
  - Renaming directly to text content
  - Adding Prefix or Suffix
  - Find & Replace string
  - Sequential numbering (`Layer_01`, `Layer_02`)
- **Center Anchor Point**: Snaps anchor points to the exact visual center of layers without shifting position.
- **Reset Transform**: Restores Position, Scale (100%), Rotation (0°), Opacity (100%), and Anchor Point.

---

## 💻 Installation

### Method 1: Automatic 1-Click Install (Windows)

1. Close Adobe After Effects if open.
2. Double-click **`install.bat`** (or right-click `install.ps1` and select **Run with PowerShell**).
3. The installer will:
   - Copy the extension to `%APPDATA%\Adobe\CEP\extensions\com.aftab.aecasemaster`
   - Enable `PlayerDebugMode` in the Windows registry across all After Effects versions.
4. Launch After Effects.
5. In the top menu, go to: **`Window` > `Extensions` > `AE Case Master`**.

---

### Method 2: Automatic Install (macOS)

1. Close Adobe After Effects if open.
2. Open Terminal in this folder and run:
   ```bash
   chmod +x install_mac.sh
   ./install_mac.sh
   ```
3. Launch After Effects.
4. Go to **`Window` > `Extensions` > `AE Case Master`**.

---

### Method 3: Standalone ScriptUI Panel (`.jsx`)

If you prefer a native dockable ScriptUI panel without CEP:
- **Windows**: Copy `AE_Case_Master.jsx` to:
  `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
- **macOS**: Copy `AE_Case_Master.jsx` to:
  `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
- Restart After Effects and open: **`Window` > `AE_Case_Master.jsx`**.
- *Or simply run it on the fly via **`File` > `Scripts` > `Run Script File...`**.*

---

## ⚙️ After Effects Recommended Settings

To ensure scripts and extensions have full access:
1. In After Effects, open **`Edit` > `Preferences` > `Scripting & Expressions`** (or `General` in older versions).
2. Check the box: **`Allow Scripts to Write Files and Access Network`**.

---

## 📁 Extension Architecture

```
Ae case master/
├── CSXS/
│   └── manifest.xml        # CEP Manifest (Supports AE 12.0 to 99.9)
├── css/
│   └── style.css           # Modern dark-mode UI stylesheet
├── js/
│   ├── CSInterface.js      # Universal CSInterface bridge
│   └── main.js             # Client controller & interaction logic
├── jsx/
│   └── hostscript.jsx      # ExtendScript AE engine
├── .debug                  # Remote Chrome debugging config
├── index.html              # HTML5 responsive extension panel
├── AE_Case_Master.jsx      # Native ScriptUI dockable panel
├── install.bat             # 1-Click Windows Batch installer
├── install.ps1             # PowerShell installer
├── install_mac.sh          # macOS Shell installer
└── README.md               # Documentation
```

---

## 📺 Connect & Support

Subscribe to the YouTube channel for tutorials, workflow tips, and new motion design tools:  
[![YouTube Channel](https://img.shields.io/badge/YouTube-@AftabMusrraf-red?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@AftabMusrraf)  
👉 **[https://www.youtube.com/@AftabMusrraf](https://www.youtube.com/@AftabMusrraf)**

---

*Created with ❤️ by **Aftab Musrraf***

