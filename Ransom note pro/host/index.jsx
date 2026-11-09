/**
 * Ransom Note Pro - ExtendScript Host Engine
 * Compatible with Adobe After Effects CC 2014 (13.0) through CC 2026+ (ES3 Strict)
 * Author: Aftab Musrraf
 */

#target aftereffects

// -------------------------------------------------------------
// Safe JSON Polyfill for ExtendScript ES3 (Handles CC 2014 - CC 2026)
// -------------------------------------------------------------
if (typeof JSON === "undefined") {
    JSON = {};
}

if (typeof JSON.stringify !== "function") {
    JSON.stringify = function(obj) {
        var t = typeof obj;
        if (t !== "object" || obj === null) {
            if (t === "string") return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
            return String(obj);
        }
        var json = [];
        var isArr = (obj && obj.constructor === Array);
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                var v = obj[k];
                var vt = typeof v;
                if (vt === "string") {
                    v = '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
                } else if (vt === "object" && v !== null) {
                    v = JSON.stringify(v);
                }
                json.push((isArr ? "" : '"' + k + '":') + String(v));
            }
        }
        return (isArr ? "[" : "{") + String(json) + (isArr ? "]" : "}");
    };
}

if (typeof JSON.parse !== "function") {
    JSON.parse = function(str) {
        if (!str) return null;
        try {
            return eval("(" + str + ")");
        } catch (e) {
            return null;
        }
    };
}

// -------------------------------------------------------------
// Ransom Note Engine Object
// -------------------------------------------------------------
var RansomNotePro = {
    version: "1.0.0",
    author: "Aftab Musrraf",

    /**
     * Checks if project and composition are ready
     */
    getCompStatus: function() {
        if (!app.project) {
            return JSON.stringify({ status: "error", message: "No active project found. Please open or create a project." });
        }
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            return JSON.stringify({ 
                status: "no_comp", 
                message: "No active composition selected. You can click 'Generate' to create a new one automatically." 
            });
        }
        return JSON.stringify({
            status: "ready",
            compName: comp.name,
            width: comp.width,
            height: comp.height,
            duration: comp.duration,
            fps: comp.frameRate
        });
    },

    /**
     * Helper to convert Hex string to ExtendScript RGB [0..1, 0..1, 0..1]
     */
    hexToRgb: function(hex) {
        if (!hex) return [0.9, 0.88, 0.82];
        var clean = hex.replace("#", "");
        if (clean.length === 3) {
            clean = clean.charAt(0) + clean.charAt(0) + clean.charAt(1) + clean.charAt(1) + clean.charAt(2) + clean.charAt(2);
        }
        var r = parseInt(clean.substring(0, 2), 16) / 255;
        var g = parseInt(clean.substring(2, 4), 16) / 255;
        var b = parseInt(clean.substring(4, 6), 16) / 255;
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return [0.92, 0.90, 0.85];
        }
        return [r, g, b];
    },

    /**
     * Choose contrasting text color based on paper background luminance
     */
    getContrastColor: function(rgb) {
        var lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        if (lum > 0.55) {
            return [0.1, 0.1, 0.12]; // Dark ink
        } else {
            return [0.98, 0.98, 0.98]; // Crisp white
        }
    },

    /**
     * Safe font list per preset with universal fallback fonts
     */
    getPresetFonts: function(presetName) {
        var fontMap = {
            "vintage_newspaper": ["TimesNewRomanPS-BoldMT", "Georgia-Bold", "CourierNewPS-BoldMT", "Baskerville", "PalatinoLinotype-Bold", "Arial-BoldMT"],
            "magazine_glossy": ["Impact", "Arial-Black", "Helvetica-Bold", "TrebuchetMS-Bold", "Futura-Bold", "Arial-BoldMT"],
            "grunge_craft": ["CourierNewPS-BoldMT", "Impact", "Georgia-Bold", "Rockwell-Bold", "Arial-BoldMT"],
            "torn_cardboard": ["Impact", "Arial-Black", "Stencil", "Copperplate-Bold", "Arial-BoldMT"],
            "stencil_spray": ["Stencil", "Impact", "Arial-Black", "TrebuchetMS-Bold"],
            "pop_art_retro": ["ComicSansMS-Bold", "Impact", "Arial-Black", "CooperBlack", "Arial-BoldMT"],
            "typewriter_classic": ["CourierNewPSMT", "Courier", "Consolas", "AmericanTypewriter", "CourierNewPS-BoldMT"],
            "random_ransom": ["Impact", "TimesNewRomanPS-BoldMT", "Arial-Black", "CourierNewPS-BoldMT", "Georgia-Bold", "ComicSansMS-Bold", "TrebuchetMS-Bold"]
        };
        return fontMap[presetName] || fontMap["random_ransom"];
    },

    /**
     * Main Ransom Note Generator
     */
    generate: function(optionsJson) {
        try {
            var options = JSON.parse(optionsJson);
            if (!options) {
                options = {};
            }

            // Defaults
            var text = options.text || "RANSOM";
            var preset = options.preset || "vintage_newspaper";
            var scaleVal = (options.scale !== undefined ? Number(options.scale) : 100) / 100;
            var maxRotation = options.rotation !== undefined ? Number(options.rotation) : 0;
            var gridSize = options.gridSize !== undefined ? Number(options.gridSize) : 12;
            var randFontSize = options.randomizeFontSize !== undefined ? options.randomizeFontSize : true;
            var randPos = options.randomizePosition !== undefined ? options.randomizePosition : true;
            var randAngle = options.randomizeAngle !== undefined ? options.randomizeAngle : true;

            // Animation options
            var animInEnabled = options.animInEnabled !== undefined ? options.animInEnabled : true;
            var animInType = options.animInType || "Paper Crumble";
            var animInDuration = options.animInDuration !== undefined ? Number(options.animInDuration) : 0.6;
            var animInScale = (options.animInScale !== undefined ? Number(options.animInScale) : 110) / 100;
            var animInPosX = options.animInPosX !== undefined ? Number(options.animInPosX) : 0;
            var animInOpacity = options.animInOpacity !== undefined ? Number(options.animInOpacity) : 0;

            var animOutEnabled = options.animOutEnabled !== undefined ? options.animOutEnabled : false;
            var animOutType = options.animOutType || "Paper Crumble";
            var animOutDuration = options.animOutDuration !== undefined ? Number(options.animOutDuration) : 0.6;
            var animOutScale = (options.animOutScale !== undefined ? Number(options.animOutScale) : 90) / 100;
            var animOutPosX = options.animOutPosX !== undefined ? Number(options.animOutPosX) : 0;
            var animOutOpacity = options.animOutOpacity !== undefined ? Number(options.animOutOpacity) : 0;

            var easeType = options.ease || "Ease-In-Out";
            var direction = options.direction || "Left to Right";
            var paletteColors = options.palette || ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#C89666", "#F4F1DE"];

            if (!app.project) {
                app.newProject();
            }

            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                // Auto-create a standard 1920x1080 composition
                comp = app.project.items.addComp("Ransom Note Pro Comp", 1920, 1080, 1, 10, 30);
                comp.openInViewer();
            }

            app.beginUndoGroup("Create Ransom Note Pro");

            var chars = text.split("");
            var totalChars = chars.length;
            if (totalChars === 0) {
                app.endUndoGroup();
                return JSON.stringify({ status: "error", message: "Text cannot be empty." });
            }

            // Create Master Controller Null Layer
            var controller = comp.layers.addNull();
            controller.name = "Ransom Note - '" + (text.length > 15 ? text.substring(0, 15) + "..." : text) + "' [Controller]";
            controller.label = 11; // Orange in AE
            controller.property("Position").setValue([comp.width / 2, comp.height / 2]);

            // Add Slider Controls for quick customization inside AE
            try {
                var sliderScale = controller.property("Effects").addProperty("ADBE Slider Control");
                sliderScale.name = "Master Scale";
                sliderScale.property("Slider").setValue(100);

                var sliderJitter = controller.property("Effects").addProperty("ADBE Slider Control");
                sliderJitter.name = "Jitter Amount";
                sliderJitter.property("Slider").setValue(gridSize);
            } catch (eSlider) {}

            var presetFonts = RansomNotePro.getPresetFonts(preset);
            var charWidth = 110 * scaleVal;
            var charHeight = 140 * scaleVal;
            var spacing = 18 * scaleVal;
            var totalWidth = (totalChars * charWidth) + ((totalChars - 1) * spacing);
            var startX = -(totalWidth / 2) + (charWidth / 2);

            var createdTiles = [];
            var currentTime = comp.time;

            for (var i = 0; i < totalChars; i++) {
                var ch = chars[i];
                if (ch === " ") {
                    // Space character, skip creating layer but keep horizontal offset
                    continue;
                }

                // Pick random font and color
                var fontChoice = presetFonts[Math.floor(Math.random() * presetFonts.length)];
                var hexColor = paletteColors[Math.floor(Math.random() * paletteColors.length)];
                var paperRgb = RansomNotePro.hexToRgb(hexColor);
                var textRgb = RansomNotePro.getContrastColor(paperRgb);

                // Base dimensions for this character tile
                var tileW = (charWidth * (0.85 + Math.random() * 0.3));
                var tileH = (charHeight * (0.90 + Math.random() * 0.25));

                // Tile center position
                var posX = startX + (i * (charWidth + spacing));
                var posY = 0;

                // Pattern Randomization offsets
                if (randPos) {
                    var jitX = (Math.random() * 2 - 1) * (gridSize * 1.5);
                    var jitY = (Math.random() * 2 - 1) * (gridSize * 2.2);
                    posX += jitX;
                    posY += jitY;
                }

                var tileAngle = 0;
                if (randAngle || maxRotation > 0) {
                    var baseRot = maxRotation > 0 ? maxRotation : 10;
                    tileAngle = (Math.random() * 2 - 1) * baseRot;
                }

                // 1. Create Paper Background Tile (Shape Layer)
                var paperLayer = comp.layers.addShape();
                paperLayer.name = "Tile [" + (i + 1) + "] " + ch;
                paperLayer.label = 9; // Green label
                paperLayer.parent = controller;

                // Add Rectangle Shape & Fill
                var contents = paperLayer.property("Contents");
                var shapeGroup = contents.addProperty("ADBE Vector Group");
                shapeGroup.name = "Paper Card";

                var rectShape = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rectShape.property("Size").setValue([tileW, tileH]);
                rectShape.property("Roundness").setValue(preset === "torn_cardboard" ? 12 : 6);

                var fillProp = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fillProp.property("Color").setValue(paperRgb);

                // Authentic Torn Paper edge effect (Roughen Edges)
                try {
                    var roughen = paperLayer.property("Effects").addProperty("ADBE Roughen Edges");
                    if (roughen) {
                        roughen.property("Border").setValue(preset === "grunge_craft" || preset === "torn_cardboard" ? 6 : 3.5);
                        roughen.property("Edge Sharpness").setValue(2.0);
                        roughen.property("Scale").setValue(35);
                    }
                } catch (eRoughen) {}

                // Realistic 3D Depth (Drop Shadow)
                try {
                    var dropShadow = paperLayer.property("Effects").addProperty("ADBE Drop Shadow");
                    if (dropShadow) {
                        dropShadow.property("Distance").setValue(8);
                        dropShadow.property("Softness").setValue(14);
                        dropShadow.property("Shadow Color").setValue([0, 0, 0]);
                        dropShadow.property("Opacity").setValue(110); // 43%
                    }
                } catch (eShadow) {}

                // Position and Rotation of Paper Layer
                paperLayer.property("Position").setValue([posX, posY]);
                paperLayer.property("Rotation").setValue(tileAngle);

                // 2. Create Text Character Layer
                var textLayer = comp.layers.addText(ch);
                textLayer.name = "Letter [" + (i + 1) + "] " + ch;
                textLayer.label = 13; // Yellow label
                textLayer.parent = paperLayer;

                var textProp = textLayer.property("Source Text");
                var textDoc = textProp.value;
                textDoc.text = ch;

                // Font size calculation with jitter
                var baseFontSize = 76 * scaleVal;
                if (randFontSize) {
                    baseFontSize *= (0.85 + Math.random() * 0.35);
                }
                textDoc.fontSize = baseFontSize;
                textDoc.fillColor = textRgb;
                textDoc.applyFill = true;

                // Try assigning font safely
                try {
                    textDoc.font = fontChoice;
                } catch (eFont) {
                    // Fallback to default
                }

                // For Pop-Art or Stencil, apply stroke if desired
                if (preset === "pop_art_retro") {
                    textDoc.applyStroke = true;
                    textDoc.strokeColor = [0, 0, 0];
                    textDoc.strokeWidth = 3;
                } else if (preset === "stencil_spray") {
                    textDoc.applyStroke = true;
                    textDoc.strokeColor = [0.2, 0.2, 0.2];
                    textDoc.strokeWidth = 1.5;
                }

                textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
                textProp.setValue(textDoc);

                // Center text in paper tile
                textLayer.property("Position").setValue([0, baseFontSize * 0.32]);

                // 3. Stagger & Keyframe Animation
                var delay = 0;
                var staggerStep = 0.08;
                if (direction === "Left to Right") {
                    delay = i * staggerStep;
                } else if (direction === "Right to Left") {
                    delay = (totalChars - 1 - i) * staggerStep;
                } else if (direction === "Random Order") {
                    delay = (Math.random() * (totalChars - 1)) * staggerStep;
                } else if (direction === "Center Out") {
                    var mid = (totalChars - 1) / 2;
                    delay = Math.abs(i - mid) * staggerStep;
                } else if (direction === "All Together") {
                    delay = 0;
                }

                var inStart = currentTime + delay;
                var inEnd = inStart + animInDuration;

                // In Animation Keyframes
                if (animInEnabled) {
                    var posProp = paperLayer.property("Position");
                    var scaleProp = paperLayer.property("Scale");
                    var opProp = paperLayer.property("Opacity");
                    var rotProp = paperLayer.property("Rotation");

                    // Initial state
                    var restingPos = [posX, posY];
                    var restingScale = [100, 100];
                    var restingRot = tileAngle;

                    // Keyframe 1: Start
                    posProp.setValueAtTime(inStart, [posX + animInPosX, posY + (animInType === "Cutout Drop" ? -250 : 0)]);
                    scaleProp.setValueAtTime(inStart, [restingScale[0] * animInScale, restingScale[1] * animInScale]);
                    opProp.setValueAtTime(inStart, animInOpacity);

                    // Keyframe 2: "Paper Crumble" / Stop-Motion Overshoot
                    if (animInType === "Paper Crumble" || animInType === "Stop-Motion Pop") {
                        var midTime = inStart + (animInDuration * 0.65);
                        scaleProp.setValueAtTime(midTime, [restingScale[0] * 1.08, restingScale[1] * 1.08]);
                        rotProp.setValueAtTime(midTime, restingRot + (Math.random() > 0.5 ? 4 : -4));
                    }

                    // Keyframe 3: Settle
                    posProp.setValueAtTime(inEnd, restingPos);
                    scaleProp.setValueAtTime(inEnd, restingScale);
                    opProp.setValueAtTime(inEnd, 100);
                    rotProp.setValueAtTime(inEnd, restingRot);

                    // Apply Stop-Motion look (Posterize Time expression) if selected
                    if (easeType === "Stop-Motion (Posterize 10fps)") {
                        try {
                            paperLayer.property("Transform").property("Position").expression = "posterizeTime(10); value;";
                            paperLayer.property("Transform").property("Rotation").expression = "posterizeTime(10); value;";
                            paperLayer.property("Transform").property("Scale").expression = "posterizeTime(10); value;";
                        } catch (eExpr) {}
                    }
                }

                // Out Animation Keyframes
                if (animOutEnabled && animOutDuration > 0) {
                    var outStart = inStart + 3.0; // 3 seconds hold
                    var outEnd = outStart + animOutDuration;

                    var pProp = paperLayer.property("Position");
                    var sProp = paperLayer.property("Scale");
                    var oProp = paperLayer.property("Opacity");

                    pProp.setValueAtTime(outStart, [posX, posY]);
                    sProp.setValueAtTime(outStart, [100, 100]);
                    oProp.setValueAtTime(outStart, 100);

                    pProp.setValueAtTime(outEnd, [posX + animOutPosX, posY + (animOutType === "Drop Down" ? 300 : 0)]);
                    sProp.setValueAtTime(outEnd, [100 * animOutScale, 100 * animOutScale]);
                    oProp.setValueAtTime(outEnd, animOutOpacity);
                }

                createdTiles.push(paperLayer);
            }

            app.endUndoGroup();

            return JSON.stringify({
                status: "success",
                message: "Successfully generated " + createdTiles.length + " ransom note cutout letters!",
                controllerName: controller.name,
                count: createdTiles.length
            });

        } catch (err) {
            try { app.endUndoGroup(); } catch (e) {}
            return JSON.stringify({
                status: "error",
                message: "ExtendScript Error: " + err.toString() + " (Line " + (err.line || "unknown") + ")"
            });
        }
    },

    /**
     * Converts selected text layer into Ransom Note cutouts
     */
    convertSelectedLayer: function(optionsJson) {
        try {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                return JSON.stringify({ status: "error", message: "Please select an active composition." });
            }
            if (comp.selectedLayers.length === 0) {
                return JSON.stringify({ status: "error", message: "Please select a Text Layer in your timeline." });
            }
            var selLayer = comp.selectedLayers[0];
            if (!(selLayer instanceof TextLayer)) {
                return JSON.stringify({ status: "error", message: "Selected layer must be a Text Layer." });
            }

            var textContent = selLayer.property("Source Text").value.text;
            if (!textContent || textContent.length === 0) {
                return JSON.stringify({ status: "error", message: "Selected text layer has no text." });
            }

            var opts = JSON.parse(optionsJson) || {};
            opts.text = textContent;

            // Generate using extracted text
            var res = RansomNotePro.generate(JSON.stringify(opts));
            var parsed = JSON.parse(res);
            if (parsed.status === "success") {
                // Optionally turn off visibility of original text layer
                selLayer.enabled = false;
            }
            return res;

        } catch (e) {
            return JSON.stringify({ status: "error", message: e.toString() });
        }
    }
};

// Global dispatch helper called by CSInterface.evalScript
function runRansomNotePro(action, paramJson) {
    if (action === "checkStatus") {
        return RansomNotePro.getCompStatus();
    } else if (action === "generate") {
        return RansomNotePro.generate(paramJson);
    } else if (action === "convertSelected") {
        return RansomNotePro.convertSelectedLayer(paramJson);
    }
    return JSON.stringify({ status: "error", message: "Unknown action: " + action });
}
