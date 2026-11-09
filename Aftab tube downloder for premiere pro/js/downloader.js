/**
 * Aftab Tube Downloder - Core Download & Stream Resolver Engine
 * Author: Aftab Musrraf
 * Compatible with Adobe CEP 6.0 - 12.0+ (Node.js runtime) and browser fallback.
 * Built with native yt-dlp & ffmpeg support for high-fidelity After Effects video & audio imports.
 */

(function (window) {
    'use strict';

    // Environment detection
    var hasNode = (typeof process !== 'undefined' && typeof require === 'function');
    var fs = hasNode ? require('fs') : null;
    var path = hasNode ? require('path') : null;
    var os = hasNode ? require('os') : null;
    var https = hasNode ? require('https') : null;
    var http = hasNode ? require('http') : null;
    var child_process = hasNode ? require('child_process') : null;

    var Downloader = {
        /**
         * Locate bundled or system binaries (yt-dlp and ffmpeg)
         */
        getBinaryPaths: function () {
            if (!hasNode || !path || !fs) {
                return { ytdlp: null, ffmpeg: null };
            }

            var appData = process.env.APPDATA || '';
            var localAppData = process.env.LOCALAPPDATA || '';
            var home = os ? os.homedir() : '';

            // Search paths in order of priority
            var candidateDirs = [
                // 1. Extension bin directory relative to current module / HTML file
                (typeof __dirname !== 'undefined') ? path.join(__dirname, '..', 'bin') : null,
                (typeof __dirname !== 'undefined') ? path.join(__dirname, 'bin') : null,
                // 2. Installed Adobe CEP extension directory
                appData ? path.join(appData, 'Adobe', 'CEP', 'extensions', 'com.aftab.tubedownloader', 'bin') : null,
                // 3. Desktop project directory
                home ? path.join(home, 'Desktop', 'Aftab tube downloder', 'bin') : null,
                // 4. Current working directory
                (process.cwd && typeof process.cwd === 'function') ? path.join(process.cwd(), 'bin') : null
            ].filter(Boolean);

            var ytdlpPath = null;
            var ffmpegPath = null;

            for (var i = 0; i < candidateDirs.length; i++) {
                var dir = candidateDirs[i];
                var ytdlpCand = path.join(dir, 'yt-dlp.exe');
                var ffmpegCand = path.join(dir, 'ffmpeg.exe');

                if (!ytdlpPath && fs.existsSync(ytdlpCand)) {
                    ytdlpPath = ytdlpCand;
                }
                if (!ffmpegPath && fs.existsSync(ffmpegCand)) {
                    ffmpegPath = ffmpegCand;
                }
            }

            // Fallback for ffmpeg if not in bin
            if (!ffmpegPath) {
                var altFfmpeg = [
                    path.join(localAppData, 'Programs', 'Xender Download', 'Xender AI', 'ffmpeg', 'ffmpeg.exe'),
                    path.join(localAppData, 'CapCut', 'Apps', '8.0.0.3318', 'ffmpeg.exe')
                ];
                for (var j = 0; j < altFfmpeg.length; j++) {
                    if (fs.existsSync(altFfmpeg[j])) {
                        ffmpegPath = altFfmpeg[j];
                        break;
                    }
                }
            }

            return { ytdlp: ytdlpPath, ffmpeg: ffmpegPath };
        },

        /**
         * Extract YouTube Video ID from any standard URL
         */
        extractVideoId: function (url) {
            if (!url) return null;
            url = url.trim();
            if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
            var regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            var match = url.match(regExp);
            return match ? match[1] : null;
        },

        /**
         * Determine user's local downloads directory
         */
        getDownloadFolder: function () {
            if (hasNode && os && path && fs) {
                var home = os.homedir();
                var dl = path.join(home, 'Downloads', 'AftabTube');
                try {
                    if (!fs.existsSync(dl)) {
                        fs.mkdirSync(dl, { recursive: true });
                    }
                    return dl;
                } catch (e) {
                    return path.join(home, 'Downloads');
                }
            }
            return 'C:\\Users\\Default\\Downloads\\AftabTube';
        },

        /**
         * Sanitize file names for Windows filesystem
         */
        sanitizeFilename: function (name) {
            return (name || 'AftabTube_Media')
                .replace(/[\\/:*?"<>|]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 80);
        },

        /**
         * Analyze video URL and fetch metadata (title, author, thumbnail, duration)
         */
        analyzeUrl: async function (url) {
            var videoId = this.extractVideoId(url);
            var bins = this.getBinaryPaths();

            var result = {
                id: videoId || 'MediaStream',
                url: url,
                title: 'learn video editing in 25 minutes - Beginner Tutorial',
                author: 'Aftab Musrraf',
                duration: '28:59',
                views: '73 views',
                year: new Date().getFullYear().toString(),
                thumbnail: videoId ? ('https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg') : './assets/sample-thumb.jpg'
            };

            // 1. Fast metadata query via yt-dlp if available
            if (bins.ytdlp && hasNode && child_process) {
                try {
                    var ytdlpData = await new Promise(function (resolve) {
                        var cmdArgs = [
                            '--print', '%(id)s|||%(title)s|||%(uploader)s|||%(duration_string)s|||%(thumbnail)s|||%(view_count)s',
                            '--no-warnings',
                            '--no-playlist',
                            url
                        ];
                        child_process.execFile(bins.ytdlp, cmdArgs, { timeout: 8000 }, function (err, stdout) {
                            if (!err && stdout && stdout.trim()) {
                                resolve(stdout.trim());
                            } else {
                                resolve(null);
                            }
                        });
                    });

                    if (ytdlpData) {
                        var parts = ytdlpData.split('|||');
                        if (parts.length >= 2) {
                            result.id = parts[0] || result.id;
                            result.title = parts[1] || result.title;
                            result.author = parts[2] || result.author;
                            result.duration = parts[3] || result.duration;
                            if (parts[4] && parts[4].startsWith('http')) {
                                result.thumbnail = parts[4];
                            }
                            if (parts[5]) {
                                var vCount = parseInt(parts[5], 10);
                                if (!isNaN(vCount)) {
                                    result.views = (vCount >= 1000000) ? ((vCount / 1000000).toFixed(1) + 'M views') :
                                                   (vCount >= 1000) ? ((vCount / 1000).toFixed(1) + 'K views') : (vCount + ' views');
                                }
                            }
                            return result;
                        }
                    }
                } catch (e) {
                    console.warn('[Downloader] yt-dlp info query fallback:', e);
                }
            }

            // 2. Fallback to YouTube oEmbed
            if (videoId) {
                try {
                    var oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) + '&format=json';
                    var res = await fetch(oembedUrl);
                    if (res.ok) {
                        var data = await res.json();
                        result.title = data.title || result.title;
                        result.author = data.author_name || result.author;
                        result.thumbnail = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg';
                        return result;
                    }
                } catch (err) {
                    console.warn('[Downloader] oEmbed error:', err);
                }

                // 3. Fallback to NoEmbed
                try {
                    var noembedUrl = 'https://noembed.com/embed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId);
                    var nRes = await fetch(noembedUrl);
                    if (nRes.ok) {
                        var nData = await nRes.json();
                        if (nData.title) result.title = nData.title;
                        if (nData.author_name) result.author = nData.author_name;
                        result.thumbnail = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
                        return result;
                    }
                } catch (nErr) {
                    console.warn('[Downloader] Noembed error:', nErr);
                }
            }

            return result;
        },

        /**
         * Ensure downloaded video has Premiere Pro compatible H.264 video compression
         */
        ensureHostCompatibility: function (filePath, ffmpegPath, onStatus) {
            return new Promise(function (resolve) {
                if (!hasNode || !fs || !child_process || !ffmpegPath || !fs.existsSync(filePath)) {
                    resolve(filePath);
                    return;
                }

                // Run probe check using ffmpeg
                child_process.execFile(ffmpegPath, ['-i', filePath], function (err, stdout, stderr) {
                    var probeText = (stdout || '') + (stderr || '');
                    
                    // Check if video codec is non-H264 (e.g. vp9, av01, hevc) which Premiere Pro might reject
                    var isVp9 = probeText.indexOf('Video: vp9') !== -1;
                    var isAv1 = probeText.indexOf('Video: av01') !== -1 || probeText.indexOf('Video: av1') !== -1;
                    var isH264 = probeText.indexOf('Video: h264') !== -1 || probeText.indexOf('avc1') !== -1;

                    if ((isVp9 || isAv1 || !isH264) && probeText.indexOf('Video:') !== -1) {
                        if (onStatus) onStatus('Converting to Premiere Pro compatible H.264...');
                        var dir = path.dirname(filePath);
                        var ext = path.extname(filePath);
                        var base = path.basename(filePath, ext);
                        var tempFixed = path.join(dir, base + '_ppro_fixed' + ext);

                        var transcodeArgs = [
                            '-y',
                            '-i', filePath,
                            '-c:v', 'libx264',
                            '-pix_fmt', 'yuv420p',
                            '-preset', 'veryfast',
                            '-crf', '20',
                            '-c:a', 'aac',
                            '-b:a', '192k',
                            tempFixed
                        ];

                        child_process.execFile(ffmpegPath, transcodeArgs, function (tcErr) {
                            if (!tcErr && fs.existsSync(tempFixed)) {
                                try {
                                    fs.unlinkSync(filePath);
                                    fs.renameSync(tempFixed, filePath);
                                } catch (e) {
                                    resolve(tempFixed);
                                    return;
                                }
                                resolve(filePath);
                            } else {
                                resolve(filePath);
                            }
                        });
                    } else {
                        // Already H.264, completely Premiere Pro compatible!
                        resolve(filePath);
                    }
                });
            });
        },

        ensureAeCompatibility: function (filePath, ffmpegPath, onStatus) {
            return this.ensureHostCompatibility(filePath, ffmpegPath, onStatus);
        },

        /**
         * Download media stream and save locally for Premiere Pro import
         */
        download: async function (options) {
            var self = this;
            var url = options.url;
            var format = options.format || 'mp4';
            var quality = options.quality || 'Best';
            var title = options.title || 'AftabTube_Download';
            var onProgress = options.onProgress || function () {};
            var onStatus = options.onStatus || function () {};

            var saveDir = this.getDownloadFolder();
            var ext = (format.toLowerCase() === 'mp3') ? 'mp3' : 'mp4';
            var cleanTitle = this.sanitizeFilename(title);
            var destPath = hasNode ? path.join(saveDir, cleanTitle + '_' + quality + '.' + ext) : (cleanTitle + '.' + ext);

            if (!hasNode) {
                // Browser simulation mode
                return new Promise(function (resolve) {
                    var cur = 20;
                    var timer = setInterval(function () {
                        cur += 15;
                        onProgress({
                            percent: Math.min(cur, 100),
                            speed: '4.8 MB/s',
                            downloaded: (cur * 0.4).toFixed(1) + ' MB',
                            total: '40.0 MB'
                        });
                        if (cur >= 100) {
                            clearInterval(timer);
                            onStatus('Simulated download complete.');
                            resolve({
                                success: true,
                                filePath: 'C:\\Users\\JUNAID\\Downloads\\AftabTube\\' + cleanTitle + '.' + ext,
                                title: title,
                                format: ext,
                                quality: quality
                            });
                        }
                    }, 250);
                });
            }

            var bins = this.getBinaryPaths();
            if (!bins.ytdlp) {
                throw new Error('yt-dlp engine not found. Please ensure yt-dlp.exe is inside the extension bin folder.');
            }

            onStatus('Initializing YouTube download engine...');
            onProgress({ percent: 5, speed: '0 MB/s', downloaded: '0 MB' });

            return new Promise(function (resolve, reject) {
                var heightMap = {
                    'Best': 2160,
                    '1080p': 1080,
                    '720p': 720,
                    '480p': 480,
                    '360p': 360,
                    '240p': 240,
                    '144p': 144
                };
                var maxH = heightMap[quality] || 1080;

                var ytdlpArgs = [
                    url,
                    '--no-playlist',
                    '--no-warnings'
                ];

                if (bins.ffmpeg) {
                    ytdlpArgs.push('--ffmpeg-location', bins.ffmpeg);
                }

                if (ext === 'mp3') {
                    // Extract high quality audio with M4A/AAC source to avoid YouTube 403 blocks
                    ytdlpArgs.push(
                        '-f', 'ba[ext=m4a]/ba',
                        '-x',
                        '--audio-format', 'mp3',
                        '--audio-quality', '0',
                        '-o', path.join(saveDir, cleanTitle + '_' + quality + '.%(ext)s')
                    );
                } else {
                    // Force H.264 (avc1) video & AAC audio streams for 100% native After Effects compatibility!
                    var formatSelector;
                    if (quality === 'Best') {
                        formatSelector = 'bv*[vcodec^=avc]+ba[ext=m4a]/bv*[vcodec^=avc]+ba/b[vcodec^=avc]/bv*+ba[ext=m4a]/bv*+ba/b';
                    } else {
                        formatSelector = 'bv*[vcodec^=avc][height<=' + maxH + ']+ba[ext=m4a]/bv*[vcodec^=avc][height<=' + maxH + ']+ba/b[vcodec^=avc][height<=' + maxH + ']/bv*[height<=' + maxH + ']+ba[ext=m4a]/bv*[height<=' + maxH + ']+ba/b[height<=' + maxH + ']/b';
                    }

                    ytdlpArgs.push(
                        '-f', formatSelector,
                        '--merge-output-format', 'mp4',
                        '-o', destPath
                    );
                }

                onStatus('Connecting to YouTube & fetching streams...');
                var proc = child_process.spawn(bins.ytdlp, ytdlpArgs);
                var lastPercent = 5;

                proc.stdout.on('data', function (chunk) {
                    var text = chunk.toString();

                    // Parse download percentage: [download]  45.2% of  171.01MiB at    5.43MiB/s ETA 00:27
                    var pctMatch = text.match(/\[download\]\s+([\d\.]+)%/);
                    if (pctMatch) {
                        var pct = parseFloat(pctMatch[1]);
                        lastPercent = pct;
                        var speedMatch = text.match(/at\s+([^\s]+)/);
                        var sizeMatch = text.match(/of\s+~?\s*([^\s]+)/);
                        var spd = speedMatch ? speedMatch[1] : '';
                        var sz = sizeMatch ? sizeMatch[1] : '';

                        onProgress({
                            percent: Math.min(Math.round(pct), 98),
                            speed: spd,
                            downloaded: sz,
                            total: sz
                        });
                        onStatus('Downloading: ' + Math.round(pct) + '% ' + (spd ? ('(' + spd + ')') : ''));
                    } else if (text.indexOf('[Merger]') !== -1 || text.indexOf('[ExtractAudio]') !== -1) {
                        onStatus('Assembling media tracks...');
                        onProgress({ percent: 99, speed: 'Merging' });
                    }
                });

                var errorLog = '';
                proc.stderr.on('data', function (chunk) {
                    errorLog += chunk.toString();
                });

                proc.on('close', async function (code) {
                    if (code === 0) {
                        // Locate output file (handle case where extension was adjusted by yt-dlp)
                        var finalFilePath = destPath;
                        if (!fs.existsSync(finalFilePath)) {
                            var altPath = path.join(saveDir, cleanTitle + '_' + quality + '.' + ext);
                            if (fs.existsSync(altPath)) {
                                finalFilePath = altPath;
                            }
                        }

                        if (!fs.existsSync(finalFilePath)) {
                            reject(new Error('Downloaded file not found on disk.'));
                            return;
                        }

                        // Ensure Premiere Pro compatibility (transcodes if any non-supported VP9/AV1 codec was present)
                        if (ext === 'mp4' && bins.ffmpeg) {
                            var compatFn = self.ensureHostCompatibility || self.ensureAeCompatibility;
                            finalFilePath = await compatFn.call(self, finalFilePath, bins.ffmpeg, onStatus);
                        }

                        onProgress({ percent: 100, speed: 'Complete', downloaded: '100%' });
                        onStatus('File saved. Preparing to import into Premiere Pro...');

                        resolve({
                            success: true,
                            filePath: finalFilePath,
                            title: title,
                            format: ext,
                            quality: quality
                        });
                    } else {
                        reject(new Error(errorLog || ('Download process exited with code ' + code)));
                    }
                });

                proc.on('error', function (err) {
                    reject(err);
                });
            });
        }
    };

    window.Downloader = Downloader;

})(window);
