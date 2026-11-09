/**
 * Motion Vibe Light - After Effects ExtendScript Engine (JSX)
 * Compatible with Adobe After Effects CS6 through CC 2025+
 * (Strict ES3 syntax for ExtendScript engine & cross-language compatibility)
 */

var MotionVibe = (function () {
    var self = {};

    self.ping = function () {
        return "PONG: Motion Vibe Light ExtendScript Ready (AE " + app.version + ")";
    };

    // Helper: get or create active comp (CS6 through CC 2025+)
    self.getOrCreateComp = function (compName) {
        if (app.project === null) {
            app.newProject();
        }

        var activeItem = app.project.activeItem;
        if (activeItem && activeItem instanceof CompItem) {
            return activeItem;
        }

        // Search project for existing comp
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i) instanceof CompItem) {
                return app.project.item(i);
            }
        }

        // Create new comp: 1920x1080 @ 30fps, 5 seconds
        var name = compName || "Motion Vibe Light Comp";
        return app.project.items.addComp(name, 1920, 1080, 1.0, 5.0, 30);
    };

    // Helper: Universal match-name / index property finder across AE versions & languages
    self.getRootVectors = function (shapeLayer) {
        if (!shapeLayer) return null;
        return shapeLayer.property("ADBE Root Vectors Group") || shapeLayer.property("Contents") || shapeLayer.property(2);
    };

    self.getGroupVectors = function (shapeGroup) {
        if (!shapeGroup) return null;
        return shapeGroup.property("ADBE Vectors Group") || shapeGroup.property("Contents") || shapeGroup.property(2);
    };

    self.setVectorProp = function (parentProp, matchName, displayName, index, value) {
        if (!parentProp) return null;
        var p = null;
        try { p = parentProp.property(matchName); } catch (e1) { }
        if (!p) {
            try { p = parentProp.property(displayName); } catch (e2) { }
        }
        if (!p && index !== undefined) {
            try { p = parentProp.property(index); } catch (e3) { }
        }
        if (p && value !== undefined) {
            try {
                if (value instanceof Array) {
                    var valType = p.propertyValueType;
                    if (valType === PropertyValueType.COLOR) {
                        if (value.length === 3) value = [value[0], value[1], value[2], 1.0];
                    } else if (valType === PropertyValueType.TwoD || valType === PropertyValueType.TwoD_SPATIAL) {
                        if (value.length === 3) value = [value[0], value[1]];
                    } else if (valType === PropertyValueType.ThreeD || valType === PropertyValueType.ThreeD_SPATIAL) {
                        if (value.length === 2) value = [value[0], value[1], 0];
                    }
                }
                p.setValue(value);
            } catch (errSet) {
                try {
                    if (value instanceof Array && value.length === 4) {
                        p.setValue([value[0], value[1], value[2]]);
                    } else if (value instanceof Array && value.length === 3) {
                        p.setValue([value[0], value[1], value[2], 1.0]);
                    }
                } catch (eFallback) { }
            }
        }
        return p;
    };

    // Helper: Cross-version text document formatting
    self.setTextProperties = function (textLayer, textStr, fontSize, fontColor, tracking) {
        if (!textLayer) return;
        var textProp = textLayer.property("ADBE Text Properties");
        if (textProp) {
            textProp = textProp.property("ADBE Text Document") || textProp.property(1);
        } else {
            textProp = textLayer.property("Source Text");
        }
        if (!textProp) return;

        var textDoc = textProp.value;
        if (textStr !== undefined && textStr !== null) {
            textDoc.text = textStr;
        }
        if (fontSize) {
            textDoc.fontSize = fontSize;
        }
        if (fontColor) {
            textDoc.applyFill = true;
            textDoc.fillColor = (fontColor.length === 4) ? [fontColor[0], fontColor[1], fontColor[2]] : fontColor;
        }
        if (tracking !== undefined) {
            textDoc.tracking = tracking;
        }
        try {
            textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        } catch (e) { }

        try {
            textProp.setValue(textDoc);
        } catch (eDoc) { }
        return textProp;
    };

    // Add keyframe helper - supports 1D, 2D, and 3D properties across all AE versions
    self.addEaseKeyframes = function (prop, times, values) {
        if (!prop || !times || !values) return;

        var reqLen = 1;
        try {
            if (prop.value && typeof prop.value.length === "number") {
                reqLen = prop.value.length;
            }
        } catch (eLen) { }

        for (var i = 0; i < times.length; i++) {
            var v = values[i];
            if (v instanceof Array) {
                if (reqLen === 2 && v.length === 3) {
                    v = [v[0], v[1]];
                } else if (reqLen === 3 && v.length === 2) {
                    v = [v[0], v[1], 100];
                }
            }
            try {
                prop.setValueAtTime(times[i], v);
            } catch (eSet) { }
        }

        try {
            var numDims = reqLen;
            var easeInList = [];
            var easeOutList = [];
            for (var d = 0; d < numDims; d++) {
                easeInList.push(new KeyframeEase(0, 75));
                easeOutList.push(new KeyframeEase(0, 75));
            }

            for (var k = 1; k <= prop.numKeys; k++) {
                prop.setTemporalEaseAtKey(k, easeInList, easeOutList);
            }
        } catch (e) { }
    };

    // Helper: Set in/out times for layers
    self.setLayerTiming = function (layer, curTime, duration) {
        if (!layer) return;
        var dur = duration || 5.0;
        try {
            layer.startTime = curTime;
            layer.inPoint = curTime;
            layer.outPoint = curTime + dur;
        } catch (e) { }
    };

    // Main entry point called from CEP JavaScript
    self.applyAsset = function (assetJsonString) {
        try {
            app.beginUndoGroup("Apply Motion Vibe Asset");

            var comp = self.getOrCreateComp();
            var asset = self.parseJSON(assetJsonString);
            var result = "";

            if (!asset || !asset.type) {
                app.endUndoGroup();
                return "ERROR: Invalid asset data received.";
            }

            var type = asset.type;
            var name = asset.name || "Vibe Asset";

            if (type.indexOf("brand-") === 0) {
                result = self.buildBrandBadge(comp, asset);
            } else if (type === "single-star" || type === "five-star") {
                result = self.buildStarRating(comp, asset);
            } else if (type === "customer-review") {
                result = self.buildCustomerReviewCard(comp, asset);
            } else if (type === "bookmark") {
                result = self.buildBookmark(comp, asset);
            } else if (type.indexOf("swipe-up") === 0) {
                result = self.buildSwipeUp(comp, asset);
            } else if (type === "bell-icon") {
                result = self.buildBellAlert(comp, asset);
            } else if (type === "map-pin" || type.indexOf("map-") === 0) {
                result = self.buildMapPin(comp, asset);
            } else if (type === "pill-notification" || type === "chat-bubbles") {
                result = self.buildNotificationCard(comp, asset);
            } else if (type.indexOf("counter-") === 0) {
                result = self.buildNumberCounter(comp, asset);
            } else if (type.indexOf("chart-") === 0) {
                result = self.buildChart(comp, asset);
            } else if (type.indexOf("glass-") === 0) {
                result = self.buildGlassCard(comp, asset);
            } else if (type.indexOf("text-") === 0) {
                result = self.buildKineticText(comp, asset);
            } else if (type.indexOf("callout-") === 0) {
                result = self.buildCallout(comp, asset);
            } else if (type.indexOf("tr-") === 0) {
                result = self.buildTransition(comp, asset);
            } else {
                result = self.buildGenericBadge(comp, asset);
            }

            app.endUndoGroup();
            return "SUCCESS: Added '" + name + "' to composition.";
        } catch (err) {
            app.endUndoGroup();
            return "ERROR: " + err.toString();
        }
    };

    // =========================================================================
    // 1. BRAND BADGES & SOCIAL MEDIA ELEMENTS (With full vector emblems & icons)
    // =========================================================================
    self.buildBrandBadge = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var centerPos = [comp.width / 2, comp.height / 2];

        // Route to specialized widgets if matched
        if (asset.id === "dis-01" || asset.name.indexOf("Server Invite") !== -1) {
            return self.buildDiscordInviteCard(comp, asset, curTime, centerPos);
        }
        if (asset.id === "beh-01" || asset.name.indexOf("Follow Button") !== -1) {
            return self.buildFollowPillButton(comp, asset, curTime, centerPos);
        }
        if (asset.id === "yt-01" || asset.name.indexOf("Subscribe") !== -1) {
            return self.buildYouTubeSubscribePill(comp, asset, curTime, centerPos);
        }

        // Main shape layer for badge
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = asset.name || "Brand Badge";
        shapeLayer.transform.position.setValue(centerPos);
        self.setLayerTiming(shapeLayer, curTime, 5.0);

        // Circle Badge Background
        var contents = self.getRootVectors(shapeLayer);
        var shapeGroup = contents.addProperty("ADBE Vector Group");
        shapeGroup.name = "Badge Circle";
        var groupContents = self.getGroupVectors(shapeGroup);

        var ellipse = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(ellipse, "ADBE Vector Ellipse Size", "Size", 2, [140, 140]);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        var color = [0.1, 0.5, 0.9, 1.0]; // default blue
        if (asset.type === "brand-youtube") color = [0.95, 0.1, 0.1, 1.0];
        if (asset.type === "brand-discord") color = [0.345, 0.396, 0.949, 1.0];
        if (asset.type === "brand-spotify") color = [0.114, 0.725, 0.329, 1.0];
        if (asset.type === "brand-whatsapp") color = [0.145, 0.827, 0.40, 1.0];
        if (asset.type === "brand-behance") color = [0.0, 0.341, 1.0, 1.0];
        if (asset.type === "brand-dribbble") color = [0.918, 0.298, 0.537, 1.0];
        if (asset.type === "brand-snapchat") color = [1.0, 0.98, 0.0, 1.0];
        if (asset.type === "brand-x") color = [0.06, 0.06, 0.06, 1.0];
        if (asset.type === "brand-facebook") color = [0.094, 0.467, 0.949, 1.0];
        if (asset.type === "brand-instagram") color = [0.88, 0.19, 0.42, 1.0];
        if (asset.type === "brand-telegram") color = [0.133, 0.62, 0.851, 1.0];
        if (asset.type === "brand-linkedin") color = [0.039, 0.4, 0.76, 1.0];
        if (asset.type === "brand-pinterest") color = [0.9, 0.0, 0.137, 1.0];
        if (asset.type === "brand-reddit") color = [1.0, 0.27, 0.0, 1.0];
        if (asset.type === "brand-threads") color = [0.08, 0.08, 0.08, 1.0];
        if (asset.type === "brand-tinder") color = [0.99, 0.31, 0.41, 1.0];
        if (asset.type === "brand-wechat") color = [0.027, 0.757, 0.376, 1.0];
        if (asset.type === "brand-google") color = [0.26, 0.52, 0.96, 1.0];

        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, color);

        // BUILD VECTOR EMBLEM / ICON INSIDE BADGE
        self.buildBrandEmblem(comp, shapeLayer, asset, color, curTime);

        // Animated scale pop
        self.addEaseKeyframes(
            shapeLayer.transform.scale,
            [curTime, curTime + 0.3, curTime + 0.45],
            [[0, 0, 100], [115, 115, 100], [100, 100, 100]]
        );

        // Add label text under badge
        var textContent = asset.name.replace("Brand Icon", "").replace("Logo", "").replace("Minimal Icon", "").replace("Pro Badge", "");
        if (textContent.indexOf("SocialMedia") === 0) {
            textContent = asset.type.replace("brand-", "").toUpperCase();
        }
        var textLayer = comp.layers.addText(textContent);
        textLayer.name = (asset.name || "Brand") + " Label";
        textLayer.parent = shapeLayer;
        self.setLayerTiming(textLayer, curTime, 5.0);
        self.setTextProperties(textLayer, textContent, 28, [1, 1, 1, 1]);
        textLayer.transform.position.setValue([0, 110]);

        // Position playhead at resting state so user immediately sees the complete graphic!
        try {
            comp.time = curTime + 0.45;
        } catch (eTime) { }

        return "Brand Badge Created";
    };

    // Helper: Build authentic vector emblem / icon for each brand
    self.buildBrandEmblem = function (comp, shapeLayer, asset, brandColor, curTime) {
        var contents = self.getRootVectors(shapeLayer);
        var type = asset.type;

        // 1. DISCORD EMBLEM (Clyde robot face with eyes & cutouts)
        if (type === "brand-discord") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "Discord Emblem";
            var iv = self.getGroupVectors(iconGroup);

            // White face body
            var faceRect = iv.addProperty("ADBE Vector Shape - Rect");
            self.setVectorProp(faceRect, "ADBE Vector Rect Size", "Size", 2, [68, 46]);
            self.setVectorProp(faceRect, "ADBE Vector Rect Roundness", "Roundness", 3, 18);
            var faceFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(faceFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

            // Top cutout bridge
            var topCut = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(topCut, "ADBE Vector Ellipse Size", "Size", 2, [42, 14]);
            self.setVectorProp(topCut, "ADBE Vector Ellipse Position", "Position", 3, [0, -23]);
            var topCutFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(topCutFill, "ADBE Vector Fill Color", "Color", 3, brandColor);

            // Bottom cutout
            var botCut = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(botCut, "ADBE Vector Ellipse Size", "Size", 2, [34, 14]);
            self.setVectorProp(botCut, "ADBE Vector Ellipse Position", "Position", 3, [0, 23]);
            var botCutFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(botCutFill, "ADBE Vector Fill Color", "Color", 3, brandColor);

            // Left Eye
            var eyeL = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(eyeL, "ADBE Vector Ellipse Size", "Size", 2, [14, 18]);
            self.setVectorProp(eyeL, "ADBE Vector Ellipse Position", "Position", 3, [-15, 2]);
            var eyeLFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(eyeLFill, "ADBE Vector Fill Color", "Color", 3, brandColor);

            // Right Eye
            var eyeR = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(eyeR, "ADBE Vector Ellipse Size", "Size", 2, [14, 18]);
            self.setVectorProp(eyeR, "ADBE Vector Ellipse Position", "Position", 3, [15, 2]);
            var eyeRFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(eyeRFill, "ADBE Vector Fill Color", "Color", 3, brandColor);

            // Online Badge indicator if applicable
            if (asset.id === "dis-02" || asset.name.indexOf("Online") !== -1) {
                var statusDot = iv.addProperty("ADBE Vector Shape - Ellipse");
                self.setVectorProp(statusDot, "ADBE Vector Ellipse Size", "Size", 2, [24, 24]);
                self.setVectorProp(statusDot, "ADBE Vector Ellipse Position", "Position", 3, [42, 42]);
                var statusFill = iv.addProperty("ADBE Vector Graphic - Fill");
                self.setVectorProp(statusFill, "ADBE Vector Fill Color", "Color", 3, [0.18, 0.8, 0.44, 1.0]);
                var statusStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
                self.setVectorProp(statusStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
                self.setVectorProp(statusStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 3.5);
            }
            return;
        }

        // 2. YOUTUBE EMBLEM (White Play Triangle)
        if (type === "brand-youtube") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "YouTube Play Button";
            var iv = self.getGroupVectors(iconGroup);

            var poly = iv.addProperty("ADBE Vector Shape - Star");
            self.setVectorProp(poly, "ADBE Vector Star Type", "Type", 1, 2);
            self.setVectorProp(poly, "ADBE Vector Star Points", "Points", 2, 3);
            self.setVectorProp(poly, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 26);
            self.setVectorProp(poly, "ADBE Vector Star Rotation", "Rotation", 4, 90);
            self.setVectorProp(poly, "ADBE Vector Star Position", "Position", 3, [4, 0]);

            var playFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(playFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);
            return;
        }

        // 3. INSTAGRAM EMBLEM (Camera Outline, Lens Circle, Flash Dot)
        if (type === "brand-instagram") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "Instagram Camera";
            var iv = self.getGroupVectors(iconGroup);

            // Camera body
            var camBody = iv.addProperty("ADBE Vector Shape - Rect");
            self.setVectorProp(camBody, "ADBE Vector Rect Size", "Size", 2, [66, 66]);
            self.setVectorProp(camBody, "ADBE Vector Rect Roundness", "Roundness", 3, 18);
            var camStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(camStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
            self.setVectorProp(camStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 5.5);

            // Lens circle
            var camLens = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(camLens, "ADBE Vector Ellipse Size", "Size", 2, [28, 28]);
            var lensStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(lensStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
            self.setVectorProp(lensStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 5.5);

            // Flash dot
            var flashDot = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(flashDot, "ADBE Vector Ellipse Size", "Size", 2, [8, 8]);
            self.setVectorProp(flashDot, "ADBE Vector Ellipse Position", "Position", 3, [18, -18]);
            var flashFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(flashFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);
            return;
        }

        // 4. DRIBBLE EMBLEM (Basketball Seams)
        if (type === "brand-dribbble") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "Dribbble Basketball";
            var iv = self.getGroupVectors(iconGroup);

            var ballOutline = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(ballOutline, "ADBE Vector Ellipse Size", "Size", 2, [76, 76]);
            var ballStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(ballStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
            self.setVectorProp(ballStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 4.5);

            var seamDiag = iv.addProperty("ADBE Vector Shape - Rect");
            self.setVectorProp(seamDiag, "ADBE Vector Rect Size", "Size", 2, [4.5, 76]);
            self.setVectorProp(seamDiag, "ADBE Vector Rect Rotation", "Rotation", 1, 45);
            var seamDiagFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(seamDiagFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

            var seamL = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(seamL, "ADBE Vector Ellipse Size", "Size", 2, [52, 76]);
            self.setVectorProp(seamL, "ADBE Vector Ellipse Position", "Position", 3, [-18, 0]);
            var seamLStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(seamLStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
            self.setVectorProp(seamLStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 4);

            var seamR = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(seamR, "ADBE Vector Ellipse Size", "Size", 2, [52, 76]);
            self.setVectorProp(seamR, "ADBE Vector Ellipse Position", "Position", 3, [18, 0]);
            var seamRStroke = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(seamRStroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
            self.setVectorProp(seamRStroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 4);
            return;
        }

        // 5. SPOTIFY EMBLEM (3 Soundwave Arcs)
        if (type === "brand-spotify") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "Spotify Soundwaves";
            var iv = self.getGroupVectors(iconGroup);

            var wave1 = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(wave1, "ADBE Vector Ellipse Size", "Size", 2, [72, 40]);
            self.setVectorProp(wave1, "ADBE Vector Ellipse Position", "Position", 3, [0, -14]);
            var strk1 = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(strk1, "ADBE Vector Stroke Color", "Color", 3, [0.08, 0.08, 0.08, 1]);
            self.setVectorProp(strk1, "ADBE Vector Stroke Width", "Stroke Width", 4, 7);

            var wave2 = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(wave2, "ADBE Vector Ellipse Size", "Size", 2, [56, 32]);
            self.setVectorProp(wave2, "ADBE Vector Ellipse Position", "Position", 3, [0, 2]);
            var strk2 = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(strk2, "ADBE Vector Stroke Color", "Color", 3, [0.08, 0.08, 0.08, 1]);
            self.setVectorProp(strk2, "ADBE Vector Stroke Width", "Stroke Width", 4, 6.5);

            var wave3 = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(wave3, "ADBE Vector Ellipse Size", "Size", 2, [42, 24]);
            self.setVectorProp(wave3, "ADBE Vector Ellipse Position", "Position", 3, [0, 16]);
            var strk3 = iv.addProperty("ADBE Vector Graphic - Stroke");
            self.setVectorProp(strk3, "ADBE Vector Stroke Color", "Color", 3, [0.08, 0.08, 0.08, 1]);
            self.setVectorProp(strk3, "ADBE Vector Stroke Width", "Stroke Width", 4, 6);
            return;
        }

        // 6. WHATSAPP EMBLEM (Speech Bubble + Handset)
        if (type === "brand-whatsapp") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "WhatsApp Emblem";
            var iv = self.getGroupVectors(iconGroup);

            var bubble = iv.addProperty("ADBE Vector Shape - Ellipse");
            self.setVectorProp(bubble, "ADBE Vector Ellipse Size", "Size", 2, [74, 74]);
            var bFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(bFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

            var tail = iv.addProperty("ADBE Vector Shape - Star");
            self.setVectorProp(tail, "ADBE Vector Star Type", "Type", 1, 2);
            self.setVectorProp(tail, "ADBE Vector Star Points", "Points", 2, 3);
            self.setVectorProp(tail, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 14);
            self.setVectorProp(tail, "ADBE Vector Star Rotation", "Rotation", 4, 125);
            self.setVectorProp(tail, "ADBE Vector Star Position", "Position", 3, [-26, 26]);
            var tFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(tFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

            // Phone receiver glyph inside white bubble
            var phoneGlyph = comp.layers.addText("📞");
            phoneGlyph.name = "WhatsApp Phone";
            phoneGlyph.parent = shapeLayer;
            self.setLayerTiming(phoneGlyph, curTime, 5.0);
            self.setTextProperties(phoneGlyph, "📞", 38, [0.145, 0.827, 0.40, 1]);
            phoneGlyph.transform.position.setValue([0, 14]);
            return;
        }

        // 7. TELEGRAM EMBLEM (Paper Airplane)
        if (type === "brand-telegram") {
            var iconGroup = contents.addProperty("ADBE Vector Group");
            iconGroup.name = "Telegram Paper Airplane";
            var iv = self.getGroupVectors(iconGroup);

            var planeShape = iv.addProperty("ADBE Vector Shape - Star");
            self.setVectorProp(planeShape, "ADBE Vector Star Type", "Type", 1, 2);
            self.setVectorProp(planeShape, "ADBE Vector Star Points", "Points", 2, 3);
            self.setVectorProp(planeShape, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 34);
            self.setVectorProp(planeShape, "ADBE Vector Star Rotation", "Rotation", 4, 45);
            self.setVectorProp(planeShape, "ADBE Vector Star Position", "Position", 3, [-3, 3]);

            var pFill = iv.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(pFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);
            return;
        }

        // 8. TEXT / GLYPH BRANDS (Behance, Facebook, X, LinkedIn, Pinterest, Google, Threads, Snapchat, Reddit, Tinder, WeChat)
        var glyphText = "";
        var glyphFontSize = 58;
        var glyphOffset = [0, 20];

        if (type === "brand-behance") {
            glyphText = "Bē";
            glyphFontSize = 56;
            glyphOffset = [0, 20];
        } else if (type === "brand-facebook") {
            glyphText = "f";
            glyphFontSize = 84;
            glyphOffset = [10, 26];
        } else if (type === "brand-x") {
            glyphText = "𝕏";
            glyphFontSize = 66;
            glyphOffset = [0, 22];
        } else if (type === "brand-linkedin") {
            glyphText = "in";
            glyphFontSize = 58;
            glyphOffset = [0, 20];
        } else if (type === "brand-pinterest") {
            glyphText = "P";
            glyphFontSize = 72;
            glyphOffset = [0, 24];
        } else if (type === "brand-google") {
            glyphText = "G";
            glyphFontSize = 66;
            glyphOffset = [0, 22];
        } else if (type === "brand-threads") {
            glyphText = "@";
            glyphFontSize = 62;
            glyphOffset = [0, 20];
        } else if (type === "brand-snapchat") {
            glyphText = "👻";
            glyphFontSize = 54;
            glyphOffset = [0, 18];
        } else if (type === "brand-reddit") {
            glyphText = "👾";
            glyphFontSize = 54;
            glyphOffset = [0, 18];
        } else if (type === "brand-tinder") {
            glyphText = "🔥";
            glyphFontSize = 54;
            glyphOffset = [0, 18];
        } else if (type === "brand-wechat") {
            glyphText = "💬";
            glyphFontSize = 52;
            glyphOffset = [0, 18];
        }

        if (glyphText) {
            var glyphLayer = comp.layers.addText(glyphText);
            glyphLayer.name = (asset.name || "Brand") + " Emblem";
            glyphLayer.parent = shapeLayer;
            self.setLayerTiming(glyphLayer, curTime, 5.0);
            self.setTextProperties(glyphLayer, glyphText, glyphFontSize, [1, 1, 1, 1]);
            glyphLayer.transform.position.setValue(glyphOffset);
        }
    };

    // =========================================================================
    // DEDICATED SOCIAL MEDIA WIDGET BUILDERS
    // =========================================================================

    // DISCORD SERVER INVITE CARD (Matches reference UI screenshot widget)
    self.buildDiscordInviteCard = function (comp, asset, curTime, centerPos) {
        var cardNull = comp.layers.addNull();
        cardNull.name = asset.name || "Discord Server Invite";
        cardNull.transform.position.setValue(centerPos);
        self.setLayerTiming(cardNull, curTime, 5.0);

        // Card Container Shape
        var cardShape = comp.layers.addShape();
        cardShape.name = "Invite Card Frame";
        cardShape.parent = cardNull;
        self.setLayerTiming(cardShape, curTime, 5.0);

        var contents = self.getRootVectors(cardShape);
        var group = contents.addProperty("ADBE Vector Group");
        group.name = "Frame Group";
        var gContents = self.getGroupVectors(group);

        var rect = gContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [440, 190]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 20);

        var fill = gContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.18, 0.19, 0.23, 1.0]);

        var stroke = gContents.addProperty("ADBE Vector Graphic - Stroke");
        self.setVectorProp(stroke, "ADBE Vector Stroke Color", "Color", 3, [0.28, 0.29, 0.35, 1.0]);
        self.setVectorProp(stroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 2);

        // Discord Blurple Circle Badge on left
        var badgeGroup = contents.addProperty("ADBE Vector Group");
        badgeGroup.name = "Discord Logo Badge";
        var bContents = self.getGroupVectors(badgeGroup);

        var badgeCircle = bContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(badgeCircle, "ADBE Vector Ellipse Size", "Size", 2, [80, 80]);
        self.setVectorProp(badgeCircle, "ADBE Vector Ellipse Position", "Position", 3, [-140, 0]);

        var badgeFill = bContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(badgeFill, "ADBE Vector Fill Color", "Color", 3, [0.345, 0.396, 0.949, 1.0]);

        // Discord White Clyde Robot Face Emblem inside the badge
        var emblemGroup = contents.addProperty("ADBE Vector Group");
        emblemGroup.name = "Clyde Face";
        var eVectors = self.getGroupVectors(emblemGroup);

        var face = eVectors.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(face, "ADBE Vector Rect Size", "Size", 2, [46, 30]);
        self.setVectorProp(face, "ADBE Vector Rect Roundness", "Roundness", 3, 12);
        self.setVectorProp(face, "ADBE Vector Rect Position", "Position", 3, [-140, 0]);

        var fFill = eVectors.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

        // Clyde Eyes
        var eye1 = eVectors.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(eye1, "ADBE Vector Ellipse Size", "Size", 2, [10, 13]);
        self.setVectorProp(eye1, "ADBE Vector Ellipse Position", "Position", 3, [-150, 1]);
        var eye1Fill = eVectors.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(eye1Fill, "ADBE Vector Fill Color", "Color", 3, [0.345, 0.396, 0.949, 1.0]);

        var eye2 = eVectors.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(eye2, "ADBE Vector Ellipse Size", "Size", 2, [10, 13]);
        self.setVectorProp(eye2, "ADBE Vector Ellipse Position", "Position", 3, [-130, 1]);
        var eye2Fill = eVectors.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(eye2Fill, "ADBE Vector Fill Color", "Color", 3, [0.345, 0.396, 0.949, 1.0]);

        // Join Button Shape on right
        var btnGroup = contents.addProperty("ADBE Vector Group");
        btnGroup.name = "Join Button";
        var btnVectors = self.getGroupVectors(btnGroup);

        var btnRect = btnVectors.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(btnRect, "ADBE Vector Rect Size", "Size", 2, [130, 36]);
        self.setVectorProp(btnRect, "ADBE Vector Rect Roundness", "Roundness", 3, 8);
        self.setVectorProp(btnRect, "ADBE Vector Rect Position", "Position", 3, [60, 48]);

        var btnFill = btnVectors.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(btnFill, "ADBE Vector Fill Color", "Color", 3, [0.345, 0.396, 0.949, 1.0]);

        // Header Invite Text
        var headerTxt = comp.layers.addText("YOU'VE BEEN INVITED TO JOIN");
        headerTxt.parent = cardNull;
        self.setLayerTiming(headerTxt, curTime, 5.0);
        self.setTextProperties(headerTxt, "YOU'VE BEEN INVITED TO JOIN", 12, [0.65, 0.67, 0.75, 1], 100);
        headerTxt.transform.position.setValue([40, -42]);

        // Server Title Text
        var titleTxt = comp.layers.addText("Motion Vibe Community");
        titleTxt.parent = cardNull;
        self.setLayerTiming(titleTxt, curTime, 5.0);
        self.setTextProperties(titleTxt, "Motion Vibe Community", 22, [1, 1, 1, 1]);
        titleTxt.transform.position.setValue([40, -14]);

        // Server Members Stat
        var statTxt = comp.layers.addText("● 5,420 Online  ● 24,100 Members");
        statTxt.parent = cardNull;
        self.setLayerTiming(statTxt, curTime, 5.0);
        self.setTextProperties(statTxt, "● 5,420 Online  ● 24,100 Members", 13, [0.2, 0.8, 0.45, 1]);
        statTxt.transform.position.setValue([40, 14]);

        // Join Server Button Text
        var joinTxt = comp.layers.addText("Join Server");
        joinTxt.parent = cardNull;
        self.setLayerTiming(joinTxt, curTime, 5.0);
        self.setTextProperties(joinTxt, "Join Server", 15, [1, 1, 1, 1]);
        joinTxt.transform.position.setValue([60, 54]);

        // Card Pop-in animation
        self.addEaseKeyframes(
            cardNull.transform.scale,
            [curTime, curTime + 0.3, curTime + 0.45],
            [[0, 0, 100], [108, 108, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.45;
        } catch (eTime) { }

        return "Discord Server Invite Card Created";
    };

    // BEHANCE FOLLOW PILL BUTTON
    self.buildFollowPillButton = function (comp, asset, curTime, centerPos) {
        var pillNull = comp.layers.addNull();
        pillNull.name = asset.name || "Behance Follow Button";
        pillNull.transform.position.setValue(centerPos);
        self.setLayerTiming(pillNull, curTime, 5.0);

        var pillShape = comp.layers.addShape();
        pillShape.name = "Follow Pill Frame";
        pillShape.parent = pillNull;
        self.setLayerTiming(pillShape, curTime, 5.0);

        var contents = self.getRootVectors(pillShape);
        var group = contents.addProperty("ADBE Vector Group");
        var gContents = self.getGroupVectors(group);

        var rect = gContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [260, 72]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 36);

        var fill = gContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.0, 0.341, 1.0, 1.0]);

        // Behance "Bē" Emblem on left
        var logoTxt = comp.layers.addText("Bē");
        logoTxt.parent = pillNull;
        self.setLayerTiming(logoTxt, curTime, 5.0);
        self.setTextProperties(logoTxt, "Bē", 40, [1, 1, 1, 1]);
        logoTxt.transform.position.setValue([-65, 14]);

        // Divider Line
        var divGroup = contents.addProperty("ADBE Vector Group");
        divGroup.name = "Divider";
        var divVectors = self.getGroupVectors(divGroup);
        var divRect = divVectors.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(divRect, "ADBE Vector Rect Size", "Size", 2, [2, 40]);
        self.setVectorProp(divRect, "ADBE Vector Rect Position", "Position", 3, [-25, 0]);
        var divFill = divVectors.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(divFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 0.3]);

        // Follow Text on right
        var followTxt = comp.layers.addText("+ Follow");
        followTxt.parent = pillNull;
        self.setLayerTiming(followTxt, curTime, 5.0);
        self.setTextProperties(followTxt, "+ Follow", 22, [1, 1, 1, 1]);
        followTxt.transform.position.setValue([45, 8]);

        // Pop in animation
        self.addEaseKeyframes(
            pillNull.transform.scale,
            [curTime, curTime + 0.3, curTime + 0.45],
            [[0, 0, 100], [112, 112, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.45;
        } catch (eTime) { }

        return "Behance Follow Button Created";
    };

    // YOUTUBE SUBSCRIBE PILL
    self.buildYouTubeSubscribePill = function (comp, asset, curTime, centerPos) {
        var ytNull = comp.layers.addNull();
        ytNull.name = asset.name || "YouTube Subscribe & Bell";
        ytNull.transform.position.setValue(centerPos);
        self.setLayerTiming(ytNull, curTime, 5.0);

        var pillShape = comp.layers.addShape();
        pillShape.name = "Subscribe Button Frame";
        pillShape.parent = ytNull;
        self.setLayerTiming(pillShape, curTime, 5.0);

        var contents = self.getRootVectors(pillShape);
        var group = contents.addProperty("ADBE Vector Group");
        var gContents = self.getGroupVectors(group);

        var rect = gContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [280, 72]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 36);

        var fill = gContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.95, 0.05, 0.05, 1.0]);

        // YouTube Play Triangle on Left
        var poly = gContents.addProperty("ADBE Vector Shape - Star");
        self.setVectorProp(poly, "ADBE Vector Star Type", "Type", 1, 2);
        self.setVectorProp(poly, "ADBE Vector Star Points", "Points", 2, 3);
        self.setVectorProp(poly, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 18);
        self.setVectorProp(poly, "ADBE Vector Star Rotation", "Rotation", 4, 90);
        self.setVectorProp(poly, "ADBE Vector Star Position", "Position", 3, [-85, 0]);

        var polyFill = gContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(polyFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1]);

        // SUBSCRIBE Text
        var subTxt = comp.layers.addText("SUBSCRIBE");
        subTxt.parent = ytNull;
        self.setLayerTiming(subTxt, curTime, 5.0);
        self.setTextProperties(subTxt, "SUBSCRIBE", 22, [1, 1, 1, 1], 150);
        subTxt.transform.position.setValue([10, 8]);

        // Notification Bell on right
        var bellTxt = comp.layers.addText("🔔");
        bellTxt.parent = ytNull;
        self.setLayerTiming(bellTxt, curTime, 5.0);
        self.setTextProperties(bellTxt, "🔔", 24, [1, 1, 1, 1]);
        bellTxt.transform.position.setValue([100, 8]);

        self.addEaseKeyframes(
            ytNull.transform.scale,
            [curTime, curTime + 0.3, curTime + 0.45],
            [[0, 0, 100], [112, 112, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.45;
        } catch (eTime) { }

        return "YouTube Subscribe Pill Created";
    };

    // =========================================================================
    // 2. STAR RATING (1-star or 5-star animated)
    // =========================================================================
    self.buildStarRating = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var numStars = (asset.type === "five-star") ? 5 : 1;
        var masterNull = comp.layers.addNull();
        masterNull.name = asset.name || "Star Rating Group";
        masterNull.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(masterNull, curTime, 5.0);

        var starSpacing = 70;
        var startX = -((numStars - 1) * starSpacing) / 2;

        for (var i = 0; i < numStars; i++) {
            var starLayer = comp.layers.addShape();
            starLayer.name = "Star " + (i + 1);
            starLayer.parent = masterNull;
            self.setLayerTiming(starLayer, curTime, 5.0);

            var contents = self.getRootVectors(starLayer);
            var shapeGroup = contents.addProperty("ADBE Vector Group");
            var groupContents = self.getGroupVectors(shapeGroup);

            var star = groupContents.addProperty("ADBE Vector Shape - Star");
            self.setVectorProp(star, "ADBE Vector Star Type", "Type", 1, 1); // Star type
            self.setVectorProp(star, "ADBE Vector Star Points", "Points", 2, 5);
            self.setVectorProp(star, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 28);
            self.setVectorProp(star, "ADBE Vector Star Inner Radius", "Inner Radius", 5, 13);

            var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [1.0, 0.82, 0.1, 1.0]); // Gold

            var posX = startX + (i * starSpacing);
            starLayer.transform.position.setValue([posX, 0]);

            // Staggered pop-in animation
            var startTime = curTime + (i * 0.12);
            var scale = starLayer.transform.scale;
            scale.setValueAtTime(curTime, [0, 0, 100]);
            scale.setValueAtTime(startTime, [0, 0, 100]);
            scale.setValueAtTime(startTime + 0.25, [125, 125, 100]);
            scale.setValueAtTime(startTime + 0.4, [100, 100, 100]);
        }

        try {
            comp.time = curTime + 0.5;
        } catch (eTime) { }

        return "Star Rating Created";
    };

    // =========================================================================
    // 3. CUSTOMER REVIEW CARD (Card with stars + 'Customer Review' + '4.5')
    // =========================================================================
    self.buildCustomerReviewCard = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var cardNull = comp.layers.addNull();
        cardNull.name = "Customer Review Widget";
        cardNull.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(cardNull, curTime, 5.0);

        // Card background shape
        var bg = comp.layers.addShape();
        bg.name = "Card Background";
        bg.parent = cardNull;
        self.setLayerTiming(bg, curTime, 5.0);

        var contents = self.getRootVectors(bg);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [420, 220]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 24);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.1, 0.1, 0.12, 1.0]);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        self.setVectorProp(stroke, "ADBE Vector Stroke Color", "Color", 3, [0.25, 0.25, 0.28, 1.0]);
        self.setVectorProp(stroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 2);

        // Header Title
        var titleLayer = comp.layers.addText("Customer Review");
        titleLayer.parent = cardNull;
        self.setLayerTiming(titleLayer, curTime, 5.0);
        self.setTextProperties(titleLayer, "Customer Review", 24, [0.85, 0.85, 0.9, 1.0]);
        titleLayer.transform.position.setValue([0, -50]);

        // Stars row
        var starsLayer = comp.layers.addText("★★★★★");
        starsLayer.parent = cardNull;
        self.setLayerTiming(starsLayer, curTime, 5.0);
        self.setTextProperties(starsLayer, "★★★★★", 32, [1.0, 0.82, 0.1, 1.0]);
        starsLayer.transform.position.setValue([0, 0]);

        // Score 4.5
        var scoreLayer = comp.layers.addText("4.5");
        scoreLayer.parent = cardNull;
        self.setLayerTiming(scoreLayer, curTime, 5.0);
        self.setTextProperties(scoreLayer, "4.5", 30, [1, 1, 1, 1]);
        scoreLayer.transform.position.setValue([0, 55]);

        // Pop in animation for whole card
        self.addEaseKeyframes(
            cardNull.transform.scale,
            [curTime, curTime + 0.35, curTime + 0.5],
            [[0, 0, 100], [108, 108, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.5;
        } catch (eTime) { }

        return "Customer Review Card Created";
    };

    // =========================================================================
    // 4. BOOKMARK RIBBON (With Authentic V-Cutout)
    // =========================================================================
    self.buildBookmark = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Bookmark Ribbon";
        var y = comp.height / 2;
        shapeLayer.transform.position.setValue([comp.width / 2, y]);
        self.setLayerTiming(shapeLayer, curTime, 5.0);

        var contents = self.getRootVectors(shapeLayer);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var pathShape = groupContents.addProperty("ADBE Vector Shape - Group");
        var ribbon = new Shape();
        ribbon.vertices = [[-35, -55], [35, -55], [35, 55], [0, 25], [-35, 55]];
        ribbon.inTangents = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        ribbon.outTangents = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        ribbon.closed = true;

        try {
            pathShape.property("ADBE Vector Shape").setValue(ribbon);
        } catch (eRibbon) {
            var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
            self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [70, 110]);
            self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 10);
        }

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.95, 0.95, 0.95, 1.0]);

        self.addEaseKeyframes(
            shapeLayer.transform.position,
            [curTime, curTime + 0.4, curTime + 0.6],
            [[comp.width / 2, y - 80], [comp.width / 2, y + 10], [comp.width / 2, y]]
        );

        try {
            comp.time = curTime + 0.6;
        } catch (eTime) { }

        return "Bookmark Created";
    };

    // =========================================================================
    // 5. SWIPE UP ANIMATION
    // =========================================================================
    self.buildSwipeUp = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var nullGroup = comp.layers.addNull();
        nullGroup.name = asset.name || "Swipe Up Graphic";
        nullGroup.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(nullGroup, curTime, 5.0);

        // Chevron arrow
        var arrowLayer = comp.layers.addShape();
        arrowLayer.name = "Arrow Chevron";
        arrowLayer.parent = nullGroup;
        self.setLayerTiming(arrowLayer, curTime, 5.0);

        var contents = self.getRootVectors(arrowLayer);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var pathGroup = groupContents.addProperty("ADBE Vector Shape - Group");
        var chevron = new Shape();
        chevron.vertices = [[-24, 8], [0, -12], [24, 8]];
        chevron.inTangents = [[0, 0], [0, 0], [0, 0]];
        chevron.outTangents = [[0, 0], [0, 0], [0, 0]];
        chevron.closed = false;
        try {
            pathGroup.property("ADBE Vector Shape").setValue(chevron);
        } catch (eChev) { }

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        self.setVectorProp(stroke, "ADBE Vector Stroke Color", "Color", 3, [1, 1, 1, 1]);
        self.setVectorProp(stroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 5);

        // Text
        var textLayer = comp.layers.addText("SWIPE UP");
        textLayer.parent = nullGroup;
        self.setLayerTiming(textLayer, curTime, 5.0);
        self.setTextProperties(textLayer, "SWIPE UP", 24, [1, 1, 1, 1], 200);
        textLayer.transform.position.setValue([0, 40]);

        nullGroup.transform.position.expression = "var y = value[1] - Math.sin((time - " + curTime + ") * 4) * 20; [value[0], y];";

        try {
            comp.time = curTime + 0.4;
        } catch (eTime) { }

        return "Swipe Up Created";
    };

    // =========================================================================
    // 6. NOTIFICATION BELL WIGGLE (Bell Dome, Rim & Clapper)
    // =========================================================================
    self.buildBellAlert = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var bellLayer = comp.layers.addShape();
        bellLayer.name = "Notification Bell";
        bellLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(bellLayer, curTime, 5.0);

        var contents = self.getRootVectors(bellLayer);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        // Bell Body Dome
        var dome = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(dome, "ADBE Vector Ellipse Size", "Size", 2, [54, 58]);
        self.setVectorProp(dome, "ADBE Vector Ellipse Position", "Position", 3, [0, -6]);

        // Bell Bottom Rim
        var rim = groupContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rim, "ADBE Vector Rect Size", "Size", 2, [66, 12]);
        self.setVectorProp(rim, "ADBE Vector Rect Roundness", "Roundness", 3, 6);
        self.setVectorProp(rim, "ADBE Vector Rect Position", "Position", 3, [0, 20]);

        // Clapper
        var clapper = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(clapper, "ADBE Vector Ellipse Size", "Size", 2, [18, 18]);
        self.setVectorProp(clapper, "ADBE Vector Ellipse Position", "Position", 3, [0, 28]);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [1.0, 0.85, 0.1, 1.0]);

        self.addEaseKeyframes(
            bellLayer.transform.rotation,
            [curTime, curTime + 0.15, curTime + 0.3, curTime + 0.45, curTime + 0.6, curTime + 0.75],
            [0, -20, 20, -12, 12, 0]
        );

        try {
            comp.time = curTime + 0.5;
        } catch (eTime) { }

        return "Notification Bell Created";
    };

    // =========================================================================
    // 7. MAP PIN DROP WITH RIPPLE
    // =========================================================================
    self.buildMapPin = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var pinLayer = comp.layers.addShape();
        pinLayer.name = "Map Pin";
        var y = comp.height / 2;
        pinLayer.transform.position.setValue([comp.width / 2, y]);
        self.setLayerTiming(pinLayer, curTime, 5.0);

        var contents = self.getRootVectors(pinLayer);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        // Pin Head
        var head = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(head, "ADBE Vector Ellipse Size", "Size", 2, [52, 52]);
        self.setVectorProp(head, "ADBE Vector Ellipse Position", "Position", 3, [0, -16]);

        // Pin Tip
        var tip = groupContents.addProperty("ADBE Vector Shape - Star");
        self.setVectorProp(tip, "ADBE Vector Star Type", "Type", 1, 2);
        self.setVectorProp(tip, "ADBE Vector Star Points", "Points", 2, 3);
        self.setVectorProp(tip, "ADBE Vector Star Outer Radius", "Outer Radius", 7, 24);
        self.setVectorProp(tip, "ADBE Vector Star Rotation", "Rotation", 4, 180);
        self.setVectorProp(tip, "ADBE Vector Star Position", "Position", 3, [0, 8]);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.95, 0.2, 0.2, 1.0]);

        // Inner white dot
        var dot = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        self.setVectorProp(dot, "ADBE Vector Ellipse Size", "Size", 2, [20, 20]);
        self.setVectorProp(dot, "ADBE Vector Ellipse Position", "Position", 3, [0, -16]);

        var dotFill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(dotFill, "ADBE Vector Fill Color", "Color", 3, [1, 1, 1, 1.0]);

        self.addEaseKeyframes(
            pinLayer.transform.position,
            [curTime, curTime + 0.35, curTime + 0.5, curTime + 0.65],
            [[comp.width / 2, y - 180], [comp.width / 2, y], [comp.width / 2, y - 30], [comp.width / 2, y]]
        );

        try {
            comp.time = curTime + 0.65;
        } catch (eTime) { }

        return "Map Pin Created";
    };

    // =========================================================================
    // 8. NOTIFICATION CARD / PILL
    // =========================================================================
    self.buildNotificationCard = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var pill = comp.layers.addShape();
        pill.name = asset.name || "Notification Bubble";
        pill.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(pill, curTime, 5.0);

        var contents = self.getRootVectors(pill);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [420, 88]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 44);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.18, 0.18, 0.22, 1.0]);

        var text = comp.layers.addText("New message received");
        text.parent = pill;
        self.setLayerTiming(text, curTime, 5.0);
        self.setTextProperties(text, "New message received", 20, [1, 1, 1, 1]);
        text.transform.position.setValue([0, 7]);

        self.addEaseKeyframes(
            pill.transform.scale,
            [curTime, curTime + 0.3, curTime + 0.45],
            [[0, 0, 100], [110, 110, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.45;
        } catch (eTime) { }

        return "Notification Bubble Created";
    };

    // =========================================================================
    // 9. NUMBER COUNTER WITH SLIDER CONTROL & LIVE EXPRESSION
    // =========================================================================
    self.buildNumberCounter = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var textLayer = comp.layers.addText("0");
        textLayer.name = asset.name || "Animated Counter";
        textLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(textLayer, curTime, 5.0);
        self.setTextProperties(textLayer, "0", 72, [0.0, 0.85, 1.0, 1.0]);

        var fxGroup = textLayer.property("ADBE Effect Parade") || textLayer.property("Effects") || textLayer.property(1);
        var slider = fxGroup.addProperty("ADBE Slider Control");
        slider.name = "Counter Value";
        var sliderProp = slider.property("ADBE Slider Control-0001") || slider.property(1);

        var maxVal = 100000;
        if (asset.name.indexOf("100K") !== -1) maxVal = 100000;
        if (asset.name.indexOf("100%") !== -1) maxVal = 100;
        if (asset.name.indexOf("Revenue") !== -1) maxVal = 50000;

        sliderProp.setValueAtTime(curTime, 0);
        sliderProp.setValueAtTime(curTime + 2.5, maxVal);

        var textSourceProp = textLayer.property("ADBE Text Properties") ?
            textLayer.property("ADBE Text Properties").property("ADBE Text Document") :
            textLayer.property("Source Text");

        if (asset.name.indexOf("Revenue") !== -1 || asset.name.indexOf("$") !== -1) {
            textSourceProp.expression = "'$' + Math.round(effect('Counter Value')(1)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');";
        } else if (asset.name.indexOf("%") !== -1) {
            textSourceProp.expression = "Math.round(effect('Counter Value')(1)) + '%';";
        } else {
            textSourceProp.expression = "Math.round(effect('Counter Value')(1)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');";
        }

        try {
            comp.time = curTime + 2.5;
        } catch (eTime) { }

        return "Number Counter Created";
    };

    // =========================================================================
    // 10. DYNAMIC CHARTS
    // =========================================================================
    self.buildChart = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var chartNull = comp.layers.addNull();
        chartNull.name = asset.name || "Chart Infographic";
        chartNull.transform.position.setValue([comp.width / 2, comp.height / 2 + 100]);
        self.setLayerTiming(chartNull, curTime, 5.0);

        var barHeights = [180, 260, 140, 320, 240];
        var barSpacing = 70;
        var startX = -((barHeights.length - 1) * barSpacing) / 2;

        for (var i = 0; i < barHeights.length; i++) {
            var bar = comp.layers.addShape();
            bar.name = "Bar " + (i + 1);
            bar.parent = chartNull;
            self.setLayerTiming(bar, curTime, 5.0);

            var contents = self.getRootVectors(bar);
            var group = contents.addProperty("ADBE Vector Group");
            var groupContents = self.getGroupVectors(group);

            var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
            self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [45, barHeights[i]]);
            self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 10);
            self.setVectorProp(rect, "ADBE Vector Rect Position", "Position", 1, [0, -barHeights[i] / 2]);

            var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
            self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.0, 0.7 + (i * 0.05), 0.95, 1.0]);

            bar.transform.position.setValue([startX + (i * barSpacing), 0]);

            var scale = bar.transform.scale;
            scale.setValueAtTime(curTime, [100, 0, 100]);
            scale.setValueAtTime(curTime + 0.2 + (i * 0.1), [100, 0, 100]);
            scale.setValueAtTime(curTime + 0.6 + (i * 0.1), [100, 100, 100]);
        }

        try {
            comp.time = curTime + 1.0;
        } catch (eTime) { }

        return "Chart Created";
    };

    // =========================================================================
    // 11. LIQUID GLASS PACK
    // =========================================================================
    self.buildGlassCard = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var card = comp.layers.addShape();
        card.name = asset.name || "Liquid Glass Card";
        card.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(card, curTime, 5.0);

        var contents = self.getRootVectors(card);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
        self.setVectorProp(rect, "ADBE Vector Rect Size", "Size", 2, [480, 280]);
        self.setVectorProp(rect, "ADBE Vector Rect Roundness", "Roundness", 3, 30);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        self.setVectorProp(fill, "ADBE Vector Fill Color", "Color", 3, [0.2, 0.25, 0.35, 0.4]);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        self.setVectorProp(stroke, "ADBE Vector Stroke Color", "Color", 3, [0.7, 0.85, 1.0, 1.0]);
        self.setVectorProp(stroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 3);

        return "Glass Card Created";
    };

    // =========================================================================
    // 12. KINETIC TEXT
    // =========================================================================
    self.buildKineticText = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var textContent = asset.name.replace("Title", "").replace("Text", "");
        var textLayer = comp.layers.addText(textContent);
        textLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(textLayer, curTime, 5.0);
        self.setTextProperties(textLayer, textContent, 64, [1, 1, 1, 1]);

        self.addEaseKeyframes(
            textLayer.transform.scale,
            [curTime, curTime + 0.4, curTime + 0.6],
            [[0, 0, 100], [115, 115, 100], [100, 100, 100]]
        );

        try {
            comp.time = curTime + 0.6;
        } catch (eTime) { }

        return "Kinetic Text Created";
    };

    // =========================================================================
    // 13. CALLOUT HUD
    // =========================================================================
    self.buildCallout = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var callout = comp.layers.addShape();
        callout.name = asset.name || "HUD Callout";
        callout.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(callout, curTime, 5.0);

        var contents = self.getRootVectors(callout);
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = self.getGroupVectors(group);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        self.setVectorProp(stroke, "ADBE Vector Stroke Color", "Color", 3, [0.0, 0.85, 1.0, 1.0]);
        self.setVectorProp(stroke, "ADBE Vector Stroke Width", "Stroke Width", 4, 3);

        var text = comp.layers.addText("TARGET SPECIFICATION");
        text.parent = callout;
        self.setLayerTiming(text, curTime, 5.0);
        self.setTextProperties(text, "TARGET SPECIFICATION", 20, [0.0, 0.85, 1.0, 1.0]);
        text.transform.position.setValue([120, -50]);

        return "HUD Callout Created";
    };

    // =========================================================================
    // 14. TRANSITIONS
    // =========================================================================
    self.buildTransition = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var solid = comp.layers.addSolid([0.05, 0.05, 0.08], asset.name, comp.width, comp.height, 1.0, 1.0);
        solid.name = asset.name || "Transition Wipe";
        self.setLayerTiming(solid, curTime, 5.0);

        var y = comp.height / 2;
        self.addEaseKeyframes(
            solid.transform.position,
            [curTime, curTime + 0.4, curTime + 0.8],
            [[-comp.width / 2, y], [comp.width / 2, y], [comp.width * 1.5, y]]
        );

        return "Transition Created";
    };

    // Fallback Generic Badge
    self.buildGenericBadge = function (comp, asset) {
        var curTime = (comp && typeof comp.time === "number") ? comp.time : 0;
        var textLayer = comp.layers.addText(asset.name);
        textLayer.transform.position.setValue([comp.width / 2, comp.height / 2]);
        self.setLayerTiming(textLayer, curTime, 5.0);
        self.setTextProperties(textLayer, asset.name, 48, [1, 1, 1, 1]);

        return "Generic Asset Created";
    };

    // Universal JSON parser for ExtendScript (supports ES3 fallback and native JSON)
    self.parseJSON = function (jsonString) {
        if (!jsonString) return null;
        if (typeof jsonString === "object") return jsonString;
        try {
            if (typeof JSON !== "undefined" && typeof JSON.parse === "function") {
                return JSON.parse(jsonString);
            }
            return eval("(" + jsonString + ")");
        } catch (e) {
            return null;
        }
    };

    return self;
})();
