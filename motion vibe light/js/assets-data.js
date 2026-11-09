/**
 * Motion Vibe Light - Comprehensive Asset Library Catalog
 * Matches the reference UI categories, counts, and asset specifications.
 */

const CATEGORIES_DATA = [
    {
        id: "social-media",
        name: "Social Media",
        count: 392,
        icon: "share-2",
        expanded: true,
        children: [
            {
                id: "elements",
                name: "Elements",
                count: 67,
                expanded: true,
                children: [
                    { id: "behance", name: "Behance", count: 16, icon: "behance" },
                    { id: "discord", name: "Discord", count: 16, icon: "discord" },
                    { id: "dribbble", name: "Dribbble", count: 16, icon: "dribbble" },
                    { id: "facebook", name: "Facebook", count: 24, icon: "facebook" },
                    { id: "google", name: "Google", count: 16, icon: "google" },
                    { id: "instagram", name: "Instagram", count: 18, icon: "instagram" },
                    { id: "linkedin", name: "LinkedIn", count: 16, icon: "linkedin" },
                    { id: "pinterest", name: "Pinterest", count: 16, icon: "pinterest" },
                    { id: "reddit", name: "Reddit", count: 16, icon: "reddit" },
                    { id: "snapchat", name: "Snapchat", count: 16, icon: "snapchat" },
                    { id: "spotify", name: "Spotify", count: 16, icon: "spotify" },
                    { id: "telegram", name: "Telegram", count: 16, icon: "telegram" },
                    { id: "threads", name: "Threads", count: 16, icon: "threads" },
                    { id: "tinder", name: "Tinder", count: 16, icon: "tinder" },
                    { id: "wechat", name: "WeChat", count: 16, icon: "wechat" },
                    { id: "whatsapp", name: "WhatsApp", count: 23, icon: "whatsapp" },
                    { id: "x", name: "X", count: 16, icon: "twitter-x" },
                    { id: "youtube", name: "YouTube", count: 20, icon: "youtube" }
                ]
            }
        ]
    },
    { id: "flags", name: "Flags", count: 196, icon: "flag" },
    { id: "maps", name: "Maps", count: 230, icon: "globe" },
    { id: "charts", name: "Charts", count: 63, icon: "bar-chart-2" },
    { id: "number-counters", name: "Number Counters", count: 8, icon: "list-ordered" },
    { id: "liquid-glass-pack", name: "Liquid Glass Pack", count: 90, icon: "smartphone" },
    { id: "text", name: "Text", count: 10, icon: "type" },
    { id: "call-outs", name: "Call Outs", count: 10, icon: "message-square" },
    { id: "people", name: "People", count: 10, icon: "user" },
    { id: "transitions", name: "Transitions", count: 18, icon: "layers" }
];

const ASSETS_LIST = [
    // -------------------------------------------------------------
    // SOCIAL MEDIA / ELEMENTS (Exact items shown on UI screenshot)
    // -------------------------------------------------------------
    {
        id: "sm-34",
        name: "SocialMedia 34",
        category: "social-media",
        subCategory: "elements",
        type: "bookmark",
        duration: "2.0s",
        tags: ["bookmark", "ribbon", "save", "social"],
        title: "Bookmark Ribbon",
        desc: "Smooth bounce animated bookmark save tag"
    },
    {
        id: "sm-star-icon",
        name: "Star Icon",
        category: "social-media",
        subCategory: "elements",
        type: "single-star",
        duration: "1.5s",
        tags: ["star", "rating", "favorite", "sparkle"],
        title: "Pulsing Star Icon",
        desc: "Glowing gold rotating star element"
    },
    {
        id: "sm-5-star",
        name: "5-Star Rating",
        category: "social-media",
        subCategory: "elements",
        type: "five-star",
        duration: "2.5s",
        tags: ["rating", "stars", "5-star", "review", "gold"],
        title: "5-Star Gold Review",
        desc: "Sequential pop-in golden stars with sparkle highlights"
    },
    {
        id: "sm-37",
        name: "SocialMedia 37",
        category: "social-media",
        subCategory: "elements",
        type: "customer-review",
        duration: "3.0s",
        tags: ["customer review", "stars", "score", "testimonial"],
        title: "Customer Review 4.5",
        desc: "Card with 'Customer Review', gold stars, and 4.5 score"
    },
    {
        id: "sm-38",
        name: "SocialMedia 38",
        category: "social-media",
        subCategory: "elements",
        type: "pill-notification",
        duration: "2.5s",
        tags: ["notification", "pill", "message", "bubble"],
        title: "Glass Pill Notification",
        desc: "Rounded translucent prompt message popup"
    },
    {
        id: "sm-facebook-logo",
        name: "Facebook Logo",
        category: "social-media",
        subCategory: "elements",
        type: "chat-bubbles",
        duration: "2.5s",
        tags: ["chat", "speech bubbles", "dialogue", "comments"],
        title: "Two-Tier Chat Dialog",
        desc: "Interactive double speech bubble comment thread"
    },
    {
        id: "sm-40",
        name: "SocialMedia 40",
        category: "social-media",
        subCategory: "elements",
        type: "swipe-up-simple",
        duration: "1.8s",
        tags: ["swipe up", "arrow", "story", "instagram"],
        title: "Minimal Swipe Up",
        desc: "Ascending chevron arrow with 'SWIPE UP' text"
    },
    {
        id: "sm-41",
        name: "SocialMedia 41",
        category: "social-media",
        subCategory: "elements",
        type: "swipe-up-avatar-1",
        duration: "2.0s",
        tags: ["swipe up", "avatar", "profile", "creator"],
        title: "Avatar Swipe Up Light",
        desc: "Circular user photo badge with upward swipe bounce"
    },
    {
        id: "sm-42",
        name: "SocialMedia 42",
        category: "social-media",
        subCategory: "elements",
        type: "swipe-up-avatar-2",
        duration: "2.0s",
        tags: ["swipe up", "avatar", "profile", "dark"],
        title: "Avatar Swipe Up Modern",
        desc: "Sleek circular profile badge with glow indicator"
    },
    {
        id: "sm-43",
        name: "SocialMedia 43",
        category: "social-media",
        subCategory: "elements",
        type: "bell-icon",
        duration: "1.5s",
        tags: ["bell", "notification", "subscribe", "alert"],
        title: "Wiggle Bell Alert",
        desc: "Animated notification bell with sound wave ripples"
    },
    {
        id: "sm-44",
        name: "SocialMedia 44",
        category: "social-media",
        subCategory: "elements",
        type: "map-pin",
        duration: "2.0s",
        tags: ["location", "pin", "map", "marker", "gps"],
        title: "Bouncing Map Pin",
        desc: "Location marker pin dropping with shadow radar effect"
    },
    {
        id: "sm-45",
        name: "SocialMedia 45",
        category: "social-media",
        subCategory: "elements",
        type: "brand-behance",
        duration: "2.0s",
        tags: ["behance", "portfolio", "adobe", "creative"],
        title: "Behance Brand Icon",
        desc: "Official Behance cyan circle badge with 3D scale pop"
    },
    {
        id: "sm-46",
        name: "SocialMedia 46",
        category: "social-media",
        subCategory: "elements",
        type: "brand-discord",
        duration: "2.0s",
        tags: ["discord", "gaming", "community", "chat"],
        title: "Discord Brand Icon",
        desc: "Blurple Discord robot emblem with blink animation"
    },
    {
        id: "sm-47",
        name: "SocialMedia 47",
        category: "social-media",
        subCategory: "elements",
        type: "brand-dribbble",
        duration: "2.0s",
        tags: ["dribbble", "design", "shots", "basketball"],
        title: "Dribbble Brand Icon",
        desc: "Pink basketball emblem with smooth rotate roll-in"
    },
    {
        id: "sm-48",
        name: "SocialMedia 48",
        category: "social-media",
        subCategory: "elements",
        type: "brand-facebook",
        duration: "2.0s",
        tags: ["facebook", "meta", "social", "blue"],
        title: "Facebook Brand Icon",
        desc: "Classic vibrant blue Facebook circular badge"
    },

    // -------------------------------------------------------------
    // BRAND SPECIFIC ASSETS (Sub-categories under Elements)
    // -------------------------------------------------------------
    // Behance
    { id: "beh-01", name: "Behance Follow Button", category: "social-media", subCategory: "behance", type: "brand-behance", duration: "2.0s", tags: ["behance", "follow", "button"] },
    { id: "beh-02", name: "Behance Project Appreciation", category: "social-media", subCategory: "behance", type: "brand-behance", duration: "1.8s", tags: ["behance", "thumbs up", "appreciate"] },
    { id: "beh-03", name: "Behance Lower Third", category: "social-media", subCategory: "behance", type: "brand-behance", duration: "3.0s", tags: ["behance", "lower third", "name"] },
    { id: "beh-04", name: "Behance Minimal Icon", category: "social-media", subCategory: "behance", type: "brand-behance", duration: "1.5s", tags: ["behance", "logo", "minimal"] },

    // Discord
    { id: "dis-01", name: "Discord Server Invite", category: "social-media", subCategory: "discord", type: "brand-discord", duration: "2.5s", tags: ["discord", "invite", "join"] },
    { id: "dis-02", name: "Discord Online Badge", category: "social-media", subCategory: "discord", type: "brand-discord", duration: "1.5s", tags: ["discord", "status", "online"] },
    { id: "dis-03", name: "Discord Message Bubble", category: "social-media", subCategory: "discord", type: "brand-discord", duration: "2.0s", tags: ["discord", "chat", "ping"] },

    // Dribbble
    { id: "dri-01", name: "Dribbble Like Heart", category: "social-media", subCategory: "dribbble", type: "brand-dribbble", duration: "1.8s", tags: ["dribbble", "heart", "like"] },
    { id: "dri-02", name: "Dribbble Pro Badge", category: "social-media", subCategory: "dribbble", type: "brand-dribbble", duration: "2.0s", tags: ["dribbble", "pro", "badge"] },

    // Facebook
    { id: "fb-01", name: "Facebook Like & Thumbs Up", category: "social-media", subCategory: "facebook", type: "brand-facebook", duration: "2.0s", tags: ["facebook", "like", "thumbs up"] },
    { id: "fb-02", name: "Facebook Share Counter", category: "social-media", subCategory: "facebook", type: "brand-facebook", duration: "2.5s", tags: ["facebook", "share", "counter"] },
    { id: "fb-03", name: "Facebook Live Stream Tag", category: "social-media", subCategory: "facebook", type: "brand-facebook", duration: "2.0s", tags: ["facebook", "live", "stream"] },

    // Google
    { id: "goo-01", name: "Google 5-Star Reviews Card", category: "social-media", subCategory: "google", type: "customer-review", duration: "2.8s", tags: ["google", "review", "stars", "rating"] },
    { id: "goo-02", name: "Google Search Bar Pop", category: "social-media", subCategory: "google", type: "brand-google", duration: "2.0s", tags: ["google", "search", "bar"] },

    // Instagram
    { id: "ig-01", name: "Instagram Heart Like Explosion", category: "social-media", subCategory: "instagram", type: "brand-instagram", duration: "1.8s", tags: ["instagram", "like", "heart", "love"] },
    { id: "ig-02", name: "Instagram Follow & Bell", category: "social-media", subCategory: "instagram", type: "brand-instagram", duration: "2.2s", tags: ["instagram", "follow", "subscribe"] },
    { id: "ig-03", name: "Instagram Story Frame", category: "social-media", subCategory: "instagram", type: "brand-instagram", duration: "3.0s", tags: ["instagram", "story", "gradient"] },

    // LinkedIn
    { id: "in-01", name: "LinkedIn Connect Button", category: "social-media", subCategory: "linkedin", type: "brand-linkedin", duration: "2.0s", tags: ["linkedin", "connect", "jobs"] },
    { id: "in-02", name: "LinkedIn Endorsement Badge", category: "social-media", subCategory: "linkedin", type: "brand-linkedin", duration: "2.2s", tags: ["linkedin", "skills", "endorse"] },

    // Pinterest
    { id: "pin-01", name: "Pinterest Pin It Tag", category: "social-media", subCategory: "pinterest", type: "brand-pinterest", duration: "2.0s", tags: ["pinterest", "pin", "save"] },

    // Reddit
    { id: "red-01", name: "Reddit Upvote Rocket", category: "social-media", subCategory: "reddit", type: "brand-reddit", duration: "1.8s", tags: ["reddit", "upvote", "karma"] },

    // Snapchat
    { id: "snap-01", name: "Snapchat Ghost Pop", category: "social-media", subCategory: "snapchat", type: "brand-snapchat", duration: "2.0s", tags: ["snapchat", "ghost", "yellow"] },

    // Spotify
    { id: "spot-01", name: "Spotify Now Playing Widget", category: "social-media", subCategory: "spotify", type: "brand-spotify", duration: "3.0s", tags: ["spotify", "music", "audio", "wave"] },
    { id: "spot-02", name: "Spotify Soundwave Visualizer", category: "social-media", subCategory: "spotify", type: "brand-spotify", duration: "2.0s", tags: ["spotify", "visualizer", "audio"] },

    // Telegram
    { id: "tg-01", name: "Telegram Flying Airplane", category: "social-media", subCategory: "telegram", type: "brand-telegram", duration: "2.0s", tags: ["telegram", "plane", "send", "chat"] },

    // Threads
    { id: "th-01", name: "Threads Social Badge", category: "social-media", subCategory: "threads", type: "brand-threads", duration: "2.0s", tags: ["threads", "meta", "logo"] },

    // Tinder
    { id: "tin-01", name: "Tinder It's A Match Flame", category: "social-media", subCategory: "tinder", type: "brand-tinder", duration: "2.2s", tags: ["tinder", "flame", "match"] },

    // WeChat
    { id: "wc-01", name: "WeChat Message Green Pill", category: "social-media", subCategory: "wechat", type: "brand-wechat", duration: "2.0s", tags: ["wechat", "chat", "message"] },

    // WhatsApp
    { id: "wa-01", name: "WhatsApp Incoming Call Popup", category: "social-media", subCategory: "whatsapp", type: "brand-whatsapp", duration: "2.5s", tags: ["whatsapp", "call", "voice"] },
    { id: "wa-02", name: "WhatsApp Double Blue Check", category: "social-media", subCategory: "whatsapp", type: "brand-whatsapp", duration: "1.6s", tags: ["whatsapp", "check", "seen", "message"] },

    // X (Twitter)
    { id: "x-01", name: "X Verified Blue Checkmark", category: "social-media", subCategory: "x", type: "brand-x", duration: "1.8s", tags: ["x", "twitter", "verified", "badge"] },
    { id: "x-02", name: "X Repost & Retweet Pulse", category: "social-media", subCategory: "x", type: "brand-x", duration: "2.0s", tags: ["x", "repost", "retweet"] },

    // YouTube
    { id: "yt-01", name: "YouTube Subscribe & Bell Click", category: "social-media", subCategory: "youtube", type: "brand-youtube", duration: "2.8s", tags: ["youtube", "subscribe", "bell", "red"] },
    { id: "yt-02", name: "YouTube Like Button Thumbs Up", category: "social-media", subCategory: "youtube", type: "brand-youtube", duration: "2.0s", tags: ["youtube", "like", "thumbs up"] },
    { id: "yt-03", name: "YouTube Lower Third Channel", category: "social-media", subCategory: "youtube", type: "brand-youtube", duration: "3.0s", tags: ["youtube", "lower third", "name"] },

    // -------------------------------------------------------------
    // FLAGS (196 items sample & key highlights)
    // -------------------------------------------------------------
    { id: "flag-usa", name: "Flag - United States", category: "flags", type: "flag", country: "United States", code: "US", duration: "2.0s", tags: ["flag", "usa", "america"] },
    { id: "flag-uk", name: "Flag - United Kingdom", category: "flags", type: "flag", country: "United Kingdom", code: "GB", duration: "2.0s", tags: ["flag", "uk", "britain"] },
    { id: "flag-ca", name: "Flag - Canada", category: "flags", type: "flag", country: "Canada", code: "CA", duration: "2.0s", tags: ["flag", "canada"] },
    { id: "flag-fr", name: "Flag - France", category: "flags", type: "flag", country: "France", code: "FR", duration: "2.0s", tags: ["flag", "france", "paris"] },
    { id: "flag-de", name: "Flag - Germany", category: "flags", type: "flag", country: "Germany", code: "DE", duration: "2.0s", tags: ["flag", "germany"] },
    { id: "flag-jp", name: "Flag - Japan", category: "flags", type: "flag", country: "Japan", code: "JP", duration: "2.0s", tags: ["flag", "japan", "tokyo"] },
    { id: "flag-in", name: "Flag - India", category: "flags", type: "flag", country: "India", code: "IN", duration: "2.0s", tags: ["flag", "india", "delhi"] },
    { id: "flag-br", name: "Flag - Brazil", category: "flags", type: "flag", country: "Brazil", code: "BR", duration: "2.0s", tags: ["flag", "brazil"] },
    { id: "flag-au", name: "Flag - Australia", category: "flags", type: "flag", country: "Australia", code: "AU", duration: "2.0s", tags: ["flag", "australia"] },
    { id: "flag-it", name: "Flag - Italy", category: "flags", type: "flag", country: "Italy", code: "IT", duration: "2.0s", tags: ["flag", "italy"] },
    { id: "flag-es", name: "Flag - Spain", category: "flags", type: "flag", country: "Spain", code: "ES", duration: "2.0s", tags: ["flag", "spain"] },
    { id: "flag-ae", name: "Flag - UAE Dubai", category: "flags", type: "flag", country: "United Arab Emirates", code: "AE", duration: "2.0s", tags: ["flag", "uae", "dubai"] },

    // -------------------------------------------------------------
    // MAPS (230 items key collection)
    // -------------------------------------------------------------
    { id: "map-world", name: "World Map Hologram Grid", category: "maps", type: "map-world", duration: "3.5s", tags: ["map", "world", "globe", "hologram"] },
    { id: "map-pin-pulse", name: "Radar Geo Pin Pointer", category: "maps", type: "map-pin-radar", duration: "2.5s", tags: ["map", "pin", "radar", "target"] },
    { id: "map-route", name: "Animated Flight Path Route", category: "maps", type: "map-route", duration: "3.0s", tags: ["map", "route", "travel", "flight"] },
    { id: "map-europe", name: "Europe Geo Focus Outline", category: "maps", type: "map-europe", duration: "2.5s", tags: ["map", "europe", "continent"] },
    { id: "map-asia", name: "Asia Geo Regional Focus", category: "maps", type: "map-asia", duration: "2.5s", tags: ["map", "asia", "continent"] },
    { id: "map-america", name: "Americas Continental Map", category: "maps", type: "map-americas", duration: "2.5s", tags: ["map", "america", "continent"] },

    // -------------------------------------------------------------
    // CHARTS (63 items)
    // -------------------------------------------------------------
    { id: "chart-bars", name: "Dynamic 3D Bar Chart", category: "charts", type: "chart-bar", duration: "2.5s", tags: ["chart", "bars", "finance", "growth", "stats"] },
    { id: "chart-donut", name: "Circular Donut Progress", category: "charts", type: "chart-donut", duration: "2.2s", tags: ["chart", "donut", "pie", "percentage", "circle"] },
    { id: "chart-line", name: "Gradient Curve Line Graph", category: "charts", type: "chart-line", duration: "3.0s", tags: ["chart", "line", "graph", "stocks", "crypto"] },
    { id: "chart-radar", name: "Spider Radar Metric Chart", category: "charts", type: "chart-radar", duration: "2.5s", tags: ["chart", "radar", "spider", "analytics"] },
    { id: "chart-candles", name: "Trading Candlestick Flow", category: "charts", type: "chart-candles", duration: "3.0s", tags: ["chart", "candlestick", "forex", "trading"] },
    { id: "chart-progress", name: "Segmented Progress Gauge", category: "charts", type: "chart-gauge", duration: "2.0s", tags: ["chart", "gauge", "speed", "metric"] },

    // -------------------------------------------------------------
    // NUMBER COUNTERS (8 items)
    // -------------------------------------------------------------
    { id: "counter-01", name: "0 to 100K Followers Counter", category: "number-counters", type: "counter-followers", duration: "3.0s", tags: ["counter", "100k", "followers", "numbers", "odometer"] },
    { id: "counter-02", name: "Currency Revenue Counter ($)", category: "number-counters", type: "counter-money", duration: "2.8s", tags: ["counter", "money", "dollar", "revenue", "sales"] },
    { id: "counter-03", name: "Smooth 0% to 100% Percentage", category: "number-counters", type: "counter-percent", duration: "2.5s", tags: ["counter", "percentage", "progress", "loading"] },
    { id: "counter-04", name: "Countdown Timer (00:60 to 00:00)", category: "number-counters", type: "counter-countdown", duration: "4.0s", tags: ["counter", "timer", "countdown", "clock"] },
    { id: "counter-05", name: "Digital Clock Time HUD", category: "number-counters", type: "counter-hud", duration: "2.0s", tags: ["counter", "hud", "digital", "time"] },
    { id: "counter-06", name: "Download Speed 1000 MB/s", category: "number-counters", type: "counter-speed", duration: "2.5s", tags: ["counter", "speed", "mbps", "bandwidth"] },
    { id: "counter-07", name: "Year Timeline (2000 - 2026)", category: "number-counters", type: "counter-year", duration: "3.0s", tags: ["counter", "year", "date", "timeline"] },
    { id: "counter-08", name: "Crypto Value Ticker Live", category: "number-counters", type: "counter-crypto", duration: "2.5s", tags: ["counter", "crypto", "bitcoin", "ticker"] },

    // -------------------------------------------------------------
    // LIQUID GLASS PACK (90 items)
    // -------------------------------------------------------------
    { id: "glass-01", name: "Liquid Glass Notification Card", category: "liquid-glass-pack", type: "glass-card", duration: "2.5s", tags: ["glass", "frosted", "liquid", "blur", "ui"] },
    { id: "glass-02", name: "Prism Crystal Glass Pill", category: "liquid-glass-pack", type: "glass-pill", duration: "2.2s", tags: ["glass", "prism", "refraction", "glossy"] },
    { id: "glass-03", name: "Frosted Profile Glass Modal", category: "liquid-glass-pack", type: "glass-modal", duration: "3.0s", tags: ["glass", "modal", "window", "overlay"] },
    { id: "glass-04", name: "Neon Border Glass Shield", category: "liquid-glass-pack", type: "glass-shield", duration: "2.5s", tags: ["glass", "cyberpunk", "glow", "shield"] },
    { id: "glass-05", name: "Liquid Floating Orb Badge", category: "liquid-glass-pack", type: "glass-orb", duration: "2.8s", tags: ["glass", "liquid", "orb", "sphere", "fluid"] },
    { id: "glass-06", name: "Ultra-Frost Weather Tile", category: "liquid-glass-pack", type: "glass-tile", duration: "2.4s", tags: ["glass", "weather", "tile", "widget"] },

    // -------------------------------------------------------------
    // TEXT (10 items)
    // -------------------------------------------------------------
    { id: "text-01", name: "Kinetic Typography Stagger", category: "text", type: "text-kinetic", duration: "2.5s", tags: ["text", "kinetic", "typography", "stagger", "title"] },
    { id: "text-02", name: "Vintage Terminal Typewriter", category: "text", type: "text-typewriter", duration: "3.0s", tags: ["text", "typewriter", "terminal", "code"] },
    { id: "text-03", name: "Cyberpunk RGB Glitch Text", category: "text", type: "text-glitch", duration: "1.8s", tags: ["text", "glitch", "rgb", "distortion"] },
    { id: "text-04", name: "Minimal Modern Clean Title", category: "text", type: "text-clean", duration: "2.0s", tags: ["text", "minimal", "clean", "headline"] },
    { id: "text-05", name: "Neon Glow Flicker Title", category: "text", type: "text-neon", duration: "2.2s", tags: ["text", "neon", "flicker", "glow"] },
    { id: "text-06", name: "3D Extruded Perspective Title", category: "text", type: "text-3d", duration: "2.5s", tags: ["text", "3d", "extrusion", "depth"] },
    { id: "text-07", name: "Liquid Mask Reveal Title", category: "text", type: "text-liquid", duration: "2.5s", tags: ["text", "liquid", "mask", "reveal"] },
    { id: "text-08", name: "Stomp Fast Cut Rhythm Text", category: "text", type: "text-stomp", duration: "1.5s", tags: ["text", "stomp", "fast", "beat"] },
    { id: "text-09", name: "Smooth Lower Third Broadcast", category: "text", type: "text-broadcast", duration: "3.0s", tags: ["text", "lower third", "broadcast", "tv"] },
    { id: "text-10", name: "Handwritten Signature Draw", category: "text", type: "text-signature", duration: "2.8s", tags: ["text", "handwritten", "signature", "stroke"] },

    // -------------------------------------------------------------
    // CALL OUTS (10 items)
    // -------------------------------------------------------------
    { id: "co-01", name: "Futuristic HUD Spec Callout", category: "call-outs", type: "callout-hud", duration: "2.5s", tags: ["callout", "hud", "spec", "line", "tech"] },
    { id: "co-02", name: "Circular Target Focus Marker", category: "call-outs", type: "callout-circle", duration: "2.0s", tags: ["callout", "circle", "target", "focus"] },
    { id: "co-03", name: "Product Feature Leader Tag", category: "call-outs", type: "callout-product", duration: "2.8s", tags: ["callout", "product", "tag", "hardware"] },
    { id: "co-04", name: "Angled Bracket Tech Box", category: "call-outs", type: "callout-bracket", duration: "2.2s", tags: ["callout", "bracket", "box", "sci-fi"] },
    { id: "co-05", name: "Pulsing Coordinate Waypoint", category: "call-outs", type: "callout-coord", duration: "2.4s", tags: ["callout", "coordinates", "gps", "pointer"] },

    // -------------------------------------------------------------
    // PEOPLE (10 items)
    // -------------------------------------------------------------
    { id: "ppl-01", name: "Speaker Intro Profile Badge", category: "people", type: "people-speaker", duration: "2.8s", tags: ["people", "speaker", "profile", "avatar", "name"] },
    { id: "ppl-02", name: "Testimonial Quote Card", category: "people", type: "people-testimonial", duration: "3.2s", tags: ["people", "testimonial", "quote", "customer"] },
    { id: "ppl-03", name: "Verified Author Info Tag", category: "people", type: "people-author", duration: "2.5s", tags: ["people", "author", "verified", "tag"] },
    { id: "ppl-04", name: "Team Member Carousel Pill", category: "people", type: "people-team", duration: "2.5s", tags: ["people", "team", "member", "staff"] },
    { id: "ppl-05", name: "Podcast Guest Lower Third", category: "people", type: "people-podcast", duration: "3.0s", tags: ["people", "podcast", "guest", "interview"] },

    // -------------------------------------------------------------
    // TRANSITIONS (18 items)
    // -------------------------------------------------------------
    { id: "tr-01", name: "Smooth Zoom Motion Blur", category: "transitions", type: "tr-zoom", duration: "0.8s", tags: ["transition", "zoom", "motion blur", "whip"] },
    { id: "tr-02", name: "Vintage Film Burn Flash", category: "transitions", type: "tr-filmburn", duration: "1.0s", tags: ["transition", "film burn", "light leak", "flash"] },
    { id: "tr-03", name: "High-Speed Whip Pan Left", category: "transitions", type: "tr-whippan", duration: "0.6s", tags: ["transition", "pan", "whip", "slide"] },
    { id: "tr-04", name: "Cyber RGB Glitch Slice", category: "transitions", type: "tr-glitch", duration: "0.7s", tags: ["transition", "glitch", "rgb", "digital"] },
    { id: "tr-05", name: "Liquid Glass Wipe Wave", category: "transitions", type: "tr-liquidwipe", duration: "1.2s", tags: ["transition", "liquid", "wipe", "water"] },
    { id: "tr-06", name: "Geometric Shape Mask Pop", category: "transitions", type: "tr-shape", duration: "0.9s", tags: ["transition", "shape", "mask", "circle"] }
];
