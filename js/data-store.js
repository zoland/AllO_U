const DATA_KEY = "allo_scene_snapshot";
const DATA_VERSION = "2025-09-05";

/** Читаем текущую сцену из localStorage или подтягиваем из JSON */
export async function loadSceneData(forceReset = false) {
  const cacheRaw = localStorage.getItem(DATA_KEY);
  if (!forceReset && cacheRaw) {
    try {
      const parsed = JSON.parse(cacheRaw);
      if (parsed?.__version === DATA_VERSION) {
        return parsed.snapshot;
      }
    } catch (_) {
      console.warn("Очистка локального кеша: повреждены данные");
    }
  }

  const response = await fetch("./data/scene-testdata.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Не удалось загрузить test data");
  const snapshot = await response.json();
  persistSceneData(snapshot);
  return snapshot;
}

export function persistSceneData(snapshot) {
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify({ __version: DATA_VERSION, snapshot })
  );
}