/**
 * Ransom Note Pro - Extension Controller
 * Compatible with CEP 6 through 12+ and Modern Chromium
 * Author: Aftab Musrraf
 */

(function () {
    'use strict';

    // Initialize Adobe CEP Interface
    var csInterface = new CSInterface();

    // -------------------------------------------------------------
    // Application State
    // -------------------------------------------------------------
    var state = {
        text: "RANSOM",
        preset: "vintage_newspaper",
        scale: 100,
        rotation: 0,
        gridSize: 12,
        randomizeFontSize: true,
        randomizePosition: true,
        randomizeAngle: true,
        
        animInEnabled: true,
        animInType: "Paper Crumble",
        animInDuration: 0.6,
        animInScale: 110,
        animInPosX: 0,
        animInOpacity: 0,
        
        animOutEnabled: false,
        animOutType: "Paper Crumble",
        animOutDuration: 0.6,
        animOutScale: 90,
        animOutPosX: 0,
        animOutOpacity: 0,
        
        ease: "Ease-In-Out",
        direction: "Left to Right",
        
        activePalette: [
            "#FF6B6B", "#FFD166", "#A6E22E", "#06D6A0", 
            "#38BDF8", "#4EA8DE", "#7209B7", "#F72585", 
            "#C89666", "#F4F1DE", "#3D5A80"
        ],
        selectedColor: "#FF6B6B"
    };

    // Preset configurations
    var presetsData = {
        "vintage_newspaper": {
            fonts: ["'Times New Roman', Times, serif", "'Courier Prime', monospace", "'Georgia', serif", "serif"],
            palette: ["#F4F1DE", "#E2D9C8", "#D3C2A9", "#BCA88E", "#3A3833", "#F9F6EE"],
            rotation: 5,
            gridSize: 10,
            animIn: "Paper Crumble"
        },
        "magazine_glossy": {
            fonts: ["Impact, sans-serif", "'Outfit', sans-serif", "'Arial Black', sans-serif", "sans-serif"],
            palette: ["#FF3366", "#33CC99", "#FFCC00", "#38BDF8", "#1E293B", "#F8FAFC"],
            rotation: 10,
            gridSize: 14,
            animIn: "Stop-Motion Pop"
        },
        "grunge_craft": {
            fonts: ["'Courier Prime', monospace", "'Special Elite', monospace", "Impact, sans-serif"],
            palette: ["#C89666", "#A47551", "#523A28", "#E6CCB2", "#7F5539", "#463123"],
            rotation: 8,
            gridSize: 12,
            animIn: "Paper Crumble"
        },
        "torn_cardboard": {
            fonts: ["Impact, sans-serif", "'Arial Black', sans-serif", "'Trebuchet MS', sans-serif"],
            palette: ["#D4A373", "#CCD5AE", "#E9EDC9", "#FAEDCD", "#8C6239", "#582F0E"],
            rotation: 12,
            gridSize: 16,
            animIn: "Cutout Drop"
        },
        "stencil_spray": {
            fonts: ["Impact, sans-serif", "'Arial Black', sans-serif", "'Outfit', sans-serif"],
            palette: ["#18181B", "#38BDF8", "#F43F5E", "#FBBF24", "#F4F4F5"],
            rotation: 6,
            gridSize: 12,
            animIn: "Stamp Down"
        },
        "pop_art_retro": {
            fonts: ["Impact, sans-serif", "'Comic Sans MS', cursive", "'Arial Black', sans-serif"],
            palette: ["#FFE600", "#FF0055", "#00F0FF", "#111827", "#FFFFFF"],
            rotation: 15,
            gridSize: 16,
            animIn: "Stop-Motion Pop"
        },
        "typewriter_classic": {
            fonts: ["'Courier Prime', monospace", "'Special Elite', monospace", "'Courier New', monospace"],
            palette: ["#F7F5EE", "#ECE8DE", "#262626", "#DDD8CE", "#403D39"],
            rotation: 4,
            gridSize: 8,
            animIn: "Typewriter Strike"
        },
        "random_ransom": {
            fonts: ["Impact, sans-serif", "'Times New Roman', serif", "'Courier Prime', monospace", "'Outfit', sans-serif", "'Special Elite', monospace"],
            palette: ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#C89666", "#F4F1DE", "#7209B7", "#F72585"],
            rotation: 14,
            gridSize: 15,
            animIn: "Paper Crumble"
        }
    };

    // Predefined vibrant palette themes for Randomize button
    var curatedThemes = [
        ["#FF6B6B", "#FFD166", "#A6E22E", "#06D6A0", "#38BDF8", "#4EA8DE", "#7209B7", "#F72585", "#C89666", "#F4F1DE", "#3D5A80"],
        ["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F", "#90BE6D", "#43AA8B", "#4D908E", "#577590", "#277DA1", "#F4F1DE"],
        ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E", "#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557", "#FFE66D"],
        ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429", "#FFB703", "#FB8500", "#023047", "#219EBC", "#8ECAE6", "#70E000"],
        ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#E7C6FF", "#C8B6FF", "#B8C0FF", "#BBD0FF", "#FFC6FF", "#FFFFFC"]
    ];

    // -------------------------------------------------------------
    // DOM Element References
    // -------------------------------------------------------------
    var els = {
        previewStage: document.getElementById("previewStage"),
        noteTextInput: document.getElementById("noteTextInput"),
        btnRandomizePreview: document.getElementById("btnRandomizePreview"),
        
        swatchesContainer: document.getElementById("swatchesContainer"),
        btnRandomizePalette: document.getElementById("btnRandomizePalette"),
        spectrumBar: document.getElementById("spectrumBar"),
        spectrumHandle: document.getElementById("spectrumHandle"),
        nativeColorPicker: document.getElementById("nativeColorPicker"),
        customColorDot: document.getElementById("customColorDot"),
        customColorHex: document.getElementById("customColorHex"),
        eyedropperBtn: document.getElementById("eyedropperBtn"),
        
        presetsGrid: document.getElementById("presetsGrid"),
        
        scaleSlider: document.getElementById("scaleSlider"),
        scaleValBox: document.getElementById("scaleValBox"),
        scaleTicks: document.querySelectorAll("#scaleTicks .tick"),
        
        rotationSlider: document.getElementById("rotationSlider"),
        rotationValBox: document.getElementById("rotationValBox"),
        rotationTicks: document.querySelectorAll("#rotationTicks .tick"),
        
        gridSizeSlider: document.getElementById("gridSizeSlider"),
        gridSizeValBox: document.getElementById("gridSizeValBox"),
        gridSizeTicks: document.querySelectorAll("#gridSizeTicks .tick"),
        
        toggleRandFontSize: document.getElementById("toggleRandFontSize"),
        toggleRandPos: document.getElementById("toggleRandPos"),
        toggleRandAngle: document.getElementById("toggleRandAngle"),
        
        checkAnimIn: document.getElementById("checkAnimIn"),
        selectAnimIn: document.getElementById("selectAnimIn"),
        animInDurationSlider: document.getElementById("animInDurationSlider"),
        animInDurationVal: document.getElementById("animInDurationVal"),
        animInScaleSlider: document.getElementById("animInScaleSlider"),
        animInScaleVal: document.getElementById("animInScaleVal"),
        animInPosSlider: document.getElementById("animInPosSlider"),
        animInPosVal: document.getElementById("animInPosVal"),
        animInOpacitySlider: document.getElementById("animInOpacitySlider"),
        animInOpacityVal: document.getElementById("animInOpacityVal"),
        
        checkAnimOut: document.getElementById("checkAnimOut"),
        selectAnimOut: document.getElementById("selectAnimOut"),
        animOutDurationSlider: document.getElementById("animOutDurationSlider"),
        animOutDurationVal: document.getElementById("animOutDurationVal"),
        animOutScaleSlider: document.getElementById("animOutScaleSlider"),
        animOutScaleVal: document.getElementById("animOutScaleVal"),
        animOutPosSlider: document.getElementById("animOutPosSlider"),
        animOutPosVal: document.getElementById("animOutPosVal"),
        animOutOpacitySlider: document.getElementById("animOutOpacitySlider"),
        animOutOpacityVal: document.getElementById("animOutOpacityVal"),
        
        selectEase: document.getElementById("selectEase"),
        selectDirection: document.getElementById("selectDirection"),
        
        btnGenerate: document.getElementById("btnGenerate"),
        btnConvertSelected: document.getElementById("btnConvertSelected"),
        statusToast: document.getElementById("statusToast"),
        toastIcon: document.getElementById("toastIcon"),
        toastMessage: document.getElementById("toastMessage")
    };

    // -------------------------------------------------------------
    // Live Preview Engine
    // -------------------------------------------------------------
    function updatePreview() {
        if (!els.previewStage) return;
        els.previewStage.innerHTML = "";

        var text = (state.text || "").trim();
        if (!text) {
            text = "RANSOM";
        }

        var presetConfig = presetsData[state.preset] || presetsData["random_ransom"];
        var availableFonts = presetConfig.fonts;
        var palette = state.activePalette;

        // Overall scale factor
        var scaleRatio = state.scale / 100;
        els.previewStage.style.transform = "scale(" + (0.95 * scaleRatio) + ")";

        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);

            if (char === " ") {
                var spaceElem = document.createElement("div");
                spaceElem.style.width = (20 * scaleRatio) + "px";
                spaceElem.style.display = "inline-block";
                els.previewStage.appendChild(spaceElem);
                continue;
            }

            var tile = document.createElement("div");
            tile.className = "cutout-preview-tile";

            // Random paper color from palette
            var paperColor = palette[Math.floor(Math.random() * palette.length)];
            tile.style.backgroundColor = paperColor;

            // Compute font size
            var fontSize = 32;
            if (state.randomizeFontSize) {
                fontSize = Math.round(fontSize * (0.8 + Math.random() * 0.45));
            }

            // Compute rotation
            var angle = 0;
            if (state.randomizeAngle || state.rotation > 0) {
                var maxRot = state.rotation > 0 ? state.rotation : 12;
                angle = (Math.random() * 2 - 1) * maxRot;
            }
            tile.style.transform = "rotate(" + angle.toFixed(1) + "deg)";

            // Compute position jitter
            var offsetMargin = 0;
            if (state.randomizePosition) {
                var jitterX = (Math.random() * 2 - 1) * (state.gridSize * 0.4);
                var jitterY = (Math.random() * 2 - 1) * (state.gridSize * 0.6);
                tile.style.marginLeft = jitterX.toFixed(0) + "px";
                tile.style.marginTop = jitterY.toFixed(0) + "px";
            }

            // Font selection
            var font = availableFonts[Math.floor(Math.random() * availableFonts.length)];

            // Contrasting ink color
            var textColor = getContrastingTextColor(paperColor);

            var charSpan = document.createElement("span");
            charSpan.className = "cutout-preview-char";
            charSpan.textContent = char;
            charSpan.style.fontFamily = font;
            charSpan.style.fontSize = fontSize + "px";
            charSpan.style.color = textColor;

            // Special preset accents
            if (state.preset === "pop_art_retro") {
                charSpan.style.textShadow = "2px 2px 0px #000000";
                tile.style.border = "2px solid #000000";
            } else if (state.preset === "stencil_spray") {
                tile.style.border = "1px dashed rgba(255,255,255,0.3)";
            } else if (state.preset === "torn_cardboard") {
                tile.style.borderRadius = "8px";
            }

            tile.appendChild(charSpan);
            els.previewStage.appendChild(tile);
        }
    }

    function getContrastingTextColor(hex) {
        if (!hex) return "#111111";
        var clean = hex.replace("#", "");
        if (clean.length === 3) {
            clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
        }
        var r = parseInt(clean.substring(0, 2), 16);
        var g = parseInt(clean.substring(2, 4), 16);
        var b = parseInt(clean.substring(4, 6), 16);
        var lum = 0.299 * r + 0.587 * g + 0.114 * b;
        return lum > 140 ? "#111827" : "#FFFFFF";
    }

    // -------------------------------------------------------------
    // Color Palette Controls
    // -------------------------------------------------------------
    function renderPaletteSwatches() {
        if (!els.swatchesContainer) return;
        els.swatchesContainer.innerHTML = "";

        state.activePalette.forEach(function (colorHex) {
            var dot = document.createElement("div");
            dot.className = "color-swatch-dot";
            dot.style.backgroundColor = colorHex;
            dot.setAttribute("data-color", colorHex);
            dot.title = colorHex;

            if (colorHex.toUpperCase() === state.selectedColor.toUpperCase()) {
                dot.classList.add("active");
            }

            dot.addEventListener("click", function () {
                setSelectedColor(colorHex);
            });

            els.swatchesContainer.appendChild(dot);
        });
    }

    function setSelectedColor(hex) {
        state.selectedColor = hex;
        if (els.customColorDot) els.customColorDot.style.backgroundColor = hex;
        if (els.customColorHex) els.customColorHex.value = hex.toUpperCase();
        if (els.nativeColorPicker) els.nativeColorPicker.value = hex;

        document.querySelectorAll(".color-swatch-dot").forEach(function (dot) {
            if (dot.getAttribute("data-color").toUpperCase() === hex.toUpperCase()) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        // Add to active palette if not present
        if (state.activePalette.indexOf(hex) === -1) {
            state.activePalette.unshift(hex);
            if (state.activePalette.length > 12) state.activePalette.pop();
            renderPaletteSwatches();
        }

        updatePreview();
    }

    // Rainbow spectrum slider
    function setupSpectrumPicker() {
        if (!els.spectrumBar) return;

        function updateSpectrumFromEvent(e) {
            var rect = els.spectrumBar.getBoundingClientRect();
            var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            var ratio = x / rect.width;
            
            if (els.spectrumHandle) {
                els.spectrumHandle.style.left = (ratio * 100) + "%";
            }

            var hue = Math.round(ratio * 360);
            var rgb = hslToRgb(hue / 360, 0.9, 0.55);
            var hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
            setSelectedColor(hex);
        }

        var isDragging = false;
        els.spectrumBar.addEventListener("mousedown", function (e) {
            isDragging = true;
            updateSpectrumFromEvent(e);
        });

        window.addEventListener("mousemove", function (e) {
            if (isDragging) {
                updateSpectrumFromEvent(e);
            }
        });

        window.addEventListener("mouseup", function () {
            isDragging = false;
        });
    }

    function hslToRgb(h, s, l) {
        var r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // -------------------------------------------------------------
    // Presets Interaction
    // -------------------------------------------------------------
    function setupPresets() {
        var presetCards = document.querySelectorAll(".preset-card");
        presetCards.forEach(function (card) {
            card.addEventListener("click", function () {
                var presetId = card.getAttribute("data-preset");
                applyPreset(presetId);
            });
        });
    }

    function applyPreset(presetId) {
        state.preset = presetId;

        document.querySelectorAll(".preset-card").forEach(function (c) {
            if (c.getAttribute("data-preset") === presetId) {
                c.classList.add("active");
            } else {
                c.classList.remove("active");
            }
        });

        var preset = presetsData[presetId];
        if (preset) {
            state.activePalette = [].concat(preset.palette);
            state.rotation = preset.rotation;
            state.gridSize = preset.gridSize;
            if (preset.animIn && els.selectAnimIn) {
                els.selectAnimIn.value = preset.animIn;
                state.animInType = preset.animIn;
            }

            // Sync slider UI
            if (els.rotationSlider) {
                els.rotationSlider.value = state.rotation;
                if (els.rotationValBox) els.rotationValBox.textContent = state.rotation + "°";
            }
            if (els.gridSizeSlider) {
                els.gridSizeSlider.value = state.gridSize;
                if (els.gridSizeValBox) els.gridSizeValBox.textContent = state.gridSize;
            }

            renderPaletteSwatches();
            setSelectedColor(state.activePalette[0]);
        }

        updatePreview();
        showToast("Applied Preset: " + presetId.replace(/_/g, " "), "🎨");
    }

    // -------------------------------------------------------------
    // Slider & Toggle Event Binding
    // -------------------------------------------------------------
    function setupSliders() {
        // Scale
        if (els.scaleSlider) {
            els.scaleSlider.addEventListener("input", function () {
                state.scale = Number(this.value);
                if (els.scaleValBox) els.scaleValBox.textContent = state.scale + "%";
                syncTick(els.scaleTicks, state.scale);
                updatePreview();
            });
        }
        setupTicks(els.scaleTicks, function (val) {
            if (els.scaleSlider) {
                els.scaleSlider.value = val;
                els.scaleSlider.dispatchEvent(new Event("input"));
            }
        });

        // Rotation
        if (els.rotationSlider) {
            els.rotationSlider.addEventListener("input", function () {
                state.rotation = Number(this.value);
                if (els.rotationValBox) els.rotationValBox.textContent = state.rotation + "°";
                syncTick(els.rotationTicks, state.rotation);
                updatePreview();
            });
        }
        setupTicks(els.rotationTicks, function (val) {
            if (els.rotationSlider) {
                els.rotationSlider.value = val;
                els.rotationSlider.dispatchEvent(new Event("input"));
            }
        });

        // Grid Size
        if (els.gridSizeSlider) {
            els.gridSizeSlider.addEventListener("input", function () {
                state.gridSize = Number(this.value);
                if (els.gridSizeValBox) els.gridSizeValBox.textContent = state.gridSize;
                syncTick(els.gridSizeTicks, state.gridSize);
                updatePreview();
            });
        }
        setupTicks(els.gridSizeTicks, function (val) {
            if (els.gridSizeSlider) {
                els.gridSizeSlider.value = val;
                els.gridSizeSlider.dispatchEvent(new Event("input"));
            }
        });

        // Pattern Randomization Toggles
        if (els.toggleRandFontSize) {
            els.toggleRandFontSize.addEventListener("change", function () {
                state.randomizeFontSize = this.checked;
                updatePreview();
            });
        }
        if (els.toggleRandPos) {
            els.toggleRandPos.addEventListener("change", function () {
                state.randomizePosition = this.checked;
                updatePreview();
            });
        }
        if (els.toggleRandAngle) {
            els.toggleRandAngle.addEventListener("change", function () {
                state.randomizeAngle = this.checked;
                updatePreview();
            });
        }

        // Animation In Controls
        if (els.checkAnimIn) {
            els.checkAnimIn.addEventListener("change", function () {
                state.animInEnabled = this.checked;
            });
        }
        if (els.selectAnimIn) {
            els.selectAnimIn.addEventListener("change", function () {
                state.animInType = this.value;
            });
        }
        if (els.animInDurationSlider) {
            els.animInDurationSlider.addEventListener("input", function () {
                state.animInDuration = Number(this.value);
                if (els.animInDurationVal) els.animInDurationVal.textContent = state.animInDuration.toFixed(1) + "s";
            });
        }
        if (els.animInScaleSlider) {
            els.animInScaleSlider.addEventListener("input", function () {
                state.animInScale = Number(this.value);
                if (els.animInScaleVal) els.animInScaleVal.textContent = state.animInScale + "%";
            });
        }
        if (els.animInPosSlider) {
            els.animInPosSlider.addEventListener("input", function () {
                state.animInPosX = Number(this.value);
                if (els.animInPosVal) els.animInPosVal.textContent = state.animInPosX;
            });
        }
        if (els.animInOpacitySlider) {
            els.animInOpacitySlider.addEventListener("input", function () {
                state.animInOpacity = Number(this.value);
                if (els.animInOpacityVal) els.animInOpacityVal.textContent = state.animInOpacity + "%";
            });
        }

        // Animation Out Controls
        if (els.checkAnimOut) {
            els.checkAnimOut.addEventListener("change", function () {
                state.animOutEnabled = this.checked;
            });
        }
        if (els.selectAnimOut) {
            els.selectAnimOut.addEventListener("change", function () {
                state.animOutType = this.value;
            });
        }
        if (els.animOutDurationSlider) {
            els.animOutDurationSlider.addEventListener("input", function () {
                state.animOutDuration = Number(this.value);
                if (els.animOutDurationVal) els.animOutDurationVal.textContent = state.animOutDuration.toFixed(1) + "s";
            });
        }
        if (els.animOutScaleSlider) {
            els.animOutScaleSlider.addEventListener("input", function () {
                state.animOutScale = Number(this.value);
                if (els.animOutScaleVal) els.animOutScaleVal.textContent = state.animOutScale + "%";
            });
        }
        if (els.animOutPosSlider) {
            els.animOutPosSlider.addEventListener("input", function () {
                state.animOutPosX = Number(this.value);
                if (els.animOutPosVal) els.animOutPosVal.textContent = state.animOutPosVal ? this.value : "0";
            });
        }
        if (els.animOutOpacitySlider) {
            els.animOutOpacitySlider.addEventListener("input", function () {
                state.animOutOpacity = Number(this.value);
                if (els.animOutOpacityVal) els.animOutOpacityVal.textContent = state.animOutOpacity + "%";
            });
        }

        // Additional Options
        if (els.selectEase) {
            els.selectEase.addEventListener("change", function () {
                state.ease = this.value;
            });
        }
        if (els.selectDirection) {
            els.selectDirection.addEventListener("change", function () {
                state.direction = this.value;
            });
        }

        // Text input & preview dice
        if (els.noteTextInput) {
            els.noteTextInput.addEventListener("input", function () {
                state.text = this.value;
                updatePreview();
            });
        }
        if (els.btnRandomizePreview) {
            els.btnRandomizePreview.addEventListener("click", function () {
                updatePreview();
            });
        }

        // Palette Randomize
        if (els.btnRandomizePalette) {
            els.btnRandomizePalette.addEventListener("click", function () {
                var theme = curatedThemes[Math.floor(Math.random() * curatedThemes.length)];
                state.activePalette = [].concat(theme);
                renderPaletteSwatches();
                setSelectedColor(theme[0]);
                updatePreview();
                showToast("Palette randomized!", "🎨");
            });
        }

        // Native color picker & hex input
        if (els.nativeColorPicker) {
            els.nativeColorPicker.addEventListener("input", function () {
                setSelectedColor(this.value);
            });
        }
        if (els.customColorHex) {
            els.customColorHex.addEventListener("change", function () {
                var val = this.value.trim();
                if (!val.startsWith("#")) val = "#" + val;
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setSelectedColor(val);
                }
            });
        }

        // Eyedropper API (Chromium / AE modern CEP)
        if (els.eyedropperBtn) {
            els.eyedropperBtn.addEventListener("click", function () {
                if (window.EyeDropper) {
                    var eyeDropper = new EyeDropper();
                    eyeDropper.open().then(function (result) {
                        if (result && result.sRGBHex) {
                            setSelectedColor(result.sRGBHex);
                        }
                    }).catch(function () {});
                } else if (els.nativeColorPicker) {
                    els.nativeColorPicker.click();
                }
            });
        }
    }

    function setupTicks(ticksNodeList, onClickVal) {
        ticksNodeList.forEach(function (tick) {
            tick.addEventListener("click", function () {
                var val = Number(tick.getAttribute("data-val"));
                onClickVal(val);
            });
        });
    }

    function syncTick(ticksNodeList, currentVal) {
        ticksNodeList.forEach(function (tick) {
            var val = Number(tick.getAttribute("data-val"));
            if (val === currentVal) {
                tick.classList.add("active");
            } else {
                tick.classList.remove("active");
            }
        });
    }

    // -------------------------------------------------------------
    // After Effects ExtendScript Execution
    // -------------------------------------------------------------
    function setupActions() {
        // Generate in AE
        if (els.btnGenerate) {
            els.btnGenerate.addEventListener("click", function () {
                executeGenerate();
            });
        }

        // Convert Selected Text Layer
        if (els.btnConvertSelected) {
            els.btnConvertSelected.addEventListener("click", function () {
                executeConvertSelected();
            });
        }
    }

    function buildOptionsPayload() {
        return {
            text: state.text || "RANSOM",
            preset: state.preset,
            scale: state.scale,
            rotation: state.rotation,
            gridSize: state.gridSize,
            randomizeFontSize: state.randomizeFontSize,
            randomizePosition: state.randomizePosition,
            randomizeAngle: state.randomizeAngle,
            
            animInEnabled: state.animInEnabled,
            animInType: state.animInType,
            animInDuration: state.animInDuration,
            animInScale: state.animInScale,
            animInPosX: state.animInPosX,
            animInOpacity: state.animInOpacity,
            
            animOutEnabled: state.animOutEnabled,
            animOutType: state.animOutType,
            animOutDuration: state.animOutDuration,
            animOutScale: state.animOutScale,
            animOutPosX: state.animOutPosX,
            animOutOpacity: state.animOutOpacity,
            
            ease: state.ease,
            direction: state.direction,
            palette: state.activePalette
        };
    }

    function executeGenerate() {
        var payload = buildOptionsPayload();
        var jsonStr = JSON.stringify(payload);
        var escapedJson = JSON.stringify(jsonStr);

        showToast("Creating Ransom Note in After Effects...", "⚡");

        csInterface.evalScript('runRansomNotePro("generate", ' + escapedJson + ')', function (res) {
            handleExtendScriptResult(res);
        });
    }

    function executeConvertSelected() {
        var payload = buildOptionsPayload();
        var jsonStr = JSON.stringify(payload);
        var escapedJson = JSON.stringify(jsonStr);

        showToast("Converting Selected Layer...", "📝");

        csInterface.evalScript('runRansomNotePro("convertSelected", ' + escapedJson + ')', function (res) {
            handleExtendScriptResult(res);
        });
    }

    function handleExtendScriptResult(res) {
        try {
            var data = (typeof res === "string") ? JSON.parse(res) : res;
            if (!data) {
                showToast("Action completed.", "✨");
                return;
            }

            if (data.status === "success") {
                showToast(data.message || "Ransom Note created successfully!", "🎉");
            } else if (data.status === "error") {
                showToast(data.message || "Error generating layers.", "⚠️", true);
            } else {
                showToast(data.message || "Execution completed.", "✨");
            }
        } catch (e) {
            showToast("Result: " + res, "✨");
        }
    }

    // Toast Notification helper
    var toastTimeout = null;
    function showToast(message, icon, isError) {
        if (!els.statusToast) return;
        if (toastTimeout) clearTimeout(toastTimeout);

        if (els.toastIcon) els.toastIcon.textContent = icon || "✨";
        if (els.toastMessage) els.toastMessage.textContent = message;

        if (isError) {
            els.statusToast.classList.add("error");
        } else {
            els.statusToast.classList.remove("error");
        }

        els.statusToast.classList.remove("hidden");

        toastTimeout = setTimeout(function () {
            els.statusToast.classList.add("hidden");
        }, 3500);
    }

    // -------------------------------------------------------------
    // Initialize Extension
    // -------------------------------------------------------------
    function init() {
        renderPaletteSwatches();
        setupSpectrumPicker();
        setupPresets();
        setupSliders();
        setupActions();
        updatePreview();

        // Check comp status on startup
        csInterface.evalScript('runRansomNotePro("checkStatus", "")', function (res) {
            try {
                var compStatus = JSON.parse(res);
                if (compStatus && compStatus.status === "ready") {
                    showToast("Connected to Comp: " + compStatus.compName, "⚡");
                }
            } catch (e) {}
        });
    }

    // Run on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
