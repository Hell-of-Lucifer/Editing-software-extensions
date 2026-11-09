/**
 * Aftab Tube Downloder - ExtendScript Host Engine
 * Compatible with Adobe After Effects CS6 through CC 2026+ (ES3 Strict Mode)
 * Author: Aftab Musrraf
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
     * Get host environment diagnostics
     */
    $aftabTube.getHostInfo = function () {
        try {
            var hasProj = (app && app.project) ? true : false;
            var activeCompName = null;
            if (hasProj && app.project.activeItem && (app.project.activeItem instanceof CompItem)) {
                activeCompName = app.project.activeItem.name;
            }
            var info = {
                success: true,
                appName: app.appName,
                appVersion: app.version,
                hasProject: hasProj,
                activeComp: activeCompName
            };
            return $aftabTube.JSON.stringify(info);
        } catch (err) {
            return $aftabTube.JSON.stringify({
                success: false,
                error: err.toString()
            });
        }
    };

    /**
     * Import downloaded media file into After Effects
     * @param {string} filePath - Absolute path to downloaded video/audio
     * @param {boolean} addToActiveComp - Whether to insert into current active comp
     */
    $aftabTube.importMediaFile = function (filePath, addToActiveComp) {
        app.beginUndoGroup("Aftab Tube: Import Media");
        try {
            if (!filePath) {
                app.endUndoGroup();
                return $aftabTube.JSON.stringify({
                    success: false,
                    error: "No file path provided."
                });
            }

            // Normalize path separators
            var normalizedPath = filePath.replace(/\\\\/g, "/").replace(/\\/g, "/");
            var targetFile = new File(normalizedPath);

            if (!targetFile.exists) {
                app.endUndoGroup();
                return $aftabTube.JSON.stringify({
                    success: false,
                    error: "Target file does not exist on disk: " + normalizedPath
                });
            }

            // Ensure project exists
            if (!app.project) {
                app.newProject();
            }

            // Import file as footage
            var importOptions = new ImportOptions(targetFile);
            if (!importOptions.canImportAs(ImportAsType.FOOTAGE)) {
                // If special type, try standard import
            }

            var importedItem = app.project.importFile(importOptions);
            if (!importedItem) {
                app.endUndoGroup();
                return $aftabTube.JSON.stringify({
                    success: false,
                    error: "After Effects failed to import the media file."
                });
            }

            var layerCreated = false;
            var compName = null;

            // If user requested to add to composition
            if (addToActiveComp) {
                var targetComp = null;
                if (app.project.activeItem && (app.project.activeItem instanceof CompItem)) {
                    targetComp = app.project.activeItem;
                } else {
                    // Fallback to first available composition in the project
                    for (var cIdx = 1; cIdx <= app.project.numItems; cIdx++) {
                        if (app.project.item(cIdx) instanceof CompItem) {
                            targetComp = app.project.item(cIdx);
                            break;
                        }
                    }
                }

                if (targetComp) {
                    compName = targetComp.name;
                    var layer = targetComp.layers.add(importedItem);
                    if (layer) {
                        layerCreated = true;
                        layer.startTime = targetComp.time;
                    }
                }
            }

            app.endUndoGroup();
            return $aftabTube.JSON.stringify({
                success: true,
                fileName: importedItem.name,
                itemId: importedItem.id,
                layerAdded: layerCreated,
                compName: compName,
                width: importedItem.width || 0,
                height: importedItem.height || 0,
                duration: importedItem.duration || 0,
                message: layerCreated ?
                    ("Imported and added '" + importedItem.name + "' to '" + compName + "'.") :
                    ("Imported '" + importedItem.name + "' into Project.")
            });

        } catch (err) {
            app.endUndoGroup();
            return $aftabTube.JSON.stringify({
                success: false,
                error: "ExtendScript Error: " + err.toString()
            });
        }
    };

    /**
     * Create a brand new composition from imported footage
     */
    $aftabTube.createCompFromFootage = function (filePath) {
        app.beginUndoGroup("Aftab Tube: New Comp From Media");
        try {
            var normalizedPath = filePath.replace(/\\\\/g, "/").replace(/\\/g, "/");
            var targetFile = new File(normalizedPath);
            if (!targetFile.exists) {
                app.endUndoGroup();
                return $aftabTube.JSON.stringify({ success: false, error: "File not found." });
            }
            if (!app.project) app.newProject();

            var importOptions = new ImportOptions(targetFile);
            var item = app.project.importFile(importOptions);

            var w = item.width > 0 ? item.width : 1920;
            var h = item.height > 0 ? item.height : 1080;
            var par = item.pixelAspect > 0 ? item.pixelAspect : 1.0;
            var dur = item.duration > 0 ? item.duration : 10.0;
            var fps = item.frameRate > 0 ? item.frameRate : 30.0;

            var comp = app.project.items.addComp(item.name + " Comp", w, h, par, dur, fps);
            comp.layers.add(item);
            comp.openInViewer();

            app.endUndoGroup();
            return $aftabTube.JSON.stringify({
                success: true,
                fileName: item.name,
                compName: comp.name
            });
        } catch (err) {
            app.endUndoGroup();
            return $aftabTube.JSON.stringify({ success: false, error: err.toString() });
        }
    };

})();
