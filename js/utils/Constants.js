// Application constants
const APP_CONSTANTS = {
    VERSION: '1.1.0',
    APP_NAME: 'AllO_U',
    APP_DESCRIPTION: 'Театральный коммуникатор',
    
    // Event types
    EVENT_TYPES: {
        INFO: 'I',
        WARNING: 'W',
        ALERT: 'A',
        COMMAND: 'C',
        SYSTEM: 'S',
        REQUEST: 'R'
    },
    
    // Entity types
    ENTITY_TYPES: {
        HUMAN: 'human',
        DROID: 'droid',
        DEVICE: 'device',
        SERVICE: 'service'
    },
    
    // Scene types
    SCENE_TYPES: {
        COMMUNICATION: 'communication',
        CONTROL: 'control',
        MONITORING: 'monitoring',
        HYBRID: 'hybrid'
    },
    
    // Protocols
    PROTOCOLS: {
        INTERNET: 'I',
        WIFI: 'W',
        ACCESS_POINT: 'A',
        ZIGBEE: 'Z'
    },
    
    // Storage keys
    STORAGE_KEYS: {
        SCENES: 'scenes',
        PARTICIPANTS: 'participants',
        EVENTS: 'events',
        SETTINGS: 'settings',
        APP_STATE: 'app_state'
    },
    
    // UI Settings
    UI: {
        MAX_EVENTS_DISPLAY: 100,
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP_CONSTANTS;
}
