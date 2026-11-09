/**
 * Easy Toolkit - Presets Module (Screenshot 804)
 */

var PresetsModule = (function () {
    var presets = [];
    var currentFolder = "All";

    function init() {
        loadPresets();
        render();
        setupEvents();
    }

    function loadPresets() {
        try {
            var raw = localStorage.getItem("easy_layer_presets");
            if (raw) {
                presets = JSON.parse(raw);
            } else {
                // Initial empty state as seen in Screenshot 804
                presets = [];
            }
        } catch (e) {
            presets = [];
        }
    }

    function savePresets() {
        localStorage.setItem("easy_layer_presets", JSON.stringify(presets));
    }

    function render() {
        var emptyContainer = document.getElementById("presetsEmptyState");
        var listContainer = document.getElementById("presetsListContainer");
        if (!emptyContainer || !listContainer) return;

        if (presets.length === 0) {
            emptyContainer.style.display = "flex";
            listContainer.style.display = "none";
        } else {
            emptyContainer.style.display = "none";
            listContainer.style.display = "grid";
            listContainer.innerHTML = "";

            var filtered = currentFolder === "All" ? presets : presets.filter(function (p) {
                return p.folder === currentFolder;
            });

            for (var i = 0; i < filtered.length; i++) {
                var p = filtered[i];
                var item = document.createElement("div");
                item.className = "saved-preset-item";
                item.innerHTML = [
                    '<div class="preset-item-title">' + p.name + '</div>',
                    '<div class="preset-item-category">' + (p.folder || "General") + '</div>'
                ].join("");

                (function (preset) {
                    item.addEventListener("click", function () {
                        applyPreset(preset);
                    });
                })(p);

                listContainer.appendChild(item);
            }
        }
    }

    function setupEvents() {
        // Save preset button
        var btnSave = document.getElementById("btnSavePreset");
        if (btnSave) {
            btnSave.addEventListener("click", function () {
                window.App.openModal("modalSavePreset");
            });
        }

        // Folder button
        var btnFolder = document.getElementById("btnPresetFolder");
        if (btnFolder) {
            btnFolder.addEventListener("click", function () {
                window.App.showToast("Preset storage: Local Extension Library (JSON/FFX)");
            });
        }

        // New folder button
        var btnNewFolder = document.getElementById("btnNewFolder");
        if (btnNewFolder) {
            btnNewFolder.addEventListener("click", function () {
                var folderName = prompt("Enter new folder / category name:", "My Animations");
                if (folderName && folderName.trim() !== "") {
                    window.App.showToast("Folder '" + folderName.trim() + "' created");
                }
            });
        }
    }

    function addPreset(name, folder, propertiesData) {
        var p = {
            id: "preset_" + Date.now(),
            name: name || "Custom Preset",
            folder: folder || "General",
            data: propertiesData || {},
            created: new Date().toISOString()
        };
        presets.push(p);
        savePresets();
        render();
    }

    function applyPreset(preset) {
        window.App.callHost("EasyHost.createTextLayer('" + preset.name + "')", function (res) {
            window.App.showToast("Applied preset: " + preset.name);
        });
    }

    return {
        init: init,
        render: render,
        addPreset: addPreset,
        applyPreset: applyPreset,
        getPresets: function () { return presets; }
    };
})();

