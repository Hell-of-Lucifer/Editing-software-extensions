/**
 * CSInterface - Adobe CEP JavaScript Interface
 * Compatible with Adobe After Effects CS6 through CC 2026+ (CEP 5.0 - 12.0+)
 * Includes standalone browser fallback mock for simulation & development.
 * Author: Aftab Musrraf
 */

var CSInterface = function () {
    this.isInsideAE = (typeof window.__adobe_cep__ !== "undefined");
};

/**
 * System path constants
 */
CSInterface.prototype.SystemPath = {
    USER_DATA: "userData",
    COMMON_FILES: "commonFiles",
    MY_DOCUMENTS: "myDocuments",
    APPLICATION: "application",
    EXTENSION: "extension",
    HOST_APPLICATION: "hostApplication"
};

/**
 * Evaluates an ExtendScript script in After Effects
 * @param {string} script - ExtendScript code to evaluate
 * @param {function} callback - Callback function receiving script output
 */
CSInterface.prototype.evalScript = function (script, callback) {
    if (this.isInsideAE) {
        try {
            window.__adobe_cep__.evalScript(script, function (result) {
                if (callback) {
                    callback(result);
                }
            });
        } catch (e) {
            console.error("[CSInterface] evalScript error:", e);
            if (callback) callback(JSON.stringify({ status: "error", message: e.message }));
        }
    } else {
        // Fallback for standalone browser testing & simulation
        console.log("[CSInterface Browser Simulation] evalScript called:\n", script);
        if (callback) {
            setTimeout(function () {
                callback(JSON.stringify({
                    status: "success",
                    mode: "browser_simulated",
                    message: "Executed in simulated browser mode."
                }));
            }, 100);
        }
    }
};

/**
 * Get host application environment details
 */
CSInterface.prototype.getHostEnvironment = function () {
    if (this.isInsideAE) {
        try {
            var raw = window.__adobe_cep__.getHostEnvironment();
            return JSON.parse(raw);
        } catch (e) {
            return { appId: "AEFT", appVersion: "Unknown", appName: "After Effects" };
        }
    }
    return {
        appId: "AEFT",
        appVersion: "24.5 (Simulated)",
        appName: "After Effects",
        isSimulated: true
    };
};

/**
 * Get system paths
 */
CSInterface.prototype.getSystemPath = function (pathType) {
    if (this.isInsideAE) {
        try {
            return window.__adobe_cep__.getSystemPath(pathType);
        } catch (e) {
            return "";
        }
    }
    return "";
};

/**
 * Open URL in Google Chrome (or default browser fallback)
 * Specifically handles Adobe CEP (with Node.js or cep.util) and standalone browsers.
 * @param {string} url - Target web address to open
 */
CSInterface.prototype.openInChrome = function (url) {
    var self = this;
    url = url || "https://www.youtube.com/@AftabMusrraf/videos";

    // 1. If running under Node.js environment (supported in CEP with --enable-nodejs)
    if (typeof require === "function") {
        try {
            var cp = require("child_process");
            if (cp && typeof cp.exec === "function") {
                if (typeof process !== "undefined" && process.platform === "win32") {
                    // Try launching via Windows "start chrome" first
                    cp.exec('start chrome "' + url + '"', function (err) {
                        if (err) {
                            // Search known Google Chrome installation locations on Windows
                            var fs = require("fs");
                            var path = require("path");
                            var localApp = process.env.LOCALAPPDATA || "";
                            var progFiles = process.env["ProgramFiles"] || "C:\\Program Files";
                            var progFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";

                            var chromeCandidates = [
                                path.join(progFiles, "Google", "Chrome", "Application", "chrome.exe"),
                                path.join(progFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
                                path.join(localApp, "Google", "Chrome", "Application", "chrome.exe")
                            ];

                            var chromeExe = null;
                            for (var i = 0; i < chromeCandidates.length; i++) {
                                try {
                                    if (fs.existsSync(chromeCandidates[i])) {
                                        chromeExe = chromeCandidates[i];
                                        break;
                                    }
                                } catch (checkErr) {}
                            }

                            if (chromeExe) {
                                cp.exec('"' + chromeExe + '" "' + url + '"');
                            } else {
                                // Fall back to system default browser
                                cp.exec('start "" "' + url + '"', function (err2) {
                                    if (err2) {
                                        self.openURLInDefaultBrowser(url);
                                    }
                                });
                            }
                        }
                    });
                    return true;
                } else if (typeof process !== "undefined" && process.platform === "darwin") {
                    // macOS: open with Google Chrome app if present, else default
                    cp.exec('open -a "Google Chrome" "' + url + '"', function (err) {
                        if (err) {
                            cp.exec('open "' + url + '"');
                        }
                    });
                    return true;
                } else if (typeof process !== "undefined") {
                    // Linux
                    cp.exec('google-chrome "' + url + '" || xdg-open "' + url + '"');
                    return true;
                }
            }
        } catch (e) {
            console.warn("[CSInterface] child_process open failed:", e);
        }
    }

    // 2. CEP native utility
    if (this.isInsideAE && window.cep && window.cep.util && typeof window.cep.util.openURLInDefaultBrowser === "function") {
        try {
            window.cep.util.openURLInDefaultBrowser(url);
            return true;
        } catch (e) {
            console.warn("[CSInterface] cep.util.openURLInDefaultBrowser failed:", e);
        }
    }

    // 3. Browser window.open fallback
    try {
        var win = window.open(url, "_blank", "noopener,noreferrer");
        if (win) {
            win.focus();
            return true;
        }
    } catch (e) {
        console.warn("[CSInterface] window.open failed:", e);
    }

    return false;
};

/**
 * Open URL in default browser
 */
CSInterface.prototype.openURLInDefaultBrowser = function (url) {
    if (this.isInsideAE && window.cep && window.cep.util && typeof window.cep.util.openURLInDefaultBrowser === "function") {
        window.cep.util.openURLInDefaultBrowser(url);
    } else if (typeof require === "function") {
        try {
            var cp = require("child_process");
            if (typeof process !== "undefined" && process.platform === "win32") {
                cp.exec('start "" "' + url + '"');
                return;
            } else if (typeof process !== "undefined" && process.platform === "darwin") {
                cp.exec('open "' + url + '"');
                return;
            }
        } catch (e) {}
        window.open(url, "_blank", "noopener,noreferrer");
    } else {
        window.open(url, "_blank", "noopener,noreferrer");
    }
};

/**
 * Close extension panel
 */
CSInterface.prototype.closeExtension = function () {
    if (this.isInsideAE) {
        window.__adobe_cep__.closeExtension();
    } else {
        window.close();
    }
};
