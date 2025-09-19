class HeaderComponent {
    constructor() {
        this.dropdownOpen = false;
        this.bindEvents();
    }

    bindEvents() {
        const logoBtn = document.getElementById("logoBtn");
        const menuBtn = document.getElementById("menuBtn");
        
        if (logoBtn) {
            logoBtn.addEventListener("click", () => this.showInfo());
        }
        
        if (menuBtn) {
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleMenu(e);
            });
        }
        
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
    }

    showInfo() {
        if (window.modalComponent) {
            window.modalComponent.show();
        }
    }

    toggleMenu(e) {
        const dropdown = document.getElementById("headerDropdown");
        const button = e.target;
        
        if (dropdown) {
            this.closeMenu();
            
            if (!this.dropdownOpen) {
                const rect = button.getBoundingClientRect();
                
                dropdown.style.position = 'fixed';
                dropdown.style.top = (rect.bottom + 5) + 'px';
                dropdown.style.right = (window.innerWidth - rect.right) + 'px';
                dropdown.style.zIndex = '9999';
                
                dropdown.classList.add("active");
                this.dropdownOpen = true;
                
                console.log(`✅ Header меню открыто`);
            }
        }
    }

    closeMenu() {
        const dropdown = document.getElementById("headerDropdown");
        if (dropdown) {
            dropdown.classList.remove("active");
            this.dropdownOpen = false;
        }
    }

    handleOutsideClick(e) {
        if (this.dropdownOpen && !e.target.closest(".menu-btn") && !e.target.closest(".dropdown-menu")) {
            this.closeMenu();
        }
    }

    openSettings() {
        NotificationManager.show("⚙️ Настройки системы", "info");
        this.closeMenu();
    }

    resetTestData() {
        if (TestDataManager.TEST_MODE) {
            if (confirm("🔄 Сбросить все данные к тестовому состоянию?\n\nВсе изменения будут потеряны!")) {
                const success = StorageManager.resetData();
                if (success) {
                    // Перезагружаем компоненты
                    if (window.foldersComponent) {
                        window.foldersComponent.folders = StorageManager.getFolders();
                        window.foldersComponent.contacts = StorageManager.getContacts();
                        window.foldersComponent.render();
                    }
                    NotificationManager.show("🔄 Данные сброшены к тестовому состоянию", "success");
                } else {
                    NotificationManager.show("❌ Тестовый режим отключен", "error");
                }
            }
        } else {
            NotificationManager.show("❌ Тестовый режим отключен", "error");
        }
        this.closeMenu();
    }

    exportData() {
        const data = {
            folders: StorageManager.getFolders(),
            contacts: StorageManager.getContacts(),
            connections: StorageManager.getConnections(),
            exported: new Date().toISOString(),
            testMode: TestDataManager.TEST_MODE
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `allo-backup-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        NotificationManager.show("💾 Данные экспортированы", "success");
        this.closeMenu();
    }
}
