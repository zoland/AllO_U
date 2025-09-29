class StorageService {
    constructor() {
        this.prefix = 'allo_g_';
        this.version = '1.2.0';
    }

    // Generic methods (существующие)
    save(key, data) {
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    }

    load(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const data = localStorage.getItem(fullKey);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Storage load error:', e);
            return defaultValue;
        }
    }

    remove(key) {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Profile methods (НОВЫЕ)
    saveProfile(profile) {
        return this.save('my_profile', profile);
    }

    loadProfile() {
        const data = this.load('my_profile', null);
        return data ? new Profile(data) : new Profile({
            callsign: 'User' + Math.floor(Math.random() * 1000),
            name: '',
            phone: '',
            avatar: null,
            visibility: {
                inNetwork: true,
                location: true,
                acceptCalls: true
            }
        });
    }

    // Check callsign uniqueness (НОВОЕ)
    isCallsignUnique(callsign, excludeId = null) {
        const participants = this.loadParticipants();
        const myProfile = this.loadProfile();
        
        // Check against my profile
        if (myProfile.callsign === callsign && excludeId !== 'my_profile') {
            return false;
        }
        
        // Check against other participants
        return !participants.some(p => 
            p.identity.callsign === callsign && p.id !== excludeId
        );
    }

    // Specific methods for data types (существующие)
    saveScenes(scenes) {
        return this.save('scenes', scenes);
    }

    loadScenes() {
        const data = this.load('scenes', []);
        return data.map(s => new Scene(s));
    }

    saveParticipants(participants) {
        return this.save('participants', participants);
    }

    loadParticipants() {
        const data = this.load('participants', []);
        return data.map(p => new Participant(p));
    }

    saveEvents(events) {
        return this.save('events', events);
    }

    loadEvents() {
        const data = this.load('events', []);
        return data.map(e => new Event(e));
    }

    // Settings
    saveSettings(settings) {
        return this.save('settings', settings);
    }

    loadSettings() {
        return this.load('settings', {
            theme: 'dark',
            language: 'ru',
            notifications: true,
            sound: true
        });
    }

    // App state
    saveAppState(state) {
        return this.save('app_state', state);
    }

    loadAppState() {
        return this.load('app_state', {
            currentView: 'scenes',
            currentScene: null,
            version: this.version
        });
    }

    // Check if first launch
    isFirstLaunch() {
        return !this.load('initialized', false);
    }

    setInitialized() {
        this.save('initialized', true);
        this.save('init_date', new Date().toISOString());
    }
}
