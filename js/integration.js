// js/integration.js
import { ParticipantsManager } from './participants.js';
import { HeaderComponent } from './components/header.js';
import { NavigationComponent } from './components/navigation.js';

// Инициализация
const app = {
    participants: new ParticipantsManager(),
    header: new HeaderComponent(),
    navigation: new NavigationComponent()
};

window.app = app;