import { loadSceneData, persistSceneData } from "./data-store.js";
import { attachGestures } from "./gesture-controller.js";
import { initMenu } from "./menu-actions.js";

let sceneSnapshot;
let filteredFavorites = false;

const state = {
  mode: "self",      // self / anchor
};

const dom = {
  title: document.getElementById("sceneTitle"),
  anchorLabel: document.getElementById("anchorLabel"),
  toggleAnchor: document.getElementById("toggleAnchor"),
  summaryParticipants: document.getElementById("summaryParticipants"),
  summaryRange: document.getElementById("summaryRange"),
  tableBody: document.getElementById("participantsTable"),
  menuButton: document.getElementById("menuButton"),
  menu: document.getElementById("sceneMenu")
};

async function bootstrap() {
  sceneSnapshot = await loadSceneData();
  renderScene();

  dom.toggleAnchor.addEventListener("click", () => {
    state.mode = state.mode === "self" ? "anchor" : "self";
    dom.anchorLabel.textContent = state.mode === "self"
      ? "Относительно меня"
      : `Относительно точки: ${sceneSnapshot.anchor?.label ?? "—"}`;
  });

  initMenu(dom.menuButton, dom.menu, {
    reset: async () => {
      sceneSnapshot = await loadSceneData(true);
      filteredFavorites = false;
      renderScene();
    },
    "toggle-favs": () => {
      filteredFavorites = !filteredFavorites;
      renderScene();
    }
  });
}

function renderScene() {
  const participants = filteredFavorites
    ? sceneSnapshot.participants.filter(p => p.favorite)
    : sceneSnapshot.participants;

  dom.title.textContent = sceneSnapshot.sceneName ?? "Сцена";
  dom.summaryParticipants.textContent = `Участников: ${participants.length}`;
  const maxDistance = Math.max(...participants.map(p => p.distance));
  dom.summaryRange.textContent = `Max: ${maxDistance} м`;

  dom.tableBody.innerHTML = "";
  participants.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    if (p.favorite) tr.classList.add("favorite");

    tr.innerHTML = `
      <td class="dir">${p.bearingLabel}<br><span>${p.bearing}°</span></td>
      <td>
        <span class="status-dot ${p.status}"></span>
        ${p.callsign} <span>${p.avatar ?? ""}</span><br>
        <small>${p.role ?? ""}</small>
      </td>
      <td>${p.distance} м</td>
      <td>${renderDelta(p.heartbeat)}</td>
    `;

    dom.tableBody.appendChild(tr);
  });

  attachGestures(dom.tableBody, handleAction);
  persistSceneData(sceneSnapshot);
}

function renderDelta(seconds) {
  if (seconds < 60) return `${seconds} с`;
  const m = Math.round(seconds / 60);
  return `${m} мин`;
}

function handleAction(action, participantId) {
  const target = sceneSnapshot.participants.find(p => p.id === participantId);
  if (!target) return;

  switch (action) {
    case "open-profile":
      alert(`Открыть портфолио: ${target.callsign}`);
      break;
    case "call":
      alert(`Голосовой вызов → ${target.callsign}`);
      break;
    case "message":
      alert(`Текстовое сообщение → ${target.callsign}`);
      break;
    case "open-panel":
      alert(`Контекстное меню: ${target.callsign}`);
      break;
    case "toggle-favorite":
      target.favorite = !target.favorite;
      break;
    default:
      console.warn("Неизвестное действие", action);
  }

  renderScene();
}

bootstrap().catch(err => {
  console.error(err);
  alert("Ошибка инициализации сцены");
});