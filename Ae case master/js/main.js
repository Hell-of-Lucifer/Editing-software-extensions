/**
 * AE CASE MASTER - Main Client Controller
 * Created by Aftab Musrraf
 */

(function () {
    'use strict';

    var csInterface = null;
    try {
        if (typeof CSInterface !== 'undefined') {
            csInterface = new CSInterface();
        }
    } catch (e) {
        console.warn("CSInterface initialization warning:", e);
    }

    // Toast Notification Controller
    var toastTimeout = null;
    function showToast(message, type) {
        type = type || 'success';
        var toastEl = document.getElementById('toast');
        var toastIcon = document.getElementById('toast-icon');
        var toastMsg = document.getElementById('toast-message');

        if (!toastEl || !toastMsg) return;

        toastEl.className = 'toast-container toast-' + type;
        if (type === 'success') {
            toastIcon.textContent = '✓';
        } else if (type === 'error') {
            toastIcon.textContent = '⚠';
        } else {
            toastIcon.textContent = 'ℹ';
        }

        toastMsg.textContent = message;
        toastEl.classList.add('show');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(function () {
            toastEl.classList.remove('show');
        }, 3200);
    }

    // Evaluates ExtendScript code and parses JSON response
    function evalHostScript(jsxCommand, callback) {
        if (!csInterface) {
            showToast("Extension host interface unavailable", "error");
            return;
        }

        csInterface.evalScript(jsxCommand, function (rawResult) {
            var data = null;
            try {
                data = JSON.parse(rawResult);
            } catch (err) {
                // ExtendScript might return primitive string or unparsed result
                if (typeof rawResult === 'string' && rawResult.indexOf('EvalScript error') !== -1) {
                    showToast(rawResult, "error");
                    if (callback) callback({ success: false, error: rawResult });
                    return;
                }
                data = { success: true, message: rawResult };
            }

            if (data) {
                if (data.success) {
                    showToast(data.message || "Action completed successfully", "success");
                } else {
                    showToast(data.message || data.error || "Action failed", "error");
                }
            }

            if (callback) {
                callback(data);
            }
        });
    }

    // -----------------------------------------------------------------
    // 1. Case Tools Event Wiring
    // -----------------------------------------------------------------
    function initCaseTools() {
        var caseButtons = document.querySelectorAll('.case-card');
        caseButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var caseType = btn.getAttribute('data-case');
                if (!caseType) return;
                var script = "aeCaseMaster_applyCase('" + caseType + "');";
                evalHostScript(script);
            });
        });
    }

    // -----------------------------------------------------------------
    // 2. Text Utilities Event Wiring
    // -----------------------------------------------------------------
    function initTextUtilities() {
        var utilButtons = document.querySelectorAll('.btn-utility');
        utilButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var utilType = btn.getAttribute('data-util');
                if (!utilType) return;
                var script = "aeCaseMaster_textUtility('" + utilType + "');";
                evalHostScript(script);
            });
        });
    }

    // -----------------------------------------------------------------
    // 3. Align & Distribute Event Wiring
    // -----------------------------------------------------------------
    function initAlignTools() {
        var alignButtons = document.querySelectorAll('.btn-align');
        alignButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var alignType = btn.getAttribute('data-align');
                if (!alignType) return;
                var script = "aeCaseMaster_alignLayers('" + alignType + "');";
                evalHostScript(script);
            });
        });
    }

    // -----------------------------------------------------------------
    // 4. Quick Actions Event Wiring
    // -----------------------------------------------------------------
    function initQuickActions() {
        var selectAllBtn = document.getElementById('btn-quick-select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function () {
                evalHostScript("aeCaseMaster_quickAction('selectAllText');");
            });
        }

        var centerAnchorBtn = document.getElementById('btn-quick-center-anchor');
        if (centerAnchorBtn) {
            centerAnchorBtn.addEventListener('click', function () {
                evalHostScript("aeCaseMaster_quickAction('centerAnchor');");
            });
        }

        var resetTransformBtn = document.getElementById('btn-quick-reset-transform');
        if (resetTransformBtn) {
            resetTransformBtn.addEventListener('click', function () {
                evalHostScript("aeCaseMaster_quickAction('resetTransform');");
            });
        }

        var renameBtn = document.getElementById('btn-quick-rename');
        if (renameBtn) {
            renameBtn.addEventListener('click', function () {
                openRenameModal();
            });
        }
    }

    // -----------------------------------------------------------------
    // 5. Rename Layers Modal Controller
    // -----------------------------------------------------------------
    var renameModal = document.getElementById('rename-modal');
    var modalBody = document.getElementById('modal-body');
    var modalCloseBtn = document.getElementById('modal-close-btn');
    var modalCancelBtn = document.getElementById('modal-cancel-btn');
    var modalApplyBtn = document.getElementById('modal-apply-btn');
    var currentRenameMode = 'toText';

    var modalModeTemplates = {
        toText: `
            <p style="font-size: 11.5px; color: #8da4be; line-height: 1.5;">
                Renames each selected text layer directly to its text content (first 35 characters).
            </p>
        `,
        prefix: `
            <div class="modal-input-group">
                <label class="modal-label" for="rename-prefix-val">Prefix to prepend:</label>
                <input class="modal-input" id="rename-prefix-val" type="text" placeholder="e.g. Title_ or Text_" value="Text_">
            </div>
        `,
        suffix: `
            <div class="modal-input-group">
                <label class="modal-label" for="rename-suffix-val">Suffix to append:</label>
                <input class="modal-input" id="rename-suffix-val" type="text" placeholder="e.g. _v1 or _Anim" value="_v1">
            </div>
        `,
        replace: `
            <div class="modal-input-group">
                <label class="modal-label" for="rename-find-val">Find string:</label>
                <input class="modal-input" id="rename-find-val" type="text" placeholder="Text to search...">
            </div>
            <div class="modal-input-group" style="margin-top: 6px;">
                <label class="modal-label" for="rename-replace-val">Replace with:</label>
                <input class="modal-input" id="rename-replace-val" type="text" placeholder="Replacement text...">
            </div>
        `,
        sequence: `
            <div class="modal-input-group">
                <label class="modal-label" for="rename-base-val">Base Name:</label>
                <input class="modal-input" id="rename-base-val" type="text" placeholder="e.g. TextLayer" value="TextLayer">
                <span style="font-size: 10.5px; color: #627d98; margin-top: 3px;">Layers will be named TextLayer_01, TextLayer_02, etc.</span>
            </div>
        `
    };

    function renderModalMode(mode) {
        currentRenameMode = mode;
        if (modalBody && modalModeTemplates[mode]) {
            modalBody.innerHTML = modalModeTemplates[mode];
            var firstInput = modalBody.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }

    function openRenameModal() {
        if (!renameModal) return;
        renameModal.classList.add('active');
        renderModalMode(currentRenameMode);
    }

    function closeRenameModal() {
        if (!renameModal) return;
        renameModal.classList.remove('active');
    }

    function initRenameModal() {
        var tabs = document.querySelectorAll('.modal-tab');
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                var mode = tab.getAttribute('data-mode');
                renderModalMode(mode);
            });
        });

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeRenameModal);
        if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeRenameModal);

        if (modalApplyBtn) {
            modalApplyBtn.addEventListener('click', function () {
                var params = { mode: currentRenameMode };

                if (currentRenameMode === 'prefix') {
                    var prefEl = document.getElementById('rename-prefix-val');
                    params.prefix = prefEl ? prefEl.value : '';
                } else if (currentRenameMode === 'suffix') {
                    var suffEl = document.getElementById('rename-suffix-val');
                    params.suffix = suffEl ? suffEl.value : '';
                } else if (currentRenameMode === 'replace') {
                    var findEl = document.getElementById('rename-find-val');
                    var repEl = document.getElementById('rename-replace-val');
                    params.findText = findEl ? findEl.value : '';
                    params.replaceText = repEl ? repEl.value : '';
                } else if (currentRenameMode === 'sequence') {
                    var baseEl = document.getElementById('rename-base-val');
                    params.baseName = baseEl ? baseEl.value : 'Layer';
                }

                closeRenameModal();
                var paramsEscaped = JSON.stringify(params).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                evalHostScript("aeCaseMaster_quickAction('renameLayers', '" + paramsEscaped + "');");
            });
        }

        // Close on background click
        if (renameModal) {
            renameModal.addEventListener('click', function (e) {
                if (e.target === renameModal) {
                    closeRenameModal();
                }
            });
        }
    }

    // -----------------------------------------------------------------
    // -----------------------------------------------------------------
    // 6. External Browser Launcher & Header/Footer Extras
    // -----------------------------------------------------------------
    var lastUrlOpenTime = 0;
    var isLaunchingUrl = false;

    function openExternalURL(url) {
        url = url || 'https://www.youtube.com/@AftabMusrraf';
        var now = (Date.now ? Date.now() : new Date().getTime());
        if (isLaunchingUrl || (now - lastUrlOpenTime < 2000)) {
            return; // Guard against duplicate triggers
        }
        isLaunchingUrl = true;
        lastUrlOpenTime = now;
        setTimeout(function () {
            isLaunchingUrl = false;
        }, 2000);

        var launched = false;

        // 1. Native Adobe CEP API (Best & cleanest inside After Effects)
        try {
            if (window.cep && window.cep.util && typeof window.cep.util.openURLInDefaultBrowser === 'function') {
                window.cep.util.openURLInDefaultBrowser(url);
                launched = true;
            } else if (typeof cep !== 'undefined' && cep.util && typeof cep.util.openURLInDefaultBrowser === 'function') {
                cep.util.openURLInDefaultBrowser(url);
                launched = true;
            }
        } catch (cepErr) {
            console.warn("CEP util openURL warning:", cepErr);
        }

        // 2. CSInterface wrapper method (when running inside CEP host)
        if (!launched && csInterface && typeof csInterface.openURLInDefaultBrowser === 'function' && typeof window.__adobe_cep__ !== 'undefined') {
            try {
                csInterface.openURLInDefaultBrowser(url);
                launched = true;
            } catch (csErr) {
                console.warn("CSInterface openURL warning:", csErr);
            }
        }

        // 3. Node.js child_process (single clean launch command for default browser)
        if (!launched) {
            try {
                var req = (typeof window !== 'undefined' && window.require) ? window.require : (typeof require === 'function' ? require : null);
                if (req) {
                    var cp = req('child_process');
                    if (cp && typeof cp.exec === 'function') {
                        var isWin = (typeof process !== 'undefined' && process.platform === 'win32') ||
                            (navigator.platform && navigator.platform.indexOf('Win') !== -1);
                        if (isWin) {
                            cp.exec('cmd.exe /c start "" "' + url + '"');
                        } else {
                            cp.exec('open "' + url + '"');
                        }
                        launched = true;
                    }
                }
            } catch (nodeErr) {
                console.warn("Node child_process launch warning:", nodeErr);
            }
        }

        // 4. Standard browser window.open (fallback for normal browser preview)
        if (!launched) {
            try {
                window.open(url, '_blank');
                launched = true;
            } catch (winErr) {
                console.warn("window.open warning:", winErr);
            }
        }

        showToast("Opening YouTube Channel in browser...", "info");
    }

    // Expose globally for inline HTML event handlers
    window.openExternalURL = openExternalURL;

    function initHeaderExtras() {
        var proBadge = document.getElementById('pro-badge');
        if (proBadge) {
            proBadge.addEventListener('click', function () {
                showToast("AE Case Master Pro • Version 1.0.0 Active", "info");
            });
        }

        var dots = document.querySelectorAll('.dot');
        dots.forEach(function (d) {
            d.addEventListener('click', function () {
                showToast("AE Case Master • By Aftab Musrraf", "info");
            });
        });

        var ytLink = document.getElementById('youtube-link');
        if (ytLink) {
            ytLink.onclick = function (e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                var url = this.getAttribute('data-url') || 'https://www.youtube.com/@AftabMusrraf';
                openExternalURL(url);
                return false;
            };
            ytLink.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var url = this.getAttribute('data-url') || 'https://www.youtube.com/@AftabMusrraf';
                    openExternalURL(url);
                }
            });
        }
    }

    // -----------------------------------------------------------------
    // Initialization on DOM Ready
    // -----------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        initCaseTools();
        initTextUtilities();
        initAlignTools();
        initQuickActions();
        initRenameModal();
        initHeaderExtras();

        // Welcome feedback when running in AE
        if (csInterface && typeof window.__adobe_cep__ !== 'undefined') {
            console.log("AE Case Master CEP Extension initialized.");
        }
    });

})();
