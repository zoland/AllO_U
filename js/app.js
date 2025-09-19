// Главный класс приложения
class AllO_App {
    constructor() {
        this.participants = [];
        this.currentPage = 'contacts';
        this.protocols = {
            'I': { name: 'Internet', active: true, signal: '4G' },
            'W': { name: 'WiFi', active: false },
            'A': { name: 'Access Point', active: false },
            'Z': { name: 'ZigBee', active: false }
        };
        
        this.init();
    }
    
    init() {
        console.log('AllO_G Initializing...');
        this.loadParticipants();
        this.renderParticipants();
        this.setupEventListeners();
        this.registerServiceWorker();
    }
    
    loadParticipants() {
        // Загрузка тестовых данных
        this.participants = [
            {
                id: 1,
                name: 'Анна Сидорова',
                callsign: 'Браво',
                type: 'human',
                role: 'Оператор',
                status: 'online',
                battery: 67,
                lastActivity: '5м назад',
                protocols: ['I', 'W'],
                favorite: true
            },
            {
                id: 2,
                name: 'Робот-помощник',
                callsign: 'Альфа',
                type: 'droid',
                role: 'Помощник',
                status: 'online',
                battery: 89,
                lastActivity: 'Сейчас',
                protocols: ['W', 'Z']
            },
            {
                id: 3,
                name: 'Метеостанция',
                callsign: 'База',
                type: 'device',
                role: 'Монитор',
                status: 'online',
                battery: 100,
                lastActivity: '1м назад',
                protocols: ['Z']
            }
        ];
        
        // Попытка загрузить из localStorage
        const saved = localStorage.getItem('participants');
        if (saved) {
            try {
                this.participants = JSON.parse(saved);
            } catch (e) {
                console.log('Using default participants');
            }
        }
    }
    
    renderParticipants() {
        const container = document.getElementById('participants-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Сортировка: избранные первыми
        const sorted = [...this.participants].sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0;
        });
        
        // Отрисовка карточек участников
        sorted.forEach(participant => {
            const card = this.createParticipantCard(participant);
            container.appendChild(card);
        });
        
        // Добавление карточки "Новый"
        const addCard = this.createAddCard();
        container.appendChild(addCard);
    }
    
    createParticipantCard(participant) {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.dataset.id = participant.id;
        
        const typeIcon = {
            'human': '👤',
            'droid': '🤖',
            'device': '📱'
        }[participant.type] || '❓';
        
        const statusClass = participant.status === 'online' ? '' : participant.status;
        
        card.innerHTML = `
            <div class="participant-header">
                <div>
                    <div class="participant-name">
                        ${typeIcon} ${participant.name}
                        ${participant.favorite ? '⭐' : ''}
                    </div>
                    <div class="participant-callsign">📢 "${participant.callsign}"</div>
                </div>
                <div class="participant-status">
                    <span class="status-indicator ${statusClass}"></span>
                    <span>${participant.battery}%</span>
                </div>
            </div>
            <div class="participant-info">
                <div>🎭 ${participant.role}</div>
                <div>📡 ${participant.protocols.join(' ')}</div>
                <div>⏱️ ${participant.lastActivity}</div>
            </div>
        `;
        
        card.addEventListener('click', () => this.onParticipantClick(participant));
        
        return card;
    }
    
    createAddCard() {
        const card = document.createElement('div');
        card.className = 'participant-card add-card';
        
        card.innerHTML = `
            <div class="add-icon">➕</div>
            <div>Добавить участника</div>
        `;
        
        card.addEventListener('click', () => this.addNewParticipant());
        
        return card;
    }
    
    onParticipantClick(participant) {
        console.log('Clicked on:', participant.name);
        // Здесь будет логика вызова или отправки сообщения
        alert(`Связь с ${participant.callsign}`);
    }
    
    addNewParticipant() {
        const name = prompt('Имя участника:');
        if (!name) return;
        
        const callsign = prompt('Позывной:');
        if (!callsign) return;
        
        const newParticipant = {
            id: Date.now(),
            name: name,
            callsign: callsign,
            type: 'human',
            role: 'Участник',
            status: 'offline',
            battery: 100,
            lastActivity: 'Новый',
            protocols: ['I'],
            favorite: false
        };
        
        this.participants.push(newParticipant);
        this.saveParticipants();
        this.renderParticipants();
    }
    
    saveParticipants() {
        localStorage.setItem('participants', JSON.stringify(this.participants));
    }
    
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.dataset.page;
                this.navigateTo(page);
            });
        });
    }
    
    navigateTo(page) {
        console.log('Navigate to:', page);
        this.currentPage = page;
        
        // Обновление активной кнопки
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        // Здесь будет логика переключения страниц
        if (page === 'settings') {
            alert('Настройки в разработке');
        }
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed'));
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AllO_App();
    console.log('AllO_G Started');
});