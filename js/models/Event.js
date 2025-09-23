class Event {
    constructor(data = {}) {
        this.id = data.id || `event-${Date.now()}`;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.scene = data.scene || null;
        this.from = data.from || null;
        this.to = data.to || ['all'];
        this.type = data.type || 'I'; // I|W|A|C|S|R
        this.priority = data.priority || 1;
        this.content = data.content || {
            text: '',
            data: {}
        };
        this.requiresAck = data.requiresAck || false;
        this.ttl = data.ttl || 3600;
        this.acknowledged = data.acknowledged || [];
    }

    getTypeLabel() {
        const labels = {
            'I': 'Информация',
            'W': 'Предупреждение',
            'A': 'Тревога',
            'C': 'Команда',
            'S': 'Системное',
            'R': 'Запрос'
        };
        return labels[this.type] || this.type;
    }

    getTypeColor() {
        const colors = {
            'I': '#4CAF50',
            'W': '#FFC107',
            'A': '#F44336',
            'C': '#2196F3',
            'S': '#9E9E9E',
            'R': '#9C27B0'
        };
        return colors[this.type] || '#9E9E9E';
    }

    isExpired() {
        const created = new Date(this.timestamp).getTime();
        const now = Date.now();
        return (now - created) > (this.ttl * 1000);
    }

    acknowledge(participantId) {
        if (!this.acknowledged.includes(participantId)) {
            this.acknowledged.push(participantId);
        }
    }

    getFormattedTime() {
        const date = new Date(this.timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) {
            return 'Только что';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}м назад`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}ч назад`;
        } else {
            return date.toLocaleDateString('ru-RU');
        }
    }
}