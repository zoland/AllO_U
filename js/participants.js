const testParticipants = [
    {
        id: 'alpha-001',
        callsign: 'Альфа',
        role: 'Командир группы',
        protocols: ['I', 'W', 'A'],
        status: {
            connection: 'online',
            location: 'Сектор А-1'
        },
        isFavorite: true,
        lastSeen: '2 мин назад'
    },
    {
        id: 'bravo-002', 
        callsign: 'Браво',
        role: 'Снайпер',
        protocols: ['I', 'A'],
        status: {
            connection: 'offline',
            location: 'Сектор Б-3'
        },
        isFavorite: false,
        lastSeen: '15 мин назад'
    },
    {
        id: 'charlie-003',
        callsign: 'Чарли', 
        role: 'Медик',
        protocols: ['I', 'W'],
        status: {
            connection: 'away',
            location: 'База'
        },
        isFavorite: false,
        lastSeen: '5 мин назад'
    },
    {
        id: 'delta-004',
        callsign: 'Дельта',
        role: 'Связист',
        protocols: ['I', 'W', 'A', 'Z'],
        status: {
            connection: 'busy',
            location: 'Мобильная'
        },
        isFavorite: true,
        lastSeen: 'Сейчас'
    }
];
