class ScenesView {
    constructor() {
        this.storage = new StorageService();
    }

    render() {
        const scenes = this.storage.loadScenes();
        
        // Sort scenes: Foyer first, then favorites, then others
        scenes.sort((a, b) => {
            if (a.id === 'foyer') return -1;
            if (b.id === 'foyer') return 1;
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return b.rules.priority - a.rules.priority;
        });

        let html = '<div class="scenes-container">';
        
        scenes.forEach(scene => {
            const eventCounts = scene.getEventCounts();
            const participantCount = scene.participants.length;
            
            html += `
                <div class="scene-card ${scene.id === 'foyer' ? 'foyer' : ''}" 
                     data-scene-id="${scene.id}"
                     style="border-color: ${scene.appearance.color}20;">
                    <div class="scene-header">
                        <div class="scene-name">
                            <span>${scene.appearance.icon}</span>
                            <span>${scene.name}</span>
                            ${scene.isFavorite ? '<span>⭐</span>' : ''}
                        </div>
                        <div class="scene-participants">
                            <span>👥</span>
                            <span>${participantCount}</span>
                        </div>
                    </div>
                    <div class="event-indicators">
                        ${this.renderEventIndicators(eventCounts)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderEventIndicators(counts) {
        const types = ['I', 'W', 'A', 'C'];
        let html = '';
        
        types.forEach(type => {
            const count = counts[type] || 0;
            const className = this.getEventClassName(type);
            const isEmpty = count === 0;
            
            html += `
                <div class="event-indicator ${className} ${isEmpty ? 'empty' : ''}">
                    ${count}
                </div>
            `;
        });
        
        return html;
    }

    getEventClassName(type) {
        const classMap = {
            'I': 'info',
            'W': 'warning',
            'A': 'alert',
            'C': 'command'
        };
        return classMap[type] || 'info';
    }

    attachEventListeners() {
        // Scene card clicks
        document.querySelectorAll('.scene-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const sceneId = card.dataset.sceneId;
                console.log('Scene clicked:', sceneId);
                // TODO: Navigate to scene details
            });
        });
    }
}
