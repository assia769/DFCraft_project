const browserAPI = (() => {
  if (typeof browser !== "undefined") return browser;
  if (typeof chrome !== "undefined") {
    return {
      runtime: chrome.runtime,
      storage: {
        local: {
          get: (keys) =>
            new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
          set: (items) =>
            new Promise((resolve) => chrome.storage.local.set(items, resolve)),
        },
      },
      action: chrome.action || chrome.browserAction,
    };
  }
})();


browserAPI.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLAY_SOUND') {
    const audio = new Audio(message.soundUrl);
    audio.play();
  }
});

// public/offscreen.js

let notificationAudio = null;
let ambientAudio = null;

try {
  chrome.runtime.sendMessage({ type: "OFFSCREEN_READY" }, (resp) => {
    if (chrome.runtime.lastError) {
      console.warn("[OFFSCREEN] OFFSCREEN_READY sendMessage lastError:", chrome.runtime.lastError.message);
    } else {
      console.log("[OFFSCREEN] OFFSCREEN_READY ack:", resp);
    }
  });
} catch (e) {
  console.error("[OFFSCREEN] sendMessage OFFSCREEN_READY error:", e);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🎧 Offscreen received:", message);

  if (message.type === "PING_OFFSCREEN") {
    sendResponse({ ok: true, ts: Date.now() });
    return true;
  }

  // ✅ Notification sounds (short, one-time)
  if (message.type === "PLAY_SOUND") {
    playNotificationSound(message.soundUrl);
    sendResponse({ success: true });
  }

  // ✅ Ambient sounds (long, looping)
  if (message.type === "PLAY_AMBIENT_SOUND_OFFSCREEN") {
    playAmbientSound(message.soundUrl);
    sendResponse({ success: true });
  }

  if (message.type === "PAUSE_AMBIENT_SOUND_OFFSCREEN") {
    pauseAmbientSound();
    sendResponse({ success: true });
  }

  if (message.type === "STOP_AMBIENT_SOUND_OFFSCREEN") {
    stopAmbientSound();
    sendResponse({ success: true });
  }

  if (message.type === "GET_AMBIENT_STATUS_OFFSCREEN") {
    sendResponse({
      isPlaying: ambientAudio && !ambientAudio.paused,
      currentSound: ambientAudio?.src || null,
    });
  }

  return true;
});

// Notification sound (one-time play)
function playNotificationSound(soundUrl) {
  console.log("🔔 Playing notification:", soundUrl);
  
  try {
    if (notificationAudio) {
      notificationAudio.pause();
      notificationAudio = null;
    }
    notificationAudio = new Audio(soundUrl);
    notificationAudio.play().catch((err) => {
      console.error("[OFFSCREEN] notification play failed:", err);
      broadcastToBackground("error", { error: "Notification play failed" });
    });
  } catch (e) {
    console.error("[OFFSCREEN] playNotificationSound exception:", e);
  }
}

// Ambient sound (looping, with events)
function playAmbientSound(soundUrl) {
  console.log("🎵 Playing ambient sound:", soundUrl);

  // Stop current ambient sound
  if (ambientAudio) {
    ambientAudio.pause();
    removeAmbientListeners();
  }

  // Create new audio
  ambientAudio = new Audio(soundUrl);
  ambientAudio.loop = true;
  ambientAudio.preload = "auto";
  ambientAudio.volume = 0.7;

  // Add event listeners
  setupAmbientListeners();

  // Start playing
  ambientAudio.play().catch((err) => {
    console.error("Ambient play failed:", err);
    broadcastToBackground("error", {
      error: "Playback failed. Click Play to try again.",
    });
  });
}

function setupAmbientListeners() {
  if (!ambientAudio) return;

  ambientAudio.addEventListener("loadstart", handleLoadStart);
  ambientAudio.addEventListener("canplay", handleCanPlay);
  ambientAudio.addEventListener("playing", handlePlaying);
  ambientAudio.addEventListener("pause", handlePause);
  ambientAudio.addEventListener("waiting", handleWaiting);
  ambientAudio.addEventListener("error", handleError);
  ambientAudio.addEventListener("progress", handleProgress);
}

function removeAmbientListeners() {
  if (!ambientAudio) return;

  ambientAudio.removeEventListener("loadstart", handleLoadStart);
  ambientAudio.removeEventListener("canplay", handleCanPlay);
  ambientAudio.removeEventListener("playing", handlePlaying);
  ambientAudio.removeEventListener("pause", handlePause);
  ambientAudio.removeEventListener("waiting", handleWaiting);
  ambientAudio.removeEventListener("error", handleError);
  ambientAudio.removeEventListener("progress", handleProgress);
}

// Event handlers
function handleLoadStart() {
  console.log("⏳ Loading started");
  broadcastToBackground("loading", { progress: 0 });
}

function handleCanPlay() {
  console.log("✅ Ready to play");
  broadcastToBackground("ready", { progress: 100 });
}

function handlePlaying() {
  console.log("▶️ Playing");
  broadcastToBackground("playing");
}

function handlePause() {
  console.log("⏸️ Paused");
  broadcastToBackground("paused");
}

function handleWaiting() {
  console.log("⏸️ Buffering...");
  broadcastToBackground("buffering");
}

function handleError(e) {
  console.error("❌ Audio error:", e);
  broadcastToBackground("error", {
    error: "Failed to load audio. Please check your connection.",
  });
}

function handleProgress() {
  if (ambientAudio && ambientAudio.buffered.length > 0 && ambientAudio.duration) {
    try {
      const bufferedEnd = ambientAudio.buffered.end(ambientAudio.buffered.length - 1);
      const progress = (bufferedEnd / ambientAudio.duration) * 100;
      console.log(`[OFFSCREEN] progress: ${progress.toFixed(1)}%`);
      broadcastToBackground("progress", { progress });
    } catch (e) {
      console.warn("[OFFSCREEN] progress read failed", e);
    }
  }
}

function pauseAmbientSound() {
  if (ambientAudio) {
    console.log("⏸️ Pausing ambient sound");
    ambientAudio.pause();
    broadcastToBackground("paused");
  }
}

function stopAmbientSound() {
  if (ambientAudio) {
    console.log("⏹️ Stopping ambient sound");
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
    removeAmbientListeners();
    ambientAudio.src = "";
    ambientAudio = null;
  }
}

// Send status updates back to background script
function broadcastToBackground(status, data = {}) {
 const message = {
    type: "AUDIO_STATUS_FROM_OFFSCREEN",
    status,
    isPlaying: !!ambientAudio && !ambientAudio.paused,
    currentSound: ambientAudio?.src || null,
    ...data,  
  };
  console.log("[OFFSCREEN] broadcastToBackground:", message);
  try {
    chrome.runtime.sendMessage(message, (resp) => {
      if (chrome.runtime.lastError) {
        console.warn("[OFFSCREEN] sendMessage lastError:", chrome.runtime.lastError.message);
      } else {
        console.log("[OFFSCREEN] sendMessage response:", resp);
      }
    });
  } catch (e) {
    console.error("[OFFSCREEN] broadcast send error:", e);
  }
}

console.log("🎧 Offscreen audio script loaded");