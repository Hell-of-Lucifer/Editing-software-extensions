/**
 * Easy Toolkit - Core Application Controller
 */

window.App = (function () {
    var csInterface = new CSInterface();
    var lastAction = null;
    var currentTab = "edit";
    var compPollInterval = null;

    function init() {
        setupNavigation();
        setupEditTools();
        setupAITools();
        setupUtilsTools();
        setupCurveActions();
        setupModals();
        setupStatusEvents();
        setupFAB();
        setupTheme();

        // Initialize submodules
        CurvesModule.init();
        PresetsModule.init();

        // Poll AE comp status
        updateCompStatus();
        compPollInterval = setInterval(updateCompStatus, 2500);

        setStatus("Ready", "ready");
    }

    // --- ExtendScript Bridge with Fallback Mock ---
    function callHost(script, callback) {
        csInterface.evalScript(script, function (result) {
            var data = null;
            try {
                data = JSON.parse(result);
            } catch (e) {
                data = { raw: result };
            }

            if (data && data.error) {
                setStatus(data.error, "error");
            } else if (data && data.message) {
                setStatus(data.message, "success");
            }

            if (callback) callback(data);
        });
    }

    // Browser Mock Implementation
    window.__mockEvalScript = function (script, callback) {
        console.log("[Easy Toolkit Mock AE]", script);
        setTimeout(function () {
            if (script.indexOf("getCompStatus") !== -1) {
                callback(JSON.stringify({ status: "ok", compName: "Comp 1", layerCount: 1, selectedCount: 1 }));
            } else if (script.indexOf("createTextLayer") !== -1) {
                callback(JSON.stringify({ success: true, message: "Your text added" }));
            } else if (script.indexOf("precompSelected") !== -1) {
                callback(JSON.stringify({ success: true, message: 'Precomposed as "Your text"' }));
            } else if (script.indexOf("precompEachSelected") !== -1) {
                callback(JSON.stringify({ success: true, message: "Precomposed 1 layer(s) each" }));
            } else if (script.indexOf("decompSelected") !== -1) {
                callback(JSON.stringify({ success: true, message: "Decomposed precomp (2 layers extracted)" }));
            } else if (script.indexOf("copyEffects") !== -1) {
                callback(JSON.stringify({ success: true, message: "Copied 2 effect(s) from selected layer" }));
            } else if (script.indexOf("pasteEffects") !== -1) {
                callback(JSON.stringify({ success: true, message: "Pasted effects to 1 layer(s)" }));
            } else if (script.indexOf("duplicateSelected") !== -1) {
                callback(JSON.stringify({ success: true, message: "Duplicated 1 layer(s)" }));
            } else if (script.indexOf("createNullLayer") !== -1) {
                callback(JSON.stringify({ success: true, message: "Null layer added" }));
            } else if (script.indexOf("createSolidLayer") !== -1) {
                callback(JSON.stringify({ success: true, message: "Solid layer added" }));
            } else if (script.indexOf("createAdjustmentLayer") !== -1) {
                callback(JSON.stringify({ success: true, message: "Adjustment layer added" }));
            } else if (script.indexOf("applyEasing") !== -1) {
                callback(JSON.stringify({ success: true, message: "Curve applied to 2 keyframe(s)" }));
            } else if (script.indexOf("readKeyEasing") !== -1) {
                callback(JSON.stringify({ success: true, x1: 0.70, y1: 0.0, x2: 0.84, y2: 0.0, message: "Read keyframe easing (84%, 70%)" }));
            } else if (script.indexOf("executeUndo") !== -1) {
                callback(JSON.stringify({ success: true, message: "Undo executed" }));
            } else {
                callback(JSON.stringify({ success: true, message: "Operation completed in AE" }));
            }
        }, 80);
    };

    // --- Navigation Tabs ---
    function setupNavigation() {
        var tabs = document.querySelectorAll(".nav-tab");
        for (var i = 0; i < tabs.length; i++) {
            (function (tab) {
                tab.addEventListener("click", function () {
                    var target = tab.getAttribute("data-tab");
                    switchTab(target);
                });
            })(tabs[i]);
        }

        // Curves View Back Button
        var btnBackCurves = document.getElementById("btnBackCurves");
        if (btnBackCurves) {
            btnBackCurves.addEventListener("click", function () {
                document.getElementById("curvesView").style.display = "none";
                document.getElementById("editGrid").style.display = "flex";
            });
        }

        // Three dots menu
        var btnDots = document.getElementById("btnMoreMenu");
        if (btnDots) {
            btnDots.addEventListener("click", function () {
                openModal("modalSettings");
            });
        }
    }

    function switchTab(tabId) {
        currentTab = tabId;
        var tabs = document.querySelectorAll(".nav-tab");
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute("data-tab") === tabId) {
                tabs[i].classList.add("active");
            } else {
                tabs[i].classList.remove("active");
            }
        }

        var panes = document.querySelectorAll(".tab-pane");
        for (var j = 0; j < panes.length; j++) {
            panes[j].classList.remove("active");
        }

        var activePane = document.getElementById("tab-" + tabId);
        if (activePane) {
            activePane.classList.add("active");
        }

        // Reset curves view when leaving Edit
        if (tabId !== "edit") {
            var curvesView = document.getElementById("curvesView");
            var editGrid = document.getElementById("editGrid");
            if (curvesView) curvesView.style.display = "none";
            if (editGrid) editGrid.style.display = "flex";
        }
    }

    // --- Edit Tab Tools (Screenshots 800 & 802) ---
    function setupEditTools() {
        // 1. Curves Button
        var btnCurves = document.getElementById("toolCurves");
        if (btnCurves) {
            btnCurves.addEventListener("click", function () {
                document.getElementById("editGrid").style.display = "none";
                var curvesView = document.getElementById("curvesView");
                curvesView.style.display = "flex";
                CurvesModule.draw();
            });
        }

        // 2. Text Button (Screenshot 802)
        var btnText = document.getElementById("toolText");
        if (btnText) {
            btnText.addEventListener("click", function () {
                callHost("EasyHost.createTextLayer('Your text')", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 3. Precomp Button
        var btnPrecomp = document.getElementById("toolPrecomp");
        if (btnPrecomp) {
            btnPrecomp.addEventListener("click", function () {
                callHost("EasyHost.precompSelected('Your text')", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 4. Precomp Each Button
        var btnPrecompEach = document.getElementById("toolPrecompEach");
        if (btnPrecompEach) {
            btnPrecompEach.addEventListener("click", function () {
                callHost("EasyHost.precompEachSelected()", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 5. Decomp Button
        var btnDecomp = document.getElementById("toolDecomp");
        if (btnDecomp) {
            btnDecomp.addEventListener("click", function () {
                callHost("EasyHost.decompSelected()", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 6. Copy fx
        var btnCopyFx = document.getElementById("toolCopyFx");
        if (btnCopyFx) {
            btnCopyFx.addEventListener("click", function () {
                callHost("EasyHost.copyEffects()");
            });
        }

        // 7. Paste fx
        var btnPasteFx = document.getElementById("toolPasteFx");
        if (btnPasteFx) {
            btnPasteFx.addEventListener("click", function () {
                callHost("EasyHost.pasteEffects()", function (res) {
                    showUndoButton();
                });
            });
        }

        // 8. Duplicate
        var btnDuplicate = document.getElementById("toolDuplicate");
        if (btnDuplicate) {
            btnDuplicate.addEventListener("click", function () {
                callHost("EasyHost.duplicateSelected()", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 9. Null
        var btnNull = document.getElementById("toolNull");
        if (btnNull) {
            btnNull.addEventListener("click", function () {
                callHost("EasyHost.createNullLayer()", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 10. Solid
        var btnSolid = document.getElementById("toolSolid");
        if (btnSolid) {
            btnSolid.addEventListener("click", function () {
                callHost("EasyHost.createSolidLayer('#581c87', 'Purple Solid')", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }

        // 11. Adjust
        var btnAdjust = document.getElementById("toolAdjust");
        if (btnAdjust) {
            btnAdjust.addEventListener("click", function () {
                callHost("EasyHost.createAdjustmentLayer()", function (res) {
                    showUndoButton();
                    updateCompStatus();
                });
            });
        }
    }

    // --- Curves Action Buttons (Screenshot 801) ---
    function setupCurveActions() {
        // Apply Curve
        var btnApply = document.getElementById("btnApplyCurve");
        if (btnApply) {
            btnApply.addEventListener("click", function () {
                var s = CurvesModule.getState();
                var script = "EasyHost.applyEasing(" + s.x1 + ", " + s.y1 + ", " + s.x2 + ", " + s.y2 + ", '" + s.mode + "')";
                callHost(script, function (res) {
                    showUndoButton();
                });
            });
        }

        // Read Keys Easing
        var btnRead = document.getElementById("btnReadKeys");
        if (btnRead) {
            btnRead.addEventListener("click", function () {
                callHost("EasyHost.readKeyEasing()", function (res) {
                    if (res && res.success) {
                        CurvesModule.setEasingValues(res.x1, res.y1, res.x2, res.y2, "Read Keys");
                    }
                });
            });
        }

        // Add Custom Curve (+)
        var btnAddCurve = document.getElementById("btnAddCurve");
        if (btnAddCurve) {
            btnAddCurve.addEventListener("click", function () {
                openModal("modalSaveCurve");
            });
        }
    }

    // --- AI Tab Tools (Screenshot 803) ---
    function setupAITools() {
        // Captions
        var toolCaptions = document.getElementById("toolAICaptions");
        if (toolCaptions) {
            toolCaptions.addEventListener("click", function () {
                openModal("modalAICaptions");
            });
        }

        // Beat
        var toolBeat = document.getElementById("toolAIBeat");
        if (toolBeat) {
            toolBeat.addEventListener("click", function () {
                callHost("EasyHost.detectAudioBeats()", function (res) {
                    showUndoButton();
                });
            });
        }

        // Mask
        var toolMask = document.getElementById("toolAIMask");
        if (toolMask) {
            toolMask.addEventListener("click", function () {
                callHost("EasyHost.applySmartMask()", function (res) {
                    showUndoButton();
                });
            });
        }

        // Voice
        var toolVoice = document.getElementById("toolAIVoice");
        if (toolVoice) {
            toolVoice.addEventListener("click", function () {
                callHost("EasyHost.createTextLayer('Voice Placeholder')", function (res) {
                    showUndoButton();
                });
            });
        }

        // Bounce
        var toolBounce = document.getElementById("toolAIBounce");
        if (toolBounce) {
            toolBounce.addEventListener("click", function () {
                openModal("modalAIBounce");
            });
        }

        // Text Kinetic
        var toolAIText = document.getElementById("toolAIText");
        if (toolAIText) {
            toolAIText.addEventListener("click", function () {
                openModal("modalAIText");
            });
        }

        // Fluid
        var toolFluid = document.getElementById("toolAIFluid");
        if (toolFluid) {
            toolFluid.addEventListener("click", function () {
                callHost("EasyHost.applyFluidMotion()", function (res) {
                    showUndoButton();
                });
            });
        }

        // Face
        var toolFace = document.getElementById("toolAIFace");
        if (toolFace) {
            toolFace.addEventListener("click", function () {
                callHost("EasyHost.createFaceTrackingNull()", function (res) {
                    showUndoButton();
                });
            });
        }

        // Relight
        var toolRelight = document.getElementById("toolAIRelight");
        if (toolRelight) {
            toolRelight.addEventListener("click", function () {
                callHost("EasyHost.createRelightRig()", function (res) {
                    showUndoButton();
                });
            });
        }
    }

    // --- Utils Tab Tools (Screenshot 805) ---
    function setupUtilsTools() {
        // Render
        var toolRender = document.getElementById("toolRender");
        if (toolRender) {
            toolRender.addEventListener("click", function () {
                openModal("modalRenderQueue");
            });
        }

        // Paste Image
        var toolPasteImage = document.getElementById("toolPasteImage");
        if (toolPasteImage) {
            toolPasteImage.addEventListener("click", function () {
                handleClipboardPasteImage();
            });
        }

        // Link
        var toolLink = document.getElementById("toolLink");
        if (toolLink) {
            toolLink.addEventListener("click", function () {
                callHost("EasyHost.linkSelectedLayers('parent')", function (res) {
                    showUndoButton();
                });
            });
        }
    }

    // --- Clipboard Paste Image ---
    function handleClipboardPasteImage() {
        if (navigator.clipboard && navigator.clipboard.read) {
            navigator.clipboard.read().then(function (items) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.types.some(function(type) { return type.startsWith("image/"); })) {
                        showToast("Pasting image from clipboard into AE...");
                        // If CEP Node.js available, write temp file
                        if (window.require) {
                            try {
                                var fs = window.require("fs");
                                var path = window.require("path");
                                var os = window.require("os");
                                item.getType("image/png").then(function (blob) {
                                    blob.arrayBuffer().then(function (buf) {
                                        var tempPath = path.join(os.tmpdir(), "easy_paste_" + Date.now() + ".png");
                                        fs.writeFileSync(tempPath, Buffer.from(buf));
                                        callHost("EasyHost.importImageLayer('" + tempPath.replace(/\\/g, "/") + "')", function () {
                                            showUndoButton();
                                        });
                                    });
                                });
                                return;
                            } catch (e) {}
                        }
                        // Fallback simulated import
                        callHost("EasyHost.createTextLayer('Pasted Image')", function () {
                            showUndoButton();
                        });
                        return;
                    }
                }
                showToast("No image currently copied to clipboard. Copy an image first!");
            }).catch(function () {
                showToast("Please copy an image to your clipboard first.");
            });
        } else {
            showToast("Clipboard access simulated.");
            callHost("EasyHost.createTextLayer('Pasted Image')", function () {
                showUndoButton();
            });
        }
    }

    // --- Status & Undo Bar ---
    function setStatus(text, type) {
        var statusDot = document.getElementById("statusDot");
        var statusText = document.getElementById("statusText");
        if (!statusText || !statusDot) return;

        statusText.textContent = text;
        statusDot.className = "status-dot";

        if (type === "ready") {
            statusText.className = "status-text";
        } else if (type === "success") {
            statusText.className = "status-text highlight";
            statusDot.className = "status-dot";
        } else if (type === "error") {
            statusText.className = "status-text";
            statusDot.className = "status-dot error";
        } else if (type === "purple") {
            statusDot.className = "status-dot purple";
        }
    }

    function showUndoButton() {
        var undoBtn = document.getElementById("btnUndo");
        if (undoBtn) {
            undoBtn.style.display = "inline-block";
        }
    }

    function hideUndoButton() {
        var undoBtn = document.getElementById("btnUndo");
        if (undoBtn) {
            undoBtn.style.display = "none";
        }
    }

    function setupStatusEvents() {
        var undoBtn = document.getElementById("btnUndo");
        if (undoBtn) {
            undoBtn.addEventListener("click", function () {
                callHost("EasyHost.executeUndo()", function (res) {
                    hideUndoButton();
                    updateCompStatus();
                });
            });
        }
    }

    function updateCompStatus() {
        callHost("EasyHost.getCompStatus()", function (res) {
            if (res && res.compName) {
                var compBadge = document.getElementById("compNameBadge");
                if (compBadge) {
                    compBadge.textContent = res.compName;
                }
            }
        });
    }

    // --- Floating Action Button (+) ---
    function setupFAB() {
        var fab = document.getElementById("fabBtn");
        var fabMenu = document.getElementById("fabMenu");
        if (!fab || !fabMenu) return;

        fab.addEventListener("click", function (e) {
            fabMenu.classList.toggle("active");
            e.stopPropagation();
        });

        document.addEventListener("click", function () {
            fabMenu.classList.remove("active");
        });

        var fabItems = document.querySelectorAll(".fab-item");
        for (var i = 0; i < fabItems.length; i++) {
            (function (item) {
                item.addEventListener("click", function () {
                    var act = item.getAttribute("data-action");
                    if (act === "add-text") {
                        callHost("EasyHost.createTextLayer('Your text')", showUndoButton);
                    } else if (act === "add-null") {
                        callHost("EasyHost.createNullLayer()", showUndoButton);
                    } else if (act === "add-solid") {
                        callHost("EasyHost.createSolidLayer('#581c87', 'Purple Solid')", showUndoButton);
                    } else if (act === "add-adjust") {
                        callHost("EasyHost.createAdjustmentLayer()", showUndoButton);
                    }
                });
            })(fabItems[i]);
        }
    }

    // --- Modals Management ---
    function openModal(id) {
        var modal = document.getElementById(id);
        if (modal) modal.classList.add("active");
    }

    function closeModal(id) {
        var modal = document.getElementById(id);
        if (modal) modal.classList.remove("active");
    }

    function setupModals() {
        // Modal close buttons
        var closes = document.querySelectorAll(".modal-close, .btn-modal-cancel");
        for (var i = 0; i < closes.length; i++) {
            (function (btn) {
                btn.addEventListener("click", function () {
                    var modal = btn.closest(".modal-overlay");
                    if (modal) modal.classList.remove("active");
                });
            })(closes[i]);
        }

        // Save Curve Modal Confirm
        var btnConfirmCurve = document.getElementById("btnConfirmSaveCurve");
        if (btnConfirmCurve) {
            btnConfirmCurve.addEventListener("click", function () {
                var nameInput = document.getElementById("inputCurveName");
                if (nameInput && nameInput.value.trim() !== "") {
                    CurvesModule.saveCustomPreset(nameInput.value.trim());
                    closeModal("modalSaveCurve");
                    nameInput.value = "";
                    showToast("Custom curve preset saved!");
                }
            });
        }

        // Save Preset Modal Confirm
        var btnConfirmPreset = document.getElementById("btnConfirmSavePreset");
        if (btnConfirmPreset) {
            btnConfirmPreset.addEventListener("click", function () {
                var nameInput = document.getElementById("inputPresetName");
                var catInput = document.getElementById("inputPresetCategory");
                if (nameInput && nameInput.value.trim() !== "") {
                    PresetsModule.addPreset(nameInput.value.trim(), catInput ? catInput.value : "General");
                    closeModal("modalSavePreset");
                    nameInput.value = "";
                    showToast("Preset saved to library!");
                }
            });
        }

        // AI Captions Confirm
        var btnConfirmCaptions = document.getElementById("btnConfirmAICaptions");
        if (btnConfirmCaptions) {
            btnConfirmCaptions.addEventListener("click", function () {
                var scriptText = document.getElementById("inputCaptionsText").value;
                callHost("EasyHost.generateCaptions('" + scriptText.replace(/'/g, "\\'") + "', 3)", function () {
                    closeModal("modalAICaptions");
                    showUndoButton();
                });
            });
        }

        // AI Bounce Confirm
        var btnConfirmBounce = document.getElementById("btnConfirmAIBounce");
        if (btnConfirmBounce) {
            btnConfirmBounce.addEventListener("click", function () {
                var freq = parseFloat(document.getElementById("inputBounceFreq").value) || 3.0;
                var decay = parseFloat(document.getElementById("inputBounceDecay").value) || 5.0;
                callHost("EasyHost.applyBounceExpression(" + freq + ", " + decay + ", 0.05)", function () {
                    closeModal("modalAIBounce");
                    showUndoButton();
                });
            });
        }

        // AI Text Kinetic Confirm
        var btnConfirmKinetic = document.getElementById("btnConfirmAIText");
        if (btnConfirmKinetic) {
            btnConfirmKinetic.addEventListener("click", function () {
                var style = document.getElementById("selectKineticStyle").value;
                callHost("EasyHost.applyTextKinetic('" + style + "')", function () {
                    closeModal("modalAIText");
                    showUndoButton();
                });
            });
        }

        // Render Queue Confirm
        var btnConfirmRender = document.getElementById("btnConfirmRender");
        if (btnConfirmRender) {
            btnConfirmRender.addEventListener("click", function () {
                callHost("EasyHost.quickRenderQueue()", function () {
                    closeModal("modalRenderQueue");
                });
            });
        }

        var btnConfirmSnapshot = document.getElementById("btnConfirmSnapshot");
        if (btnConfirmSnapshot) {
            btnConfirmSnapshot.addEventListener("click", function () {
                callHost("EasyHost.saveSnapshotFrame()", function () {
                    closeModal("modalRenderQueue");
                });
            });
        }
    }

    function showToast(message) {
        setStatus(message, "purple");
    }

    function setupTheme() {
        // Enforce the requested purple theme
        document.documentElement.style.setProperty("--purple-primary", "#a855f7");
        document.documentElement.style.setProperty("--purple-light", "#c084fc");
        document.documentElement.style.setProperty("--purple-dark", "#7e22ce");
    }

    return {
        init: init,
        callHost: callHost,
        setStatus: setStatus,
        showToast: showToast,
        openModal: openModal,
        closeModal: closeModal
    };
})();

document.addEventListener("DOMContentLoaded", function () {
    window.App.init();
});

