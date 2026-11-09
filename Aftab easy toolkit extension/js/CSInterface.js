/**
 * CSInterface - v11.0.0
 * Adobe CEP Interface implementation with fallback mock for browser testing.
 */
function CSInterface() {}

CSInterface.prototype.hostEnvironment = window.__adobe_cep__ ? JSON.parse(window.__adobe_cep__.getHostEnvironment()) : {
    appName: "AEFT",
    appVersion: "24.0.0",
    appLocale: "en_US",
    appUILocale: "en_US",
    appId: "AEFT",
    isAppOnline: true,
    appSkinInfo: {
        baseFontFamily: "Segoe UI",
        baseFontSize: 11,
        appBarBackgroundColor: { color: { red: 25, green: 22, blue: 36, alpha: 255 } },
        panelBackgroundColor: { color: { red: 18, green: 15, blue: 27, alpha: 255 } }
    }
};

CSInterface.prototype.getHostEnvironment = function () {
    return this.hostEnvironment;
};

CSInterface.prototype.evalScript = function (script, callback) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.evalScript(script, callback);
    } else {
        // Fallback mock for browser preview and development
        if (typeof window.__mockEvalScript === "function") {
            window.__mockEvalScript(script, callback);
        } else {
            console.log("[Mock AE ExtendScript Eval]:", script);
            if (callback) {
                callback(JSON.stringify({ status: "success", mock: true, message: "Action simulated in browser mode" }));
            }
        }
    }
};

CSInterface.prototype.addEventListener = function (type, listener, obj) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.addEventListener(type, listener, obj);
    } else {
        window.addEventListener(type, listener);
    }
};

CSInterface.prototype.removeEventListener = function (type, listener, obj) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.removeEventListener(type, listener, obj);
    } else {
        window.removeEventListener(type, listener);
    }
};

CSInterface.prototype.dispatchEvent = function (event) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.dispatchEvent(event);
    } else {
        window.dispatchEvent(new CustomEvent(event.type, { detail: event.data }));
    }
};

CSInterface.prototype.getSystemPath = function (pathType) {
    var destination = "";
    var path = "";
    switch (pathType) {
        case "USER_DATA":
            destination = "userData";
            break;
        case "COMMON_FILES":
            destination = "commonFiles";
            break;
        case "MY_DOCUMENTS":
            destination = "myDocuments";
            break;
        case "APPLICATION":
            destination = "application";
            break;
        case "EXTENSION":
            destination = "extension";
            break;
        case "HOST_APPLICATION":
            destination = "hostApplication";
            break;
    }
    if (window.__adobe_cep__) {
        path = decodeURI(window.__adobe_cep__.getSystemPath(destination));
    } else {
        path = "./";
    }
    return path;
};

CSInterface.prototype.closeExtension = function () {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.closeExtension();
    } else {
        console.log("closeExtension called");
    }
};

CSInterface.prototype.openURLInDefaultBrowser = function (url) {
    if (window.cep && window.cep.util && window.cep.util.openURLInDefaultBrowser) {
        window.cep.util.openURLInDefaultBrowser(url);
    } else if (window.__adobe_cep__) {
        window.__adobe_cep__.openURLInDefaultBrowser(url);
    } else {
        window.open(url, "_blank");
    }
};

CSInterface.prototype.resizeContent = function (width, height) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.requestContentSize(width, height);
    }
};

CSInterface.prototype.requestOpenExtension = function (extensionId, params) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.requestOpenExtension(extensionId, params);
    }
};

function CSEvent(type, scope, appId, extensionId) {
    this.type = type;
    this.scope = scope || "APPLICATION";
    this.appId = appId || "";
    this.extensionId = extensionId || "";
    this.data = "";
}

