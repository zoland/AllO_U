class Participant {
    constructor(data = {}) {
        this.id = data.id || `participant-${Date.now()}`;
        
        // Identity
        this.identity = data.identity || {
            callsign: data.callsign || 'Участник',
            name: data.name || '',
            phone: data.phone || '',
            avatar: data.avatar || '👤',
            color: data.color || '#4CAF50',
            badge: data.badge || ''
        };
        
        // Entity classification
        this.entity = data.entity || {
            type: data.type || 'human', // human|droid|device|service
            subtype: data.subtype || 'operator',
            model: data.model || '',
            firmware: data.firmware || ''
        };
        
        // Capabilities
        this.capabilities = data.capabilities || {
            communication: ['voice', 'text'],
            sensors: [],
            actuators: [],
            protocols: ['I', 'W'],
            special: []
        };
        
        // Events
        this.events = data.events || {
            canGenerate: ['I', 'W', 'A', 'C'],
            autoEvents: []
        };
        
        // State
        this.state = data.state || {
            online: false,
            battery: 100,
            signal: -70,
            lastSeen: new Date().toISOString(),
            location: null,
            customData: {}
        };
        
        this.scenes = data.scenes || [];
        this.isFavorite = data.isFavorite || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    getAvailability() {
        const avail = {};
        this.capabilities.protocols.forEach(protocol => {
            avail[protocol] = this.state.online;
        });
        return avail;
    }

    getBestChannel() {
        const avail = this.getAvailability();
        const priority = ['W', 'I', 'A', 'Z'];
        
        for (let protocol of priority) {
            if (avail[protocol]) return protocol;
        }
        return null;
    }

    addToScene(sceneId, role = 'member') {
        if (!this.scenes.find(s => s.id === sceneId)) {
            this.scenes.push({
                id: sceneId,
                role: role,
                joinedAt: new Date().toISOString()
            });
            this.updatedAt = new Date().toISOString();
        }
    }

    removeFromScene(sceneId) {
        this.scenes = this.scenes.filter(s => s.id !== sceneId);
        this.updatedAt = new Date().toISOString();
    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        this.updatedAt = new Date().toISOString();
        return this.isFavorite;
    }

    getDisplayIcon() {
        const typeIcons = {
            'human': '👤',
            'droid': '🤖',
            'device': '📡',
            'service': '☁️'
        };
        return this.identity.avatar || typeIcons[this.entity.type] || '❓';
    }
}