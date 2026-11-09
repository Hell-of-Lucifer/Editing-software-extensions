/**
 * AE CASE MASTER - ExtendScript Host Engine
 * Compatible with Adobe After Effects CS6, CC 2014 through CC 2026+
 * Author: Aftab Musrraf
 */

// JSON Polyfill for older ExtendScript environments
if (typeof JSON !== 'object') {
    JSON = {};
}
(function () {
    'use strict';
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value) {
            if (value === null) return 'null';
            if (typeof value === 'boolean' || typeof value === 'number') return '' + value;
            if (typeof value === 'string') {
                return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
            }
            if (value instanceof Array) {
                var res = [];
                for (var i = 0; i < value.length; i++) {
                    res.push(JSON.stringify(value[i]));
                }
                return '[' + res.join(',') + ']';
            }
            if (typeof value === 'object') {
                var props = [];
                for (var k in value) {
                    if (value.hasOwnProperty(k)) {
                        props.push(JSON.stringify(k) + ':' + JSON.stringify(value[k]));
                    }
                }
                return '{' + props.join(',') + '}';
            }
            return 'null';
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (str) {
            return eval('(' + str + ')');
        };
    }
})();

// Helper to return consistent JSON results
function ae_response(success, message, count, extra) {
    var obj = {
        success: !!success,
        message: message || '',
        count: typeof count === 'number' ? count : 0
    };
    if (extra) {
        for (var p in extra) {
            if (extra.hasOwnProperty(p)) {
                obj[p] = extra[p];
            }
        }
    }
    return JSON.stringify(obj);
}

// Get active composition safely
function ae_getActiveComp() {
    var comp = app.project ? app.project.activeItem : null;
    if (comp && comp instanceof CompItem) {
        return comp;
    }
    return null;
}

// Get selected text layers
function ae_getSelectedTextLayers(comp) {
    var layers = [];
    if (!comp) return layers;
    for (var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];
        if (layer instanceof TextLayer) {
            layers.push(layer);
        }
    }
    return layers;
}

// -------------------------------------------------------------
// CASE TRANSFORMATION ALGORITHMS
// -------------------------------------------------------------
function ae_transformString(str, type) {
    if (!str || str.length === 0) return str;

    switch (type) {
        case 'sentence':
            // Lowercase entire text, then capitalize first letter of each sentence
            var lower = str.toLowerCase();
            return lower.replace(/(^\s*|[\.\?!]\s*|\n\s*|\r\s*)([a-z\u00C0-\u017F])/g, function (match, prefix, charToCap) {
                return prefix + charToCap.toUpperCase();
            });

        case 'lower':
            return str.toLowerCase();

        case 'upper':
            return str.toUpperCase();

        case 'alternating':
            // aLtErNaTiNg CaSe (starts lowercase, then alternates on alphabetical chars)
            var altResult = '';
            var letterIdx = 0;
            for (var a = 0; a < str.length; a++) {
                var ch = str.charAt(a);
                if (/[a-zA-Z\u00C0-\u017F]/.test(ch)) {
                    if (letterIdx % 2 === 0) {
                        altResult += ch.toLowerCase();
                    } else {
                        altResult += ch.toUpperCase();
                    }
                    letterIdx++;
                } else {
                    altResult += ch;
                }
            }
            return altResult;

        case 'title':
            // Capitalize first letter of every word
            return str.toLowerCase().replace(/(^|[^\w\u00C0-\u017F])([a-z\u00C0-\u017F])/g, function (match, boundary, charToCap) {
                return boundary + charToCap.toUpperCase();
            });

        case 'inverse':
            // Invert the case of each character
            var invResult = '';
            for (var b = 0; b < str.length; b++) {
                var c = str.charAt(b);
                var upperChar = c.toUpperCase();
                var lowerChar = c.toLowerCase();
                if (c === upperChar && c !== lowerChar) {
                    invResult += lowerChar;
                } else if (c === lowerChar && c !== upperChar) {
                    invResult += upperChar;
                } else {
                    invResult += c;
                }
            }
            return invResult;

        default:
            return str;
    }
}

// Apply Case Transformation to selected Text Layers
function aeCaseMaster_applyCase(caseType) {
    try {
        var comp = ae_getActiveComp();
        if (!comp) {
            return ae_response(false, "Please open and select an active composition.");
        }

        var textLayers = ae_getSelectedTextLayers(comp);
        if (textLayers.length === 0) {
            return ae_response(false, "Please select at least one text layer.");
        }

        var label = caseType.toUpperCase() + " CASE";
        app.beginUndoGroup("AE Case Master: " + label);

        var count = 0;
        for (var i = 0; i < textLayers.length; i++) {
            var layer = textLayers[i];
            var prop = layer.property("Source Text");
            if (!prop) continue;

            if (prop.numKeys > 0) {
                // Handle keyframed text
                for (var k = 1; k <= prop.numKeys; k++) {
                    var keyDoc = prop.keyValue(k);
                    if (keyDoc && typeof keyDoc.text === 'string') {
                        keyDoc.text = ae_transformString(keyDoc.text, caseType);
                        prop.setValueAtKey(k, keyDoc);
                    }
                }
                count++;
            } else {
                var textDoc = prop.value;
                if (textDoc && typeof textDoc.text === 'string') {
                    textDoc.text = ae_transformString(textDoc.text, caseType);
                    prop.setValue(textDoc);
                    count++;
                }
            }
        }

        app.endUndoGroup();
        return ae_response(true, "Applied " + label + " to " + count + " layer" + (count === 1 ? "" : "s") + ".", count);
    } catch (err) {
        return ae_response(false, "Error: " + err.toString());
    }
}

// -------------------------------------------------------------
// TEXT UTILITIES
// -------------------------------------------------------------
function aeCaseMaster_textUtility(utilityType) {
    try {
        var comp = ae_getActiveComp();
        if (!comp) {
            return ae_response(false, "Please open and select an active composition.");
        }

        var textLayers = ae_getSelectedTextLayers(comp);
        if (textLayers.length === 0) {
            return ae_response(false, "Please select at least one text layer.");
        }

        app.beginUndoGroup("AE Case Master: Text Utility - " + utilityType);
        var count = 0;

        switch (utilityType) {
            case 'trim':
                for (var t = 0; t < textLayers.length; t++) {
                    var propTrim = textLayers[t].property("Source Text");
                    if (!propTrim) continue;
                    var docTrim = propTrim.value;
                    var lines = docTrim.text.split(/\r\n|\r|\n/);
                    for (var l = 0; l < lines.length; l++) {
                        lines[l] = lines[l].replace(/^\s+|\s+$/g, '').replace(/[ \t]+/g, ' ');
                    }
                    docTrim.text = lines.join('\r');
                    propTrim.setValue(docTrim);
                    count++;
                }
                app.endUndoGroup();
                return ae_response(true, "Trimmed spaces on " + count + " layer" + (count === 1 ? "" : "s") + ".", count);

            case 'removeBreaks':
                for (var rb = 0; rb < textLayers.length; rb++) {
                    var propRb = textLayers[rb].property("Source Text");
                    if (!propRb) continue;
                    var docRb = propRb.value;
                    docRb.text = docRb.text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
                    propRb.setValue(docRb);
                    count++;
                }
                app.endUndoGroup();
                return ae_response(true, "Removed line breaks on " + count + " layer" + (count === 1 ? "" : "s") + ".", count);

            case 'sortLines':
                for (var sl = 0; sl < textLayers.length; sl++) {
                    var propSl = textLayers[sl].property("Source Text");
                    if (!propSl) continue;
                    var docSl = propSl.value;
                    var slLines = docSl.text.split(/\r\n|\r|\n/);
                    slLines.sort(function (a, b) {
                        return a.toLowerCase().localeCompare ? a.toLowerCase().localeCompare(b.toLowerCase()) : (a.toLowerCase() > b.toLowerCase() ? 1 : -1);
                    });
                    docSl.text = slLines.join('\r');
                    propSl.setValue(docSl);
                    count++;
                }
                app.endUndoGroup();
                return ae_response(true, "Sorted lines on " + count + " layer" + (count === 1 ? "" : "s") + ".", count);

            case 'duplicateText':
                var duplicated = [];
                for (var dt = 0; dt < textLayers.length; dt++) {
                    var dupLayer = textLayers[dt].duplicate();
                    dupLayer.name = textLayers[dt].name + " Copy";
                    duplicated.push(dupLayer);
                    count++;
                }
                // Deselect old, select new duplicates
                for (var d0 = 0; d0 < textLayers.length; d0++) {
                    textLayers[d0].selected = false;
                }
                for (var d1 = 0; d1 < duplicated.length; d1++) {
                    duplicated[d1].selected = true;
                }
                app.endUndoGroup();
                return ae_response(true, "Duplicated " + count + " text layer" + (count === 1 ? "" : "s") + ".", count);

            case 'splitLines':
                var splitCreated = 0;
                for (var sp = 0; sp < textLayers.length; sp++) {
                    var origLayer = textLayers[sp];
                    var origProp = origLayer.property("Source Text");
                    if (!origProp) continue;
                    var origDoc = origProp.value;
                    var origLines = origDoc.text.split(/\r\n|\r|\n/);

                    // Filter empty lines if desired, or keep non-empty
                    var cleanLines = [];
                    for (var cl = 0; cl < origLines.length; cl++) {
                        if (origLines[cl].replace(/^\s+|\s+$/g, '').length > 0) {
                            cleanLines.push(origLines[cl]);
                        }
                    }

                    if (cleanLines.length <= 1) {
                        continue;
                    }

                    var leading = origDoc.leading;
                    if (!leading || leading <= 0) {
                        leading = origDoc.fontSize * 1.25;
                    }

                    var origPos = origLayer.transform.position.value;
                    var createdForThis = [];

                    for (var lineIdx = 0; lineIdx < cleanLines.length; lineIdx++) {
                        var newLineLayer = origLayer.duplicate();
                        var newDoc = newLineLayer.property("Source Text").value;
                        newDoc.text = cleanLines[lineIdx];
                        newLineLayer.property("Source Text").setValue(newDoc);
                        newLineLayer.name = cleanLines[lineIdx].substring(0, 30);

                        // Position offset along Y
                        var newY = origPos[1] + (lineIdx * leading);
                        var newPos = [origPos[0], newY];
                        if (origPos.length > 2) newPos.push(origPos[2]);
                        newLineLayer.transform.position.setValue(newPos);

                        createdForThis.push(newLineLayer);
                        splitCreated++;
                    }

                    // Hide original layer
                    origLayer.enabled = false;
                    origLayer.selected = false;

                    for (var sel = 0; sel < createdForThis.length; sel++) {
                        createdForThis[sel].selected = true;
                    }
                }

                app.endUndoGroup();
                if (splitCreated === 0) {
                    return ae_response(false, "Selected layer(s) have only 1 line; nothing to split.");
                }
                return ae_response(true, "Split text into " + splitCreated + " individual layers.", splitCreated);

            case 'mergeLines':
                if (textLayers.length < 2) {
                    app.endUndoGroup();
                    return ae_response(false, "Please select at least 2 text layers to merge.");
                }

                // Sort layers by vertical position
                textLayers.sort(function (la, lb) {
                    var posA = la.transform.position.value[1];
                    var posB = lb.transform.position.value[1];
                    return posA - posB;
                });

                var mergedLines = [];
                for (var ml = 0; ml < textLayers.length; ml++) {
                    var mProp = textLayers[ml].property("Source Text");
                    if (mProp) {
                        var mText = mProp.value.text;
                        if (mText && mText.length > 0) {
                            mergedLines.push(mText);
                        }
                    }
                }

                var targetLayer = textLayers[0];
                var targetDoc = targetLayer.property("Source Text").value;
                targetDoc.text = mergedLines.join('\r');
                targetLayer.property("Source Text").setValue(targetDoc);

                // Disable the other merged layers
                for (var del = 1; del < textLayers.length; del++) {
                    textLayers[del].enabled = false;
                    textLayers[del].selected = false;
                }
                targetLayer.selected = true;

                app.endUndoGroup();
                return ae_response(true, "Merged " + textLayers.length + " layers into 1 layer.", textLayers.length);

            default:
                app.endUndoGroup();
                return ae_response(false, "Unknown text utility: " + utilityType);
        }
    } catch (err) {
        return ae_response(false, "Error: " + err.toString());
    }
}

// -------------------------------------------------------------
// ALIGN & DISTRIBUTE
// -------------------------------------------------------------
function ae_getLayerVisualBounds(layer, compTime) {
    var pos = layer.transform.position.value;
    var anchor = layer.transform.anchorPoint.value;
    var scale = layer.transform.scale.value;
    var sX = scale[0] / 100;
    var sY = scale[1] / 100;

    var rect = null;
    try {
        rect = layer.sourceRectAtTime(compTime, false);
    } catch (e) {
        rect = null;
    }

    if (!rect || rect.width === 0 && rect.height === 0) {
        // Fallback for solids/footages without sourceRectAtTime or nulls
        var w = layer.width || 100;
        var h = layer.height || 100;
        rect = { left: 0, top: 0, width: w, height: h };
    }

    var left = pos[0] + (rect.left - anchor[0]) * sX;
    var right = pos[0] + (rect.left + rect.width - anchor[0]) * sX;
    var top = pos[1] + (rect.top - anchor[1]) * sY;
    var bottom = pos[1] + (rect.top + rect.height - anchor[1]) * sY;

    var actualLeft = Math.min(left, right);
    var actualRight = Math.max(left, right);
    var actualTop = Math.min(top, bottom);
    var actualBottom = Math.max(top, bottom);

    return {
        layer: layer,
        left: actualLeft,
        right: actualRight,
        top: actualTop,
        bottom: actualBottom,
        centerX: (actualLeft + actualRight) / 2,
        centerY: (actualTop + actualBottom) / 2,
        width: actualRight - actualLeft,
        height: actualBottom - actualTop,
        pos: pos,
        anchor: anchor,
        rect: rect,
        sX: sX,
        sY: sY
    };
}

function aeCaseMaster_alignLayers(alignType) {
    try {
        var comp = ae_getActiveComp();
        if (!comp) {
            return ae_response(false, "Please open and select an active composition.");
        }

        var sel = comp.selectedLayers;
        if (sel.length === 0) {
            return ae_response(false, "Please select at least one layer to align.");
        }

        app.beginUndoGroup("AE Case Master: Align " + alignType.toUpperCase());

        var bounds = [];
        for (var i = 0; i < sel.length; i++) {
            bounds.push(ae_getLayerVisualBounds(sel[i], comp.time));
        }

        var isSingle = sel.length === 1;

        if (alignType === 'left') {
            var targetLeft = isSingle ? 0 : bounds[0].left;
            if (!isSingle) {
                for (var j = 1; j < bounds.length; j++) {
                    if (bounds[j].left < targetLeft) targetLeft = bounds[j].left;
                }
            }
            for (var k = 0; k < bounds.length; k++) {
                var b = bounds[k];
                var deltaX = targetLeft - b.left;
                var p = b.pos;
                b.layer.transform.position.setValue([p[0] + deltaX, p[1], p.length > 2 ? p[2] : 0]);
            }
        } else if (alignType === 'center') {
            var targetCenterX = isSingle ? (comp.width / 2) : 0;
            if (!isSingle) {
                var minL = bounds[0].left, maxR = bounds[0].right;
                for (var c = 1; c < bounds.length; c++) {
                    if (bounds[c].left < minL) minL = bounds[c].left;
                    if (bounds[c].right > maxR) maxR = bounds[c].right;
                }
                targetCenterX = (minL + maxR) / 2;
            }
            for (var c1 = 0; c1 < bounds.length; c1++) {
                var bc = bounds[c1];
                var deltaXc = targetCenterX - bc.centerX;
                var pc = bc.pos;
                bc.layer.transform.position.setValue([pc[0] + deltaXc, pc[1], pc.length > 2 ? pc[2] : 0]);
            }
        } else if (alignType === 'right') {
            var targetRight = isSingle ? comp.width : bounds[0].right;
            if (!isSingle) {
                for (var r = 1; r < bounds.length; r++) {
                    if (bounds[r].right > targetRight) targetRight = bounds[r].right;
                }
            }
            for (var r1 = 0; r1 < bounds.length; r1++) {
                var br = bounds[r1];
                var deltaXr = targetRight - br.right;
                var pr = br.pos;
                br.layer.transform.position.setValue([pr[0] + deltaXr, pr[1], pr.length > 2 ? pr[2] : 0]);
            }
        } else if (alignType === 'top') {
            var targetTop = isSingle ? 0 : bounds[0].top;
            if (!isSingle) {
                for (var tp = 1; tp < bounds.length; tp++) {
                    if (bounds[tp].top < targetTop) targetTop = bounds[tp].top;
                }
            }
            for (var tp1 = 0; tp1 < bounds.length; tp1++) {
                var bt = bounds[tp1];
                var deltaYt = targetTop - bt.top;
                var pt = bt.pos;
                bt.layer.transform.position.setValue([pt[0], pt[1] + deltaYt, pt.length > 2 ? pt[2] : 0]);
            }
        } else if (alignType === 'middle') {
            var targetCenterY = isSingle ? (comp.height / 2) : 0;
            if (!isSingle) {
                var minT = bounds[0].top, maxB = bounds[0].bottom;
                for (var m = 1; m < bounds.length; m++) {
                    if (bounds[m].top < minT) minT = bounds[m].top;
                    if (bounds[m].bottom > maxB) maxB = bounds[m].bottom;
                }
                targetCenterY = (minT + maxB) / 2;
            }
            for (var m1 = 0; m1 < bounds.length; m1++) {
                var bm = bounds[m1];
                var deltaYm = targetCenterY - bm.centerY;
                var pm = bm.pos;
                bm.layer.transform.position.setValue([pm[0], pm[1] + deltaYm, pm.length > 2 ? pm[2] : 0]);
            }
        } else if (alignType === 'bottom') {
            var targetBottom = isSingle ? comp.height : bounds[0].bottom;
            if (!isSingle) {
                for (var btm = 1; btm < bounds.length; btm++) {
                    if (bounds[btm].bottom > targetBottom) targetBottom = bounds[btm].bottom;
                }
            }
            for (var btm1 = 0; btm1 < bounds.length; btm1++) {
                var bb = bounds[btm1];
                var deltaYb = targetBottom - bb.bottom;
                var pb = bb.pos;
                bb.layer.transform.position.setValue([pb[0], pb[1] + deltaYb, pb.length > 2 ? pb[2] : 0]);
            }
        } else if (alignType === 'justify') {
            if (sel.length < 3) {
                app.endUndoGroup();
                return ae_response(false, "Justify / Distribute requires at least 3 selected layers.");
            }

            // Sort layers left to right
            bounds.sort(function (a, b) {
                return a.centerX - b.centerX;
            });

            var firstCenterX = bounds[0].centerX;
            var lastCenterX = bounds[bounds.length - 1].centerX;
            var totalSpan = lastCenterX - firstCenterX;
            var step = totalSpan / (bounds.length - 1);

            for (var jIdx = 1; jIdx < bounds.length - 1; jIdx++) {
                var desiredCenter = firstCenterX + (jIdx * step);
                var bj = bounds[jIdx];
                var dX = desiredCenter - bj.centerX;
                var pj = bj.pos;
                bj.layer.transform.position.setValue([pj[0] + dX, pj[1], pj.length > 2 ? pj[2] : 0]);
            }
        }

        app.endUndoGroup();
        return ae_response(true, "Aligned " + sel.length + " layer" + (sel.length === 1 ? "" : "s") + " to " + alignType.toUpperCase() + ".", sel.length);
    } catch (err) {
        return ae_response(false, "Error: " + err.toString());
    }
}

// -------------------------------------------------------------
// QUICK ACTIONS
// -------------------------------------------------------------
function aeCaseMaster_quickAction(actionType, extraParamsJson) {
    try {
        var comp = ae_getActiveComp();
        if (!comp) {
            return ae_response(false, "Please open and select an active composition.");
        }

        var params = {};
        if (extraParamsJson) {
            try { params = JSON.parse(extraParamsJson); } catch (e) {}
        }

        switch (actionType) {
            case 'selectAllText':
                app.beginUndoGroup("AE Case Master: Select All Text Layers");
                var textCount = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    var l = comp.layer(i);
                    if (l instanceof TextLayer) {
                        l.selected = true;
                        textCount++;
                    } else {
                        l.selected = false;
                    }
                }
                app.endUndoGroup();
                if (textCount === 0) {
                    return ae_response(false, "No text layers found in this composition.");
                }
                return ae_response(true, "Selected all " + textCount + " text layer" + (textCount === 1 ? "" : "s") + ".", textCount);

            case 'centerAnchor':
                var selLayers = comp.selectedLayers;
                if (selLayers.length === 0) {
                    return ae_response(false, "Please select at least one layer.");
                }

                app.beginUndoGroup("AE Case Master: Center Anchor Point");
                var centeredCount = 0;

                for (var c = 0; c < selLayers.length; c++) {
                    var targetLayer = selLayers[c];
                    try {
                        var rect = targetLayer.sourceRectAtTime(comp.time, false);
                        var curAnchor = targetLayer.transform.anchorPoint.value;
                        var curPos = targetLayer.transform.position.value;
                        var curScale = targetLayer.transform.scale.value;
                        var scaleX = curScale[0] / 100;
                        var scaleY = curScale[1] / 100;

                        var newAnchorX = rect.left + rect.width / 2;
                        var newAnchorY = rect.top + rect.height / 2;

                        var moveX = (newAnchorX - curAnchor[0]) * scaleX;
                        var moveY = (newAnchorY - curAnchor[1]) * scaleY;

                        var newAnchor = [newAnchorX, newAnchorY];
                        if (curAnchor.length > 2) newAnchor.push(curAnchor[2]);

                        var newPos = [curPos[0] + moveX, curPos[1] + moveY];
                        if (curPos.length > 2) newPos.push(curPos[2]);

                        targetLayer.transform.anchorPoint.setValue(newAnchor);
                        targetLayer.transform.position.setValue(newPos);
                        centeredCount++;
                    } catch (e) {
                        // Some layer types might not support sourceRectAtTime
                    }
                }

                app.endUndoGroup();
                return ae_response(true, "Centered anchor point for " + centeredCount + " layer" + (centeredCount === 1 ? "" : "s") + ".", centeredCount);

            case 'resetTransform':
                var resetLayers = comp.selectedLayers;
                if (resetLayers.length === 0) {
                    return ae_response(false, "Please select at least one layer to reset.");
                }

                app.beginUndoGroup("AE Case Master: Reset Transform");
                var resetCount = 0;

                for (var r = 0; r < resetLayers.length; r++) {
                    var rLayer = resetLayers[r];
                    try {
                        // Reset anchor point to visual center
                        var rRect = rLayer.sourceRectAtTime(comp.time, false);
                        var rAnchor = [rRect.left + rRect.width / 2, rRect.top + rRect.height / 2];
                        if (rLayer.transform.anchorPoint.value.length > 2) rAnchor.push(0);
                        rLayer.transform.anchorPoint.setValue(rAnchor);
                    } catch (e) {}

                    // Reset position to center of composition
                    var centerPos = [comp.width / 2, comp.height / 2];
                    if (rLayer.transform.position.value.length > 2) centerPos.push(0);
                    rLayer.transform.position.setValue(centerPos);

                    // Reset Scale
                    rLayer.transform.scale.setValue([100, 100, 100]);

                    // Reset Rotation
                    if (rLayer.transform.rotation) {
                        rLayer.transform.rotation.setValue(0);
                    }

                    // Reset Opacity
                    if (rLayer.transform.opacity) {
                        rLayer.transform.opacity.setValue(100);
                    }
                    resetCount++;
                }

                app.endUndoGroup();
                return ae_response(true, "Reset transforms for " + resetCount + " layer" + (resetCount === 1 ? "" : "s") + ".", resetCount);

            case 'renameLayers':
                var renLayers = comp.selectedLayers;
                if (renLayers.length === 0) {
                    return ae_response(false, "Please select at least one layer to rename.");
                }

                app.beginUndoGroup("AE Case Master: Rename Layers");
                var renCount = 0;
                var mode = params.mode || 'toText'; // 'toText', 'prefix', 'suffix', 'replace', 'sequence'

                for (var rn = 0; rn < renLayers.length; rn++) {
                    var rnLayer = renLayers[rn];
                    if (mode === 'toText') {
                        if (rnLayer instanceof TextLayer) {
                            var textVal = rnLayer.property("Source Text").value.text;
                            if (textVal && textVal.length > 0) {
                                var cleanName = textVal.replace(/[\r\n]+/g, ' ').replace(/^\s+|\s+$/g, '');
                                if (cleanName.length > 35) cleanName = cleanName.substring(0, 35) + '...';
                                rnLayer.name = cleanName;
                                renCount++;
                            }
                        }
                    } else if (mode === 'prefix') {
                        rnLayer.name = (params.prefix || '') + rnLayer.name;
                        renCount++;
                    } else if (mode === 'suffix') {
                        rnLayer.name = rnLayer.name + (params.suffix || '');
                        renCount++;
                    } else if (mode === 'replace') {
                        if (params.findText) {
                            rnLayer.name = rnLayer.name.split(params.findText).join(params.replaceText || '');
                            renCount++;
                        }
                    } else if (mode === 'sequence') {
                        var base = params.baseName || "Layer";
                        var num = (rn + 1);
                        var pad = num < 10 ? ("0" + num) : ("" + num);
                        rnLayer.name = base + "_" + pad;
                        renCount++;
                    }
                }

                app.endUndoGroup();
                return ae_response(true, "Renamed " + renCount + " layer" + (renCount === 1 ? "" : "s") + ".", renCount);

            default:
                return ae_response(false, "Unknown quick action: " + actionType);
        }
    } catch (err) {
        return ae_response(false, "Error: " + err.toString());
    }
}

// -------------------------------------------------------------
// Open External URL in Browser (Chrome preferred, default fallback)
// -------------------------------------------------------------
function ae_openURL(url) {
    try {
        if (!url) return ae_response(false, "No URL provided");
        if ($.os.indexOf("Windows") !== -1) {
            system.callSystem('cmd.exe /c start "" "' + url + '"');
        } else {
            system.callSystem('open "' + url + '"');
        }
        return ae_response(true, "URL opened successfully");
    } catch (e) {
        return ae_response(false, "Failed to open URL: " + e.toString());
    }
}

