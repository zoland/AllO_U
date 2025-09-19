class NavigationComponent {
    constructor() {
        this.activeBtn = "connectionBtn";
        this.bindEvents();
    }

    bindEvents() {
        const navButtons = ["connectionBtn", "contactsBtn", "settingsNavBtn", "networkBtn", "voiceBtn"];
        
        navButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener("click", () => this.switchNav(id));
            }
        });
    }

    switchNav(btnId) {
        // Убираем активный класс со всех кнопок
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        
        // Добавляем активный класс к выбранной кнопке
        const activeBtn = document.getElementById(btnId);
        if (activeBtn) {
            activeBtn.classList.add("active");
        }
        
        this.activeBtn = btnId;
        this.handleNavAction(btnId);
    }

    handleNavAction(btnId) {
        const actions = {
            connectionBtn: () => NotificationManager.show("📶 Проверка соединения...", "info"),
            contactsBtn: () => NotificationManager.show("👥 Загрузка контактов...", "info"),
            settingsNavBtn: () => NotificationManager.show("⚙️ Открытие настроек...", "info"),
            networkBtn: () => NotificationManager.show("🌐 Сканирование сети...", "info"),
            voiceBtn: () => NotificationManager.show("📝 Голосовые команды готовы", "info")
        };
        
        const action = actions[btnId];
        if (action) {
            action();
        }
    }
}
