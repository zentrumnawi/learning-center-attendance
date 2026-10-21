import { ref, onMounted, onUnmounted } from "vue";

const DEBOUNCE_MS = 2000;
const MIN_UID_LENGTH = 4;

/*
 * We expect the USB reader to send data like keyboard input and finish trnasmission of card ID with Enter.
 * Listens while page is mounted; cleans up on unmount.
 */
export function useRfidKeyboard({ onScan, minLength = MIN_UID_LENGTH } = {}) {
  const listening = ref(false);
  const lastCardId = ref(null);

  let buffer = "";
  let lastUid = null;
  let lastScanAt = 0;

  function emitScan(uid) {
    const now = Date.now();
    if (uid === lastUid && now - lastScanAt < DEBOUNCE_MS) return;
    lastUid = uid;
    lastScanAt = now;
    lastCardId.value = uid;
    if (onScan) {
      onScan(uid);
    }
  }

  function flushBuffer() {
    const uid = buffer.trim();
    buffer = "";
    if (uid.length >= minLength) emitScan(uid);
  }

  function onKeydown(event) {
    if (!listening.value) return;

    // Assume the reader finishes with Enter
    if (event.key === "Enter") {
      console.log("Enter");
      event.preventDefault();
      flushBuffer();
      return;
    }

    // Compose single key strokes into a single card ID
    if (event.key.length === 1) {
      console.log("key", event.key);
      event.preventDefault();
      buffer += event.key;
    }
  }

  function start() {
    if (listening.value) return;
    listening.value = true;
    window.addEventListener("keydown", onKeydown, true);
  }

  function stop() {
    if (!listening.value) return;
    listening.value = false;
    window.removeEventListener("keydown", onKeydown, true);
    buffer = "";
  }

  onMounted(start);
  onUnmounted(stop);

  return {
    listening,
    lastCardId,
    start,
    stop,
  };
}
