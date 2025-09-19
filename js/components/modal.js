class ModalComponent {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        const closeBtn = document.getElementById("closeInfoBtn");
        const modal = document.getElementById("infoModal");
        
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.close());
        }
        
        if (modal) {
            modal.addEventListener("click", (e) => {
                if (e.target.id === "infoModal") {
                    this.close();
                }
            });
        }
    }

    close() {
        const modal = document.getElementById("infoModal");
        if (modal) {
            modal.classList.remove("active");
        }
    }

    show() {
        const modal = document.getElementById("infoModal");
        if (modal) {
            modal.classList.add("active");
        }
    }
}
