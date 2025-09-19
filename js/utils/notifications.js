class NotificationManager {
    static show(message, type = "info") {
        const notification = document.createElement("div");
        notification.textContent = message;
        const colors = {
            info: "#1e3a8a",
            success: "#10dc60",
            warning: "#ffce00",
            error: "#f04141"
        };
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 2000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            font-size: 0.9rem;
            max-width: 90%;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}
