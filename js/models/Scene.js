class Scene {
    constructor(data = {}) {
        this.id = data.id || `scene-${Date.now()}`;
        this.name = data.name || 'Новая сцена';
        this.type = data.type || 'communication';
        this.appearance = data.appearance || {
            color: '#4A90E2',
            icon: '🎬',
            decoration: 'list',
            layout: 'list'
        };
        this.participants = data.participants || [];
        this.events = data.events || [];
        this.rules = data.rules || {
            maxParticipants: 20,
            maxEventsPerMinute: 10,
            recordEvents: ['A', 'C'],
            priority: 5
        };
        this.scenario = data.scenario || null;
        this.isFavorite = data.isFavorite || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    addParticipant(participantId, role = 'member') {
        if (!this.participants.find(p => p.id === participantId)) {
            this.participants.push({
                id: participantId,
                role: role,
                joinedAt: new Date().toISOString()
            });
            this.updatedAt = new Date().toISOString();
        }
    }

    removeParticipant(participantId) {
        this.participants = this.participants.filter(p => p.id !== participantId);
        this.updatedAt = new Date().toISOString();
    }

    addEvent(event) {
        this.events.push(event);
        // Keep only last 100 events
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
        this.updatedAt = new Date().toISOString();
    }

    getEventCounts() {
        const counts = {
            I: 0, W: 0, A: 0, C: 0, S: 0, R: 0
        };
        
        this.events.forEach(event => {
            if (counts.hasOwnProperty(event.type)) {
                counts[event.type]++;
            }
        });
        
        return counts;
    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        this.updatedAt = new Date().toISOString();
        return this.isFavorite;
    }
}