/**
 * Ransom Note Pro - Standalone ScriptUI Panel
 * Compatible with ALL Adobe After Effects versions (CS6, CC 2014 through CC 2026+)
 * Author: Aftab Musrraf
 * 
 * Instructions:
 * 1. Place this file in:
 *    Windows: C:\Program Files\Adobe\Adobe After Effects <Version>\Support Files\Scripts\ScriptUI Panels\
 *    macOS:   /Applications/Adobe After Effects <Version>/Scripts/ScriptUI Panels/
 * 2. In After Effects, access via: Window -> Ransom Note Pro - ScriptUI.jsx
 */

(function (thisObj) {
    "use strict";

    var RansomScript = {
        presets: {
            "Vintage Newspaper": {
                fonts: ["TimesNewRomanPS-BoldMT", "Georgia-Bold", "CourierNewPS-BoldMT", "Arial-BoldMT"],
                colors: [[0.95, 0.94, 0.87], [0.88, 0.85, 0.78], [0.82, 0.76, 0.66], [0.22, 0.22, 0.20]],
                rot: 6,
                grid: 10
            },
            "Magazine Glossy": {
                fonts: ["Impact", "Arial-Black", "Helvetica-Bold", "TrebuchetMS-Bold"],
                colors: [[1.0, 0.2, 0.4], [0.2, 0.8, 0.6], [1.0, 0.8, 0.0], [0.22, 0.74, 0.97], [0.1, 0.1, 0.15]],
                rot: 12,
                grid: 14
            },
            "Grunge Craft Paper": {
                fonts: ["CourierNewPS-BoldMT", "Impact", "Georgia-Bold"],
                colors: [[0.78, 0.58, 0.40], [0.64, 0.46, 0.32], [0.90, 0.80, 0.70], [0.50, 0.33, 0.22]],
                rot: 8,
                grid: 12
            },
            "Torn Cardboard": {
                fonts: ["Impact", "Arial-Black", "Stencil"],
                colors: [[0.83, 0.64, 0.45], [0.80, 0.83, 0.68], [0.98, 0.93, 0.80], [0.55, 0.38, 0.22]],
                rot: 12,
                grid: 16
            },
            "Stencil Spray": {
                fonts: ["Stencil", "Impact", "Arial-Black"],
                colors: [[0.1, 0.1, 0.1], [0.22, 0.74, 0.97], [0.95, 0.24, 0.37], [0.98, 0.75, 0.14]],
                rot: 6,
                grid: 12
            },
            "Pop-Art Retro": {
                fonts: ["ComicSansMS-Bold", "Impact", "Arial-Black"],
                colors: [[1.0, 0.9, 0.0], [1.0, 0.0, 0.33], [0.0, 0.94, 1.0], [0.07, 0.09, 0.15], [1.0, 1.0, 1.0]],
                rot: 15,
                grid: 16
            },
            "Typewriter Classic": {
                fonts: ["CourierNewPSMT", "Courier", "Consolas"],
                colors: [[0.97, 0.96, 0.93], [0.92, 0.91, 0.87], [0.15, 0.15, 0.15], [0.25, 0.24, 0.22]],
                rot: 4,
                grid: 8
            },
            "Random Ransom": {
                fonts: ["Impact", "TimesNewRomanPS-BoldMT", "Arial-Black", "CourierNewPS-BoldMT", "Georgia-Bold"],
                colors: [[1.0, 0.42, 0.42], [1.0, 0.82, 0.4], [0.02, 0.84, 0.63], [0.07, 0.54, 0.7], [0.78, 0.58, 0.4], [0.95, 0.94, 0.87]],
                rot: 14,
                grid: 15
            }
        },

        buildUI: function (thisObj) {
            var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Ransom Note Pro", undefined, { resizeable: true });
            if (pal === null) return;

            pal.orientation = "column";
            pal.alignChildren = ["fill", "top"];
            pal.spacing = 10;
            pal.margins = 14;

            // Header
            var headerGrp = pal.add("group");
            headerGrp.alignment = ["fill", "top"];
            var titleTxt = headerGrp.add("statictext", undefined, "RANSOM NOTE PRO");
            titleTxt.graphics.font = ScriptUI.newFont("Verdana", "Bold", 14);
            headerGrp.add("statictext", undefined, "by Aftab Musrraf");

            // Text Input Box
            var textGrp = pal.add("panel", undefined, "Target Text");
            textGrp.orientation = "row";
            textGrp.alignChildren = ["fill", "center"];
            var inputTxt = textGrp.add("edittext", undefined, "RANSOM");
            inputTxt.characters = 20;

            // Presets Dropdown
            var presetGrp = pal.add("panel", undefined, "Presets");
            presetGrp.orientation = "row";
            var presetList = [
                "Vintage Newspaper",
                "Magazine Glossy",
                "Grunge Craft Paper",
                "Torn Cardboard",
                "Stencil Spray",
                "Pop-Art Retro",
                "Typewriter Classic",
                "Random Ransom"
            ];
            var presetDrop = presetGrp.add("dropdownlist", undefined, presetList);
            presetDrop.selection = 0;

            // Layout & Transform Controls
            var layoutGrp = pal.add("panel", undefined, "Layout & Transform");
            layoutGrp.orientation = "column";
            layoutGrp.alignChildren = ["fill", "top"];

            // Scale
            var scaleRow = layoutGrp.add("group");
            scaleRow.add("statictext", undefined, "Scale (%):");
            var scaleSlider = scaleRow.add("slider", undefined, 100, 50, 200);
            var scaleVal = scaleRow.add("statictext", undefined, "100%");
            scaleSlider.onChanging = function () {
                scaleVal.text = Math.round(scaleSlider.value) + "%";
            };

            // Rotation
            var rotRow = layoutGrp.add("group");
            rotRow.add("statictext", undefined, "Rotation (°):");
            var rotSlider = rotRow.add("slider", undefined, 0, 0, 45);
            var rotVal = rotRow.add("statictext", undefined, "0°");
            rotSlider.onChanging = function () {
                rotVal.text = Math.round(rotSlider.value) + "°";
            };

            // Jitter / Grid Size
            var jitRow = layoutGrp.add("group");
            jitRow.add("statictext", undefined, "Grid Jitter:");
            var jitSlider = jitRow.add("slider", undefined, 12, 4, 36);
            var jitVal = jitRow.add("statictext", undefined, "12");
            jitSlider.onChanging = function () {
                jitVal.text = Math.round(jitSlider.value);
            };

            // Pattern Randomization Toggles
            var randGrp = pal.add("panel", undefined, "Pattern Randomization");
            randGrp.orientation = "column";
            randGrp.alignChildren = ["left", "top"];
            var chkRandFont = randGrp.add("checkbox", undefined, "Randomize Font Size");
            chkRandFont.value = true;
            var chkRandPos = randGrp.add("checkbox", undefined, "Randomize Position");
            chkRandPos.value = true;
            var chkRandAngle = randGrp.add("checkbox", undefined, "Randomize Angle");
            chkRandAngle.value = true;

            // Advanced Animation Section
            var animGrp = pal.add("panel", undefined, "Advanced Animation");
            animGrp.orientation = "column";
            animGrp.alignChildren = ["fill", "top"];

            var animInRow = animGrp.add("group");
            var chkAnimIn = animInRow.add("checkbox", undefined, "In Animation:");
            chkAnimIn.value = true;
            var animInDrop = animInRow.add("dropdownlist", undefined, ["Paper Crumble", "Stop-Motion Pop", "Stamp Down", "Cutout Drop", "Slide In"]);
            animInDrop.selection = 0;

            var animEaseRow = animGrp.add("group");
            animEaseRow.add("statictext", undefined, "Style / Ease:");
            var animEaseDrop = animEaseRow.add("dropdownlist", undefined, ["Ease-In-Out", "Linear", "Stop-Motion (10fps)", "Cutout Snap"]);
            animEaseDrop.selection = 0;

            // Action Buttons
            var btnGrp = pal.add("group");
            btnGrp.orientation = "column";
            btnGrp.alignChildren = ["fill", "center"];

            var btnGenerate = btnGrp.add("button", undefined, "⚡ GENERATE RANSOM NOTE");
            var btnConvert = btnGrp.add("button", undefined, "📝 Convert Selected Text Layer");

            btnGenerate.onClick = function () {
                RansomScript.generate({
                    text: inputTxt.text,
                    presetName: presetDrop.selection.text,
                    scale: scaleSlider.value / 100,
                    rotation: rotSlider.value,
                    gridSize: jitSlider.value,
                    randFontSize: chkRandFont.value,
                    randPos: chkRandPos.value,
                    randAngle: chkRandAngle.value,
                    animIn: chkAnimIn.value,
                    animInType: animInDrop.selection.text,
                    ease: animEaseDrop.selection.text
                });
            };

            btnConvert.onClick = function () {
                var comp = app.project ? app.project.activeItem : null;
                if (!comp || !(comp instanceof CompItem)) {
                    alert("Please select a composition with a text layer.");
                    return;
                }
                if (comp.selectedLayers.length === 0 || !(comp.selectedLayers[0] instanceof TextLayer)) {
                    alert("Please select a Text Layer in the timeline.");
                    return;
                }
                var selLayer = comp.selectedLayers[0];
                var txt = selLayer.property("Source Text").value.text;
                if (!txt) {
                    alert("Selected text layer has no text.");
                    return;
                }
                inputTxt.text = txt;
                btnGenerate.notify("onClick");
                selLayer.enabled = false;
            };

            pal.layout.layout(true);
            if (pal instanceof Window) {
                pal.center();
                pal.show();
            }
            return pal;
        },

        generate: function (opts) {
            if (!app.project) {
                app.newProject();
            }

            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                comp = app.project.items.addComp("Ransom Note Pro Comp", 1920, 1080, 1, 10, 30);
                comp.openInViewer();
            }

            var text = opts.text || "RANSOM";
            var chars = text.split("");
            if (chars.length === 0) return;

            app.beginUndoGroup("Ransom Note Pro");

            var preset = RansomScript.presets[opts.presetName] || RansomScript.presets["Random Ransom"];
            var scaleVal = opts.scale || 1.0;
            var gridSize = opts.gridSize || 12;
            var maxRot = opts.rotation > 0 ? opts.rotation : preset.rot;

            // Controller Null
            var controller = comp.layers.addNull();
            controller.name = "Ransom Note - '" + text + "' [Controller]";
            controller.property("Position").setValue([comp.width / 2, comp.height / 2]);

            var charWidth = 110 * scaleVal;
            var charHeight = 140 * scaleVal;
            var spacing = 18 * scaleVal;
            var totalWidth = (chars.length * charWidth) + ((chars.length - 1) * spacing);
            var startX = -(totalWidth / 2) + (charWidth / 2);
            var currentTime = comp.time;

            for (var i = 0; i < chars.length; i++) {
                var ch = chars[i];
                if (ch === " ") continue;

                var fontChoice = preset.fonts[Math.floor(Math.random() * preset.fonts.length)];
                var paperRgb = preset.colors[Math.floor(Math.random() * preset.colors.length)];
                var lum = 0.299 * paperRgb[0] + 0.587 * paperRgb[1] + 0.114 * paperRgb[2];
                var textRgb = lum > 0.55 ? [0.1, 0.1, 0.12] : [0.98, 0.98, 0.98];

                var tileW = charWidth * (0.85 + Math.random() * 0.3);
                var tileH = charHeight * (0.90 + Math.random() * 0.25);

                var posX = startX + (i * (charWidth + spacing));
                var posY = 0;

                if (opts.randPos) {
                    posX += (Math.random() * 2 - 1) * (gridSize * 1.5);
                    posY += (Math.random() * 2 - 1) * (gridSize * 2.2);
                }

                var tileAngle = 0;
                if (opts.randAngle || maxRot > 0) {
                    tileAngle = (Math.random() * 2 - 1) * maxRot;
                }

                // Shape paper tile
                var paperLayer = comp.layers.addShape();
                paperLayer.name = "Tile [" + (i + 1) + "] " + ch;
                paperLayer.parent = controller;

                var shapeGroup = paperLayer.property("Contents").addProperty("ADBE Vector Group");
                var rectShape = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Rect");
                rectShape.property("Size").setValue([tileW, tileH]);
                rectShape.property("Roundness").setValue(6);

                var fillProp = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Fill");
                fillProp.property("Color").setValue(paperRgb);

                // Effects (safe try-catch)
                try {
                    var roughen = paperLayer.property("Effects").addProperty("ADBE Roughen Edges");
                    if (roughen) {
                        roughen.property("Border").setValue(4);
                        roughen.property("Scale").setValue(35);
                    }
                } catch (e1) {}

                try {
                    var dropShadow = paperLayer.property("Effects").addProperty("ADBE Drop Shadow");
                    if (dropShadow) {
                        dropShadow.property("Distance").setValue(8);
                        dropShadow.property("Softness").setValue(14);
                        dropShadow.property("Opacity").setValue(110);
                    }
                } catch (e2) {}

                paperLayer.property("Position").setValue([posX, posY]);
                paperLayer.property("Rotation").setValue(tileAngle);

                // Text Layer
                var textLayer = comp.layers.addText(ch);
                textLayer.name = "Letter [" + (i + 1) + "] " + ch;
                textLayer.parent = paperLayer;

                var textProp = textLayer.property("Source Text");
                var textDoc = textProp.value;
                textDoc.text = ch;

                var baseFontSize = 76 * scaleVal;
                if (opts.randFontSize) {
                    baseFontSize *= (0.85 + Math.random() * 0.35);
                }
                textDoc.fontSize = baseFontSize;
                textDoc.fillColor = textRgb;
                textDoc.applyFill = true;

                try {
                    textDoc.font = fontChoice;
                } catch (eF) {}

                textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
                textProp.setValue(textDoc);
                textLayer.property("Position").setValue([0, baseFontSize * 0.32]);

                // Keyframing
                if (opts.animIn) {
                    var delay = i * 0.08;
                    var tStart = currentTime + delay;
                    var tEnd = tStart + 0.6;

                    var p = paperLayer.property("Position");
                    var s = paperLayer.property("Scale");
                    var o = paperLayer.property("Opacity");

                    p.setValueAtTime(tStart, [posX, posY]);
                    s.setValueAtTime(tStart, [110, 110]);
                    o.setValueAtTime(tStart, 0);

                    if (opts.animInType === "Paper Crumble" || opts.animInType === "Stop-Motion Pop") {
                        var tMid = tStart + 0.4;
                        s.setValueAtTime(tMid, [106, 106]);
                    }

                    p.setValueAtTime(tEnd, [posX, posY]);
                    s.setValueAtTime(tEnd, [100, 100]);
                    o.setValueAtTime(tEnd, 100);

                    if (opts.ease === "Stop-Motion (10fps)") {
                        try {
                            paperLayer.property("Transform").property("Position").expression = "posterizeTime(10); value;";
                            paperLayer.property("Transform").property("Scale").expression = "posterizeTime(10); value;";
                        } catch (eExp) {}
                    }
                }
            }

            app.endUndoGroup();
        }
    };

    RansomScript.buildUI(thisObj);

})(this);
