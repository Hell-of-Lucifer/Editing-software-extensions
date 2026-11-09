/**
 * Aftab Tube Downloder - Application Logic & Premiere Pro Engine Bridge
 * Author: Aftab Musrraf
 * Compatible with Adobe Premiere Pro CC & CS6 (all versions through CC 2026+)
 * Fallback support for Adobe After Effects
 */

(function () {
    'use strict';

    // State
    var state = {
        selectedFormat: 'mp4',
        selectedQuality: 'Best',
        currentVideo: {
            id: '-43v_i8trCU',
            title: 'learn video editing in 25 minutes - Beginner Tutorial',
            channel: 'Aftab Musrraf',
            duration: '28:59',
            views: '73 views',
            year: '2026',
            thumb: './assets/sample-thumb.jpg'
        },
        downloadHistory: [],
        isDownloading: false
    };

    // DOM Elements
    var el = {
        appWindow: document.getElementById('appWindow'),
        urlInput: document.getElementById('urlInput'),
        btnClearUrl: document.getElementById('btnClearUrl'),
        btnAnalyze: document.getElementById('btnAnalyze'),
        videoThumb: document.getElementById('videoThumb'),
        videoDuration: document.getElementById('videoDuration'),
        videoTitle: document.getElementById('videoTitle'),
        videoChannel: document.getElementById('videoChannel'),
        videoMeta: document.getElementById('videoMeta'),
        btnFormatMp4: document.getElementById('btnFormatMp4'),
        btnFormatMp3: document.getElementById('btnFormatMp3'),
        qualityGrid: document.getElementById('qualityGrid'),
        btnDownload: document.getElementById('btnDownload'),
        btnDownloadText: document.getElementById('btnDownloadText'),
        progressPanel: document.getElementById('progressPanel'),
        progressStatus: document.getElementById('progressStatus'),
        progressStats: document.getElementById('progressStats'),
        progressBarFill: document.getElementById('progressBarFill'),
        hostStatusText: document.getElementById('hostStatusText') || document.getElementById('aeStatusText'),
        hostStatusDot: document.getElementById('hostStatusDot') || document.getElementById('aeStatusDot'),
        btnNavHome: document.getElementById('btnNavHome'),
        btnNavHistory: document.getElementById('btnNavHistory'),
        historyDrawer: document.getElementById('historyDrawer'),
        btnCloseHistory: document.getElementById('btnCloseHistory'),
        historyList: document.getElementById('historyList'),
        toast: document.getElementById('toastNotification'),
        toastMessage: document.getElementById('toastMessage'),
        btnOpenYouTube: document.getElementById('btnOpenYouTube'),
        btnSidebarYouTube: document.getElementById('btnSidebarYouTube')
    };

    // Initialize CSInterface
    var csInterface = new CSInterface();
    var YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@AftabMusrraf/videos';

    /**
     * Open YouTube channel in Google Chrome or default browser
     */
    function openYouTubeChannel(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        showToast('Opening YouTube channel in Chrome...', 'normal', 2500);
        csInterface.openInChrome(YOUTUBE_CHANNEL_URL);
    }

    /**
     * Display a floating notification toast
     */
    function showToast(message, type, duration) {
        if (!el.toast) return;
        type = type || 'normal';
        duration = duration || 3200;

        el.toastMessage.textContent = message;
        el.toast.className = 'toast show ' + type;

        clearTimeout(el.toast._timer);
        el.toast._timer = setTimeout(function () {
            el.toast.className = 'toast';
        }, duration);
    }

    /**
     * Check host status (Premiere Pro / After Effects)
     */
    function checkHost() {
        var statusEl = el.hostStatusText;
        var dotEl = el.hostStatusDot;

        if (csInterface.isInsideApp) {
            csInterface.evalScript('$aftabTube.getHostInfo()', function (raw) {
                try {
                    var data = JSON.parse(raw);
                    if (data && data.success) {
                        var isPremiere = (data.appId === 'PPRO' || (data.appName && data.appName.toLowerCase().indexOf('premiere') !== -1));
                        var verNum = data.appVersion ? data.appVersion.split('.')[0] : '';
                        var label = isPremiere ? ('PPro ' + (verNum ? ('CC ' + verNum) : '')) : ('AE ' + verNum);
                        var statusStr = label.trim() + ' Connected';

                        if (data.activeSequence) {
                            statusStr += ' (' + data.activeSequence + ')';
                        } else if (data.activeComp) {
                            statusStr += ' (' + data.activeComp + ')';
                        } else if (data.hasProject) {
                            statusStr += ' (Project Open)';
                        }

                        if (statusEl) statusEl.textContent = statusStr;
                        if (dotEl) {
                            dotEl.style.background = '#10b981';
                            dotEl.style.boxShadow = '0 0 8px #10b981';
                            dotEl.title = isPremiere ? 'Premiere Pro Connected' : 'After Effects Connected';
                        }
                    } else {
                        if (statusEl) statusEl.textContent = 'Premiere Pro Connected';
                    }
                } catch (e) {
                    if (statusEl) statusEl.textContent = 'Premiere Pro Active';
                }
            });
        } else {
            if (statusEl) statusEl.textContent = 'Browser Simulation';
            if (dotEl) {
                dotEl.style.background = '#38bdf8';
                dotEl.style.boxShadow = '0 0 8px #38bdf8';
                dotEl.title = 'Browser Simulation Active';
            }
        }
    }

    /**
     * Update Format selection
     */
    function setFormat(format) {
        state.selectedFormat = format.toLowerCase();
        if (state.selectedFormat === 'mp4') {
            el.btnFormatMp4.classList.add('active');
            el.btnFormatMp3.classList.remove('active');
        } else {
            el.btnFormatMp4.classList.remove('active');
            el.btnFormatMp3.classList.add('active');
        }
    }

    /**
     * Update Quality selection
     */
    function setQuality(btn) {
        var pills = el.qualityGrid.querySelectorAll('.quality-pill');
        pills.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        state.selectedQuality = btn.getAttribute('data-quality') || 'Best';
    }

    /**
     * Analyze entered YouTube URL
     */
    async function analyzeUrl() {
        var url = (el.urlInput.value || '').trim();
        if (!url) {
            showToast('Please enter a YouTube video URL.', 'error');
            el.urlInput.focus();
            return;
        }

        el.btnAnalyze.disabled = true;
        el.btnAnalyze.style.opacity = '0.75';
        showToast('Analyzing URL...', 'normal', 1500);

        try {
            var info = await window.Downloader.analyzeUrl(url);
            state.currentVideo = {
                id: info.id,
                title: info.title,
                channel: info.author,
                duration: info.duration,
                views: info.views || '73 views',
                year: info.year || '2026',
                thumb: info.thumbnail
            };

            // Update UI elements
            el.videoTitle.textContent = state.currentVideo.title;
            el.videoChannel.textContent = state.currentVideo.channel;
            el.videoDuration.textContent = state.currentVideo.duration;
            el.videoMeta.textContent = state.currentVideo.duration + ' · ' + state.currentVideo.views + ' · ' + state.currentVideo.year;

            // Load thumbnail safely
            var tempImg = new Image();
            tempImg.onload = function () {
                el.videoThumb.src = state.currentVideo.thumb;
            };
            tempImg.onerror = function () {
                el.videoThumb.src = './assets/sample-thumb.jpg';
            };
            tempImg.src = state.currentVideo.thumb;

            showToast('✓ Video details loaded!', 'success');
        } catch (err) {
            console.error('[AftabTube] Analyze error:', err);
            showToast('Error analyzing URL. Using fallback preview.', 'error');
        } finally {
            el.btnAnalyze.disabled = false;
            el.btnAnalyze.style.opacity = '1';
        }
    }

    /**
     * Import a media file into Premiere Pro (or After Effects)
     */
    function importMediaIntoHost(filePath, itemName) {
        return new Promise(function (resolve) {
            if (!csInterface.isInsideApp) {
                // Browser simulation
                setTimeout(function () {
                    resolve({
                        success: true,
                        simulated: true,
                        message: 'Simulated: Imported ' + itemName + ' into Premiere Pro Project & Timeline.'
                    });
                }, 600);
                return;
            }

            // Escape Windows backslashes for ExtendScript evaluation string
            var escapedPath = filePath.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            var script = '$aftabTube.importMediaFile("' + escapedPath + '", true);';

            csInterface.evalScript(script, function (result) {
                try {
                    var parsed = JSON.parse(result);
                    resolve(parsed);
                } catch (e) {
                    resolve({
                        success: false,
                        error: 'ExtendScript evaluation failed: ' + result
                    });
                }
            });
        });
    }

    // Alias for backwards compatibility
    var importIntoAfterEffects = importMediaIntoHost;

    /**
     * Add an item to the history drawer
     */
    function addToHistory(item) {
        state.downloadHistory.unshift(item);
        renderHistory();
    }

    function renderHistory() {
        if (!el.historyList) return;
        el.historyList.innerHTML = '';

        if (state.downloadHistory.length === 0) {
            el.historyList.innerHTML = '<div style="color:#50688a;font-size:12px;text-align:center;padding:20px;">No downloads yet.</div>';
            return;
        }

        state.downloadHistory.forEach(function (h) {
            var div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span class="history-item-title">${h.title}</span>
                <div class="history-item-meta">
                    <span>${h.format.toUpperCase()} · ${h.quality}</span>
                    <span class="history-item-action">Re-import to Timeline ↗</span>
                </div>
            `;
            div.addEventListener('click', function () {
                showToast('Importing to Premiere Pro...', 'normal');
                importMediaIntoHost(h.filePath, h.title).then(function (res) {
                    if (res && res.success) {
                        showToast('✓ ' + (res.message || 'Imported to Timeline!'), 'success');
                    } else {
                        showToast('Import error: ' + (res.error || 'Failed'), 'error');
                    }
                });
            });
            el.historyList.appendChild(div);
        });
    }

    /**
     * Download and Import action
     */
    async function startDownloadAndImport() {
        if (state.isDownloading) return;

        var url = (el.urlInput.value || '').trim();
        if (!url) {
            showToast('Please enter a valid YouTube URL.', 'error');
            return;
        }

        state.isDownloading = true;
        el.btnDownload.classList.add('loading');
        el.btnDownloadText.textContent = 'Processing...';
        el.progressPanel.style.display = 'flex';
        el.progressBarFill.style.width = '0%';
        el.progressStatus.textContent = 'Starting download...';
        el.progressStats.textContent = '0%';

        try {
            var downloadResult = await window.Downloader.download({
                url: url,
                format: state.selectedFormat,
                quality: state.selectedQuality,
                title: state.currentVideo.title,
                onStatus: function (statusText) {
                    el.progressStatus.textContent = statusText;
                },
                onProgress: function (p) {
                    var pct = p.percent || 0;
                    el.progressBarFill.style.width = pct + '%';
                    el.progressStats.textContent = pct + '% · ' + (p.speed || '');
                }
            });

            if (downloadResult && downloadResult.success) {
                el.progressStatus.textContent = 'Importing into Premiere Pro project...';
                el.progressBarFill.style.width = '100%';

                // Import into Premiere Pro
                var importResult = await importMediaIntoHost(downloadResult.filePath, downloadResult.title);

                if (importResult && importResult.success) {
                    var successMsg = importResult.message || ('Successfully imported into Premiere Pro!');
                    showToast('✓ ' + successMsg, 'success', 5000);
                    addToHistory({
                        title: downloadResult.title,
                        filePath: downloadResult.filePath,
                        format: downloadResult.format,
                        quality: downloadResult.quality
                    });
                } else {
                    showToast('File saved, but Premiere Pro import reported: ' + (importResult.error || 'Check project'), 'error', 4500);
                }
            } else {
                showToast('Failed to download video.', 'error');
            }

        } catch (err) {
            console.error('[AftabTube] Download error:', err);
            showToast('Download error: ' + (err.message || 'Check connection'), 'error');
        } finally {
            state.isDownloading = false;
            el.btnDownload.classList.remove('loading');
            el.btnDownloadText.textContent = 'Download & Import';
            setTimeout(function () {
                if (!state.isDownloading) {
                    el.progressPanel.style.display = 'none';
                }
            }, 3000);
        }
    }

    /**
     * Setup event listeners
     */
    function initEvents() {
        // Format buttons
        el.btnFormatMp4.addEventListener('click', function () { setFormat('mp4'); });
        el.btnFormatMp3.addEventListener('click', function () { setFormat('mp3'); });

        // Quality buttons
        el.qualityGrid.addEventListener('click', function (e) {
            var target = e.target.closest('.quality-pill');
            if (target) {
                setQuality(target);
            }
        });

        // Analyze button & input enter key
        el.btnAnalyze.addEventListener('click', analyzeUrl);
        el.urlInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                analyzeUrl();
            }
        });

        // Clear button
        el.btnClearUrl.addEventListener('click', function () {
            el.urlInput.value = '';
            el.urlInput.focus();
        });

        // Download & Import button
        el.btnDownload.addEventListener('click', startDownloadAndImport);

        // Sidebar Navigation
        el.btnNavHome.addEventListener('click', function () {
            el.btnNavHome.classList.add('active');
            el.btnNavHistory.classList.remove('active');
            el.historyDrawer.classList.remove('open');
        });

        el.btnNavHistory.addEventListener('click', function () {
            var isOpen = el.historyDrawer.classList.toggle('open');
            if (isOpen) {
                el.btnNavHistory.classList.add('active');
                el.btnNavHome.classList.remove('active');
                renderHistory();
            } else {
                el.btnNavHistory.classList.remove('active');
                el.btnNavHome.classList.add('active');
            }
        });

        el.btnCloseHistory.addEventListener('click', function () {
            el.historyDrawer.classList.remove('open');
            el.btnNavHistory.classList.remove('active');
            el.btnNavHome.classList.add('active');
        });

        // Open YouTube channel in Chrome
        if (el.btnOpenYouTube) {
            el.btnOpenYouTube.addEventListener('click', openYouTubeChannel);
        }
        if (el.btnSidebarYouTube) {
            el.btnSidebarYouTube.addEventListener('click', openYouTubeChannel);
        }
        if (el.videoChannel) {
            el.videoChannel.style.cursor = 'pointer';
            el.videoChannel.title = 'Open Aftab Musrraf YouTube Channel in Chrome';
            el.videoChannel.addEventListener('click', openYouTubeChannel);
        }

        // Check host on focus
        window.addEventListener('focus', checkHost);

        // Allow F5 and Ctrl+R to reload the panel immediately
        window.addEventListener('keydown', function (e) {
            if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
                window.location.reload();
            }
        });
    }

    // Initialize application
    function init() {
        initEvents();
        checkHost();
        renderHistory();
        console.log('[AftabTube] Premiere Pro extension initialized successfully.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
