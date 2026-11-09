/**
 * Easy Toolkit - Interactive Bezier Curve Editor & AE Easing Math
 */

var CurvesModule = (function () {
    // Current curve state (defaults to Expo In: 0.7, 0, 0.84, 0 matching Screenshot 801)
    var state = {
        name: "Expo In",
        mode: "value", // "value" or "speed"
        x1: 0.70,
        y1: 0.00,
        x2: 0.84,
        y2: 0.00,
        activeHandle: null, // "p1" or "p2"
        dragging: false
    };

    var defaultPresets = [
        { name: "Linear", x1: 0.0, y1: 0.0, x2: 1.0, y2: 1.0 },
        { name: "Easy Ease", x1: 0.33, y1: 0.0, x2: 0.67, y2: 1.0 },
        { name: "Smooth", x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 },
        { name: "Silk", x1: 0.16, y1: 1.0, x2: 0.30, y2: 1.0 },
        { name: "Expo Out", x1: 0.19, y1: 1.0, x2: 0.22, y2: 1.0 },
        { name: "Expo In", x1: 0.70, y1: 0.0, x2: 0.84, y2: 0.0 },
        { name: "Punch", x1: 0.85, y1: 0.0, x2: 0.15, y2: 1.0 },
        { name: "Snap Out", x1: 0.05, y1: 0.9, x2: 0.10, y2: 1.0 },
        { name: "Glide", x1: 0.40, y1: 0.0, x2: 0.20, y2: 1.0 },
        { name: "Pop", x1: 0.34, y1: 1.5, x2: 0.64, y2: 1.0 },
        { name: "Bounce", x1: 0.68, y1: -0.5, x2: 0.27, y2: 1.5 }
    ];

    var customPresets = [];
    var canvas, ctx;
    var padding = 28;

    function init() {
        canvas = document.getElementById("curveCanvas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");

        loadCustomPresets();
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        setupEvents();
        renderPresetsList();
        draw();
    }

    function resizeCanvas() {
        if (!canvas) return;
        var rect = canvas.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        draw();
    }

    function setupEvents() {
        canvas.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        // Touch support
        canvas.addEventListener("touchstart", function (e) {
            var touch = e.touches[0];
            onMouseDown({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: function(){} });
        });
        window.addEventListener("touchmove", function (e) {
            if (state.dragging) {
                var touch = e.touches[0];
                onMouseMove({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: function(){} });
            }
        });
        window.addEventListener("touchend", onMouseUp);

        // Flip button
        var btnFlip = document.getElementById("btnFlipCurve");
        if (btnFlip) {
            btnFlip.addEventListener("click", function () {
                var newX1 = Math.round((1 - state.x2) * 100) / 100;
                var newY1 = Math.round((1 - state.y2) * 100) / 100;
                var newX2 = Math.round((1 - state.x1) * 100) / 100;
                var newY2 = Math.round((1 - state.y1) * 100) / 100;
                state.x1 = newX1;
                state.y1 = newY1;
                state.x2 = newX2;
                state.y2 = newY2;
                state.name = "Custom (Flipped)";
                updateUI();
                draw();
            });
        }

        // Invert button
        var btnInvert = document.getElementById("btnInvertCurve");
        if (btnInvert) {
            btnInvert.addEventListener("click", function () {
                state.y1 = Math.round((1 - state.y1) * 100) / 100;
                state.y2 = Math.round((1 - state.y2) * 100) / 100;
                state.name = "Custom (Inverted)";
                updateUI();
                draw();
            });
        }

        // Reset button
        var btnReset = document.getElementById("btnResetCurve");
        if (btnReset) {
            btnReset.addEventListener("click", function () {
                setPreset("Expo In");
            });
        }

        // Mode buttons: Value vs Speed
        var modeVal = document.getElementById("modeValue");
        var modeSpeed = document.getElementById("modeSpeed");
        if (modeVal && modeSpeed) {
            modeVal.addEventListener("click", function () {
                state.mode = "value";
                modeVal.classList.add("active");
                modeSpeed.classList.remove("active");
                draw();
            });
            modeSpeed.addEventListener("click", function () {
                state.mode = "speed";
                modeSpeed.classList.add("active");
                modeVal.classList.remove("active");
                draw();
            });
        }
    }

    function getGraphBounds() {
        var rect = canvas.getBoundingClientRect();
        return {
            x: padding,
            y: padding,
            w: rect.width - padding * 2,
            h: rect.height - padding * 2
        };
    }

    function normToCanvas(normX, normY) {
        var b = getGraphBounds();
        return {
            x: b.x + normX * b.w,
            y: b.y + (1 - normY) * b.h
        };
    }

    function canvasToNorm(canvX, canvY) {
        var b = getGraphBounds();
        var normX = (canvX - b.x) / b.w;
        var normY = 1 - (canvY - b.y) / b.h;
        return {
            x: Math.max(0, Math.min(1, normX)),
            y: Math.max(-0.5, Math.min(1.5, normY))
        };
    }

    function onMouseDown(e) {
        var rect = canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        var p1 = normToCanvas(state.x1, state.y1);
        var p2 = normToCanvas(state.x2, state.y2);

        var hitDist = 18;
        var dist1 = Math.hypot(mx - p1.x, my - p1.y);
        var dist2 = Math.hypot(mx - p2.x, my - p2.y);

        if (dist1 < hitDist) {
            state.activeHandle = "p1";
            state.dragging = true;
        } else if (dist2 < hitDist) {
            state.activeHandle = "p2";
            state.dragging = true;
        }
    }

    function onMouseMove(e) {
        if (!state.dragging || !state.activeHandle) return;

        var rect = canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        var norm = canvasToNorm(mx, my);

        if (state.activeHandle === "p1") {
            state.x1 = Math.round(norm.x * 100) / 100;
            state.y1 = Math.round(norm.y * 100) / 100;
        } else if (state.activeHandle === "p2") {
            state.x2 = Math.round(norm.x * 100) / 100;
            state.y2 = Math.round(norm.y * 100) / 100;
        }

        state.name = "Custom";
        updateUI();
        draw();
    }

    function onMouseUp() {
        state.dragging = false;
        state.activeHandle = null;
    }

    function draw() {
        if (!ctx || !canvas) return;
        var rect = canvas.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;

        ctx.clearRect(0, 0, w, h);

        var b = getGraphBounds();

        // 1. Draw Grid lines & percentage labels
        ctx.strokeStyle = "rgba(168, 85, 247, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);

        var steps = [0, 0.25, 0.50, 0.75, 1.0];
        ctx.fillStyle = "#6b6387";
        ctx.font = "9px -apple-system, Segoe UI, sans-serif";
        ctx.textAlign = "right";

        for (var i = 0; i < steps.length; i++) {
            var s = steps[i];
            var pos = normToCanvas(0, s);
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(b.x, pos.y);
            ctx.lineTo(b.x + b.w, pos.y);
            ctx.stroke();

            // Y labels (0%, 25%, 50%, 75%, 100%)
            ctx.fillText(Math.round(s * 100) + "%", b.x - 6, pos.y + 3);
        }

        ctx.textAlign = "center";
        for (var j = 0; j < steps.length; j++) {
            var sj = steps[j];
            var posx = normToCanvas(sj, 0);
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(posx.x, b.y);
            ctx.lineTo(posx.x, b.y + b.h);
            ctx.stroke();

            // X labels
            ctx.fillText(Math.round(sj * 100) + "%", posx.x, b.y + b.h + 14);
        }

        ctx.setLineDash([]); // Reset dashed

        // 2. Control Points Tangent Lines
        var p0 = normToCanvas(0, 0);
        var p1 = normToCanvas(state.x1, state.y1);
        var p2 = normToCanvas(state.x2, state.y2);
        var p3 = normToCanvas(1, 1);

        // Arm 1
        ctx.strokeStyle = "rgba(192, 132, 252, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        // Arm 2
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // 3. Draw Bezier Curve
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(168, 85, 247, 0.7)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // 4. Draw Start & End Points
        ctx.fillStyle = "#a19bb8";
        ctx.beginPath();
        ctx.arc(p0.x, p0.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p3.x, p3.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // 5. Draw Draggable Handle Circles
        // Handle 1
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#161224";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Small center dot in handle
        ctx.fillStyle = "#c084fc";
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Handle 2
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#161224";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#c084fc";
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function updateUI() {
        var nameElem = document.getElementById("curvePresetName");
        if (nameElem) nameElem.textContent = state.name;

        var coordsElem = document.getElementById("curveCoordsText");
        if (coordsElem) {
            coordsElem.textContent = state.x1 + ", " + state.y1 + ", " + state.x2 + ", " + state.y2;
        }

        // Highlight active preset card
        var cards = document.querySelectorAll(".curve-preset-card");
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].getAttribute("data-preset") === state.name) {
                cards[i].classList.add("active");
            } else {
                cards[i].classList.remove("active");
            }
        }
    }

    function setPreset(name) {
        var allPresets = defaultPresets.concat(customPresets);
        for (var i = 0; i < allPresets.length; i++) {
            if (allPresets[i].name === name) {
                state.name = allPresets[i].name;
                state.x1 = allPresets[i].x1;
                state.y1 = allPresets[i].y1;
                state.x2 = allPresets[i].x2;
                state.y2 = allPresets[i].y2;
                updateUI();
                draw();
                return;
            }
        }
    }

    function renderPresetsList() {
        var container = document.getElementById("curvePresetsGrid");
        if (!container) return;
        container.innerHTML = "";

        var all = defaultPresets.concat(customPresets);
        for (var i = 0; i < all.length; i++) {
            var p = all[i];
            var card = document.createElement("div");
            card.className = "curve-preset-card" + (p.name === state.name ? " active" : "");
            card.setAttribute("data-preset", p.name);

            // Generate SVG curve preview path
            var sx = 4, sy = 20, ex = 32, ey = 4;
            var c1x = sx + p.x1 * (ex - sx);
            var c1y = sy - p.y1 * (sy - ey);
            var c2x = sx + p.x2 * (ex - sx);
            var c2y = sy - p.y2 * (sy - ey);
            var d = "M " + sx + " " + sy + " C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + ex + " " + ey;

            var isCustom = i >= defaultPresets.length;
            var delHtml = isCustom ? '<span class="btn-del-preset" data-del="' + p.name + '">&times;</span>' : '';

            card.innerHTML = [
                '<svg class="curve-preview" viewBox="0 0 36 24">',
                '  <path d="' + d + '" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>',
                '</svg>',
                '<div class="preset-name">' + p.name + '</div>',
                delHtml
            ].join("");

            (function (presetName) {
                card.addEventListener("click", function (e) {
                    if (e.target.classList.contains("btn-del-preset")) {
                        deleteCustomPreset(presetName);
                        e.stopPropagation();
                        return;
                    }
                    setPreset(presetName);
                });
            })(p.name);

            container.appendChild(card);
        }
    }

    function loadCustomPresets() {
        try {
            var raw = localStorage.getItem("easy_curve_presets");
            if (raw) {
                customPresets = JSON.parse(raw);
            }
        } catch (e) {
            customPresets = [];
        }
    }

    function saveCustomPreset(name) {
        if (!name || name.trim() === "") return;
        var p = {
            name: name.trim(),
            x1: state.x1,
            y1: state.y1,
            x2: state.x2,
            y2: state.y2
        };
        customPresets.push(p);
        localStorage.setItem("easy_curve_presets", JSON.stringify(customPresets));
        state.name = p.name;
        renderPresetsList();
        updateUI();
    }

    function deleteCustomPreset(name) {
        customPresets = customPresets.filter(function (item) { return item.name !== name; });
        localStorage.setItem("easy_curve_presets", JSON.stringify(customPresets));
        if (state.name === name) {
            setPreset("Expo In");
        }
        renderPresetsList();
    }

    function setEasingValues(x1, y1, x2, y2, name) {
        state.x1 = x1;
        state.y1 = y1;
        state.x2 = x2;
        state.y2 = y2;
        state.name = name || "Read from Keys";
        updateUI();
        draw();
    }

    return {
        init: init,
        draw: draw,
        getState: function () { return state; },
        setPreset: setPreset,
        setEasingValues: setEasingValues,
        saveCustomPreset: saveCustomPreset
    };
})();

