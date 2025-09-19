class StorageManager {
    static FOLDERS_KEY = "allo_folders";
    static CONTACTS_KEY = "allo_contacts";
    static CONNECTIONS_KEY = "allo_connections";

    static getFolders() {
        const folders = localStorage.getItem(this.FOLDERS_KEY);
        if (folders) {
            return JSON.parse(folders);
        }
        
        // Если нет данных и включен тестовый режим - инициализируем
        if (TestDataManager.TEST_MODE) {
            TestDataManager.initTestData();
            return JSON.parse(localStorage.getItem(this.FOLDERS_KEY)) || [];
        }
        
        return [];
    }

    static saveFolders(folders) {
        localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    }

    static getContacts() {
        const contacts = localStorage.getItem(this.CONTACTS_KEY);
        if (contacts) {
            return JSON.parse(contacts);
        }
        
        // Если нет данных и включен тестовый режим - инициализируем
        if (TestDataManager.TEST_MODE) {
            TestDataManager.initTestData();
            return JSON.parse(localStorage.getItem(this.CONTACTS_KEY)) || [];
        }
        
        return [];
    }

    static saveContacts(contacts) {
        localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
    }

    static getConnections() {
        const connections = localStorage.getItem(this.CONNECTIONS_KEY);
        if (connections) {
            return JSON.parse(connections);
        }
        
        if (TestDataManager.TEST_MODE) {
            return TestDataManager.getTestConnections();
        }
        
        return [];
    }

    static createFolder(name, icon = "📁") {
        const folders = this.getFolders();
        const newFolder = {
            id: Date.now().toString(),
            name: name,
            icon: icon,
            deviceCount: 0,
            statusOk: 0,
            statusWarning: 0,
            statusError: 0,
            details: [],
            created: new Date().toISOString()
        };
        folders.push(newFolder);
        this.saveFolders(folders);
        return newFolder;
    }

    static deleteFolder(folderId) {
        const folders = this.getFolders().filter(f => f.id !== folderId);
        this.saveFolders(folders);
        this.cleanupContactsFromFolder(folderId);
    }

    static renameFolder(folderId, newName) {
        const folders = this.getFolders();
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            folder.name = newName;
            this.saveFolders(folders);
        }
    }

    static cleanupContactsFromFolder(folderId) {
        const contacts = this.getContacts();
        const updatedContacts = contacts.map(contact => {
            if (contact.folders && contact.folders.includes(folderId)) {
                contact.folders = contact.folders.filter(id => id !== folderId);
            }
            return contact;
        });
        this.saveContacts(updatedContacts);
    }

    // Метод для сброса данных (только в тестовом режиме)
    static resetData() {
        return TestDataManager.resetToTestData();
    }
}
