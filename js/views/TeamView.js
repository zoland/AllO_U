class TeamView {
    constructor() {
        this.storage = new StorageService();
    }

    render() {
        const participants = this.storage.loadParticipants();
        
        // Sort: favorites first, then online, then offline
        participants.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            if (a.state.online && !b.state.online) return -1;
            if (!a.state.online && b.state.online) return 1;
            return 0;
        });

        let html = '<div class="team-container">';
        
        // Favorites section
        const favorites = participants.filter(p => p.isFavorite);
        if (favorites.length > 0) {
            html += '<h3>⭐ Избранные</h3>';
            favorites.forEach(p => {
                html += this.renderParticipantCard(p);
            });
        }
        
        // Others section
        const others = participants.filter(p => !p.isFavorite);
        if (others.length > 0) {
            html += '<h3>Команда</h3>';
            others.forEach(p => {
                html += this.renderParticipantCard(p);
            });
        }
        
        html += '</div>';
        return html;
    }

    renderParticipantCard(participant) {
        const icon = participant.getDisplayIcon();
        const availability = participant.getAvailability();
        
        return `
            <div class="participant-card" data-participant-id="${participant.id}">
                <div class="participant-avatar" style="background: ${participant.identity.color}">
                    ${icon}
                </div>
                <div class="participant-info">
                    <div class="participant-callsign">
                        ${participant.identity.callsign}
                        ${participant.isFavorite ? '⭐' : ''}
                    </div>
                    <div class="participant-name">
                        ${participant.identity.name}
                    </div>
                    <div class="participant-protocols">
                        ${this.renderProtocols(availability)}
                    </div>
                </div>
                <div class="participant-status">
                    ${participant.state.online ? '🟢' : '⚫'}
                </div>
            </div>
        `;
    }

    renderProtocols(availability) {
        let html = '';
        Object.keys(availability).forEach(protocol => {
            const isAvailable = availability[protocol];
            html += `
                <span class="protocol-badge ${isAvailable ? 'available' : ''}">
                    [${protocol}]
                </span>
            `;
        });
        return html;
    }

    attachEventListeners() {
        document.querySelectorAll('.participant-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const participantId = card.dataset.participantId;
                console.log('Participant clicked:', participantId);
                // TODO: Show participant portfolio
            });
        });
    }
}
