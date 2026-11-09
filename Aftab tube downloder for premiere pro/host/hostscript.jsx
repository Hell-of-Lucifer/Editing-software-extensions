/**
 * Aftab Tube Downloder - ExtendScript Host Engine
 * Dedicated for Adobe Premiere Pro CC & CS6 (all versions through CC 2026+)
 * With dual-engine fallback support for Adobe After Effects
 * Author: Aftab Musrraf
 * Strict ES3 compliant (No ES6 syntax)
 */

(function () {
    // Global namespace
    if (typeof $aftabTube === "undefined") {
        $aftabTube = {};
    }

    // Built-in lightweight ES3 JSON serializer
    $aftabTube.JSON = {
        parse: function (s) {
            try {
                return eval("(" + s + ")");
            } catch (e) {
                return null;
            }
        },
        stringify: function (v) {
            var t = typeof v;
            if (v === null) return "null";
            if (t === "number" || t === "boolean") return String(v);
            if (t === "string") {
                return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
            }
            if (v instanceof Array) {
                var arr = [];
                for (var i = 0; i < v.length; i++) {
                    arr.push($aftabTube.JSON.stringify(v[i]));
                }
                return "[" + arr.join(",") + "]";
            }
            if (t === "object") {
                var obj = [];
                for (var k in v) {
                    if (v.hasOwnProperty(k)) {
                        obj.push('"' + k + '":' + $aftabTube.JSON.stringify(v[k]));
                    }
                }
                return "{" + obj.join(",") + "}";
            }
            return '""';
        }
    };

    /**
     * Check if currently running inside Adobe Premiere Pro
     */
    function isPremiere() {
        try {
            if (typeof BridgeTalk !== "undefined" && BridgeTalk.appName) {
                var bn = BridgeTalk.appName.toLowerCase();
                if (bn.indexOf("premiere") !== -1) return true;
            }
            if (typeof app !== "undefined" && app.name) {
                if (app.name.toLowerCase().indexOf("premiere") !== -1) return true;
            }
            if (typeof app !== "undefined" && app.project && typeof app.project.importFiles === "function") {
                return true;
            }
        } catch (e) {}
        return false;
    }

    /**
     * Helper: Recursively search for a ProjectItem in Premiere Pro
     */
    function findPProProjectItem(parentBin, absPath, fileName) {
        if (!parentBin || !parentBin.children) return null;
        var cleanTarget = absPath.toLowerCase().replace(/\\/g, "/");
        var cleanFile = fileName.toLowerCase();

        var count = parentBin.children.numItems;
        for (var i = 0; i < count; i++) {
            var item = parentBin.children[i];
            if (!item) continue;

            // 1. Check getMediaPath() if available
            try {
                if (item.getMediaPath && typeof item.getMediaPath === "function") {
                    var mPath = item.getMediaPath();
                    if (mPath && mPath.toLowerCase().replace(/\\/g, "/") === cleanTarget) {
                        return item;
                    }
                }
            } catch (ePath) {}

            // 2. Check name
            try {
                if (item.name && item.name.toLowerCase() === cleanFile) {
                    return item;
                }
            } catch (eName) {}

            // 3. Recursive sub-bin search
            try {
                if (item.children && item.children.numItems > 0) {
                    var sub = findPProProjectItem(item, absPath, fileName);
                    if (sub) return sub;
                }
            } catch (eSub) {}
        }
        return null;
    }

    /**
     * Get host environment diagnostics
     */
    $aftabTube.getHostInfo = function () {
        try {
            if (isPremiere()) {
                var hasProj = false;
                var activeSeqName = null;
                try {
                    if (app && app.project && app.project.rootItem) {
                        hasProj = true;
                        if (app.project.activeSequence) {
                            activeSeqName = app.project.activeSequence.name;
                        }
                    }
                } catch (pe) {}

                return $aftabTube.JSON.stringify({
                    success: true,
                    appId: "PPRO",
                    appName: "Adobe Premiere Pro",
                    appVersion: app.version || "Unknown",
                    hasProject: hasProj,
                    activeSequence: activeSeqName,
                    activeComp: null
                });
            } else {
                // After Effects
                var hasAeProj = (app && app.project) ? true : false;
                var activeCompName = null;
                if (hasAeProj && app.project.activeItem && (typeof CompItem !== "undefined") && (app.project.activeItem instanceof CompItem)) {
                    activeCompName = app.project.activeItem.name;
                }
                return $aftabTube.JSON.stringify({
                    success: true,
                    appId: "AEFT",
                    appName: "Adobe After Effects",
                    appVersion: app.version || "Unknown",
                    hasProject: hasAeProj,
                    activeSequence: null,
                    activeComp: activeCompName
                });
            }
        } catch (err) {
            return $aftabTube.JSON.stringify({
                success: false,
                error: err.toString()
            });
        }
    };

    /**
     * Import downloaded media file into host (Premiere Pro or After Effects)
     * @param {string} filePath - Absolute path to downloaded video/audio
     * @param {boolean} addToTimeline - Whether to insert into current active sequence/comp
     */
    $aftabTube.importMediaFile = function (filePath, addToTimeline) {
        if (!filePath) {
            return $aftabTube.JSON.stringify({
                success: false,
                error: "No file path provided."
            });
        }

        // Normalize path separators
        var normalizedPath = filePath.replace(/\\\\/g, "/").replace(/\\/g, "/");
        var targetFile = new File(normalizedPath);

        if (!targetFile.exists) {
            return $aftabTube.JSON.stringify({
                success: false,
                error: "Target file does not exist on disk: " + normalizedPath
            });
        }

        // ==========================================
        // 1. ADOBE PREMIERE PRO ENGINE
        // ==========================================
        if (isPremiere()) {
            try {
                if (!app.project || !app.project.rootItem) {
                    return $aftabTube.JSON.stringify({
                        success: false,
                        error: "No active Premiere Pro project found. Please open or create a project first."
                    });
                }

                // Determine destination bin (current user insertion bin or project root)
                var targetBin = null;
                if (app.project.getInsertionBin && typeof app.project.getInsertionBin === "function") {
                    try {
                        targetBin = app.project.getInsertionBin();
                    } catch (bErr) {}
                }
                if (!targetBin || !targetBin.children) {
                    targetBin = app.project.rootItem;
                }

                // Import file into Premiere Pro project
                var filesToImport = [targetFile.fsName];
                var importSuccess = false;
                try {
                    importSuccess = app.project.importFiles(filesToImport, true, targetBin, false);
                } catch (eImp) {
                    try {
                        importSuccess = app.project.importFiles([normalizedPath], true, targetBin, false);
                    } catch (eImp2) {
                        return $aftabTube.JSON.stringify({
                            success: false,
                            error: "Premiere Pro import error: " + eImp2.toString()
                        });
                    }
                }

                // Locate the imported ProjectItem reference
                var fileNameOnly = targetFile.name;
                var importedItem = findPProProjectItem(targetBin, normalizedPath, fileNameOnly);
                if (!importedItem && targetBin !== app.project.rootItem) {
                    importedItem = findPProProjectItem(app.project.rootItem, normalizedPath, fileNameOnly);
                }

                var timelineAdded = false;
                var seqName = null;

                // If user requested to add to the Timeline
                if (addToTimeline && importedItem) {
                    var isAudio = (normalizedPath.search(/\.(mp3|wav|m4a|aac|flac|ogg)$/i) !== -1);
                    var activeSeq = app.project.activeSequence;

                    if (activeSeq) {
                        seqName = activeSeq.name;
                        var targetTime = 0.0;
                        try {
                            if (activeSeq.getPlayerPosition && typeof activeSeq.getPlayerPosition === "function") {
                                var playhead = activeSeq.getPlayerPosition();
                                if (playhead && typeof playhead.seconds !== "undefined") {
                                    targetTime = playhead.seconds;
                                }
                            }
                        } catch (tErr) {
                            targetTime = 0.0;
                        }

                        if (isAudio) {
                            // Insert audio clip into Audio Track 1
                            if (activeSeq.audioTracks && activeSeq.audioTracks.numTracks > 0) {
                                try {
                                    activeSeq.audioTracks[0].insertClip(importedItem, targetTime);
                                    timelineAdded = true;
                                } catch (aErr) {
                                    try {
                                        activeSeq.audioTracks[0].overwriteClip(importedItem, targetTime);
                                        timelineAdded = true;
                                    } catch (aErr2) {}
                                }
                            }
                        } else {
                            // Video file: insert into Video Track 1 (PPro links audio automatically to Audio Track 1)
                            if (activeSeq.videoTracks && activeSeq.videoTracks.numTracks > 0) {
                                try {
                                    activeSeq.videoTracks[0].insertClip(importedItem, targetTime);
                                    timelineAdded = true;
                                } catch (vErr) {
                                    try {
                                        activeSeq.videoTracks[0].overwriteClip(importedItem, targetTime);
                                        timelineAdded = true;
                                    } catch (vErr2) {}
                                }
                            } else if (activeSeq.audioTracks && activeSeq.audioTracks.numTracks > 0) {
                                try {
                                    activeSeq.audioTracks[0].insertClip(importedItem, targetTime);
                                    timelineAdded = true;
                                } catch (vaErr) {}
                            }
                        }
                    } else {
                        // If no active sequence is open, create a new sequence from the imported clip
                        if (!isAudio && app.project.createNewSequenceFromClips && typeof app.project.createNewSequenceFromClips === "function") {
                            try {
                                var cleanSeqName = fileNameOnly.replace(/\.[^\.]+$/, "");
                                var newSeq = app.project.createNewSequenceFromClips(cleanSeqName, [importedItem], targetBin);
                                if (newSeq) {
                                    timelineAdded = true;
                                    seqName = newSeq.name;
                                }
                            } catch (sErr) {}
                        }
                    }
                }

                var resolvedName = importedItem ? importedItem.name : fileNameOnly;
                var displayMsg = "";
                if (timelineAdded && seqName) {
                    displayMsg = "Imported '" + resolvedName + "' and added to sequence '" + seqName + "'.";
                } else {
                    displayMsg = "Imported '" + resolvedName + "' into Premiere Pro project.";
                }

                return $aftabTube.JSON.stringify({
                    success: true,
                    fileName: resolvedName,
                    timelineAdded: timelineAdded,
                    sequenceName: seqName,
                    message: displayMsg
                });

            } catch (ppErr) {
                return $aftabTube.JSON.stringify({
                    success: false,
                    error: "Premiere Pro Error: " + ppErr.toString()
                });
            }
        }

        // ==========================================
        // 2. ADOBE AFTER EFFECTS ENGINE (FALLBACK)
        // ==========================================
        if (typeof app.beginUndoGroup === "function") {
            app.beginUndoGroup("Aftab Tube: Import Media");
        }

        try {
            if (!app.project) {
                app.newProject();
            }

            var importOptions = new ImportOptions(targetFile);
            var importedAeItem = app.project.importFile(importOptions);
            if (!importedAeItem) {
                if (typeof app.endUndoGroup === "function") app.endUndoGroup();
                return $aftabTube.JSON.stringify({
                    success: false,
                    error: "After Effects failed to import the media file."
                });
            }

            var layerCreated = false;
            var compName = null;

            if (addToTimeline) {
                var targetComp = null;
                if (app.project.activeItem && (typeof CompItem !== "undefined") && (app.project.activeItem instanceof CompItem)) {
                    targetComp = app.project.activeItem;
                } else {
                    for (var cIdx = 1; cIdx <= app.project.numItems; cIdx++) {
                        if (typeof CompItem !== "undefined" && app.project.item(cIdx) instanceof CompItem) {
                            targetComp = app.project.item(cIdx);
                            break;
                        }
                    }
                }

                if (targetComp) {
                    compName = targetComp.name;
                    var layer = targetComp.layers.add(importedAeItem);
                    if (layer) {
                        layerCreated = true;
                        layer.startTime = targetComp.time;
                    }
                }
            }

            if (typeof app.endUndoGroup === "function") app.endUndoGroup();
            return $aftabTube.JSON.stringify({
                success: true,
                fileName: importedAeItem.name,
                timelineAdded: layerCreated,
                sequenceName: compName,
                compName: compName,
                message: layerCreated ?
                    ("Imported and added '" + importedAeItem.name + "' to '" + compName + "'.") :
                    ("Imported '" + importedAeItem.name + "' into Project.")
            });

        } catch (aeErr) {
            if (typeof app.endUndoGroup === "function") app.endUndoGroup();
            return $aftabTube.JSON.stringify({
                success: false,
                error: "ExtendScript Error: " + aeErr.toString()
            });
        }
    };

    /**
     * Create a brand new sequence / composition from imported footage
     */
    $aftabTube.createSequenceFromMedia = function (filePath) {
        return $aftabTube.importMediaFile(filePath, true);
    };

    $aftabTube.createCompFromFootage = function (filePath) {
        return $aftabTube.importMediaFile(filePath, true);
    };

})();
