/**
 * CSInterface - v11.0.0 (Enhanced Universal Version)
 * Cross-version compatible with Adobe After Effects CC 2014 through CC 2026+
 */

(function () {
    'use strict';

    function CSInterface() {
        // Constructor
    }

    CSInterface.prototype.getHostEnvironment = function () {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            try {
                return JSON.parse(window.__adobe_cep__.getHostEnvironment());
            } catch (e) {
                return { appName: "AEFT", appVersion: "24.0" };
            }
        }
        return {
            appName: "AEFT_MOCK",
            appVersion: "24.0",
            appLocale: "en_US",
            appUILocale: "en_US",
            appId: "AEFT",
            isMock: true
        };
    };

    CSInterface.prototype.closeExtension = function () {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.closeExtension();
        }
    };

    CSInterface.prototype.getSystemPath = function (pathType) {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            return window.__adobe_cep__.getSystemPath(pathType);
        }
        return "";
    };

    CSInterface.prototype.evalScript = function (script, callback) {
        if (typeof callback === 'undefined') {
            callback = function () {};
        }

        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.evalScript(script, callback);
        } else {
            // Mock environment fallback for browser preview/testing
            console.warn("[CSInterface Mock] evalScript executed:", script);
            setTimeout(function () {
                var mockResponse = JSON.stringify({
                    success: true,
                    count: 1,
                    message: "Browser Preview Mode: simulated action completed successfully."
                });
                callback(mockResponse);
            }, 80);
        }
    };

    CSInterface.prototype.addEventListener = function (type, listener, obj) {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.addEventListener(type, listener, obj);
        } else {
            window.addEventListener(type, listener);
        }
    };

    CSInterface.prototype.removeEventListener = function (type, listener, obj) {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.removeEventListener(type, listener, obj);
        } else {
            window.removeEventListener(type, listener);
        }
    };

    CSInterface.prototype.dispatchEvent = function (event) {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.dispatchEvent(event);
        }
    };

    CSInterface.prototype.openURLInDefaultBrowser = function (url) {
        if (!url) return;
        if (window.cep && window.cep.util && typeof window.cep.util.openURLInDefaultBrowser === 'function') {
            window.cep.util.openURLInDefaultBrowser(url);
            return;
        }
        if (typeof cep !== 'undefined' && cep.util && typeof cep.util.openURLInDefaultBrowser === 'function') {
            cep.util.openURLInDefaultBrowser(url);
            return;
        }
        try {
            var req = (typeof window.require === 'function') ? window.require : (typeof require === 'function' ? require : null);
            if (req) {
                var cp = req('child_process');
                var isWin = (navigator.platform && navigator.platform.indexOf('Win') !== -1) ||
                            (typeof process !== 'undefined' && process.platform === 'win32');
                if (isWin) {
                    cp.exec('cmd.exe /c start "" "' + url + '"');
                } else {
                    cp.exec('open "' + url + '"');
                }
                return;
            }
        } catch (e) {}
        try {
            window.open(url, '_blank');
        } catch (e2) {}
    };

    CSInterface.prototype.resizeContent = function (width, height) {
        if (typeof window.__adobe_cep__ !== 'undefined') {
            window.__adobe_cep__.resizeContent(width, height);
        }
    };

    window.CSInterface = CSInterface;
})();
