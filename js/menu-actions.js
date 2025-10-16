import { loadSceneData } from "./data-store.js";

export function initMenu(button, menu, actions) {
  button.addEventListener("click", () => menu.toggleAttribute("hidden"));

  menu.addEventListener("click", async e => {
    if (e.target.tagName !== "BUTTON") return;
    const action = e.target.dataset.action;
    menu.setAttribute("hidden", "");

    if (action === "close") return;
    if (typeof actions[action] === "function") {
      await actions[action]();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !menu.hasAttribute("hidden")) {
      menu.setAttribute("hidden", "");
    }
  });
}