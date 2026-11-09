/**
 * AE CASE MASTER - Standalone ScriptUI Dockable Panel
 * Created by Aftab Musrraf
 * Compatible with After Effects CS6 through CC 2026+
 * 
 * Can be installed in:
 * Windows: C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\
 * Mac: /Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/
 * Or executed directly via: File > Scripts > Run Script File...
 */

(function (thisObj) {
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "AE Case Master", undefined, { resizeable: true });
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 12;

        // Custom dark palette styling
        try {
            var darkBg = win.graphics.newBrush(win.graphics.BrushType.SOLID_COLOR, [0.04, 0.08, 0.13, 1]);
            win.graphics.backgroundColor = darkBg;
        } catch (e) { }

        // Header Title
        var titleGroup = win.add("group");
        titleGroup.orientation = "column";
        titleGroup.alignChildren = ["center", "center"];
        titleGroup.spacing = 2;

        var headerTxt = titleGroup.add("statictext", undefined, "AE CASE MASTER");
        try {
            headerTxt.graphics.foregroundColor = headerTxt.graphics.newPen(headerTxt.graphics.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
        } catch (e) { }

        var subTxt = titleGroup.add("statictext", undefined, "CREATED BY AFTAB MUSRRAF  •  PRO");
        try {
            subTxt.graphics.foregroundColor = subTxt.graphics.newPen(subTxt.graphics.PenType.SOLID_COLOR, [0.45, 0.58, 0.72, 1], 1);
        } catch (e) { }

        // Main Tabbed / Stacked Sections
        var mainTab = win.add("tabbedpanel");
        mainTab.alignChildren = ["fill", "fill"];

        // ==================== TAB 1: CASE TOOLS ====================
        var tabCase = mainTab.add("tab", undefined, "Case Tools");
        tabCase.orientation = "column";
        tabCase.alignChildren = ["fill", "top"];
        tabCase.spacing = 6;

        var caseDesc = tabCase.add("statictext", undefined, "Transform selected text layers:");
        try { caseDesc.graphics.foregroundColor = caseDesc.graphics.newPen(caseDesc.graphics.PenType.SOLID_COLOR, [0.6, 0.7, 0.8, 1], 1); } catch (e) { }

        var caseGrid1 = tabCase.add("group");
        caseGrid1.orientation = "row";
        caseGrid1.alignChildren = ["fill", "fill"];
        var btnSentence = caseGrid1.add("button", undefined, "Sc  Sentence Case");
        var btnLower = caseGrid1.add("button", undefined, "lc  lower case");
        var btnUpper = caseGrid1.add("button", undefined, "UC  UPPER CASE");

        var caseGrid2 = tabCase.add("group");
        caseGrid2.orientation = "row";
        caseGrid2.alignChildren = ["fill", "fill"];
        var btnAlt = caseGrid2.add("button", undefined, "aC  aLtErNaTiNg");
        var btnTitle = caseGrid2.add("button", undefined, "TC  Title Case");
        var btnInverse = caseGrid2.add("button", undefined, "iC  InVeRsE CaSe");

        // Wire Case Buttons
        btnSentence.onClick = function () { runCaseAction("sentence"); };
        btnLower.onClick = function () { runCaseAction("lower"); };
        btnUpper.onClick = function () { runCaseAction("upper"); };
        btnAlt.onClick = function () { runCaseAction("alternating"); };
        btnTitle.onClick = function () { runCaseAction("title"); };
        btnInverse.onClick = function () { runCaseAction("inverse"); };

        // ==================== TAB 2: TEXT UTILITIES ====================
        var tabUtils = mainTab.add("tab", undefined, "Text Utilities");
        tabUtils.orientation = "column";
        tabUtils.alignChildren = ["fill", "top"];
        tabUtils.spacing = 6;

        var utilGrid1 = tabUtils.add("group");
        utilGrid1.orientation = "row";
        utilGrid1.alignChildren = ["fill", "fill"];
        var btnTrim = utilGrid1.add("button", undefined, "Trim Spaces");
        var btnBreaks = utilGrid1.add("button", undefined, "Remove Breaks");
        var btnSplit = utilGrid1.add("button", undefined, "Split Lines");

        var utilGrid2 = tabUtils.add("group");
        utilGrid2.orientation = "row";
        utilGrid2.alignChildren = ["fill", "fill"];
        var btnMerge = utilGrid2.add("button", undefined, "Merge Lines");
        var btnDup = utilGrid2.add("button", undefined, "Duplicate Text");
        var btnSort = utilGrid2.add("button", undefined, "Sort Lines");

        btnTrim.onClick = function () { runUtilityAction("trim"); };
        btnBreaks.onClick = function () { runUtilityAction("removeBreaks"); };
        btnSplit.onClick = function () { runUtilityAction("splitLines"); };
        btnMerge.onClick = function () { runUtilityAction("mergeLines"); };
        btnDup.onClick = function () { runUtilityAction("duplicateText"); };
        btnSort.onClick = function () { runUtilityAction("sortLines"); };

        // ==================== TAB 3: ALIGN & DISTRIBUTE ====================
        var tabAlign = mainTab.add("tab", undefined, "Align & Distribute");
        tabAlign.orientation = "column";
        tabAlign.alignChildren = ["fill", "top"];
        tabAlign.spacing = 6;

        var alignRow1 = tabAlign.add("group");
        alignRow1.orientation = "row";
        alignRow1.alignChildren = ["fill", "fill"];
        var btnLeft = alignRow1.add("button", undefined, "LEFT");
        var btnCenter = alignRow1.add("button", undefined, "CENTER");
        var btnRight = alignRow1.add("button", undefined, "RIGHT");
        var btnJustify = alignRow1.add("button", undefined, "JUSTIFY");

        var alignRow2 = tabAlign.add("group");
        alignRow2.orientation = "row";
        alignRow2.alignChildren = ["fill", "fill"];
        var btnTop = alignRow2.add("button", undefined, "TOP");
        var btnMiddle = alignRow2.add("button", undefined, "MIDDLE");
        var btnBottom = alignRow2.add("button", undefined, "BOTTOM");

        btnLeft.onClick = function () { runAlignAction("left"); };
        btnCenter.onClick = function () { runAlignAction("center"); };
        btnRight.onClick = function () { runAlignAction("right"); };
        btnJustify.onClick = function () { runAlignAction("justify"); };
        btnTop.onClick = function () { runAlignAction("top"); };
        btnMiddle.onClick = function () { runAlignAction("middle"); };
        btnBottom.onClick = function () { runAlignAction("bottom"); };

        // ==================== TAB 4: QUICK ACTIONS ====================
        var tabQuick = mainTab.add("tab", undefined, "Quick Actions");
        tabQuick.orientation = "column";
        tabQuick.alignChildren = ["fill", "top"];
        tabQuick.spacing = 6;

        var btnSelectAll = tabQuick.add("button", undefined, "Select All Text Layers");
        var btnRename = tabQuick.add("button", undefined, "Rename Layers (to Text)");
        var btnAnchor = tabQuick.add("button", undefined, "Center Anchor Point");
        var btnReset = tabQuick.add("button", undefined, "Reset Transform");

        btnSelectAll.onClick = function () { runQuickAction("selectAllText"); };
        btnRename.onClick = function () { runQuickAction("renameLayers"); };
        btnAnchor.onClick = function () { runQuickAction("centerAnchor"); };
        btnReset.onClick = function () { runQuickAction("resetTransform"); };

        // Status Label and YouTube link at bottom
        var footerGroup = win.add("group");
        footerGroup.orientation = "row";
        footerGroup.alignment = ["fill", "bottom"];
        footerGroup.alignChildren = ["left", "center"];

        var statusTxt = footerGroup.add("statictext", undefined, "Ready");
        statusTxt.alignment = ["fill", "center"];
        try { statusTxt.graphics.foregroundColor = statusTxt.graphics.newPen(statusTxt.graphics.PenType.SOLID_COLOR, [0.5, 0.65, 0.8, 1], 1); } catch (e) { }

        var btnYT = footerGroup.add("button", undefined, "YouTube");
        btnYT.size = [80, 22];
        btnYT.alignment = ["right", "center"];
        btnYT.helpTip = "https://www.youtube.com/@AftabMusrraf";
        var lastYTClickTime = 0;
        btnYT.onClick = function () {
            var now = new Date().getTime();
            if (now - lastYTClickTime < 2000) {
                return;
            }
            lastYTClickTime = now;
            try {
                if ($.os.indexOf("Windows") !== -1) {
                    system.callSystem('cmd.exe /c start "" "https://www.youtube.com/@AftabMusrraf"');
                } else {
                    system.callSystem('open "https://www.youtube.com/@AftabMusrraf"');
                }
                setStatus("Opening YouTube: @AftabMusrraf");
            } catch (err) {
                setStatus("Error launching browser");
            }
        };

        function setStatus(msg) {
            statusTxt.text = msg;
        }

        // ==================== ENGINE FUNCTIONS ====================
        function getActiveComp() {
            var c = app.project ? app.project.activeItem : null;
            if (c && c instanceof CompItem) return c;
            alert("Please open and select an active composition.");
            return null;
        }

        function transformString(str, type) {
            if (!str) return str;
            if (type === "lower") return str.toLowerCase();
            if (type === "upper") return str.toUpperCase();
            if (type === "sentence") {
                return str.toLowerCase().replace(/(^\s*|[\.\?!]\s*|\n\s*|\r\s*)([a-z\u00C0-\u017F])/g, function (m, p, c) {
                    return p + c.toUpperCase();
                });
            }
            if (type === "title") {
                return str.toLowerCase().replace(/(^|[^\w\u00C0-\u017F])([a-z\u00C0-\u017F])/g, function (m, b, c) {
                    return b + c.toUpperCase();
                });
            }
            if (type === "alternating") {
                var res = "", cnt = 0;
                for (var i = 0; i < str.length; i++) {
                    var ch = str.charAt(i);
                    if (/[a-zA-Z\u00C0-\u017F]/.test(ch)) {
                        res += (cnt % 2 === 0) ? ch.toLowerCase() : ch.toUpperCase();
                        cnt++;
                    } else {
                        res += ch;
                    }
                }
                return res;
            }
            if (type === "inverse") {
                var inv = "";
                for (var j = 0; j < str.length; j++) {
                    var c = str.charAt(j);
                    inv += (c === c.toUpperCase()) ? c.toLowerCase() : c.toUpperCase();
                }
                return inv;
            }
            return str;
        }

        function runCaseAction(type) {
            var comp = getActiveComp();
            if (!comp) return;
            var sel = comp.selectedLayers;
            var textLayers = [];
            for (var i = 0; i < sel.length; i++) {
                if (sel[i] instanceof TextLayer) textLayers.push(sel[i]);
            }
            if (textLayers.length === 0) {
                alert("Please select at least one text layer.");
                return;
            }

            app.beginUndoGroup("AE Case Master: " + type);
            for (var t = 0; t < textLayers.length; t++) {
                var prop = textLayers[t].property("Source Text");
                if (!prop) continue;
                if (prop.numKeys > 0) {
                    for (var k = 1; k <= prop.numKeys; k++) {
                        var kd = prop.keyValue(k);
                        kd.text = transformString(kd.text, type);
                        prop.setValueAtKey(k, kd);
                    }
                } else {
                    var doc = prop.value;
                    doc.text = transformString(doc.text, type);
                    prop.setValue(doc);
                }
            }
            app.endUndoGroup();
            setStatus("Applied " + type + " case to " + textLayers.length + " layer(s).");
        }

        function runUtilityAction(type) {
            var comp = getActiveComp();
            if (!comp) return;
            var sel = comp.selectedLayers;
            var textLayers = [];
            for (var i = 0; i < sel.length; i++) {
                if (sel[i] instanceof TextLayer) textLayers.push(sel[i]);
            }
            if (textLayers.length === 0) {
                alert("Please select at least one text layer.");
                return;
            }

            app.beginUndoGroup("AE Case Master: " + type);
            if (type === "trim") {
                for (var t = 0; t < textLayers.length; t++) {
                    var p = textLayers[t].property("Source Text");
                    var d = p.value;
                    var lines = d.text.split(/\r\n|\r|\n/);
                    for (var l = 0; l < lines.length; l++) {
                        lines[l] = lines[l].replace(/^\s+|\s+$/g, '').replace(/[ \t]+/g, ' ');
                    }
                    d.text = lines.join('\r');
                    p.setValue(d);
                }
                setStatus("Trimmed spaces on " + textLayers.length + " layer(s).");
            } else if (type === "removeBreaks") {
                for (var r = 0; r < textLayers.length; r++) {
                    var pr = textLayers[r].property("Source Text");
                    var dr = pr.value;
                    dr.text = dr.text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
                    pr.setValue(dr);
                }
                setStatus("Removed breaks on " + textLayers.length + " layer(s).");
            } else if (type === "sortLines") {
                for (var s = 0; s < textLayers.length; s++) {
                    var ps = textLayers[s].property("Source Text");
                    var ds = ps.value;
                    var sLines = ds.text.split(/\r\n|\r|\n/);
                    sLines.sort();
                    ds.text = sLines.join('\r');
                    ps.setValue(ds);
                }
                setStatus("Sorted lines on " + textLayers.length + " layer(s).");
            } else if (type === "duplicateText") {
                for (var d0 = 0; d0 < textLayers.length; d0++) {
                    var dup = textLayers[d0].duplicate();
                    dup.name = textLayers[d0].name + " Copy";
                }
                setStatus("Duplicated " + textLayers.length + " layer(s).");
            } else if (type === "splitLines") {
                for (var sp = 0; sp < textLayers.length; sp++) {
                    var lay = textLayers[sp];
                    var ldoc = lay.property("Source Text").value;
                    var lLines = ldoc.text.split(/\r\n|\r|\n/);
                    var clean = [];
                    for (var c = 0; c < lLines.length; c++) {
                        if (lLines[c].replace(/^\s+|\s+$/g, '').length > 0) clean.push(lLines[c]);
                    }
                    if (clean.length <= 1) continue;
                    var lead = ldoc.leading > 0 ? ldoc.leading : (ldoc.fontSize * 1.25);
                    var pos = lay.transform.position.value;
                    for (var idx = 0; idx < clean.length; idx++) {
                        var nLay = lay.duplicate();
                        var nDoc = nLay.property("Source Text").value;
                        nDoc.text = clean[idx];
                        nLay.property("Source Text").setValue(nDoc);
                        nLay.name = clean[idx].substring(0, 30);
                        nLay.transform.position.setValue([pos[0], pos[1] + (idx * lead)]);
                    }
                    lay.enabled = false;
                }
                setStatus("Split text into individual lines.");
            } else if (type === "mergeLines") {
                if (textLayers.length < 2) {
                    alert("Please select at least 2 text layers to merge.");
                    app.endUndoGroup();
                    return;
                }
                var mLines = [];
                for (var m = 0; m < textLayers.length; m++) {
                    mLines.push(textLayers[m].property("Source Text").value.text);
                    if (m > 0) textLayers[m].enabled = false;
                }
                var firstDoc = textLayers[0].property("Source Text").value;
                firstDoc.text = mLines.join('\r');
                textLayers[0].property("Source Text").setValue(firstDoc);
                setStatus("Merged " + textLayers.length + " layers.");
            }
            app.endUndoGroup();
        }

        function runAlignAction(type) {
            var comp = getActiveComp();
            if (!comp) return;
            var sel = comp.selectedLayers;
            if (sel.length === 0) {
                alert("Please select layers to align.");
                return;
            }

            app.beginUndoGroup("AE Case Master: Align " + type);
            var bounds = [];
            for (var i = 0; i < sel.length; i++) {
                var lay = sel[i];
                var p = lay.transform.position.value;
                var a = lay.transform.anchorPoint.value;
                var s = lay.transform.scale.value;
                var sx = s[0] / 100, sy = s[1] / 100;
                var rect = { left: 0, top: 0, width: lay.width || 100, height: lay.height || 100 };
                try {
                    var r = lay.sourceRectAtTime(comp.time, false);
                    if (r && (r.width > 0 || r.height > 0)) rect = r;
                } catch (e) { }

                var l = p[0] + (rect.left - a[0]) * sx;
                var rgt = p[0] + (rect.left + rect.width - a[0]) * sx;
                var tp = p[1] + (rect.top - a[1]) * sy;
                var btm = p[1] + (rect.top + rect.height - a[1]) * sy;
                var curL = Math.min(l, rgt), curR = Math.max(l, rgt);
                var curT = Math.min(tp, btm), curB = Math.max(tp, btm);

                bounds.push({
                    layer: lay, left: curL, right: curR, top: curT, bottom: curB,
                    centerX: (curL + curR) / 2, centerY: (curT + curB) / 2, pos: p
                });
            }

            var single = sel.length === 1;
            if (type === "left") {
                var tgtL = single ? 0 : bounds[0].left;
                if (!single) for (var j = 1; j < bounds.length; j++) if (bounds[j].left < tgtL) tgtL = bounds[j].left;
                for (var k = 0; k < bounds.length; k++) {
                    var b = bounds[k];
                    b.layer.transform.position.setValue([b.pos[0] + (tgtL - b.left), b.pos[1]]);
                }
            } else if (type === "center") {
                var tgtC = single ? (comp.width / 2) : 0;
                if (!single) {
                    var minL = bounds[0].left, maxR = bounds[0].right;
                    for (var c0 = 1; c0 < bounds.length; c0++) {
                        if (bounds[c0].left < minL) minL = bounds[c0].left;
                        if (bounds[c0].right > maxR) maxR = bounds[c0].right;
                    }
                    tgtC = (minL + maxR) / 2;
                }
                for (var c1 = 0; c1 < bounds.length; c1++) {
                    var bc = bounds[c1];
                    bc.layer.transform.position.setValue([bc.pos[0] + (tgtC - bc.centerX), bc.pos[1]]);
                }
            } else if (type === "right") {
                var tgtR = single ? comp.width : bounds[0].right;
                if (!single) for (var r0 = 1; r0 < bounds.length; r0++) if (bounds[r0].right > tgtR) tgtR = bounds[r0].right;
                for (var r1 = 0; r1 < bounds.length; r1++) {
                    var br = bounds[r1];
                    br.layer.transform.position.setValue([br.pos[0] + (tgtR - br.right), br.pos[1]]);
                }
            } else if (type === "top") {
                var tgtT = single ? 0 : bounds[0].top;
                if (!single) for (var t0 = 1; t0 < bounds.length; t0++) if (bounds[t0].top < tgtT) tgtT = bounds[t0].top;
                for (var t1 = 0; t1 < bounds.length; t1++) {
                    var bt = bounds[t1];
                    bt.layer.transform.position.setValue([bt.pos[0], bt.pos[1] + (tgtT - bt.top)]);
                }
            } else if (type === "middle") {
                var tgtM = single ? (comp.height / 2) : 0;
                if (!single) {
                    var minT = bounds[0].top, maxB = bounds[0].bottom;
                    for (var m0 = 1; m0 < bounds.length; m0++) {
                        if (bounds[m0].top < minT) minT = bounds[m0].top;
                        if (bounds[m0].bottom > maxB) maxB = bounds[m0].bottom;
                    }
                    tgtM = (minT + maxB) / 2;
                }
                for (var m1 = 0; m1 < bounds.length; m1++) {
                    var bm = bounds[m1];
                    bm.layer.transform.position.setValue([bm.pos[0], bm.pos[1] + (tgtM - bm.centerY)]);
                }
            } else if (type === "bottom") {
                var tgtB = single ? comp.height : bounds[0].bottom;
                if (!single) for (var b0 = 1; b0 < bounds.length; b0++) if (bounds[b0].bottom > tgtB) tgtB = bounds[b0].bottom;
                for (var b1 = 0; b1 < bounds.length; b1++) {
                    var bb = bounds[b1];
                    bb.layer.transform.position.setValue([bb.pos[0], bb.pos[1] + (tgtB - bb.bottom)]);
                }
            } else if (type === "justify") {
                if (sel.length >= 3) {
                    bounds.sort(function (a, b) { return a.centerX - b.centerX; });
                    var fX = bounds[0].centerX, lX = bounds[bounds.length - 1].centerX;
                    var stp = (lX - fX) / (bounds.length - 1);
                    for (var jx = 1; jx < bounds.length - 1; jx++) {
                        var dCenter = fX + (jx * stp);
                        var bObj = bounds[jx];
                        bObj.layer.transform.position.setValue([bObj.pos[0] + (dCenter - bObj.centerX), bObj.pos[1]]);
                    }
                }
            }
            app.endUndoGroup();
            setStatus("Aligned " + sel.length + " layer(s) to " + type.toUpperCase() + ".");
        }

        function runQuickAction(type) {
            var comp = getActiveComp();
            if (!comp) return;

            app.beginUndoGroup("AE Case Master: " + type);
            if (type === "selectAllText") {
                var tCnt = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    var lay = comp.layer(i);
                    if (lay instanceof TextLayer) {
                        lay.selected = true;
                        tCnt++;
                    } else {
                        lay.selected = false;
                    }
                }
                setStatus("Selected " + tCnt + " text layer(s).");
            } else if (type === "centerAnchor") {
                var s = comp.selectedLayers;
                for (var a = 0; a < s.length; a++) {
                    var l = s[a];
                    try {
                        var r = l.sourceRectAtTime(comp.time, false);
                        var oldA = l.transform.anchorPoint.value;
                        var oldP = l.transform.position.value;
                        var sc = l.transform.scale.value;
                        var nAX = r.left + r.width / 2;
                        var nAY = r.top + r.height / 2;
                        var dX = (nAX - oldA[0]) * (sc[0] / 100);
                        var dY = (nAY - oldA[1]) * (sc[1] / 100);
                        l.transform.anchorPoint.setValue([nAX, nAY]);
                        l.transform.position.setValue([oldP[0] + dX, oldP[1] + dY]);
                    } catch (e) { }
                }
                setStatus("Centered anchor point for " + s.length + " layer(s).");
            } else if (type === "resetTransform") {
                var rs = comp.selectedLayers;
                for (var r = 0; r < rs.length; r++) {
                    var rLay = rs[r];
                    rLay.transform.position.setValue([comp.width / 2, comp.height / 2]);
                    rLay.transform.scale.setValue([100, 100, 100]);
                    if (rLay.transform.rotation) rLay.transform.rotation.setValue(0);
                    if (rLay.transform.opacity) rLay.transform.opacity.setValue(100);
                }
                setStatus("Reset transforms for " + rs.length + " layer(s).");
            } else if (type === "renameLayers") {
                var rn = comp.selectedLayers;
                for (var n = 0; n < rn.length; n++) {
                    if (rn[n] instanceof TextLayer) {
                        var txt = rn[n].property("Source Text").value.text;
                        if (txt) {
                            var cleanName = txt.replace(/[\r\n]+/g, ' ').substring(0, 30);
                            rn[n].name = cleanName;
                        }
                    }
                }
                setStatus("Renamed " + rn.length + " layer(s) to text content.");
            }
            app.endUndoGroup();
        }

        win.layout.layout(true);
        return win;
    }

    var aePanel = buildUI(thisObj);
    if (aePanel instanceof Window) {
        aePanel.center();
        aePanel.show();
    }
})(this);
