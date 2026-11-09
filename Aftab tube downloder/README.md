# Aftab Tube Downloder (Adobe After Effects Extension)

> **Created by Aftab Musrraf**  
> High-performance YouTube & Web Video Downloader CEP Extension for **Adobe After Effects** (Compatible with CS6 through CC 2026+).

---

## ✨ Features

- **Pixel-Perfect UI**: Built to precisely match the modern midnight navy and radiant blue gradient design.
- **Universal Compatibility**:
  - `manifest.xml` configured for `[10.0, 99.9]` covering AE CS6, CC 2014, CC 2015, CC 2017, CC 2018, CC 2019, CC 2020, 2021, 2022, 2023, 2024, 2025, 2026+.
  - ES3 Strict Mode ExtendScript host engine (`host/hostscript.jsx`) ensuring 0 runtime errors on all AE versions.
- **1-Click Download & Import**:
  - Automatically downloads MP4 (Video) or MP3 (Audio) at selected quality (`Best`, `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`).
  - Automatically imports the downloaded footage into the active After Effects project bin.
  - Automatically inserts the footage as a layer into your currently active composition.
- **Smart URL Analysis**:
  - Automatically extracts video title, author/channel, duration, and high-resolution thumbnail via YouTube oEmbed / stream resolvers.
- **Download History Drawer**:
  - Quick sidebar access to previously downloaded media with 1-click re-import to your active composition.

---

## 🚀 Installation & How to Use

### Installed & Ready:
The extension is already installed to your Adobe CEP directory:
```
%APPDATA%\Adobe\CEP\extensions\com.aftab.tubedownloader
```

### To Open in After Effects:
1. Open or restart **Adobe After Effects**.
2. In the top menu bar, click:
   **`Window` > `Extensions` > `Aftab Tube Downloder`**
3. Paste any YouTube video URL or click **Analyze URL**.
4. Choose **MP4** or **MP3**, pick your desired quality, and click **`Download & Import`**!

---

## 📁 Project Architecture

```
Aftab tube downloder/
├── CSXS/
│   └── manifest.xml        # CEP Manifest (AEFT [10.0, 99.9], Node.js enabled)
├── css/
│   └── style.css           # Premium dark theme & responsive UI styles
├── js/
│   ├── CSInterface.js      # Adobe CEP JavaScript Bridge with browser simulation
│   ├── downloader.js       # Video extraction, stream resolver & download engine
│   └── app.js              # Application logic, UI events & ExtendScript caller
├── host/
│   └── hostscript.jsx      # ES3 ExtendScript engine for footage importing into AE
├── assets/
│   ├── sample-thumb.jpg    # High-quality fallback artwork
│   ├── icon-normal.png     # Extension icon
│   └── icon-rollover.png   # Extension rollover icon
├── index.html              # Main Extension Panel HTML
├── install.bat             # 1-Click Windows batch installer
└── enable_debug_mode.reg   # Registry fix for PlayerDebugMode (CSXS 4 - 20)
```
