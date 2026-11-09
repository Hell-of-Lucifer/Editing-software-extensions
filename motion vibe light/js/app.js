/**
 * Motion Vibe Light - Main Extension Application Controller
 * Handles UI interactions, category tree navigation, zoom controls, and Adobe AE Host communication.
 */

(function () {
    'use strict';

    // Application State
    const state = {
        csInterface: null,
        activeCategory: 'social-media',
        activeSubCategory: 'elements',
        searchQuery: '',
        filterMode: 'all', // 'all', 'favorites', 'recents'
        zoomColumns: 3,
        autoPlayPreview: true,
        favorites: new Set(['sm-34', 'sm-5-star', 'sm-facebook-logo']),
        recents: ['sm-34', 'sm-star-icon', 'sm-5-star'],
        settings: {
            compWidth: 1920,
            compHeight: 1080,
            fps: 30,
            duration: 5,
            autoComp: true
        }
    };

    // DOM Elements
    const elements = {
        categoryTree: document.getElementById('category-tree'),
        assetGrid: document.getElementById('asset-grid'),
        currentCategoryTitle: document.getElementById('current-category-title'),
        itemsCountBadge: document.getElementById('items-count-badge'),
        searchInput: document.getElementById('search-input'),
        searchClear: document.getElementById('search-clear'),
        zoomSlider: document.getElementById('zoom-slider'),
        btnFilterAll: document.getElementById('tb-filter-all'),
        btnFavorites: document.getElementById('tb-favorites'),
        btnRecents: document.getElementById('tb-recents'),
        btnAutoPreview: document.getElementById('tb-preview-toggle'),
        btnGetFull: document.getElementById('btn-get-full'),
        btnEmptyTrash: document.getElementById('btn-empty-trash'),
        btnSettings: document.getElementById('btn-settings'),
        modalGetFull: document.getElementById('modal-get-full'),
        modalSettings: document.getElementById('modal-settings'),
        toastContainer: document.getElementById('toast-container')
    };

    // Initialize Application
    function init() {
        state.csInterface = new CSInterface();

        setupCategoryTree();
        setupEventListeners();
        renderAssets();

        // Check AE connection
        state.csInterface.evalScript('MotionVibe.ping()', function (res) {
            console.log("ExtendScript Host Status:", res);
        });
    }

    // -------------------------------------------------------------
    // Category Tree Rendering & Navigation
    // -------------------------------------------------------------
    function setupCategoryTree() {
        if (!elements.categoryTree) return;
        elements.categoryTree.innerHTML = '';

        CATEGORIES_DATA.forEach(cat => {
            const catNode = createCategoryNode(cat, 0);
            elements.categoryTree.appendChild(catNode);
        });
    }

    function createCategoryNode(item, level) {
        const node = document.createElement('div');
        node.className = 'tree-node';

        const row = document.createElement('div');
        row.className = 'tree-row' + (state.activeCategory === item.id ? ' active' : '');
        row.dataset.id = item.id;
        row.dataset.level = level;

        const hasChildren = item.children && item.children.length > 0;

        // Chevron
        if (hasChildren) {
            const chevron = document.createElement('span');
            chevron.className = 'tree-chevron' + (item.expanded ? '' : ' collapsed');
            chevron.innerHTML = '▼';
            chevron.addEventListener('click', (e) => {
                e.stopPropagation();
                chevron.classList.toggle('collapsed');
                const childContainer = node.querySelector('.tree-children');
                if (childContainer) {
                    childContainer.classList.toggle('collapsed');
                }
            });
            row.appendChild(chevron);
        } else {
            const spacer = document.createElement('span');
            spacer.className = 'tree-chevron';
            spacer.innerHTML = (level === 0) ? '▶' : '';
            spacer.style.opacity = '0.3';
            row.appendChild(spacer);
        }

        // Title
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = item.name;
        row.appendChild(name);

        // Count Badge
        const badge = document.createElement('span');
        badge.className = 'tree-badge';
        badge.textContent = item.count || '';
        row.appendChild(badge);

        // Click to select
        row.addEventListener('click', () => {
            selectCategory(item, level);
        });

        node.appendChild(row);

        // Children
        if (hasChildren) {
            const childrenWrap = document.createElement('div');
            childrenWrap.className = `tree-children level-${level + 1}` + (item.expanded ? '' : ' collapsed');

            item.children.forEach(child => {
                const childNode = createCategoryNode(child, level + 1);
                childrenWrap.appendChild(childNode);
            });

            node.appendChild(childrenWrap);
        }

        return node;
    }

    function selectCategory(item, level) {
        // Highlight active tree row
        document.querySelectorAll('.tree-row').forEach(r => r.classList.remove('active'));
        const activeRow = document.querySelector(`.tree-row[data-id="${item.id}"]`);
        if (activeRow) activeRow.classList.add('active');

        state.filterMode = 'all';
        updateFilterButtons();

        if (level === 0) {
            state.activeCategory = item.id;
            state.activeSubCategory = item.children ? item.children[0].id : null;
            elements.currentCategoryTitle.textContent = item.name;
        } else if (level === 1) {
            state.activeSubCategory = item.id;
            elements.currentCategoryTitle.textContent = `Social Media / ${item.name}`;
        } else {
            state.activeSubCategory = item.id;
            elements.currentCategoryTitle.textContent = `Elements / ${item.name}`;
        }

        renderAssets();
    }

    // -------------------------------------------------------------
    // Asset Grid Rendering
    // -------------------------------------------------------------
    function renderAssets() {
        if (!elements.assetGrid) return;
        elements.assetGrid.innerHTML = '';

        let filtered = ASSETS_LIST.filter(asset => {
            // Mode filter
            if (state.filterMode === 'favorites') {
                return state.favorites.has(asset.id);
            }
            if (state.filterMode === 'recents') {
                return state.recents.includes(asset.id);
            }

            // Search query filter
            if (state.searchQuery.trim() !== '') {
                const q = state.searchQuery.toLowerCase();
                const matchName = asset.name.toLowerCase().includes(q);
                const matchTags = asset.tags && asset.tags.some(t => t.toLowerCase().includes(q));
                return matchName || matchTags;
            }

            // Category filter
            if (state.activeCategory && asset.category !== state.activeCategory) {
                return false;
            }

            // Subcategory filter
            if (state.activeSubCategory && state.activeSubCategory !== 'elements') {
                if (asset.subCategory && asset.subCategory !== state.activeSubCategory) {
                    return false;
                }
            }

            return true;
        });

        // Update items count
        if (elements.itemsCountBadge) {
            elements.itemsCountBadge.textContent = `${filtered.length} items`;
        }

        if (filtered.length === 0) {
            elements.assetGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 28px; margin-bottom: 10px;">🔍</div>
                    <div style="font-size: 14px; color: #aaa;">No assets match your search or filter</div>
                    <div style="font-size: 12px; margin-top: 6px;">Try searching for "star", "bookmark", "review", or clear filters</div>
                </div>
            `;
            return;
        }

        filtered.forEach(asset => {
            const card = createAssetCard(asset);
            elements.assetGrid.appendChild(card);
        });
    }

    function createAssetCard(asset) {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.dataset.id = asset.id;

        // Preview box
        const preview = document.createElement('div');
        preview.className = 'card-preview-area';
        preview.innerHTML = PreviewRenderer.renderCardContent(asset);

        // Hover Overlay with Apply Button
        const overlay = document.createElement('div');
        overlay.className = 'card-apply-overlay';
        overlay.innerHTML = `
            <button class="btn-apply-card" title="Apply to active After Effects composition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Apply to Comp
            </button>
        `;

        const applyBtn = overlay.querySelector('.btn-apply-card');
        applyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            applyAssetToComp(asset);
        });

        // Top-right action buttons (Favorite)
        const topActions = document.createElement('div');
        topActions.className = 'card-actions-hover';

        const favBtn = document.createElement('button');
        favBtn.className = 'card-btn btn-fav' + (state.favorites.has(asset.id) ? ' active' : '');
        favBtn.title = 'Add to Favorites';
        favBtn.innerHTML = state.favorites.has(asset.id) ? '★' : '☆';
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(asset.id, favBtn);
        });
        topActions.appendChild(favBtn);

        // Bottom Info Bar
        const infoBar = document.createElement('div');
        infoBar.className = 'card-info-bar';

        const title = document.createElement('span');
        title.className = 'card-title';
        title.textContent = asset.name;
        infoBar.appendChild(title);

        // Double Click to Apply
        card.addEventListener('dblclick', () => {
            applyAssetToComp(asset);
        });

        card.appendChild(preview);
        card.appendChild(overlay);
        card.appendChild(topActions);
        card.appendChild(infoBar);

        return card;
    }

    // -------------------------------------------------------------
    // After Effects ExtendScript Bridge Execution
    // -------------------------------------------------------------
    function applyAssetToComp(asset) {
        // Record in recents
        if (!state.recents.includes(asset.id)) {
            state.recents.unshift(asset.id);
            if (state.recents.length > 20) state.recents.pop();
        }

        const jsonString = JSON.stringify(asset);
        // Call Host ExtendScript
        const scriptCall = `MotionVibe.applyAsset(${JSON.stringify(jsonString)})`;

        state.csInterface.evalScript(scriptCall, function (result) {
            console.log("ExtendScript Apply Result:", result);
            if (result && typeof result === "string" && result.indexOf("ERROR") === 0) {
                showToast(result.replace("ERROR: ", ""), "error");
            } else {
                showToast(`Added '${asset.name}' to AE Composition!`, "success");
            }
        });
    }

    function toggleFavorite(id, buttonEl) {
        if (state.favorites.has(id)) {
            state.favorites.delete(id);
            buttonEl.classList.remove('active');
            buttonEl.innerHTML = '☆';
            showToast('Removed from Favorites');
        } else {
            state.favorites.add(id);
            buttonEl.classList.add('active');
            buttonEl.innerHTML = '★';
            showToast('Added to Favorites', 'success');
        }
        if (state.filterMode === 'favorites') {
            renderAssets();
        }
    }

    // -------------------------------------------------------------
    // Toast Notification System
    // -------------------------------------------------------------
    function showToast(message, type = 'info') {
        if (!elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">✓</span>
            <span class="toast-text">${message}</span>
        `;

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2400);
    }

    // -------------------------------------------------------------
    // UI Event Listeners
    // -------------------------------------------------------------
    function setupEventListeners() {
        // Zoom Slider (Changes column count 2-5)
        if (elements.zoomSlider) {
            elements.zoomSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                state.zoomColumns = val;
                elements.assetGrid.className = `asset-grid columns-${val}`;
            });
        }

        // Search Input
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                if (elements.searchClear) {
                    elements.searchClear.style.display = state.searchQuery ? 'block' : 'none';
                }
                renderAssets();
            });
        }

        if (elements.searchClear) {
            elements.searchClear.addEventListener('click', () => {
                elements.searchInput.value = '';
                state.searchQuery = '';
                elements.searchClear.style.display = 'none';
                renderAssets();
            });
        }

        // Toolbar Buttons
        if (elements.btnFilterAll) {
            elements.btnFilterAll.addEventListener('click', () => {
                state.filterMode = 'all';
                updateFilterButtons();
                renderAssets();
            });
        }

        if (elements.btnFavorites) {
            elements.btnFavorites.addEventListener('click', () => {
                state.filterMode = (state.filterMode === 'favorites') ? 'all' : 'favorites';
                updateFilterButtons();
                renderAssets();
            });
        }

        if (elements.btnRecents) {
            elements.btnRecents.addEventListener('click', () => {
                state.filterMode = (state.filterMode === 'recents') ? 'all' : 'recents';
                updateFilterButtons();
                renderAssets();
            });
        }

        if (elements.btnAutoPreview) {
            elements.btnAutoPreview.addEventListener('click', () => {
                state.autoPlayPreview = !state.autoPlayPreview;
                elements.btnAutoPreview.classList.toggle('active', state.autoPlayPreview);
                showToast(state.autoPlayPreview ? 'Live Previews: Enabled' : 'Live Previews: Paused');
            });
        }

        // Bottom Footer Buttons
        if (elements.btnEmptyTrash) {
            elements.btnEmptyTrash.addEventListener('click', () => {
                state.searchQuery = '';
                if (elements.searchInput) elements.searchInput.value = '';
                state.filterMode = 'all';
                updateFilterButtons();
                showToast('Filters and search reset');
                renderAssets();
            });
        }

        // Get Full Version Modal
        if (elements.btnGetFull && elements.modalGetFull) {
            elements.btnGetFull.addEventListener('click', () => {
                elements.modalGetFull.classList.add('open');
            });
        }

        // Settings Modal
        if (elements.btnSettings && elements.modalSettings) {
            elements.btnSettings.addEventListener('click', () => {
                elements.modalSettings.classList.add('open');
            });
        }

        // Close modals on click outside or close buttons
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el || el.classList.contains('modal-close')) {
                    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
                }
            });
        });
    }

    function updateFilterButtons() {
        if (elements.btnFavorites) {
            elements.btnFavorites.classList.toggle('active', state.filterMode === 'favorites');
        }
        if (elements.btnRecents) {
            elements.btnRecents.classList.toggle('active', state.filterMode === 'recents');
        }
    }

    // Launch app on DOM Ready
    window.addEventListener('DOMContentLoaded', init);
})();
