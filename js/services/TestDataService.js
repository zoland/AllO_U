class TestDataService {
    static generateTestData() {
        const scenes = this.generateScenes();
        const participants = this.generateParticipants();
        const events = this.generateEvents(scenes, participants);
        
        return {
            scenes,
            participants,
            events
        };
    }

    static generateScenes() {
        const scenes = [
            // Foyer - special scene
            new Scene({
                id: 'foyer',
                name: 'Фойе',
                type: 'communication',
                appearance: {
                    color: '#4A90E2',
                    icon: '🏛️',
                    decoration: 'list',
                    layout: 'list'
                },
                participants: [],
                isFavorite: false,
                rules: {
                    maxParticipants: 100,
                    maxEventsPerMinute: 50,
                    recordEvents: ['A'],
                    priority: 10
                }
            }),
            
            // Family scene
            new Scene({
                id: 'scene-family',
                name: 'Семья',
                type: 'communication',
                appearance: {
                    color: '#E91E63',
                    icon: '👨‍👩‍👧‍👦',
                    decoration: 'list',
                    layout: 'list'
                },
                participants: [],
                isFavorite: true
            }),
            
            // Smart home scene
            new Scene({
                id: 'scene-home',
                name: 'Гостиная',
                type: 'control',
                appearance: {
                    color: '#4CAF50',
                    icon: '🏠',
                    decoration: 'panel_climate',
                    layout: 'grid'
                },
                participants: [],
                isFavorite: true
            }),
            
            // Security scene
            new Scene({
                id: 'scene-security',
                name: 'Безопасность',
                type: 'monitoring',
                appearance: {
                    color: '#F44336',
                    icon: '🔒',
                    decoration: 'grid',
                    layout: 'grid'
                },
                participants: [],
                isFavorite: false
            }),
            
            // Work scene
            new Scene({
                id: 'scene-work',
                name: 'Офис',
                type: 'hybrid',
                appearance: {
                    color: '#FF9800',
                    icon: '💼',
                    decoration: 'list',
                    layout: 'list'
                },
                participants: [],
                isFavorite: false
            })
        ];
        
        return scenes;
    }

    static generateParticipants() {
        const participants = [
            // Humans
            new Participant({
                id: 'human-1',
                identity: {
                    callsign: 'Альфа',
                    name: 'Иван Петров',
                    phone: '+79001234567',
                    avatar: '👨',
                    color: '#2196F3'
                },
                entity: {
                    type: 'human',
                    subtype: 'operator',
                    model: 'iPhone 12'
                },
                capabilities: {
                    communication: ['voice', 'video', 'text'],
                    sensors: ['gps', 'accelerometer'],
                    actuators: [],
                    protocols: ['I', 'W', 'A'],
                    special: ['recording']
                },
                state: {
                    online: true,
                    battery: 67,
                    signal: -65,
                    lastSeen: new Date().toISOString()
                },
                isFavorite: true
            }),
            
            new Participant({
                id: 'human-2',
                identity: {
                    callsign: 'Бета',
                    name: 'Мария Иванова',
                    phone: '+79001234568',
                    avatar: '👩',
                    color: '#E91E63'
                },
                entity: {
                    type: 'human',
                    subtype: 'operator',
                    model: 'Samsung S21'
                },
                capabilities: {
                    communication: ['voice', 'video', 'text'],
                    sensors: ['gps'],
                    actuators: [],
                    protocols: ['I', 'W'],
                    special: []
                },
                state: {
                    online: true,
                    battery: 89,
                    signal: -70,
                    lastSeen: new Date().toISOString()
                },
                isFavorite: true
            }),
            
            // Droid
            new Participant({
                id: 'droid-1',
                identity: {
                    callsign: 'R2-D2',
                    name: 'Робот-пылесос',
                    avatar: '🤖',
                    color: '#9C27B0'
                },
                entity: {
                    type: 'droid',
                    subtype: 'cleaner',
                    model: 'Xiaomi Mi Robot',
                    firmware: 'v3.5.8'
                },
                capabilities: {
                    communication: ['data'],
                    sensors: ['lidar', 'bumper', 'cliff'],
                    actuators: ['motor', 'vacuum', 'brush'],
                    protocols: ['W'],
                    special: ['mapping', 'scheduling']
                },
                state: {
                    online: true,
                    battery: 45,
                    signal: -75,
                    lastSeen: new Date().toISOString(),
                    customData: {
                        cleaningArea: 45,
                        status: 'docked'
                    }
                },
                isFavorite: false
            }),
            
            // Devices
            new Participant({
                id: 'device-1',
                identity: {
                    callsign: 'Климат-1',
                    name: 'Кондиционер',
                    avatar: '❄️',
                    color: '#00BCD4'
                },
                entity: {
                    type: 'device',
                    subtype: 'climate',
                    model: 'LG Dual Inverter',
                    firmware: 'v2.1'
                },
                capabilities: {
                    communication: ['data'],
                    sensors: ['temperature', 'humidity'],
                    actuators: ['compressor', 'fan', 'louver'],
                    protocols: ['W', 'I'],
                    special: ['scheduling']
                },
                state: {
                    online: true,
                    battery: null,
                    signal: -60,
                    lastSeen: new Date().toISOString(),
                    customData: {
                        temperature: 22,
                        targetTemp: 23,
                        mode: 'cool',
                        fanSpeed: 2
                    }
                },
                isFavorite: false
            }),
            
            new Participant({
                id: 'device-2',
                identity: {
                    callsign: 'Камера-1',
                    name: 'Камера входная',
                    avatar: '📹',
                    color: '#795548'
                },
                entity: {
                    type: 'device',
                    subtype: 'camera',
                    model: 'Hikvision DS-2CD2',
                    firmware: 'v5.5.0'
                },
                capabilities: {
                    communication: ['video', 'data'],
                    sensors: ['motion', 'ir'],
                    actuators: ['ptz'],
                    protocols: ['I', 'W'],
                    special: ['recording', 'streaming', 'detection']
                },
                state: {
                    online: true,
                    battery: null,
                    signal: -55,
                    lastSeen: new Date().toISOString(),
                    customData: {
                        recording: true,
                        motionDetection: true
                    }
                },
                isFavorite: false
            }),
            
            new Participant({
                id: 'device-3',
                identity: {
                    callsign: 'Метео-1',
                    name: 'Метеостанция',
                    avatar: '🌡️',
                    color: '#FFC107'
                },
                entity: {
                    type: 'device',
                    subtype: 'sensor',
                    model: 'Netatmo Weather',
                    firmware: 'v1.2.3'
                },
                capabilities: {
                    communication: ['data'],
                    sensors: ['temperature', 'humidity', 'pressure', 'co2'],
                    actuators: [],
                    protocols: ['W', 'I'],
                    special: ['forecast']
                },
                state: {
                    online: false,
                    battery: 20,
                    signal: -80,
                    lastSeen: new Date(Date.now() - 3600000).toISOString(),
                    customData: {
                        temperature: 18,
                        humidity: 65,
                        pressure: 1013,
                        co2: 450
                    }
                },
                isFavorite: false
            })
        ];
        
        // Assign participants to scenes
        participants[0].scenes = [
            {id: 'foyer', role: 'member'},
            {id: 'scene-family', role: 'admin'},
            {id: 'scene-home', role: 'admin'},
            {id: 'scene-security', role: 'admin'}
        ];
        
        participants[1].scenes = [
            {id: 'foyer', role: 'member'},
            {id: 'scene-family', role: 'member'},
            {id: 'scene-work', role: 'member'}
        ];
        
        participants[2].scenes = [
            {id: 'scene-home', role: 'device'}
        ];
        
        participants[3].scenes = [
            {id: 'scene-home', role: 'device'}
        ];
        
        participants[4].scenes = [
            {id: 'scene-security', role: 'device'}
        ];
        
        participants[5].scenes = [
            {id: 'scene-home', role: 'device'}
        ];
        
        return participants;
    }

    static generateEvents(scenes, participants) {
        const events = [];
        const now = Date.now();
        
        // Generate various events
        events.push(
            new Event({
                id: 'event-1',
                timestamp: new Date(now - 120000).toISOString(),
                scene: 'scene-family',
                from: 'human-1',
                to: ['human-2'],
                type: 'I',
                priority: 1,
                content: {
                    text: 'Буду через 20 минут',
                    data: {}
                }
            }),
            
            new Event({
                id: 'event-2',
                timestamp: new Date(now - 300000).toISOString(),
                scene: 'scene-home',
                from: 'device-1',
                to: ['all'],
                type: 'I',
                priority: 1,
                content: {
                    text: 'Температура достигла целевого значения: 23°C',
                    data: {temperature: 23}
                }
            }),
            
            new Event({
                id: 'event-3',
                timestamp: new Date(now - 600000).toISOString(),
                scene: 'scene-security',
                from: 'device-2',
                to: ['all'],
                type: 'W',
                priority: 3,
                content: {
                    text: 'Обнаружено движение у входной двери',
                    data: {snapshot: 'base64...'}
                }
            }),
            
            new Event({
                id: 'event-4',
                timestamp: new Date(now - 900000).toISOString(),
                scene: 'scene-home',
                from: 'device-3',
                to: ['all'],
                type: 'W',
                priority: 2,
                content: {
                    text: 'Низкий заряд батареи: 20%',
                    data: {battery: 20}
                }
            }),
            
            new Event({
                id: 'event-5',
                timestamp: new Date(now - 60000).toISOString(),
                scene: 'foyer',
                from: 'human-1',
                to: ['all'],
                type: 'C',
                priority: 4,
                content: {
                    text: 'Включить режим охраны',
                    data: {command: 'arm_security'}
                }
            }),
            
            new Event({
                id: 'event-6',
                timestamp: new Date(now - 30000).toISOString(),
                scene: 'scene-security',
                from: 'device-2',
                to: ['all'],
                type: 'A',
                priority: 5,
                content: {
                    text: 'ТРЕВОГА! Несанкционированное проникновение!',
                    data: {
                        snapshot: 'base64...',
                        location: 'entrance'
                    }
                },
                requiresAck: true
            })
        );
        
        // Add events to scenes
        scenes.forEach(scene => {
            const sceneEvents = events.filter(e => e.scene === scene.id);
            scene.events = sceneEvents;
        });
        
        return events;
    }

    static resetToTestData() {
        const storage = new StorageService();
        
        // Clear existing data
        storage.clear();
        
        // Generate test data
        const testData = this.generateTestData();
        
        // Save test data
        storage.saveScenes(testData.scenes);
        storage.saveParticipants(testData.participants);
        storage.saveEvents(testData.events);
        
        // Set initialized flag
        storage.setInitialized();
        
        // Save app state
        storage.saveAppState({
            currentView: 'scenes',
            currentScene: null,
            version: '1.1.0'
        });
        
        console.log('Test data loaded successfully');
        return testData;
    }
}
