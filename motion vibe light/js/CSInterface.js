/**
 * CSInterface - Adobe CEP Extension Bridge & Browser Simulator
 * Supports After Effects & Premiere Pro host integration with automatic fallback for standalone browser preview.
 */
(function(window) {
    'use strict';

    function CSInterface() {
        this.isHostAvailable = typeof window.__adobe_cep__ !== 'undefined';
        if (!this.isHostAvailable) {
            console.info("%c[Motion Vibe Light] Running in Web Preview mode (Browser Simulated CEP)", "color: #00d2ff; font-weight: bold;");
        }
    }

    CSInterface.prototype.evalScript = function(script, callback) {
        if (this.isHostAvailable) {
            window.__adobe_cep__.evalScript(script, callback || function() {});
        } else {
            console.log("[Simulated AE JSX Call]:", script);
            // Simulate success callback after slight delay
            if (typeof callback === 'function') {
                setTimeout(function() {
                    callback("OK: Simulated AE execution success");
                }, 100);
            }
        }
    };

    CSInterface.prototype.getHostEnvironment = function() {
        if (this.isHostAvailable) {
            return JSON.parse(window.__adobe_cep__.getHostEnvironment());
        }
        return {
            appName: "AEFT",
            appVersion: "24.5",
            appLocale: "en_US",
            appUILocale: "en_US",
            appId: "AEFT"
        };
    };

    CSInterface.prototype.getSystemPath = function(pathType) {
        if (this.isHostAvailable) {
            return window.__adobe_cep__.getSystemPath(pathType);
        }
        return "./";
    };

    CSInterface.prototype.openURLInDefaultBrowser = function(url) {
        if (this.isHostAvailable && window.__adobe_cep__.openURLInDefaultBrowser) {
            window.__adobe_cep__.openURLInDefaultBrowser(url);
        } else {
            window.open(url, '_blank');
        }
    };

    CSInterface.prototype.addEventListener = function(type, listener, obj) {
        if (this.isHostAvailable) {
            window.__adobe_cep__.addEventListener(type, listener, obj);
        } else {
            window.addEventListener(type, listener);
        }
    };

    CSInterface.prototype.dispatchEvent = function(event) {
        if (this.isHostAvailable) {
            window.__adobe_cep__.dispatchEvent(event);
        } else {
            window.dispatchEvent(new CustomEvent(event.type, { detail: event.data }));
        }
    };

    CSInterface.prototype.closeExtension = function() {
        if (this.isHostAvailable) {
            window.__adobe_cep__.closeExtension();
        } else {
            window.close();
        }
    };

    window.CSInterface = CSInterface;
})(window);
