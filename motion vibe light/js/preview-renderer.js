/**
 * Motion Vibe Light - Preview Renderer
 * Generates accurate, animated SVG and CSS/Canvas previews for all assets in the library.
 */

const PreviewRenderer = {
    renderCardContent: function(asset) {
        const type = asset.type;
        const name = asset.name;

        switch (type) {
            case "bookmark":
                return `
                    <div class="pv-container pv-bookmark">
                        <svg viewBox="0 0 100 100" class="pv-svg anim-float">
                            <path d="M32 15 C32 12, 34 10, 37 10 L63 10 C66 10, 68 12, 68 15 L68 90 L50 72 L32 90 Z" fill="#ffffff" />
                        </svg>
                    </div>
                `;

            case "single-star":
                return `
                    <div class="pv-container pv-star">
                        <svg viewBox="0 0 100 100" class="pv-svg anim-pulse">
                            <polygon points="50,15 61,38 86,41 68,58 72,83 50,71 28,83 32,58 14,41 39,38" fill="#ffffff" />
                        </svg>
                    </div>
                `;

            case "five-star":
                return `
                    <div class="pv-container pv-five-stars">
                        <div class="stars-row anim-sparkle">
                            <svg viewBox="0 0 24 24" class="star-icon"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffb800"/></svg>
                            <svg viewBox="0 0 24 24" class="star-icon"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffb800"/></svg>
                            <svg viewBox="0 0 24 24" class="star-icon"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffb800"/></svg>
                            <svg viewBox="0 0 24 24" class="star-icon"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffb800"/></svg>
                            <svg viewBox="0 0 24 24" class="star-icon"><polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" fill="#ffb800"/></svg>
                        </div>
                    </div>
                `;

            case "customer-review":
                return `
                    <div class="pv-container pv-review-card">
                        <div class="review-box anim-fade-pop">
                            <span class="review-title">Customer Review</span>
                            <div class="review-stars">
                                <span class="review-star">★</span><span class="review-star">★</span><span class="review-star">★</span><span class="review-star">★</span><span class="review-star">★</span>
                            </div>
                            <span class="review-score">4.5</span>
                        </div>
                    </div>
                `;

            case "pill-notification":
                return `
                    <div class="pv-container pv-pill">
                        <div class="pill-bubble anim-slide-in">
                            <div class="pill-line-top">Get your real-time your social content</div>
                            <div class="pill-line-bot">meet new goals.</div>
                        </div>
                    </div>
                `;

            case "chat-bubbles":
                return `
                    <div class="pv-container pv-chat">
                        <div class="chat-stack">
                            <div class="chat-msg msg-1 anim-chat-1">Hi all</div>
                            <div class="chat-msg msg-2 anim-chat-2">Look awesome! Here's a quick link.</div>
                            <div class="chat-msg msg-3 anim-chat-3">new incoming alerts.</div>
                        </div>
                    </div>
                `;

            case "swipe-up-simple":
                return `
                    <div class="pv-container pv-swipe-simple">
                        <div class="swipe-wrap anim-swipe">
                            <svg viewBox="0 0 24 24" class="chevron-up"><polyline points="18 15 12 9 6 15" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <span class="swipe-text">SWIPE UP</span>
                        </div>
                    </div>
                `;

            case "swipe-up-avatar-1":
            case "swipe-up-avatar-2":
                const isDark = type === "swipe-up-avatar-2";
                return `
                    <div class="pv-container pv-swipe-avatar">
                        <div class="avatar-wrap anim-swipe">
                            <div class="avatar-ring ${isDark ? 'dark-ring' : 'light-ring'}">
                                <div class="avatar-placeholder"></div>
                            </div>
                            <span class="avatar-swipe-text">Swipe Up</span>
                        </div>
                    </div>
                `;

            case "bell-icon":
                return `
                    <div class="pv-container pv-bell">
                        <svg viewBox="0 0 100 100" class="pv-svg anim-bell">
                            <path d="M50 16 C38 16 30 25 30 40 L30 58 L22 68 L78 68 L70 58 L70 40 C70 25 62 16 50 16 Z M42 74 C42 79 45 83 50 83 C55 83 58 79 58 74 Z" fill="#ffffff"/>
                        </svg>
                    </div>
                `;

            case "map-pin":
                return `
                    <div class="pv-container pv-pin">
                        <div class="pin-wrap anim-pin-drop">
                            <svg viewBox="0 0 24 24" class="pin-svg">
                                <path d="M12 2 C8 2 5 5 5 9 C5 14.5 12 22 12 22 C12 22 19 14.5 19 9 C19 5 16 2 12 2 Z" fill="#ffffff"/>
                                <circle cx="12" cy="9" r="3" fill="#000000"/>
                            </svg>
                            <div class="pin-ripple"></div>
                        </div>
                    </div>
                `;

            case "brand-behance":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge behance-badge anim-pop">
                            <span class="brand-glyph">Bē</span>
                        </div>
                    </div>
                `;

            case "brand-discord":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge discord-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-dribbble":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge dribbble-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.93 9.27c-.36-.08-2.2-.47-4.46.22-.05-.12-.1-.23-.15-.35-.55-1.22-1.2-2.36-1.78-3.23 2.68.96 5.48 2.67 6.39 3.36zM12 3.96c2.08 0 3.98.78 5.45 2.07-.84-.66-3.41-2.27-5.96-1.32-.47-.83-.93-1.57-1.26-2.07.57-.11 1.16-.17 1.77-.17zm-3.69 1.15c.34.49.78 1.2 1.23 2-2.88.88-5.35.9-5.75.9 1-1.31 2.62-2.37 4.52-2.9zm-4.7 4.67c.39 0 2.65-.01 5.75-.98.24.49.46.99.66 1.49-3.79 1.18-7.1 4.79-7.39 5.12-.48-1.58-.75-3.32-.75-5.15 0-.16.01-.32.02-.48zm2.46 8.35c.27-.3 3.09-3.4 6.78-4.56.88 2.3 1.26 4.49 1.37 5.21-1.5.63-3.14.99-4.88.99-1.27 0-2.48-.2-3.6-.58.11-.35.21-.7.33-1.06zm9.89-.9c-.11-.64-.47-2.67-1.3-4.85 2.08-.68 3.84-.33 4.19-.24-.46 2.19-1.68 4.09-3.37 5.39.16-.1.32-.2.48-.3z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-facebook":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge facebook-badge anim-pop">
                            <span class="brand-glyph-fb">f</span>
                        </div>
                    </div>
                `;

            case "brand-google":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge google-badge anim-pop">
                            <span class="brand-glyph-google">G</span>
                        </div>
                    </div>
                `;

            case "brand-instagram":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge instagram-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-linkedin":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge linkedin-badge anim-pop">
                            <span class="brand-glyph">in</span>
                        </div>
                    </div>
                `;

            case "brand-pinterest":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge pinterest-badge anim-pop">
                            <span class="brand-glyph">P</span>
                        </div>
                    </div>
                `;

            case "brand-reddit":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge reddit-badge anim-pop">
                            <span class="brand-glyph">👾</span>
                        </div>
                    </div>
                `;

            case "brand-snapchat":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge snapchat-badge anim-pop">
                            <span class="brand-glyph-snap">👻</span>
                        </div>
                    </div>
                `;

            case "brand-spotify":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge spotify-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-telegram":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge telegram-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-threads":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge threads-badge anim-pop">
                            <span class="brand-glyph">@</span>
                        </div>
                    </div>
                `;

            case "brand-tinder":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge tinder-badge anim-pop">
                            <span class="brand-glyph">🔥</span>
                        </div>
                    </div>
                `;

            case "brand-wechat":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge wechat-badge anim-pop">
                            <span class="brand-glyph">💬</span>
                        </div>
                    </div>
                `;

            case "brand-whatsapp":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge whatsapp-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M12.031 0C5.408 0 .025 5.383.025 12.006c0 2.115.552 4.178 1.6 5.996L0 24l6.177-1.599a11.956 11.956 0 0 0 5.854 1.517h.005c6.623 0 12.006-5.383 12.006-12.006C24.042 5.383 18.654 0 12.031 0zm.005 21.921c-1.796 0-3.557-.483-5.097-1.399l-.365-.217-3.784.979 1.011-3.687-.238-.379a9.94 9.94 0 0 1-1.528-5.212c0-5.503 4.478-9.98 9.983-9.98 2.666 0 5.172 1.038 7.056 2.924a9.92 9.92 0 0 1 2.92 7.057c0 5.503-4.478 9.98-10.026 9.98z"/></svg>
                        </div>
                    </div>
                `;

            case "brand-x":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge x-badge anim-pop">
                            <span class="brand-glyph">𝕏</span>
                        </div>
                    </div>
                `;

            case "brand-youtube":
                return `
                    <div class="pv-container pv-brand">
                        <div class="brand-badge youtube-badge anim-pop">
                            <svg viewBox="0 0 24 24" class="brand-svg"><path fill="#ffffff" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </div>
                    </div>
                `;

            // FLAG PREVIEWS
            case "flag":
                return `
                    <div class="pv-container pv-flag">
                        <div class="flag-icon-box anim-wave">
                            <span class="flag-code">${asset.code || "US"}</span>
                            <span class="flag-sub">${asset.country || "Flag"}</span>
                        </div>
                    </div>
                `;

            // MAP PREVIEWS
            case "map-world":
            case "map-pin-radar":
            case "map-route":
            case "map-europe":
            case "map-asia":
            case "map-americas":
                return `
                    <div class="pv-container pv-map">
                        <div class="map-grid-graphic anim-pulse">
                            <div class="radar-circle"></div>
                            <div class="radar-line"></div>
                            <span class="map-label">GEO HUD</span>
                        </div>
                    </div>
                `;

            // CHART PREVIEWS
            case "chart-bar":
                return `
                    <div class="pv-container pv-chart">
                        <div class="bar-chart-bars">
                            <div class="bar bar-1"></div>
                            <div class="bar bar-2"></div>
                            <div class="bar bar-3"></div>
                            <div class="bar bar-4"></div>
                            <div class="bar bar-5"></div>
                        </div>
                    </div>
                `;

            case "chart-donut":
                return `
                    <div class="pv-container pv-donut">
                        <div class="donut-circle anim-rotate">
                            <span class="donut-text">78%</span>
                        </div>
                    </div>
                `;

            case "chart-line":
                return `
                    <div class="pv-container pv-line-chart">
                        <svg viewBox="0 0 100 50" class="line-svg">
                            <path d="M5 45 Q 25 10, 45 35 T 85 10 T 95 20" fill="none" stroke="#00d2ff" stroke-width="3" class="anim-draw-line" />
                        </svg>
                    </div>
                `;

            // NUMBER COUNTERS
            case "counter-followers":
                return `
                    <div class="pv-container pv-counter">
                        <div class="counter-display anim-count-up">100,000</div>
                        <div class="counter-label">FOLLOWERS</div>
                    </div>
                `;

            case "counter-money":
                return `
                    <div class="pv-container pv-counter">
                        <div class="counter-display text-green anim-count-up">$49,850</div>
                        <div class="counter-label">REVENUE</div>
                    </div>
                `;

            case "counter-percent":
                return `
                    <div class="pv-container pv-counter">
                        <div class="counter-display text-cyan anim-count-up">100%</div>
                        <div class="counter-label">COMPLETE</div>
                    </div>
                `;

            case "counter-countdown":
                return `
                    <div class="pv-container pv-counter">
                        <div class="counter-display text-orange anim-countdown">00:59</div>
                        <div class="counter-label">COUNTDOWN</div>
                    </div>
                `;

            // LIQUID GLASS PACK
            case "glass-card":
            case "glass-pill":
            case "glass-modal":
            case "glass-shield":
            case "glass-orb":
            case "glass-tile":
                return `
                    <div class="pv-container pv-glass">
                        <div class="glass-card-element anim-glass-sheen">
                            <div class="glass-orb-light"></div>
                            <span class="glass-card-title">FROSTED GLASS</span>
                            <span class="glass-card-sub">Liquid Refraction</span>
                        </div>
                    </div>
                `;

            // TEXT ANIMATIONS
            case "text-kinetic":
            case "text-typewriter":
            case "text-glitch":
            case "text-clean":
            case "text-neon":
            case "text-3d":
            case "text-liquid":
            case "text-stomp":
            case "text-broadcast":
            case "text-signature":
                return `
                    <div class="pv-container pv-text-anim">
                        <div class="kinetic-text-title anim-glitch">KINETIC</div>
                        <div class="kinetic-text-sub">TYPOGRAPHY</div>
                    </div>
                `;

            // CALLOUTS
            case "callout-hud":
            case "callout-circle":
            case "callout-product":
            case "callout-bracket":
            case "callout-coord":
                return `
                    <div class="pv-container pv-callout">
                        <div class="callout-pointer-dot"></div>
                        <div class="callout-leader-line"></div>
                        <div class="callout-box">
                            <span>SPEC // 01</span>
                        </div>
                    </div>
                `;

            // PEOPLE
            case "people-speaker":
            case "people-testimonial":
            case "people-author":
            case "people-team":
            case "people-podcast":
                return `
                    <div class="pv-container pv-people">
                        <div class="people-card-pill">
                            <div class="people-avatar"></div>
                            <div class="people-info">
                                <div class="people-name">Sarah Connor</div>
                                <div class="people-role">Verified Speaker</div>
                            </div>
                        </div>
                    </div>
                `;

            // TRANSITIONS
            case "tr-zoom":
            case "tr-filmburn":
            case "tr-whippan":
            case "tr-glitch":
            case "tr-liquidwipe":
            case "tr-shape":
                return `
                    <div class="pv-container pv-transition">
                        <div class="tr-wipe-preview anim-wipe-flash">
                            <span class="tr-badge">${asset.name.split(' ')[0]}</span>
                        </div>
                    </div>
                `;

            default:
                return `
                    <div class="pv-container pv-default">
                        <span class="default-icon">✦</span>
                    </div>
                `;
        }
    }
};
