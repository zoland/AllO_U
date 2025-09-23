class LocatorView {
    constructor() {
        this.storage = new StorageService();
        this.isScanning = false;
    }

    render() {
        let html = '<div class="locator-container">';
        
        // Header
        html += `
            <div class="scan-status">
                <h2>📡 Локатор сети</h2>
                <p>Протокол: [W] WiFi Local</p>
                ${this.isScanning ? 
                    '<div class="scan-animation"></div><p>Сканирование...</p>' : 
                    '<button class="btn btn-primary" id="startScanBtn">🔍 Начать сканирование</button>'
                }
            </div>
        `;
        
        if (this.isScanning) {
            // Имитация найденных участников
            html += this.renderFoundParticipants();
        }
        
        html += '</div>';
        return html;
    }

    renderFoundParticipants() {
        // Временные тестовые данные для демонстрации
        const foundParticipants = [
            {
                id: 'temp-1',
                callsign: 'Браво',
                isNew: true,
                signal: -45,
                distance: '120м Ю'
            },
            {
                id: 'temp-2', 
                callsign: 'Чарли',
                isNew: true,
                signal: -60,
                distance: '350м СВ'
            }
        ];

        // Также показываем известных участников если они "в сети"
        const knownParticipants = this.storage.loadParticipants()
            .filter(p => p.state && p.state.online);

        let html = '<div class="found-participants">';
        
        if (foundParticipants.length > 0 || knownParticipants.length > 0) {
            html += '<h3>🟢 В сети сейчас:</h3>';
            
            // Новые участники
            foundParticipants.forEach(p => {
                html += `
                    <div class="network-participant new">
                        <div class="participant-header">
                            <span class="participant-icon">👤</span>
                            <div class="participant-info">
                                <div class="participant-callsign">${p.callsign} (новый)</div>
                                <div class="signal-strength">
                                    📶 Сигнал: ${this.getSignalStrength(p.signal)}
                                </div>
                                ${p.distance ? `<div class="participant-distance">📍 ${p.distance}</div>` : ''}
                            </div>
                        </div>
                        <button class="btn btn-secondary add-btn" data-callsign="${p.callsign}">
                            ➕ Добавить в команду
                        </button>
                    </div>
                `;
            });
            
            // Известные участники
            knownParticipants.forEach(p => {
                html += `
                    <div class="network-participant">
                        <div class="participant-header">
                            <span class="participant-icon">${p.getDisplayIcon()}</span>
                            <div class="participant-info">
                                <div class="participant-callsign">
                                    ${p.identity.callsign} ${p.isFavorite ? '⭐' : ''}
                                </div>
                                <div class="signal-strength">
                                    📶 В сети
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary call-btn" data-id="${p.id}">
                            📡 Вызвать
                        </button>
                    </div>
                `;
            });
        } else {
            html += '<p class="no-results">Участники не найдены</p>';
        }
        
        html += '</div>';
        return html;
    }

    getSignalStrength(signal) {
        if (signal > -50) return 'Отличный';
        if (signal > -70) return 'Хороший';
        if (signal > -85) return 'Средний';
        return 'Слабый';
    }

    attachEventListeners() {
        // Start scan button
        const startBtn = document.getElementById('startScanBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startScanning();
            });
        }

        // Add participant buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const callsign = btn.dataset.callsign;
                this.addParticipant(callsign);
            });
        });

        // Call buttons
        document.querySelectorAll('.call-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const participantId = btn.dataset.id;
                console.log('Calling participant:', participantId);
                alert('Функция вызова будет доступна в версии 1.4');
            });
        });
    }

    startScanning() {
        this.isScanning = true;
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = this.render();
        this.attachEventListeners();

        // Имитация сканирования - остановка через 3 секунды
        setTimeout(() => {
            this.isScanning = false;
            mainContent.innerHTML = this.render();
            this.attachEventListeners();
        }, 3000);
    }

    addParticipant(callsign) {
        // TODO: Открыть форму добавления с предзаполненным позывным
        console.log('Adding participant with callsign:', callsign);
        alert(`Участник ${callsign} будет добавлен в команду`);
    }
}