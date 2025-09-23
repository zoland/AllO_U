class TestDataService {
    static createTestData() {
        const storage = new StorageService();
        
        // Clear existing data
        storage.clear();
        
        // Create test scenes
        const scenes = [
            new Scene({
                id: 'scene-test-1',
                name: 'Семья',
                type: 'personal',
                description: 'Семейные дела и события',
                participants: ['part-1'],
                isActive: false,
                createdAt: Date.now()
            }),
            new Scene({
                id: 'scene-test-2',
                name: 'Работа',
                type: 'work',
                description: 'Рабочие вопросы',
                participants: ['part-2'],
                isActive: true,
                createdAt: Date.now()
            }),
            new Scene({
                id: 'scene-test-3',
                name: 'Экстрим',
                type: 'extreme',
                description: 'Походы и приключения',
                participants: [],
                isActive: false,
                createdAt: Date.now()
            })
        ];
        
        // Create test participants
        const participants = [
            new Participant({
                id: 'part-1',
                identity: {
                    callsign: 'Альфа',
                    name: 'Иван Петров',
                    phone: '+79001234567'
                },
                type: 'human',
                isFavorite: true,
                capabilities: {
                    protocols: ['I', 'W'],
                    devices: ['phone', 'radio']
                }
            }),
            new Participant({
                id: 'part-2',
                identity: {
                    callsign: 'Браво',
                    name: 'Мария Иванова',
                    phone: '+79007654321'
                },
                type: 'human',
                isFavorite: false,
                capabilities: {
                    protocols: ['I'],
                    devices: ['phone']
                }
            }),
            new Participant({
                id: 'part-3',
                identity: {
                    callsign: 'R2D2',
                    name: 'Робот-помощник'
                },
                type: 'droid',
                isFavorite: false,
                capabilities: {
                    protocols: ['W', 'A'],
                    devices: ['wifi', 'bluetooth']
                }
            })
        ];
        
        // Create test events
        const events = [
            new Event({
                id: 'event-1',
                type: 'call',
                timestamp: Date.now() - 3600000,
                participants: ['part-1'],
                scene: 'scene-test-1',
                data: {
                    duration: 180,
                    status: 'completed'
                }
            }),
            new Event({
                id: 'event-2',
                type: 'message',
                timestamp: Date.now() - 7200000,
                participants: ['part-2'],
                scene: 'scene-test-2',
                data: {
                    text: 'Встреча перенесена на 15:00'
                }
            })
        ];
        
        // Save all test data
        storage.saveScenes(scenes);
        storage.saveParticipants(participants);
        storage.saveEvents(events);
        storage.setInitialized();
        
        console.log('Test data created successfully');
        return true;
    }
    
    static resetToTestData() {
        return this.createTestData();
    }
}