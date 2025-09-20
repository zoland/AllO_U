// Главный класс приложения AllO_G
class AllO_App {
    constructor() {
        this.version = '1.1.5';
        this.participants = [];
        this.currentPage = 'contacts';
        this.protocols = {
            'I': { name: 'Internet', active: true, signal: '4G' },
            'W': { name: 'WiFi Direct', active: false },
            'A': { name: 'Amateur Radio', active: false },
            'Z': { name: 'ZigBee Mesh', active: false }
        };
        
        this.init();
    }
    
    // Инициализация приложения
    init() {
        console.log(`🚀 AllO_G v${this.version} Starting...`);
        this.loadParticipants();
        this.renderParticipants();
        this.setupEventListeners();
        this.setupTouchHandlers();
        this.registerServiceWorker();
    }
    
    // Загрузка участников
    loadParticipants() {
        // Тестовые данные с новой структурой
        const defaultParticipants = [
            {
                id: 'user-001',
                callsign: 'Альфа',
                name: 'Анна Сидорова',
                role: 'Оператор',
                protocols: ['I', 'W'],
                status: {
                    connection: 'online',
                    location: 'База-1'
                },
                isFavorite: true,
                battery: 67,
                lastActivity: '2м назад'
            },
            {
                id: 'droid-001',
                callsign: 'Бета',
                name: 'Дроид R2',
                role: 'Разведчик',
                protocols: ['W', 'Z'],
                status: {
                    connection: 'online',
                    location: 'Сектор-7'
                },
                isFavorite: false,
                battery: 89,
                lastActivity: 'Сейчас'
            },
            {
                id: 'device-001',
                callsign: 'Гамма',
                name: 'Метеостанция',
                role: 'Монитор',
                protocols: ['Z'],
                status: {
                    connection: 'away',
                    location: 'Вышка-3'
                },
                isFavorite: false,
                battery: 100,
                lastActivity: '5м назад'
            }
        ];
        
        // Загрузка из localStorage или использование тестовых
        const saved = localStorage.getItem('allo_participants');
        if (saved) {
            try {
                this.participants = JSON.parse(saved);
            } catch (e) {
                this.participants = defaultParticipants;
            }
        } else {
            this.participants = defaultParticipants;
        }
    }
    
    // Сортировка участников
    sortParticipants() {
        return [...this.participants].sort((a, b) => {
            // Сначала избранные
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            // Затем по позывному
            return a.callsign.localeCompare(b.callsign);
        });
    }
    
    // Отрисовка участников
    renderParticipants() {
        const container = document.getElementById('participants-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Сортированные участники
        const sorted = this.sortParticipants();
        
        // Создание карточек
        sorted.forEach(participant => {
            const card = this.createParticipantCard(participant);
            container.appendChild(card);
        });
        
        // Карточка добавления
        const addCard = this.createAddCard();
        container.appendChild(addCard);
    }
    
    // Создание карточки участника
    createParticipantCard(participant) {
        const card = document.createElement('div');
        card.className = `participant-card ${participant.isFavorite ? 'favorite' : ''}`;
        card.dataset.id = participant.id;
        
        const statusClass = participant.status.connection;
        
        card.innerHTML = `
            <button class="favorite-button" onclick="app.toggleFavorite('${participant.id}')">
                ${participant.isFavorite ? '⭐' : '☆'}
            </button>
            
            <div class="participant-header">
                <div>
                    <div class="participant-name">
                        ${participant.name}
                    </div>
                    <div class="participant-callsign">
                        📢 "${participant.callsign}"
                    </div>
                </div>
                <div class="participant-status">
                    <span class="status-indicator ${statusClass}"></span>
                    <span>${participant.battery}%🔋</span>
                </div>
            </div>
            
            <div class="participant-info">
                <div>🎭 ${participant.role}</div>
                <div>📡 ${participant.protocols.join(' • ')}</div>
                <div>📍 ${participant.status.location}</div>
                <div>⏱️ ${participant.lastActivity}</div>
            </div>
        `;
        
        // Обработчик клика на карточку
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-button')) {
                this.onParticipantClick(participant);
            }
        });
        
        return card;
    }
    
    // Создание карточки добавления
    createAddCard() {
        const card = document.createElement('div');
        card.className = 'participant-card add-card';
        
        card.innerHTML = `
            <div class="add-icon" style="font-size: 48px;">➕</div>
            <div style="margin-top: 10px;">Добавить участника</div>
        `;
        
        card.addEventListener('click', () => this.addNewParticipant());
        
        return card;
    }
    
    // Переключение избранного
    toggleFavorite(participantId) {
        const participant = this.participants.find(p => p.id === participantId);
        if (participant) {
            participant.isFavorite = !participant.isFavorite;
            this.saveParticipants();
            this.renderParticipants();
        }
    }
    
    // Показать информацию о программе
    showInfo() {
        const info = `🔥 AllO_G v${this.version} - Гибридный коммуникатор

📡 ПРОТОКОЛЫ СВЯЗИ:
• I - Интернет (4G/5G/WiFi)
• W - WiFi Direct (прямое соединение)
• A - Amateur Radio (радиосвязь)
• Z - ZigBee Mesh (ячеистая сеть)

⚡ ВОЗМОЖНОСТИ:
• Мультипротокольная связь
• Избранные контакты
• Офлайн режим
• Шифрование данных

👥 Участников: ${this.participants.length}
⭐ Избранных: ${this.participants.filter(p => p.isFavorite).length}`;
        
        alert(info);
    }
    
    // Показать меню
    showMenu() {
        alert('⚙️ Меню в разработке');
    }
    
    // Клик на участника
    onParticipantClick(participant) {
        console.log('Connecting to:', participant.callsign);
        alert(`📞 Вызов: ${participant.callsign}\n📍 ${participant.status.location}`);
    }
    
    // Добавление нового участника
    addNewParticipant() {
        const callsign = prompt('Позывной участника:');
        if (!callsign) return;
        
        const name = prompt('Имя участника:');
        if (!name) return;
        
        const role = prompt('Роль (например: Оператор, Разведчик):') || 'Участник';
        
        const newParticipant = {
            id: `user-${Date.now()}`,
            callsign: callsign,
            name: name,
            role: role,
            protocols: ['I'],
            status: {
                connection: 'offline',
                location: 'Неизвестно'
            },
            isFavorite: false,
            battery: 100,
            lastActivity: 'Новый'
        };
        
        this.participants.push(newParticipant);
        this.saveParticipants();
        this.renderParticipants();
    }
    
    // Сохранение в localStorage
    saveParticipants() {
        localStorage.setItem('allo_participants', JSON.stringify(this.participants));
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateTo(page);
            });
        });
    }
    
    // Touch обработчики для мобильных
    setupTouchHandlers() {
        // Предотвращение случайного масштабирования
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        
        // Улучшение отзывчивости
        document.addEventListener('touchstart', () => {}, {passive: true});
    }
    
    // Навигация
    navigateTo(page) {
        console.log('Navigate to:', page);
        this.currentPage = page;
        
        // Обновление активной кнопки
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        // Страницы-заглушки
        const pages = {
            'groups': '👥 Группы в разработке',
            'map': '📍 Карта в разработке',
            'voice': '🎤 Голосовая связь в разработке',
            'help': '❓ Справка в разработке',
            'settings': '⚙️ Настройки в разработке'
        };
        
        if (pages[page]) {
            alert(pages[page]);
        }
    }
    
    // Service Worker
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('✅ Service Worker registered'))
                .catch(err => console.log('❌ SW registration failed:', err));
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AllO_App();
});