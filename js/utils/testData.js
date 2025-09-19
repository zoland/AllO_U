class TestDataManager {
    static TEST_MODE = true; // Включить/выключить тестовый режим
    
    static getTestFolders() {
        return [
            {
                id: "all",
                name: "ВСЕ",
                icon: "📁",
                deviceCount: 12,
                statusOk: 8,
                statusWarning: 3,
                statusError: 1,
                details: [],
                system: true,
                created: "2024-01-01T00:00:00.000Z"
            },
            {
                id: "home",
                name: "Дом",
                icon: "🏠",
                deviceCount: 5,
                statusOk: 4,
                statusWarning: 1,
                statusError: 0,
                details: ["🌡️23°C", "��68%", "⚡3 устр."],
                created: "2024-01-01T01:00:00.000Z"
            },
            {
                id: "work",
                name: "Офис",
                icon: "🏢",
                deviceCount: 3,
                statusOk: 2,
                statusWarning: 0,
                statusError: 1,
                details: ["🔴 Принтер офлайн"],
                created: "2024-01-01T02:00:00.000Z"
            },
            {
                id: "kitchen",
                name: "Кухня",
                icon: "🍳",
                deviceCount: 4,
                statusOk: 2,
                statusWarning: 2,
                statusError: 0,
                details: ["🌡️25°C", "💨 Вытяжка вкл"],
                created: "2024-01-01T03:00:00.000Z"
            }
        ];
    }
    
    static getTestContacts() {
        return [
            {
                id: "contact1",
                name: "Алиса",
                avatar: "🤖",
                online: true,
                status: "Готова помочь",
                skills: ["💬 Общение", "📅 Планирование", "🎵 Музыка", "🌤️ Погода"],
                folders: ["home", "kitchen"],
                role: "Голосовой помощник",
                capabilities: ["voice", "text", "smart_home"],
                lastSeen: new Date().toISOString(),
                created: "2024-01-01T00:00:00.000Z"
            },
            {
                id: "contact2",
                name: "Умный дом",
                avatar: "🏠",
                online: true,
                status: "Все системы в норме",
                skills: ["💡 Освещение", "🌡️ Климат", "🔒 Безопасность", "📺 Медиа"],
                folders: ["home"],
                role: "Система управления домом",
                capabilities: ["automation", "sensors", "control"],
                lastSeen: new Date().toISOString(),
                created: "2024-01-01T01:00:00.000Z"
            },
            {
                id: "contact3",
                name: "Рабочий сервер",
                avatar: "💻",
                online: false,
                status: "Техническое обслуживание",
                skills: ["📊 Аналитика", "💾 Хранение", "🔄 Синхронизация", "📈 Отчеты"],
                folders: ["work"],
                role: "Сервер данных",
                capabilities: ["data_processing", "storage", "backup"],
                lastSeen: "2024-01-15T10:30:00.000Z",
                created: "2024-01-01T02:00:00.000Z"
            },
            {
                id: "contact4",
                name: "Кухонный помощник",
                avatar: "👨‍🍳",
                online: true,
                status: "Готовлю рецепты",
                skills: ["🍳 Рецепты", "⏰ Таймеры", "🛒 Покупки", "🥗 Диета"],
                folders: ["kitchen"],
                role: "Кулинарный ассистент",
                capabilities: ["recipes", "timers", "shopping_lists"],
                lastSeen: new Date().toISOString(),
                created: "2024-01-01T03:00:00.000Z"
            },
            {
                id: "contact5",
                name: "Охранная система",
                avatar: "🛡️",
                online: true,
                status: "Дом под защитой",
                skills: ["📹 Видеонаблюдение", "🚨 Сигнализация", "🚪 Контроль доступа"],
                folders: ["home"],
                role: "Система безопасности",
                capabilities: ["security", "monitoring", "alerts"],
                lastSeen: new Date().toISOString(),
                created: "2024-01-01T04:00:00.000Z"
            }
        ];
    }
    
    static getTestConnections() {
        return [
            {
                id: "conn1",
                name: "Wi-Fi Дом",
                type: "wifi",
                status: "connected",
                signal: 85,
                speed: "100 Мбит/с",
                icon: "📶",
                created: "2024-01-01T00:00:00.000Z"
            },
            {
                id: "conn2", 
                name: "Bluetooth",
                type: "bluetooth",
                status: "connected",
                devices: 3,
                icon: "🔵",
                created: "2024-01-01T01:00:00.000Z"
            },
            {
                id: "conn3",
                name: "Zigbee сеть",
                type: "zigbee", 
                status: "connected",
                devices: 12,
                icon: "🔗",
                created: "2024-01-01T02:00:00.000Z"
            }
        ];
    }
    
    static resetToTestData() {
        if (!this.TEST_MODE) {
            console.log("🚫 Тестовый режим отключен");
            return false;
        }
        
        console.log("🔄 Сброс к тестовым данным...");
        
        // Очищаем localStorage
        localStorage.removeItem(StorageManager.FOLDERS_KEY);
        localStorage.removeItem(StorageManager.CONTACTS_KEY);
        localStorage.removeItem("allo_connections");
        
        // Устанавливаем тестовые данные
        localStorage.setItem(StorageManager.FOLDERS_KEY, JSON.stringify(this.getTestFolders()));
        localStorage.setItem(StorageManager.CONTACTS_KEY, JSON.stringify(this.getTestContacts()));
        localStorage.setItem("allo_connections", JSON.stringify(this.getTestConnections()));
        
        console.log("✅ Тестовые данные восстановлены");
        return true;
    }
    
    static initTestData() {
        if (!this.TEST_MODE) {
            return;
        }
        
        // Проверяем есть ли данные
        const folders = localStorage.getItem(StorageManager.FOLDERS_KEY);
        const contacts = localStorage.getItem(StorageManager.CONTACTS_KEY);
        
        if (!folders || !contacts) {
            console.log("📊 Инициализация тестовых данных...");
            this.resetToTestData();
        }
    }
    
    static toggleTestMode() {
        this.TEST_MODE = !this.TEST_MODE;
        console.log(`🔧 Тестовый режим: ${this.TEST_MODE ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}`);
        return this.TEST_MODE;
    }
}
