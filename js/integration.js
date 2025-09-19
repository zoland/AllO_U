// Интеграция всех модулей
import { ParticipantsManager } from './participants.js';
import { FoldersComponent } from './components/folders.js';
import { SwipeManager } from './utils/swipe-manager.js';
import { Storage } from './utils/storage.js';

class AllO_Unified {
    constructor() {
        // Инициализация всех подсистем
        this.participants = new ParticipantsManager();
        this.folders = new FoldersComponent();
        this.swipe = new SwipeManager();
        this.storage = new Storage();
        
        this.init();
    }
    
    async init() {
        // Загрузка сохраненных данных
        await this.storage.init();
        
        // Восстановление участников
        const savedParticipants = await this.storage.get('participants');
        if (savedParticipants) {
            this.participants.restore(savedParticipants);
        }
        
        // Инициализация UI
        this.initializeUI();
        
        // Регистрация Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }
    
    initializeUI() {
        // Объединенная логика UI из всех версий
        this.folders.render();
        this.swipe.init();
        this.participants.renderCards();
    }
}