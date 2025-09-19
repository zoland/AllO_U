class FoldersComponent {
    constructor() {
        console.log("🔧 FoldersComponent: Инициализация с portal меню");
        
        if (typeof StorageManager === 'undefined') {
            console.error("❌ StorageManager не найден!");
            return;
        }
        
        try {
            this.folders = StorageManager.getFolders();
            this.contacts = StorageManager.getContacts();
            console.log("✅ Данные загружены:", this.folders.length, "папок");
        } catch (error) {
            console.error("❌ Ошибка загрузки данных:", error);
            this.folders = [];
            this.contacts = [];
        }
        
        this.activeDropdown = null;
        this.createMenuPortal();
        this.bindGlobalEvents();
        
        setTimeout(() => {
            this.render();
        }, 100);
    }

    createMenuPortal() {
        // Создаем контейнер для всех выпадающих меню в body
        let portal = document.getElementById('dropdown-portal');
        if (!portal) {
            portal = document.createElement('div');
            portal.id = 'dropdown-portal';
            portal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 99999;
            `;
            document.body.appendChild(portal);
            console.log("✅ Portal для меню создан");
        }
    }

    bindGlobalEvents() {
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("folder-menu-btn")) {
                e.stopPropagation();
                const folderId = e.target.dataset.folder;
                console.log("📂 Клик по меню папки:", folderId);
                this.toggleDropdown(folderId, e.target);
            } else if (!e.target.closest(".folder-dropdown")) {
                this.closeDropdowns();
            }
        });
        
        document.addEventListener("scroll", () => this.closeDropdowns());
        window.addEventListener("resize", () => this.closeDropdowns());
    }

    render() {
        console.log("🎨 Рендеринг папок с portal меню...");
        const mainContent = document.querySelector(".main-content");
        
        if (!mainContent) {
            console.error("❌ .main-content не найден!");
            return;
        }

        // Очищаем portal от старых меню
        const portal = document.getElementById('dropdown-portal');
        if (portal) {
            portal.innerHTML = '';
        }

        let foldersHTML = this.folders.map((folder, index) => {
            const statusBadges = this.createStatusBadges(folder);
            const hasActions = !folder.system;
            const details = folder.details && folder.details.length > 0 ? 
                `<div class="folder-details">${folder.details.map(d => `<span class="detail-item">${d}</span>`).join("")}</div>` : "";
            
            // Создаем меню в portal
            if (hasActions && portal) {
                const menuHTML = `
                    <div class="folder-dropdown" id="dropdown-${folder.id}" style="display: none; pointer-events: auto;">
                        <button class="folder-dropdown-item" onclick="window.foldersComponent.renameFolder('${folder.id}')">
                            <span>✏️</span> Переименовать
                        </button>
                        <button class="folder-dropdown-item danger" onclick="window.foldersComponent.deleteFolder('${folder.id}')">
                            <span>🗑️</span> Удалить
                        </button>
                    </div>
                `;
                portal.innerHTML += menuHTML;
            }
            
            return `
                <div class="folder-card" data-folder="${folder.id}">
                    <div class="folder-header">
                        <div class="folder-info">
                            <span class="folder-icon">${folder.icon}</span>
                            <span class="folder-name">${folder.name} (${folder.deviceCount})</span>
                        </div>
                        <div class="status-badges">${statusBadges}</div>
                        ${hasActions ? `
                            <div class="folder-actions">
                                <button class="folder-menu-btn" data-folder="${folder.id}" id="btn-${folder.id}">⋮</button>
                            </div>
                        ` : ""}
                    </div>
                    ${details}
                </div>
            `;
        }).join("");

        mainContent.innerHTML = `
            <div class="folders-list">
                ${foldersHTML}
                <div class="folder-card add-folder" onclick="window.foldersComponent.showCreateDialog()">
                    <div class="add-folder-content">
                        <span class="folder-icon">📁</span>
                        <span class="add-text">+ Создать папку</span>
                    </div>
                </div>
            </div>
            <div class="search-section">
                <div class="search-bar">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="�� Поиск в папках..." oninput="window.foldersComponent.searchFolders(this.value)">
                </div>
            </div>
        `;

        console.log("✅ HTML обновлен с portal меню");
        this.bindFolderClicks();
    }

    bindFolderClicks() {
        document.querySelectorAll(".folder-card[data-folder]").forEach(card => {
            card.addEventListener("click", (e) => {
                if (!e.target.closest(".folder-actions")) {
                    this.openFolder(card.dataset.folder);
                }
            });
        });
    }

    createStatusBadges(folder) {
        let badges = "";
        if (folder.statusOk > 0) badges += `<span class="status-badge status-ok">${folder.statusOk}</span>`;
        if (folder.statusWarning > 0) badges += `<span class="status-badge status-warning">${folder.statusWarning}</span>`;
        if (folder.statusError > 0) badges += `<span class="status-badge status-error">${folder.statusError}</span>`;
        return badges;
    }

    showCreateDialog() {
        console.log("➕ Создание новой папки");
        const name = prompt("Введите название папки:");
        if (name && name.trim()) {
            try {
                StorageManager.createFolder(name.trim());
                this.folders = StorageManager.getFolders();
                this.render();
                NotificationManager.show(`📁 Папка "${name}" создана`, "success");
            } catch (error) {
                console.error("Ошибка создания папки:", error);
                NotificationManager.show("❌ Ошибка создания папки", "error");
            }
        }
    }

    renameFolder(folderId) {
        console.log("✏️ Переименование папки:", folderId);
        const folder = this.folders.find(f => f.id === folderId);
        if (folder) {
            const newName = prompt("Новое название папки:", folder.name);
            if (newName && newName.trim() && newName !== folder.name) {
                try {
                    StorageManager.renameFolder(folderId, newName.trim());
                    this.folders = StorageManager.getFolders();
                    this.render();
                    NotificationManager.show(`✏️ Папка переименована в "${newName}"`, "success");
                } catch (error) {
                    console.error("Ошибка переименования:", error);
                    NotificationManager.show("❌ Ошибка переименования", "error");
                }
            }
        }
        this.closeDropdowns();
    }

    deleteFolder(folderId) {
        console.log("🗑️ Удаление папки:", folderId);
        const folder = this.folders.find(f => f.id === folderId);
        if (folder) {
            const hasContacts = this.contacts.some(contact => 
                contact.folders && contact.folders.includes(folderId)
            );
            
            let confirmMessage = `Удалить папку "${folder.name}"?`;
            if (hasContacts) {
                confirmMessage += `\n\n⚠️ ВНИМАНИЕ: В этой папке есть контакты!\nВсе связи контактов с папкой будут удалены.`;
            }
            
            if (confirm(confirmMessage)) {
                try {
                    StorageManager.deleteFolder(folderId);
                    this.folders = StorageManager.getFolders();
                    this.contacts = StorageManager.getContacts();
                    this.render();
                    NotificationManager.show(`🗑️ Папка "${folder.name}" удалена${hasContacts ? ' (контакты обновлены)' : ''}`, "success");
                } catch (error) {
                    console.error("Ошибка удаления:", error);
                    NotificationManager.show("❌ Ошибка удаления", "error");
                }
            }
        }
        this.closeDropdowns();
    }

    openFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (folder) {
            NotificationManager.show(`📁 Открытие: ${folder.name}`, "info");
        }
    }

    searchFolders(query) {
        if (query.length > 2) {
            NotificationManager.show(`🔍 Поиск: ${query}`, "info");
        }
    }

    toggleDropdown(folderId, buttonElement) {
        console.log(`🎯 Переключение меню для папки: ${folderId}`);
        
        // Закрываем все меню
        this.closeDropdowns();
        
        const dropdown = document.getElementById(`dropdown-${folderId}`);
        
        if (buttonElement && dropdown) {
            // Получаем точную позицию кнопки
            const rect = buttonElement.getBoundingClientRect();
            
            console.log("📍 Позиция кнопки:", {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
            
            // Позиционируем меню ТОЧНО под кнопкой, справа
            const menuTop = rect.bottom + 5;
            const menuLeft = rect.right - 160; // 160px - ширина меню
            
            dropdown.style.position = 'fixed';
            dropdown.style.top = menuTop + 'px';
            dropdown.style.left = Math.max(10, menuLeft) + 'px'; // Не меньше 10px от края
            dropdown.style.display = 'block';
            dropdown.style.zIndex = '99999';
            
            this.activeDropdown = folderId;
            
            console.log(`✅ Меню показано для папки ${folderId}:`, {
                top: menuTop,
                left: Math.max(10, menuLeft),
                zIndex: 99999
            });
        } else {
            console.error(`❌ Не найдены элементы для папки ${folderId}:`, {
                button: !!buttonElement,
                dropdown: !!dropdown
            });
        }
    }

    closeDropdowns() {
        const portal = document.getElementById('dropdown-portal');
        if (portal) {
            portal.querySelectorAll('.folder-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
        this.activeDropdown = null;
    }
}
