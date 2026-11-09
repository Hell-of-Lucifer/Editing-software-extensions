# Aftab Tube Downloder for Adobe Premiere Pro

> **Created by Aftab Musrraf**  
> High-performance YouTube & Web Media Downloader CEP Extension for **Adobe Premiere Pro** (Compatible with CS6 through CC 2026+).

---

## ✨ Features

- **Pixel-Perfect UI**: Built with a sleek midnight navy and radiant blue gradient design matching modern professional video editing suites.
- **Universal Premiere Pro Compatibility**:
  - `manifest.xml` configured for `PPRO [6.0, 99.9]` covering Premiere Pro CS6, CC 2013, CC 2014, CC 2015, CC 2017, CC 2018, CC 2019, 2020, 2021, 2022, 2023, 2024, 2025, and CC 2026+.
  - ES3 Strict Mode ExtendScript host engine (`host/hostscript.jsx`) ensuring 0 runtime errors on all Premiere Pro versions.
  - Dual host fallback: also works in Adobe After Effects seamlessly.
- **1-Click Download & Timeline Import**:
  - Automatically downloads MP4 (Video) or MP3 (Audio) at selected quality (`Best`, `1080p`, `720p`, `480p`, `360p`, `240p`, `144p`).
  - Automatically imports downloaded footage directly into the active Premiere Pro project bin.
  - Automatically inserts video clips onto Video Track 1 (with linked audio on Audio Track 1) or audio onto Audio Track 1 right at your current playhead position.
  - If no sequence is open, automatically creates a new sequence matching the clip's resolution and framerate!
- **H.264 & AAC Native Compatibility**:
  - Automatically transcodes streams into Premiere Pro native `libx264` (`yuv420p`) and `aac` audio, preventing any import errors or green screens.
- **Smart URL Analysis**:
  - Extracts title, channel/author, duration, views, and high-res thumbnail with a single click.
- **Download History Drawer**:
  - Quick sidebar access to previously downloaded media with 1-click re-import to your timeline.

---

## 🚀 Installation & How to Use

### 1-Click Install:
Double-click `install.bat` inside the project folder. It will:
1. Enable `PlayerDebugMode` across all CSXS versions (4 to 20).
2. Copy the extension files into `%APPDATA%\Adobe\CEP\extensions\com.aftab.tubedownloader`.

### To Open in Adobe Premiere Pro:
1. Open or restart **Adobe Premiere Pro** (e.g. 2023, 2025, or any other version).
2. Open any project or create a new project.
3. In the top menu bar, click:
   **`Window` > `Extensions` > `Aftab Tube Downloder`**
4. Paste any YouTube video URL or click **Analyze URL**.
5. Choose **MP4** or **MP3**, select your desired quality, and click **`Download & Import`**!

---

## 📁 Project Architecture

```
Aftab tube downloder for premiere pro/
├── CSXS/
│   └── manifest.xml        # CEP Manifest (PPRO [6.0, 99.9] + AEFT [10.0, 99.9], Node.js enabled)
├── css/
│   └── style.css           # Premium dark theme & responsive UI styles
├── js/
│   ├── CSInterface.js      # Adobe CEP JavaScript Bridge with browser simulation
│   ├── downloader.js       # Video extraction, stream resolver & H.264 yuv420p transcode engine
│   └── app.js              # Premiere Pro application logic, UI events & ExtendScript caller
├── host/
│   └── hostscript.jsx      # ES3 ExtendScript engine for Premiere Pro & AE footage importing
├── assets/
│   ├── sample-thumb.jpg    # High-quality fallback artwork
│   ├── icon-normal.png     # Extension icon
│   └── icon-rollover.png   # Extension rollover icon
├── bin/
│   ├── yt-dlp.exe          # YouTube video downloader binary
│   └── ffmpeg.exe         # Media transcoder binary
├── index.html              # Main Extension Panel HTML
├── install.bat             # 1-Click Windows batch installer
└── enable_debug_mode.reg   # Registry fix for PlayerDebugMode (CSXS 4 - 20)
```
