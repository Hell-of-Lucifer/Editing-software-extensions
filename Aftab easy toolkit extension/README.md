# Easy Toolkit - Adobe After Effects Extension

An ultra-sleek, modern, and high-performance Adobe After Effects CEP extension panel built with a custom neon purple aesthetic. Designed for maximum speed, smooth workflow, and 100% compatibility across all versions of After Effects (CC 2015 to CC 2026+).

---

## 🎨 Theme & Appearance
- **Deep Obsidian Purple Theme**: Specially crafted dark purple background (`#0c0915`), glowing purple accents (`#a855f7`, `#c084fc`), and sleek card surfaces.
- **Micro-Interactions**: Hover glow, smooth Bezier animations, tactile button feedback, and responsive layout.

---

## 🚀 Features Overview

### 1. ✏️ Edit Tab
- **Curves**: Opens the interactive cubic Bezier easing curve editor (matches Screenshot 801).
- **Text**: Automatically creates a centered text layer (`"Your text"`) with smart bounds in the active composition. Status updates with one-click **Undo**.
- **Precomp**: Precomposes selected layers with option to keep or move attributes.
- **Precomp each**: Precomposes each selected layer individually into separate compositions.
- **Decomp**: Un-precomposes / extracts layers from the selected precomp back into the main timeline while preserving timing and transforms.
- **Copy fx**: Inspects and copies all applied effects from the active layer.
- **Paste fx**: Pastes copied effects across all selected target layers.
- **Duplicate**: Duplicates selected layers cleanly.
- **Null**: Instantly generates a Null Object layer centered in the comp.
- **Solid**: Adds a solid layer matching the comp dimensions with a purple tint.
- **Adjust**: Inserts an Adjustment Layer on top of selected layers or timeline.

### 2. 📈 Curves View (Bezier Easing Editor)
- **Interactive Graph**: Real-time draggable handles P1 and P2 with visual tangent lines and high-DPI rendering.
- **Mode Toggle**: Instant switching between **Value** and **Speed** curve easing modes.
- **Coordinates Readout**: Live coordinate display (e.g. `0.7, 0, 0.84, 0`).
- **Graph Controls**: Flip Horizontally/Vertically (`⇄`), Reset 100% Zoom, and Invert curve.
- **`/ Apply` Button**: Translates cubic Bezier coordinates into Adobe After Effects `KeyframeEase(speed, influence)` and applies them to all selected keyframes.
- **`Read keys` Button**: Analyzes the ease of keyframes currently selected in AE and automatically draws the matching curve in the panel.
- **`+` Button**: Allows saving custom Bezier curves as presets.
- **Preset Library Grid**: Linear, Easy Ease, Smooth, Silk, Expo Out, Expo In, Punch, Snap Out, Glide, Pop, Bounce (with SVG thumbnails and delete options).

### 3. ✨ AI Tab
- **Captions**: Generates animated subtitle cards with karaoke-style bounce and outline styles.
- **Beat**: Detects musical tempo and places beat markers or pulse scale keyframes across the timeline.
- **Mask**: Auto-creates feather-edge smart masks / vignettes on selected layers.
- **Voice**: Adds dialogue placeholder guides and timing markers.
- **Bounce**: Injects elastic momentum bounce expressions onto keyframed properties (Scale, Position, Rotation) with configurable frequency and damping decay.
- **Text**: Kinetic typography animator (Typewriter with blinking cursor, Stagger 3D Rise).
- **Fluid**: Adds natural fluid wave wiggle expressions and organic displacement.
- **Face**: Generates facial / point tracking guide target Nulls.
- **Relight**: Creates a cinematic 3-point lighting rig (Key Light, Rim Light, Ambient Light).

### 4. 🔖 Presets Tab
- **Empty State**: Exact layout matching Screenshot 804 with instructions on saving effects and expressions.
- **Save Preset**: Captures selected layer attributes, effects, and keyframes.
- **Folders & Organization**: Create custom folders and categorize presets.

### 5. 🔧 Utils Tab
- **Render**: Quick Add to AE Render Queue or instant one-click frame snapshot to Desktop PNG.
- **Paste Image**: Directly reads images from system clipboard and imports them as layers into the active composition.
- **Link**: Property link and layer parenting utility with master controller nulls.

### 6. Floating Action Button (+) & Status Bar
- **FAB (+)**: Quick popup menu for instant layer additions.
- **Status Bar**: Real-time indicator (`● Ready`, `● Your text added`, etc.), dynamic active comp name (`Comp 1`), sync lock, and instant **Undo** trigger.

---

## 🛠️ Version Compatibility & Architecture
- **After Effects CC 2015 – CC 2026+ (`[13.0, 99.9]`)**.
- **ES3 ExtendScript Backend**: Strict ES3 compliant code with embedded `json2.js` polyfill to prevent any syntax or `JSON is undefined` runtime errors on older AE engines.
- **CEP 6 – 12+ Runtime**: Works with modern CEP as well as legacy CEP engines.
- **Browser Mock Mode**: Allows offline UI testing in standard web browsers without errors.

---

## 📦 Installation Instructions

### Method 1: Automatic One-Click Installer (Recommended)
1. Double-click `install_extension.bat`.
2. It automatically enables Adobe CEP Debug Mode (`PlayerDebugMode`) and copies the extension files to your user CEP directory (`%APPDATA%\Adobe\CEP\extensions\Easy Toolkit`).
3. Launch Adobe After Effects.
4. Navigate to **Window > Extensions > Easy Toolkit**.

### Method 2: Manual Installation
1. Copy the entire extension folder to:
   - **Windows**: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\Easy Toolkit`
   - or `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\Easy Toolkit`
2. Enable CEP debug mode in Windows Registry:
   - Run `reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f`
   - Run `reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f`
   - Run `reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f`
3. Restart After Effects and open **Window > Extensions > Easy Toolkit**.
