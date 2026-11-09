/**
 * CSInterface - v9.4.0 (Compatibility Layer for Adobe CEP 6 through 12+)
 * Supports After Effects CC 2014 through CC 2026+
 */
var CSInterface = function() {
    this.hostEnvironment = null;
};

CSInterface.prototype.getHostEnvironment = function() {
    if (!this.hostEnvironment) {
        var env = window.__adobe_cep__ ? window.__adobe_cep__.getHostEnvironment() : null;
        if (env) {
            try {
                this.hostEnvironment = JSON.parse(env);
            } catch (e) {
                this.hostEnvironment = {};
            }
        } else {
            this.hostEnvironment = {
                appName: "AEFT",
                appVersion: "24.0",
                appLocale: "en_US"
            };
        }
    }
    return this.hostEnvironment;
};

CSInterface.prototype.evalScript = function(script, callback) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.evalScript(script, callback || function() {});
    } else {
        // Fallback for standalone browser preview / debugging
        console.log("[CSInterface Mock evalScript]:", script);
        if (typeof callback === "function") {
            setTimeout(function() {
                callback(JSON.stringify({
                    status: "success",
                    mock: true,
                    message: "Executed in preview mode (outside AE). When opened in After Effects, this generates actual layers."
                }));
            }, 100);
        }
    }
};

CSInterface.prototype.addEventListener = function(type, listener, obj) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.addEventListener(type, listener, obj);
    }
};

CSInterface.prototype.removeEventListener = function(type, listener, obj) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.removeEventListener(type, listener, obj);
    }
};

CSInterface.prototype.dispatchEvent = function(event) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.dispatchEvent(event);
    }
};

CSInterface.prototype.requestOpenExtension = function(extensionId, params) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.requestOpenExtension(extensionId, params);
    }
};

CSInterface.prototype.closeExtension = function() {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.closeExtension();
    } else {
        window.close();
    }
};

CSInterface.prototype.getSystemPath = function(pathType) {
    var path = "";
    if (window.__adobe_cep__) {
        path = window.__adobe_cep__.getSystemPath(pathType);
    }
    return path;
};

CSInterface.prototype.openURLInDefaultBrowser = function(url) {
    if (window.__adobe_cep__ && window.cep && window.cep.util) {
        window.cep.util.openURLInDefaultBrowser(url);
    } else {
        window.open(url, "_blank");
    }
};

SystemPath = {
    USER_DATA: "userData",
    COMMON_FILES: "commonFiles",
    MY_DOCUMENTS: "myDocuments",
    APPLICATION: "application",
    EXTENSION: "extension",
    HOST_APPLICATION: "hostApplication"
};
