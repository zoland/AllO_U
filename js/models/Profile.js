class Profile {
    constructor(data = {}) {
        this.callsign = data.callsign || '';
        this.name = data.name || '';
        this.phone = data.phone || '';
        this.avatar = data.avatar || null;
        this.visibility = data.visibility || {
            inNetwork: true,
            location: true,
            acceptCalls: true
        };
        this.location = data.location || null;
        this.lastUpdated = data.lastUpdated || Date.now();
    }

    validate() {
        const errors = [];
        
        if (!this.callsign || this.callsign.length < 2) {
            errors.push('Позывной должен содержать минимум 2 символа');
        }
        
        if (this.callsign && this.callsign.length > 20) {
            errors.push('Позывной не должен превышать 20 символов');
        }
        
        if (this.phone && !this.isValidPhone(this.phone)) {
            errors.push('Неверный формат телефона');
        }
        
        return errors;
    }

    isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'));
    }

    toJSON() {
        return {
            callsign: this.callsign,
            name: this.name,
            phone: this.phone,
            avatar: this.avatar,
            visibility: this.visibility,
            location: this.location,
            lastUpdated: this.lastUpdated
        };
    }
}
