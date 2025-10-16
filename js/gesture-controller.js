const TAP_THRESHOLD = 200;
const LONG_PRESS_THRESHOLD = 450;
const SWIPE_DIFF = 60;

export function attachGestures(tableBody, callback) {
  Array.from(tableBody.querySelectorAll("tr")).forEach(row => {
    bind(row, callback);
  });
}

function bind(row, callback) {
  let startX = 0;
  let startY = 0;
  let touchStartTime = 0;
  let tapTimer = null;
  let longPressFired = false;
  let doubleTapFlag = false;

  const id = row.dataset.id;

  row.addEventListener("touchstart", e => {
    const touch = e.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    touchStartTime = Date.now();
    longPressFired = false;

    row.classList.remove("swipe-left", "swipe-right", "longpress");

    tapTimer = setTimeout(() => {
      longPressFired = true;
      row.classList.add("longpress");
      callback("open-panel", id);
    }, LONG_PRESS_THRESHOLD);
  }, { passive: true });

  row.addEventListener("touchmove", e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_DIFF) {
      clearTimeout(tapTimer);
      if (dx > 0) {
        row.classList.add("swipe-right");
        callback("call", id);
      } else {
        row.classList.add("swipe-left");
        callback("message", id);
      }
    }
  }, { passive: true });

  row.addEventListener("touchend", e => {
    clearTimeout(tapTimer);
    if (longPressFired) return;

    const elapsed = Date.now() - touchStartTime;
    if (elapsed <= TAP_THRESHOLD) {
      if (doubleTapFlag) {
        callback("toggle-favorite", id);
        doubleTapFlag = false;
      } else {
        callback("open-profile", id);
        doubleTapFlag = true;
        setTimeout(() => (doubleTapFlag = false), 250);
      }
    }
  });
}