# Ransom Note Pro - Adobe After Effects Extension & ScriptUI Panel

**Created by Aftab Musrraf**

An Adobe After Effects extension designed to generate authentic, procedural cutout collage animations. Compatible with **all versions of Adobe After Effects** (CC 2014 through CC 2026+).

---

## 🎨 Features & UI Overview

Matches the custom UI design:

1. **Window Header**:
   - Modern dark navy window styling with macOS-style controls.
   - Title: **Ransom Note Pro** with author credit.
2. **Interactive Live Preview**:
   - Dynamic real-time preview canvas showcasing the ransom note cutouts.
   - Live editable text input with re-randomize dice button.
3. **Color Palette System**:
   - 11 pre-curated color swatches (Coral, Gold, Lime, Emerald, Teal, Sky, Purple, Pink, Kraft Tan, Off-White, Slate).
   - Interactive Rainbow Spectrum slider for instant custom color blending.
   - Custom Color hex input with native color picker & eyedropper support.
   - **Randomize Palette** button with curated color harmony sets.
4. **8 One-Click Presets**:
   - **Vintage Newspaper**: Classic serif letterpress styling on newsprint paper.
   - **Magazine Glossy**: High-contrast, bold editorial cutouts with vivid colors.
   - **Grunge Craft Paper**: Monospace & worn rustic aesthetic on textured craft paper.
   - **Torn Cardboard**: Chunky cardboard cutout tiles with rounded torn edges.
   - **Stencil Spray**: High-energy spray stencil typography with dark distressing.
   - **Pop-Art Retro**: Comic halftone look with heavy outlines and vibrant accents.
   - **Typewriter Classic**: Vintage mechanical typewriter letters on aged cream paper.
   - **Random Ransom**: Dynamic mixed collage combining different styles, fonts, and papers.
5. **Layout & Transform Controls**:
   - **Scale**: Interactive slider with quick jump ticks (`0.5x`, `1.0x`, `2.0x`).
   - **Rotation**: Angle slider with ticks (`0°`, `45°`).
   - **Grid Size / Jitter**: Spacing and placement irregularity slider (`6`, `12`, `24`).
6. **Pattern Randomization**:
   - Toggles for **Randomize Font Size**, **Randomize Position**, and **Randomize Angle**.
7. **Advanced Animation Engine**:
   - **In Animation**: Selectable styles (*Paper Crumble*, *Stop-Motion Pop*, *Stamp Down*, *Cutout Drop*, *Slide In*, *Typewriter Strike*).
   - Custom parameters: Duration (`0.6s`), Scale In (`110%`), Position X (`0`), Opacity In (`0%`).
   - **Out Animation**: Optional exit transitions (*Paper Crumble*, *Fly Away*, *Drop Down*, *Paper Tear*, *Fade Cut*).
   - **Additional Options**:
     - **Ease**: *Ease-In-Out*, *Linear*, *Stop-Motion (10fps Posterize Time)*, *Cutout Snap*, *Bounce*.
     - **Direction**: *Left to Right*, *Right to Left*, *Random Order*, *All Together*, *Center Out*.
8. **Action Buttons**:
   - **⚡ GENERATE IN AFTER EFFECTS**: Procedurally creates Controller Null, Shape Layer paper tiles, roughen edge effects, drop shadows, and text layers.
   - **📝 CONVERT SELECTED TEXT LAYER**: Converts any active text layer directly into ransom note cutouts.

---

## 🚀 Compatibility & Installation

### Compatibility:
- **Adobe After Effects**: CC 2014, CC 2015, CC 2017, CC 2018, CC 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026+
- **Operating Systems**: Windows 10 / 11 and macOS

### 1-Click Installation (Recommended):
Double-click [install_extension.bat](file:///c:/Users/JUNAID/Desktop/Ransom%20note%20pro/install_extension.bat).
The installer automatically:
1. Enables `PlayerDebugMode` in Windows Registry for all Adobe CSXS versions (CSXS 4 through 25).
2. Deploys the extension directly to:
   - `%APPDATA%\Adobe\CEP\extensions\com.aftab.ransomnotepro`
   - `%APPDATA%\Adobe\CEP\extensions\Ransom note pro`

### How to Open in After Effects:
1. Restart Adobe After Effects (if already running).
2. In the top menu bar, go to:
   ```
   Window > Extensions > Ransom Note Pro
   ```

---

## 🛠️ Standalone ScriptUI Panel (Alternative)
For environments where CEP extensions cannot be installed, a standalone ScriptUI panel is included:
`standalone/Ransom Note Pro - ScriptUI.jsx`

To use it:
- In After Effects: `File > Scripts > Run Script File...` and choose `Ransom Note Pro - ScriptUI.jsx`.
- Or copy it to:
  `C:\Program Files\Adobe\Adobe After Effects <Version>\Support Files\Scripts\ScriptUI Panels\`
  and access it via `Window > Ransom Note Pro - ScriptUI.jsx`.

---

## 📁 Directory Structure
```
ransom note pro/
├── extension/
│   ├── CSXS/
│   │   └── manifest.xml          (CEP Manifest supporting AE 13.0 - 99.9)
│   ├── client/
│   │   ├── index.html            (HTML5 Panel UI matching reference)
│   │   ├── css/
│   │   │   └── style.css         (Custom styling and design system)
│   │   ├── js/
│   │   │   ├── CSInterface.js    (Adobe CEP host communication)
│   │   │   └── main.js           (Interactive UI logic & preview engine)
│   │   └── assets/
│   │       └── presets/          (Cropped high-res preset thumbnails)
│   └── host/
│       └── index.jsx             (ExtendScript ES3 engine with error handling)
├── standalone/
│   └── Ransom Note Pro - ScriptUI.jsx (Direct ScriptUI Panel)
├── install_extension.bat         (1-click Windows installer)
├── install_extension.ps1         (PowerShell installer)
├── Ransom note pro.png           (Original UI design reference)
└── README.md                     (Documentation)
```
