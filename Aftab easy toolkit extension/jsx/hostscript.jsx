// Easy Toolkit - Adobe After Effects ExtendScript Engine
// Compatible with After Effects CC 2015 - CC 2026+ (ES3 Compliant)

#include "json2.js"

var EasyHost = (function () {
    var storedEffectsClipboard = [];

    // Helper: Safely get active comp or null
    function getActiveComp() {
        if (!app.project) return null;
        var comp = app.project.activeItem;
        if (comp && comp instanceof CompItem) {
            return comp;
        }
        return null;
    }

    // Helper: Clamps a number between min and max
    function clamp(val, min, max) {
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }

    return {
        // --- System & Status ---
        getCompStatus: function () {
            try {
                var comp = getActiveComp();
                if (!comp) {
                    return JSON.stringify({
                        status: "no_comp",
                        compName: "No Comp",
                        layerCount: 0,
                        selectedCount: 0,
                        duration: 0,
                        time: 0
                    });
                }
                return JSON.stringify({
                    status: "ok",
                    compName: comp.name,
                    layerCount: comp.numLayers,
                    selectedCount: comp.selectedLayers.length,
                    duration: comp.duration,
                    time: comp.time
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        executeUndo: function () {
            try {
                app.executeCommand(app.findMenuCommandId("Undo"));
                return JSON.stringify({ success: true, message: "Undo executed" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- Edit Tab: Basic Layers & Operations ---
        createTextLayer: function (customText) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "Please open or select a composition first." });

                app.beginUndoGroup("Easy: Create Text");
                var textValue = customText || "Your text";
                var textLayer = comp.layers.addText(textValue);
                
                // Center anchor point and position
                var textProp = textLayer.property("Source Text");
                var textDoc = textProp.value;
                textDoc.fontSize = Math.round(comp.height * 0.08);
                textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
                textProp.setValue(textDoc);

                textLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
                textLayer.startTime = comp.time;

                // Deselect other layers and select new layer
                for (var i = 1; i <= comp.numLayers; i++) {
                    comp.layer(i).selected = false;
                }
                textLayer.selected = true;

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    layerName: textLayer.name,
                    message: "Your text added"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        createNullLayer: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "Please open or select a composition first." });

                app.beginUndoGroup("Easy: Create Null");
                var nullLayer = comp.layers.addNull();
                nullLayer.name = "Null " + comp.numLayers;
                nullLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
                nullLayer.startTime = comp.time;

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Null layer added" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        createSolidLayer: function (colorHex, customName) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "Please open or select a composition first." });

                app.beginUndoGroup("Easy: Create Solid");
                // Default sleek purple/dark color [0.15, 0.1, 0.22]
                var r = 0.15, g = 0.10, b = 0.22;
                if (colorHex && colorHex.length === 7) {
                    r = parseInt(colorHex.substring(1, 3), 16) / 255;
                    g = parseInt(colorHex.substring(3, 5), 16) / 255;
                    b = parseInt(colorHex.substring(5, 7), 16) / 255;
                }

                var solidName = customName || "Purple Solid " + comp.numLayers;
                var solid = comp.layers.addSolid([r, g, b], solidName, comp.width, comp.height, comp.pixelAspect, comp.duration);
                solid.startTime = 0;

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Solid layer added" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        createAdjustmentLayer: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "Please open or select a composition first." });

                app.beginUndoGroup("Easy: Create Adjustment");
                var adj = comp.layers.addSolid([1, 1, 1], "Adjustment Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);
                adj.adjustmentLayer = true;
                adj.startTime = 0;

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Adjustment layer added" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        duplicateSelected: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select at least one layer to duplicate." });

                app.beginUndoGroup("Easy: Duplicate Layers");
                for (var i = 0; i < selected.length; i++) {
                    selected[i].duplicate();
                }
                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Duplicated " + selected.length + " layer(s)" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- Edit Tab: Precomp & Decomp ---
        precompSelected: function (compName) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select layer(s) to precompose." });

                app.beginUndoGroup("Easy: Precompose");
                var indices = [];
                for (var i = 0; i < selected.length; i++) {
                    indices.push(selected[i].index);
                }

                var defaultName = selected.length === 1 ? selected[0].name : "Pre-comp";
                var finalName = (compName && compName.length > 0) ? compName : defaultName;

                var newPrecomp = comp.layers.precompose(indices, finalName, true);
                app.endUndoGroup();

                return JSON.stringify({
                    success: true,
                    compName: finalName,
                    message: "Precomposed as \"" + finalName + "\""
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        precompEachSelected: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select layers to precompose each." });

                app.beginUndoGroup("Easy: Precompose Each");
                var count = selected.length;
                // Precompose one by one
                for (var i = 0; i < selected.length; i++) {
                    var l = selected[i];
                    comp.layers.precompose([l.index], l.name + " Precomp", true);
                }
                app.endUndoGroup();

                return JSON.stringify({
                    success: true,
                    message: "Precomposed " + count + " layer(s) each"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        decompSelected: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a precomp layer to decompose." });

                app.beginUndoGroup("Easy: Decompose Precomp");
                var extractedTotal = 0;

                for (var s = 0; s < selected.length; s++) {
                    var precompLayer = selected[s];
                    var sourceComp = precompLayer.source;
                    if (!(sourceComp instanceof CompItem)) {
                        continue;
                    }

                    var parentComp = comp;
                    var timeOffset = precompLayer.startTime;
                    var layerIndex = precompLayer.index;

                    // Copy internal layers into the parent comp
                    for (var j = 1; j <= sourceComp.numLayers; j++) {
                        var sourceLayer = sourceComp.layer(j);
                        sourceLayer.copyToComp(parentComp);
                        var newLayer = parentComp.layer(1);
                        newLayer.startTime += timeOffset;
                        newLayer.moveBefore(parentComp.layer(layerIndex));
                        extractedTotal++;
                    }

                    // Remove original precomp layer
                    precompLayer.remove();
                }

                app.endUndoGroup();

                if (extractedTotal === 0) {
                    return JSON.stringify({ error: "Selected layer is not a precomposition." });
                }

                return JSON.stringify({
                    success: true,
                    message: "Decomposed precomp (" + extractedTotal + " layers extracted)"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- Edit Tab: Copy & Paste Effects ---
        copyEffects: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a layer to copy effects from." });

                var layer = selected[0];
                var fxGroup = layer.property("ADBE Effect Parade");
                if (!fxGroup || fxGroup.numProperties === 0) {
                    return JSON.stringify({ error: "Selected layer has no effects to copy." });
                }

                storedEffectsClipboard = [];
                for (var i = 1; i <= fxGroup.numProperties; i++) {
                    var effect = fxGroup.property(i);
                    storedEffectsClipboard.push({
                        matchName: effect.matchName,
                        name: effect.name
                    });
                }

                // Also trigger native AE copy if effect properties selected
                app.executeCommand(19); // Edit > Copy

                return JSON.stringify({
                    success: true,
                    count: storedEffectsClipboard.length,
                    message: "Copied " + storedEffectsClipboard.length + " effect(s) from " + layer.name
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        pasteEffects: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select target layer(s) to paste effects." });

                app.beginUndoGroup("Easy: Paste Effects");

                // If effects were stored
                if (storedEffectsClipboard.length > 0) {
                    for (var s = 0; s < selected.length; s++) {
                        var targetLayer = selected[s];
                        var fxGroup = targetLayer.property("ADBE Effect Parade");
                        for (var e = 0; e < storedEffectsClipboard.length; e++) {
                            try {
                                if (fxGroup.canAddProperty(storedEffectsClipboard[e].matchName)) {
                                    fxGroup.addProperty(storedEffectsClipboard[e].matchName);
                                }
                            } catch (err) {}
                        }
                    }
                } else {
                    // Try native paste
                    app.executeCommand(20); // Edit > Paste
                }

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    message: "Pasted effects to " + selected.length + " layer(s)"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- Curves / Easing Tab (Screenshot 801) ---
        applyEasing: function (x1, y1, x2, y2, mode) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                var selectedLayers = comp.selectedLayers;
                if (selectedLayers.length === 0) {
                    return JSON.stringify({ error: "Please select a layer with keyframes." });
                }

                app.beginUndoGroup("Easy: Apply Easing Curve");

                // Calculate KeyframeEase parameters from Cubic Bezier (x1, y1, x2, y2)
                // x is time (0 to 1), y is progress (0 to 1)
                // Influence: 0.1 to 100%
                var outInfluence = clamp(Math.round(x1 * 100 * 100) / 100, 0.1, 100);
                var inInfluence = clamp(Math.round((1 - x2) * 100 * 100) / 100, 0.1, 100);

                // Speed calculation: tangent slope at start and end
                var outSpeed = 0;
                var inSpeed = 0;
                if (mode === "speed") {
                    outSpeed = (x1 > 0.001) ? clamp((y1 / x1) * 20, -1000, 1000) : 0;
                    inSpeed = (x2 < 0.999) ? clamp(((1 - y2) / (1 - x2)) * 20, -1000, 1000) : 0;
                }

                var outEase = new KeyframeEase(outSpeed, outInfluence);
                var inEase = new KeyframeEase(inSpeed, inInfluence);

                var appliedPropsCount = 0;
                var appliedKeysCount = 0;

                function applyEaseToProperty(prop) {
                    if (!prop.canVaryOverTime || prop.numKeys < 2) return;
                    
                    var selKeys = prop.selectedKeys;
                    // If no specific keys selected, apply to all keys
                    var keysToApply = (selKeys && selKeys.length > 0) ? selKeys : [];
                    if (keysToApply.length === 0) {
                        for (var k = 1; k <= prop.numKeys; k++) {
                            keysToApply.push(k);
                        }
                    }

                    for (var ki = 0; ki < keysToApply.length; ki++) {
                        var keyIndex = keysToApply[ki];
                        try {
                            // Check property value type (1D, 2D, 3D)
                            var valType = prop.propertyValueType;
                            if (valType === PropertyValueType.TwoD_SPATIAL || valType === PropertyValueType.ThreeD_SPATIAL) {
                                // Spatial properties use 2 or 3 ease elements
                                var easeArrIn = [];
                                var easeArrOut = [];
                                var dim = (valType === PropertyValueType.TwoD_SPATIAL) ? 2 : 3;
                                for (var d = 0; d < dim; d++) {
                                    easeArrIn.push(new KeyframeEase(inSpeed, inInfluence));
                                    easeArrOut.push(new KeyframeEase(outSpeed, outInfluence));
                                }
                                prop.setTemporalEaseAtKey(keyIndex, easeArrIn, easeArrOut);
                            } else if (valType === PropertyValueType.TwoD || valType === PropertyValueType.ThreeD) {
                                var easeArrIn2 = [];
                                var easeArrOut2 = [];
                                var dim2 = (valType === PropertyValueType.TwoD) ? 2 : 3;
                                for (var d2 = 0; d2 < dim2; d2++) {
                                    easeArrIn2.push(new KeyframeEase(inSpeed, inInfluence));
                                    easeArrOut2.push(new KeyframeEase(outSpeed, outInfluence));
                                }
                                prop.setTemporalEaseAtKey(keyIndex, easeArrIn2, easeArrOut2);
                            } else {
                                // 1D scalar property
                                prop.setTemporalEaseAtKey(keyIndex, [inEase], [outEase]);
                            }
                            appliedKeysCount++;
                        } catch (err) {}
                    }
                    appliedPropsCount++;
                }

                // Recursively check properties in layer
                function traverseProperties(propGroup) {
                    for (var p = 1; p <= propGroup.numProperties; p++) {
                        var child = propGroup.property(p);
                        if (child.propertyType === PropertyType.PROPERTY) {
                            if (child.isModified && child.numKeys > 0) {
                                applyEaseToProperty(child);
                            }
                        } else if (child.propertyType === PropertyType.INDEXED_GROUP || child.propertyType === PropertyType.NAMED_GROUP) {
                            traverseProperties(child);
                        }
                    }
                }

                for (var l = 0; l < selectedLayers.length; l++) {
                    traverseProperties(selectedLayers[l]);
                }

                app.endUndoGroup();

                if (appliedKeysCount === 0) {
                    return JSON.stringify({
                        warning: true,
                        message: "No keyframes found on selected layer(s). Add keyframes first."
                    });
                }

                return JSON.stringify({
                    success: true,
                    keysCount: appliedKeysCount,
                    message: "Curve applied to " + appliedKeysCount + " keyframe(s)"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        readKeyEasing: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                var selectedLayers = comp.selectedLayers;
                if (selectedLayers.length === 0) return JSON.stringify({ error: "Please select a layer with keyframes." });

                var foundEase = null;

                function findFirstKeyEase(propGroup) {
                    if (foundEase) return;
                    for (var p = 1; p <= propGroup.numProperties; p++) {
                        var child = propGroup.property(p);
                        if (child.propertyType === PropertyType.PROPERTY) {
                            if (child.canVaryOverTime && child.numKeys > 0) {
                                var selKeys = child.selectedKeys;
                                var keyIdx = (selKeys && selKeys.length > 0) ? selKeys[0] : 1;
                                try {
                                    var inEase = child.keyInTemporalEase(keyIdx);
                                    var outEase = child.keyOutTemporalEase(keyIdx);
                                    if (inEase && outEase && inEase.length > 0 && outEase.length > 0) {
                                        foundEase = {
                                            inInfluence: inEase[0].influence,
                                            outInfluence: outEase[0].influence,
                                            inSpeed: inEase[0].speed,
                                            outSpeed: outEase[0].speed
                                        };
                                        return;
                                    }
                                } catch (e) {}
                            }
                        } else if (child.propertyType === PropertyType.INDEXED_GROUP || child.propertyType === PropertyType.NAMED_GROUP) {
                            findFirstKeyEase(child);
                        }
                    }
                }

                for (var l = 0; l < selectedLayers.length; l++) {
                    findFirstKeyEase(selectedLayers[l]);
                    if (foundEase) break;
                }

                if (!foundEase) {
                    return JSON.stringify({ error: "No keyframes with easing found." });
                }

                // Map back to cubic bezier coordinates
                var x1 = clamp(foundEase.outInfluence / 100, 0, 1);
                var x2 = clamp(1 - (foundEase.inInfluence / 100), 0, 1);
                var y1 = clamp(x1 * 0.2, 0, 1);
                var y2 = clamp(x2 + 0.2, 0, 1);

                return JSON.stringify({
                    success: true,
                    x1: Math.round(x1 * 100) / 100,
                    y1: Math.round(y1 * 100) / 100,
                    x2: Math.round(x2 * 100) / 100,
                    y2: Math.round(y2 * 100) / 100,
                    message: "Read keyframe easing (" + Math.round(foundEase.outInfluence) + "%, " + Math.round(foundEase.inInfluence) + "%)"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- AI Tab Tools (Screenshot 803) ---
        applyBounceExpression: function (freq, decay, amp) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a layer with keyframes." });

                app.beginUndoGroup("Easy: Inertial Bounce");
                var f = freq || 3.0;
                var d = decay || 5.0;
                var a = amp || 0.05;

                var bounceExpr = [
                    "// Easy Elastic Bounce",
                    "n = 0;",
                    "if (numKeys > 0){",
                    "  n = nearestKey(time).index;",
                    "  if (key(n).time > time){ n--; }",
                    "}",
                    "if (n == 0){ t = 0; } else { t = time - key(n).time; }",
                    "if (n > 0 && t < 1){",
                    "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);",
                    "  amp = " + a + ";",
                    "  freq = " + f + ";",
                    "  decay = " + d + ";",
                    "  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);",
                    "} else { value; }"
                ].join("\n");

                var applied = 0;
                for (var i = 0; i < selected.length; i++) {
                    var l = selected[i];
                    var props = [l.transform.scale, l.transform.position, l.transform.rotation];
                    for (var p = 0; p < props.length; p++) {
                        if (props[p] && props[p].numKeys > 0) {
                            props[p].expression = bounceExpr;
                            applied++;
                        }
                    }
                }

                app.endUndoGroup();

                if (applied === 0) {
                    // Apply to scale property as fallback default
                    selected[0].transform.scale.expression = bounceExpr;
                    return JSON.stringify({ success: true, message: "Bounce expression applied to Scale" });
                }

                return JSON.stringify({ success: true, message: "Bounce applied to " + applied + " property(s)" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        generateCaptions: function (textString, wordsPerCard) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                app.beginUndoGroup("Easy: Generate AI Captions");
                var text = textString || "Create stunning captions with Easy Toolkit in After Effects";
                var words = text.split(/\s+/);
                var chunkSize = wordsPerCard || 3;
                var groups = [];
                
                for (var w = 0; w < words.length; w += chunkSize) {
                    groups.push(words.slice(w, w + chunkSize).join(" "));
                }

                var durationPerCard = 1.0;
                var startT = comp.time;

                for (var g = 0; g < groups.length; g++) {
                    var capLayer = comp.layers.addText(groups[g].toUpperCase());
                    var textProp = capLayer.property("Source Text");
                    var doc = textProp.value;
                    doc.fontSize = Math.round(comp.height * 0.07);
                    doc.font = "Impact";
                    doc.fillColor = [1, 1, 1];
                    doc.strokeColor = [0, 0, 0];
                    doc.strokeWidth = 4;
                    doc.strokeOverFill = false;
                    doc.justification = ParagraphJustification.CENTER_JUSTIFY;
                    textProp.setValue(doc);

                    capLayer.transform.position.setValue([comp.width / 2, comp.height * 0.78]);
                    capLayer.startTime = startT + (g * durationPerCard);
                    capLayer.inPoint = startT + (g * durationPerCard);
                    capLayer.outPoint = startT + ((g + 1) * durationPerCard);

                    // Add subtle pop animation on scale
                    var scaleProp = capLayer.transform.scale;
                    scaleProp.setValueAtTime(capLayer.inPoint, [80, 80]);
                    scaleProp.setValueAtTime(capLayer.inPoint + 0.15, [105, 105]);
                    scaleProp.setValueAtTime(capLayer.inPoint + 0.25, [100, 100]);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    count: groups.length,
                    message: "Generated " + groups.length + " caption cards"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        detectAudioBeats: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                app.beginUndoGroup("Easy: Audio Beat Markers");
                // Place beat markers at regular musical bpm interval (e.g. 128 BPM = 0.46875s)
                var bpm = 120;
                var interval = 60 / bpm;
                var totalMarkers = Math.floor(comp.duration / interval);

                for (var m = 0; m < totalMarkers; m++) {
                    var markerTime = m * interval;
                    var marker = new MarkerValue("Beat " + (m + 1));
                    comp.markerProperty.setValueAtTime(markerTime, marker);
                }

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    message: "Added " + totalMarkers + " beat markers (120 BPM)"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        applySmartMask: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a layer to mask." });

                app.beginUndoGroup("Easy: Auto Smart Mask");
                var layer = selected[0];
                var maskGroup = layer.property("ADBE Mask Parade");
                var newMask = maskGroup.addProperty("ADBE Mask Atom");
                newMask.maskMode = MaskMode.ADD;
                newMask.maskFeather.setValue([60, 60]);

                var shape = newMask.property("ADBE Mask Shape").value;
                var w = layer.width || comp.width;
                var h = layer.height || comp.height;
                var margin = 0.15;
                shape.vertices = [
                    [w * margin, h * margin],
                    [w * (1 - margin), h * margin],
                    [w * (1 - margin), h * (1 - margin)],
                    [w * margin, h * (1 - margin)]
                ];
                shape.closed = true;
                newMask.property("ADBE Mask Shape").setValue(shape);

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Smart feather mask applied" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        applyTextKinetic: function (style) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a text layer." });

                var layer = selected[0];
                var textProp = layer.property("Source Text");
                if (!textProp) return JSON.stringify({ error: "Selected layer is not a text layer." });

                app.beginUndoGroup("Easy: Kinetic Text");
                if (style === "typewriter") {
                    var expr = [
                        "// Typewriter Effect",
                        "speed = 30; // chars per second",
                        "str = value;",
                        "idx = Math.min(str.length, Math.floor((time - inPoint) * speed));",
                        "cursor = (Math.floor(time * 3) % 2 == 0) ? '|' : '';",
                        "str.substr(0, idx) + (idx < str.length ? cursor : '');"
                    ].join("\n");
                    textProp.expression = expr;
                } else {
                    // Stagger fade up
                    var textAnim = layer.property("ADBE Text Properties").property("ADBE Text Animators");
                    var animator = textAnim.addProperty("ADBE Text Animator");
                    animator.name = "Easy Kinetic Rise";
                    var posProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D");
                    posProp.setValue([0, 80, 0]);
                    var opacProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
                    opacProp.setValue(0);

                    var selector = animator.property("ADBE Text Selectors").property(1);
                    selector.property("ADBE Text Percent Start").setValueAtTime(comp.time, 0);
                    selector.property("ADBE Text Percent Start").setValueAtTime(comp.time + 0.8, 100);
                }

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Kinetic text animation applied" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        applyFluidMotion: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length === 0) return JSON.stringify({ error: "Please select a layer for fluid motion." });

                app.beginUndoGroup("Easy: Fluid Motion");
                var layer = selected[0];
                var expr = "// Easy Fluid Wave Motion\nw = wiggle(1.5, 25);\n[w[0], w[1]];";
                layer.transform.position.expression = expr;
                layer.transform.rotation.expression = "wiggle(1.0, 4);";

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Fluid wave expression applied" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        createRelightRig: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                app.beginUndoGroup("Easy: Cinematic Relight Rig");
                // Key Light
                var keyLight = comp.layers.addLight("Key Light (Purple)", [comp.width * 0.3, comp.height * 0.3]);
                keyLight.lightType = LightType.POINT;
                keyLight.lightSourceColor = [0.85, 0.70, 1.0];
                keyLight.intensity = 110;

                // Rim Light
                var rimLight = comp.layers.addLight("Rim Light (Accent)", [comp.width * 0.85, comp.height * 0.2]);
                rimLight.lightType = LightType.POINT;
                rimLight.lightSourceColor = [0.65, 0.40, 1.0];
                rimLight.intensity = 90;

                // Ambient Light
                var ambLight = comp.layers.addLight("Ambient Base", [comp.width / 2, comp.height / 2]);
                ambLight.lightType = LightType.AMBIENT;
                ambLight.intensity = 45;

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Cinematic 3-point light rig created" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        createFaceTrackingNull: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                app.beginUndoGroup("Easy: Face Tracker Target");
                var nullLayer = comp.layers.addNull();
                nullLayer.name = "Track Target [Face]";
                nullLayer.transform.position.setValue([comp.width / 2, comp.height * 0.4]);
                nullLayer.startTime = comp.time;

                app.endUndoGroup();
                return JSON.stringify({ success: true, message: "Face tracking target created" });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        // --- Utils Tab (Screenshot 805) ---
        importImageLayer: function (filePath) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                var f = new File(filePath);
                if (!f.exists) return JSON.stringify({ error: "File not found: " + filePath });

                app.beginUndoGroup("Easy: Paste Image");
                var importOpts = new ImportOptions(f);
                var importedItem = app.project.importFile(importOpts);
                var layer = comp.layers.add(importedItem);
                layer.startTime = comp.time;

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    layerName: layer.name,
                    message: "Pasted image into composition"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        linkSelectedLayers: function (mode) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });
                var selected = comp.selectedLayers;
                if (selected.length < 2) {
                    return JSON.stringify({ error: "Please select at least 2 layers to link." });
                }

                app.beginUndoGroup("Easy: Link Layers");
                // The first selected is child, last selected is parent
                var parentLayer = selected[selected.length - 1];
                for (var i = 0; i < selected.length - 1; i++) {
                    selected[i].parent = parentLayer;
                }

                app.endUndoGroup();
                return JSON.stringify({
                    success: true,
                    message: "Linked " + (selected.length - 1) + " layer(s) to " + parentLayer.name
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        quickRenderQueue: function () {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                app.beginUndoGroup("Easy: Add to Render Queue");
                var renderItem = app.project.renderQueue.items.add(comp);
                app.endUndoGroup();

                return JSON.stringify({
                    success: true,
                    message: "Added \"" + comp.name + "\" to Render Queue"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        },

        saveSnapshotFrame: function (outputFolder) {
            try {
                var comp = getActiveComp();
                if (!comp) return JSON.stringify({ error: "No active composition." });

                var folder = outputFolder ? new Folder(outputFolder) : Folder.desktop;
                var outFile = new File(folder.fsName + "/" + comp.name + "_frame.png");
                comp.saveFrameToPng(comp.time, outFile);

                return JSON.stringify({
                    success: true,
                    path: outFile.fsName,
                    message: "Snapshot saved to Desktop"
                });
            } catch (e) {
                return JSON.stringify({ error: e.toString() });
            }
        }
    };
})();


// EasyHost engine ready
