class EventsView {
    constructor() {
        this.storage = new StorageService();
    }

    render() {
        const events = this.storage.loadEvents();
        
        // Sort by timestamp, newest first
        events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        let html = '<div class="events-container">';
        
        if (events.length === 0) {
            html += '<p class="no-events">Нет событий</p>';
        } else {
            events.forEach(event => {
                html += this.renderEventCard(event);
            });
        }
        
        html += '</div>';
        return html;
    }

    renderEventCard(event) {
        const typeClass = this.getEventClassName(event.type);
        const time = event.getFormattedTime();
        const typeLabel = event.getTypeLabel();
        
        return `
            <div class="event-card ${typeClass}" data-event-id="${event.id}">
                <div class="event-header">
                    <span class="event-type">${typeLabel}</span>
                    <span class="event-time">${time}</span>
                </div>
                <div class="event-content">
                    ${event.content.text}
                </div>
                <div class="event-meta">
                    <span class="event-from">От: ${event.from}</span>
                    <span class="event-scene">Сцена: ${event.scene}</span>
                </div>
            </div>
        `;
    }

    getEventClassName(type) {
        const classMap = {
            'I': 'info',
            'W': 'warning',
            'A': 'alert',
            'C': 'command',
            'S': 'system',
            'R': 'request'
        };
        return classMap[type] || 'info';
    }

    attachEventListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const eventId = card.dataset.eventId;
                console.log('Event clicked:', eventId);
                // TODO: Show event details
            });
        });
    }
}
