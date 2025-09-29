class App {
    constructor() {
        this.storage = new StorageService();
        this.currentView = 'scenes';
        this.views = {
            scenes: new ScenesView(),
            team: new TeamView(),
            events: new EventsView(),
            locator: new LocatorView() // НОВОЕ
        };
        this.profile = null;
        
        this.init();
    }

    init() {
        // Load profile
        this.profile = this.storage.loadProfile();
        
        // Check if first launch
        if (this.storage.isFirstLaunch()) {
            console.log('First launch detected, loading test data...');
            TestDataService.resetToTestData();
        }
        
        // Load app state
        const appState = this.storage.loadAppState();
        this.currentView = appState.currentView || 'scenes';
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Initial render
        this.render();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });
        
        // Logo button - справка
        const logoBtn = document.getElementById('logoBtn');
        if (logoBtn) {
            logoBtn.addEventListener('click', () => {
                this.showAboutModal();
            });
        }
        
        // Menu button - ОБНОВЛЕНО для dropdown
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdownMenu();
            });
        }

        // Dropdown menu items
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.hideDropdownMenu();
                this.showProfileModal();
            });
        }

        const aboutBtn = document.getElementById('aboutBtn');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.hideDropdownMenu();
                this.showAboutModal();
            });
        }

        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.hideDropdownMenu();
                alert('Настройки будут доступны в версии 1.3');
            });
        }

        // Profile modal
        this.setupProfileModalListeners();
        
        // About modal
        const closeAbout = document.getElementById('closeAbout');
        if (closeAbout) {
            closeAbout.addEventListener('click', () => {
                this.hideAboutModal();
            });
        }
        
        // Reset data button
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Это удалит все данные и загрузит тестовый набор. Продолжить?')) {
                    TestDataService.resetToTestData();
                    this.profile = this.storage.loadProfile(); // Reload profile
                    this.render();
                    this.hideAboutModal();
                    alert('Тестовые данные загружены успешно!');
                }
            });
        }
        
        // Click outside to close modals and dropdown
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('dropdownMenu');
            const menuBtn = document.getElementById('menuBtn');
            if (dropdown && !dropdown.contains(e.target) && e.target !== menuBtn) {
                this.hideDropdownMenu();
            }
        });
        
        // Modal backgrounds
        document.getElementById('aboutModal').addEventListener('click', (e) => {
            if (e.target.id === 'aboutModal') {
                this.hideAboutModal();
            }
        });

        document.getElementById('profileModal').addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    setupProfileModalListeners() {
        const closeProfile = document.getElementById('closeProfile');
        if (closeProfile) {
            closeProfile.addEventListener('click', () => {
                this.hideProfileModal();
            });
        }

        // Avatar change
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const avatarInput = document.getElementById('avatarInput');
        
        if (changeAvatarBtn && avatarInput) {
            changeAvatarBtn.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!ImageService.isValidImageFile(file)) {
                        alert('Пожалуйста, выберите изображение (JPEG, PNG, GIF, WebP)');
                        return;
                    }

                    try {
                        const compressed = await ImageService.compressImage(file);
                        const preview = document.getElementById('avatarPreview');
                        preview.innerHTML = `<img src="${compressed}" alt="Avatar">`;
                        preview.dataset.avatar = compressed;
                    } catch (error) {
                        console.error('Error compressing image:', error);
                        alert('Ошибка при обработке изображения');
                    }
                }
            });
        }

        // Save profile
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.saveProfile();
            });
        }
    }

    toggleDropdownMenu() {
        const dropdown = document.getElementById('dropdownMenu');
        dropdown.classList.toggle('show');
    }

    hideDropdownMenu() {
        const dropdown = document.getElementById('dropdownMenu');
        dropdown.classList.remove('show');
    }

    showProfileModal() {
        const modal = document.getElementById('profileModal');
        
        // Load current profile data
        const profile = this.storage.loadProfile();
        
        // Set form values
        document.getElementById('callsignInput').value = profile.callsign || '';
        document.getElementById('nameInput').value = profile.name || '';
        document.getElementById('phoneInput').value = profile.phone || '';
        
        // Set avatar
        const preview = document.getElementById('avatarPreview');
        if (profile.avatar) {
            preview.innerHTML = `<img src="${profile.avatar}" alt="Avatar">`;
            preview.dataset.avatar = profile.avatar;
        } else {
            preview.innerHTML = '<span>👤</span>';
            preview.dataset.avatar = '';
        }
        
        // Set visibility checkboxes
        document.getElementById('visibleInNetwork').checked = profile.visibility.inNetwork;
        document.getElementById('shareLocation').checked = profile.visibility.location;
        document.getElementById('acceptCalls').checked = profile.visibility.acceptCalls;
        
        modal.classList.add('show');
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        modal.classList.remove('show');
    }

    saveProfile() {
        const callsign = document.getElementById('callsignInput').value.trim();
        const name = document.getElementById('nameInput').value.trim();
        const phone = document.getElementById('phoneInput').value.trim();
        const avatarPreview = document.getElementById('avatarPreview');
        const avatar = avatarPreview.dataset.avatar || null;
        
        // Validate callsign
        if (!callsign) {
            alert('Позывной обязателен!');
            return;
        }
        
        // Check uniqueness
        if (!this.storage.isCallsignUnique(callsign, 'my_profile')) {
            alert('Этот позывной уже используется! Выберите другой.');
            return;
        }
        
        // Create profile object
        const profile = new Profile({
            callsign,
            name,
            phone,
            avatar,
            visibility: {
                inNetwork: document.getElementById('visibleInNetwork').checked,
                location: document.getElementById('shareLocation').checked,
                acceptCalls: document.getElementById('acceptCalls').checked
            }
        });
        
        // Validate
        const errors = profile.validate();
        if (errors.length > 0) {
            alert('Ошибки:\n' + errors.join('\n'));
            return;
        }
        
        // Save
        this.storage.saveProfile(profile);
        this.profile = profile;
        
        alert('Профиль сохранен!');
        this.hideProfileModal();
    }

    switchView(viewName) {
        if (this.currentView === viewName) return;
        
        this.currentView = viewName;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });
        
        // Save state
        const appState = this.storage.loadAppState();
        appState.currentView = viewName;
        this.storage.saveAppState(appState);
        
        // Render new view
        this.render();
    }

    render() {
        const mainContent = document.getElementById('mainContent');
        const view = this.views[this.currentView];
        
        if (view) {
            mainContent.innerHTML = view.render();
            view.attachEventListeners();
        }
    }

    showAboutModal() {
        const modal = document.getElementById('aboutModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    hideAboutModal() {
        const modal = document.getElementById('aboutModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
