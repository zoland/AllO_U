class AllO_G_Communicator {
    constructor() {
        this.participants = new Map();
        this.selectedParticipant = null;
        this.init();
    }

    init() {
        this.loadTestData();
        this.renderParticipants();
        this.setupEventListeners();
        this.updateProtocolStatuses();
        console.log('AllO_G v1.1.5 инициализирован');
    }

    loadTestData() {
        if (typeof testParticipants !== 'undefined') {
            testParticipants.forEach(participant => {
                this.participants.set(participant.id, participant);
            });
        }
    }

renderParticipants() {
const container = document.getElementById("participantsList");
if (!container) return;

const participantsArray = Array.from(this.participants.values())
.sort((a, b) => {
if (a.isFavorite && !b.isFavorite) return -1;
if (!a.isFavorite && b.isFavorite) return 1;
return a.callsign.localeCompare(b.callsign);
});

const newCard = `
<div class="participant-card new-participant" onclick="app.addNewParticipant()">
<div class="new-participant-content">
<div class="new-participant-icon">➕</div>
<div class="new-participant-text">Добавить участника</div>
<div class="swipe-hint">← Свайп для быстрого добавления</div>
</div>
</div>
`;

const participantCards = participantsArray.map(participant => {
const protocols = Array.isArray(participant.protocols) ? 
participant.protocols.join(" ") : 
(participant.protocols || "");

return `
<div class="participant-card ${participant.status?.connection || "offline"}" 
data-participant-id="${participant.id}"
onclick="app.selectParticipant('${participant.id}')">
<div class="participant-header">
<span class="participant-callsign">${participant.callsign}</span>
<span class="participant-status ${participant.status?.connection || "offline"}">
${this.getStatusIcon(participant.status?.connection || "offline")}
</span>
</div>
<div class="participant-role">${participant.role}</div>
<div class="participant-protocols">${protocols}</div>
<div class="participant-location">${participant.status?.location || "Неизвестно"}</div>
</div>
`;
});

container.innerHTML = newCard + participantCards.join("");
}
    selectParticipant(participantId) {
        this.selectedParticipant = participantId;
        const participant = this.participants.get(participantId);
        
        if (participant) {
            this.showNotification(`Выбран: ${participant.callsign}`);
        }
    }

    showNotification(message) {
        console.log('Уведомление:', message);
    }

    updateProtocolStatuses() {
        const statusI = document.getElementById('status-I');
        const statusW = document.getElementById('status-W');
        const statusA = document.getElementById('status-A');
        const statusZ = document.getElementById('status-Z');
        
        if (statusI) statusI.textContent = '🟢4G';
        if (statusW) statusW.textContent = '⚫';
        if (statusA) statusA.textContent = '⚫';
        if (statusZ) statusZ.textContent = '⚫';
    }

addNewParticipant() {
const callsign = prompt("Введите позывной:");
if (callsign) {
const newId = "new-" + Date.now();
const newParticipant = {
id: newId,
callsign: callsign,
role: "Участник",
protocols: ["I"],
status: {
connection: "offline",
location: "Неизвестно"
},
isFavorite: false,
lastSeen: "Только добавлен"
};

this.participants.set(newId, newParticipant);
this.renderParticipants();
this.showNotification(`✅ Добавлен: ${callsign}`);
}
}

toggleFavorite(participantId) {
const participant = this.participants.get(participantId);
if (participant) {
participant.isFavorite = !participant.isFavorite;
this.renderParticipants();
this.showNotification(`⭐ ${participant.callsign} ${participant.isFavorite ? "добавлен в избранное" : "удален из избранного"}`);
}
}

    setupEventListeners() {
        console.log('Event listeners установлены');
    }
}

function showInfo() {
alert(`🔥 AllO_G v1.1.5 - Гибридный коммуникатор

📡 ПРОТОКОЛЫ СВЯЗИ:
• I - Интернет (4G/5G/WiFi)
• W - WiFi Direct (прямое соединение)
• A - Amateur Radio (радиосвязь)
• Z - ZigBee Mesh (ячеистая сеть)

⚡ ВОЗМОЖНОСТИ:
• Мультипротокольная связь
• Автопереключение каналов
• Групповые операции
• Голосовые команды
• Геолокация участников
• Избранные контакты

🎯 ПРИМЕНЕНИЕ:
• Тактические операции
• Аварийно-спасательные работы
• Координация групп
• Резервная связь`);
}
function showProtocolInfo(protocol) {
    const protocols = {
        'I': 'Интернет протокол',
        'W': 'WiFi Direct',
        'A': 'Amateur Radio',
        'Z': 'ZigBee Mesh'
    };
    alert(`${protocol}: ${protocols[protocol] || 'Неизвестный протокол'}`);
}

function openDialer() {
    alert('📞 Диалер');
}

function openGroupActions() {
    alert('👥 Групповые действия');
}

function openMap() {
    alert('📍 Карта');
}

function openVoiceCommands() {
    alert('🎤 Голосовые команды');
}

function openHelp() {
    alert('❓ Справка');
}

function openSettings() {
    alert('⚙️ Настройки');
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AllO_G_Communicator();
});
