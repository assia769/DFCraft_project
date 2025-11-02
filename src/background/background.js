// Use the same wrapper approach
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
      offscreen: chrome.offscreen, // Add this
      notifications: chrome.notifications,
    };
  }
})();

let offscreenReady = false;
let offscreenReadyTs = 0;

let timerData = {
  time: 1500,
  isRunning: false,
  lastUpdate: Date.now(),
  originalTime: 1500,
  workTime: 1500,
  breakTime: 300,
  phaseType: "work",
};

// Load saved state
browserAPI.storage.local.get(["timerData"]).then((result) => {
  if (result.timerData) {
    timerData = result.timerData;
    updateTimerFromLastSave();
  }
});

function updateTimerFromLastSave() {
  if (timerData.isRunning && timerData.time > 0) {
    const now = Date.now();
    const secondsPassed = Math.floor((now - timerData.lastUpdate) / 1000);
    const oldTime = timerData.time;
    timerData.time = Math.max(0, timerData.time - secondsPassed);
    timerData.lastUpdate = now;
    console.log(
      `⏩ Calculated elapsed time: ${secondsPassed}s (${oldTime} → ${timerData.time})`
    );
    saveTimerData();
  }
}

function saveTimerData() {
  browserAPI.storage.local.set({ timerData });
}

let currentAmbientAudio = null;
let isAmbientPlaying = false;
let firefoxAudio = null;

// Message listener
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TIMER") {
    updateTimerFromLastSave();
    sendResponse(timerData);
  } else if (request.type === "UPDATE_TIMER") {
    const oldData = { ...timerData };
    timerData = {
      ...timerData,
      ...request.data,
      lastUpdate: Date.now(),
    };

    console.log("🔄 UPDATE:", {
      before: oldData,
      after: timerData,
      changed: {
        time: oldData.time !== timerData.time,
        isRunning: oldData.isRunning !== timerData.isRunning,
      },
    });

    saveTimerData();
    sendResponse({ success: true });
  }

  if (request.type === "PLAY_AMBIENT_SOUND") {

    broadcastAudioStatus("loading", { progress: 0 });

    playAmbientSound(request.soundUrl)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((e) => {
        console.error("[BG] playAmbientSound failed:", e);
        broadcastAudioStatus("error", { error: String(e) });
        sendResponse({ success: false, error: String(e) });
      });
    return true;
  }

  if (request.type === "PAUSE_AMBIENT_SOUND") {
    pauseAmbientSound();
    isAmbientPlaying = false;
  broadcastAudioStatus("paused");
  sendResponse({ success: true });
  }

  if (request.type === "STOP_AMBIENT_SOUND") {
    stopAmbientSound();
    sendResponse({ success: true });
  }

  if (request.type === "GET_AMBIENT_STATUS") {
    if (browserAPI.offscreen){
      try{

        browserAPI.runtime.sendMessage({type: "GET_AMBIENT_STATUS_OFFSCREEN"}, (response) => {
          if(browserAPI.runtime.lastError){
            sendResponse({
              isPlaying: isAmbientPlaying,
              currentSound: currentAmbientAudio || null,
            }); 
          }else{
            sendResponse(response);
          }
        });
        return true;
      }catch(e){
        console.error("GET_AMBIENT_STATUS error:", e);
      }
    }
    if (!browserAPI.offscreen) {
      sendResponse({
        isPlaying: isAmbientPlaying,
        currentSound: currentAmbientAudio || null,
      });
    }
  }

  if (request.type === "AUDIO_STATUS_FROM_OFFSCREEN") {
    isAmbientPlaying = request.isPlaying;
    currentAmbientAudio = request.currentSound || currentAmbientAudio;

    // Broadcast to popup
    broadcastAudioStatus(request.status, request);
    sendResponse({ success: true });
  }

  if (request.type === "OFFSCREEN_READY") {
    offscreenReady = true;
    offscreenReadyTs = Date.now();
    console.log("[BG] received OFFSCREEN_READY from offscreen");
    sendResponse({ ok: true });
    return true;
  }

  return true; // Keep channel open for async response
});

// Notification sound player for the timer
async function playSound(soundName) {
  try {
    // Check if offscreen API exists (Chrome only)
    if (browserAPI.offscreen) {
      const existingContexts = await browserAPI.runtime.getContexts({});
      const offscreenDocument = existingContexts.find(
        (context) => context.contextType === "OFFSCREEN_DOCUMENT"
      );

      if (!offscreenDocument) {
        await browserAPI.offscreen.createDocument({
          url: "offscreen.html",
          reasons: ["AUDIO_PLAYBACK"],
          justification: "Play timer completion sound",
        });
      }

      browserAPI.runtime.sendMessage({
        type: "PLAY_SOUND",
        soundUrl: browserAPI.runtime.getURL(`sounds/${soundName}.wav`),
      });
    } else {
      // Firefox fallback
      const audio = new Audio(
        browserAPI.runtime.getURL(`sounds/${soundName}.wav`)
      );
      audio.play().catch((err) => {
        console.error("Firefox audio playback failed:", err);
      });
    }
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
}

// Timer loop
// In background.js, inside the timer loop:
setInterval(() => {
  if (timerData.isRunning && timerData.time > 0) {
    timerData.time--;
    timerData.lastUpdate = Date.now();
    saveTimerData();

    // Update badge
    if (browserAPI.action && browserAPI.action.setBadgeText) {
      browserAPI.action.setBadgeText({ text: String(timerData.time) });
    }

    // Notify open pages
    browserAPI.runtime
      .sendMessage({
        type: "TIMER_TICK",
        data: timerData,
      })
      .catch(() => {});
  } else if (timerData.time === 0 && timerData.isRunning) {
    // Timer hit 0, switch phases
    if (timerData.phaseType === "work" && timerData.breakTime > 0) {
      timerData.phaseType = "break";
      timerData.time = timerData.breakTime;
      timerData.originalTime = timerData.breakTime;
      timerData.lastUpdate = Date.now();
      console.log("Switching to break phase:", timerData.breakTime);

      playSound("notification");
    } else if (timerData.phaseType === "break" && timerData.workTime > 0) {
      timerData.phaseType = "work";
      timerData.time = timerData.workTime;
      timerData.originalTime = timerData.workTime;
      timerData.lastUpdate = Date.now();
      console.log("Switching to work phase:", timerData.workTime);

      playSound("notification");
    } else {
      // No break/work time set, just stop
      timerData.isRunning = false;
      console.log("Timer finished, no next phase");
    }

    saveTimerData();

    // Notify popup of phase change
    browserAPI.runtime
      .sendMessage({
        type: "PHASE_CHANGE",
        data: timerData,
      })
      .catch(() => {});
  }
}, 1000);

async function playAmbientSound(soundUrl) {
  console.log("🎵 Requesting ambient sound playback:", soundUrl);

  if (
    browserAPI.offscreen &&
    typeof browserAPI.offscreen.createDocument === "function"
  ) {
    await ensureOffscreenDocument();
    // instruct offscreen to play
    browserAPI.runtime.sendMessage(
      { type: "PLAY_AMBIENT_SOUND_OFFSCREEN", soundUrl },
      (resp) => {
        if (browserAPI.runtime.lastError) {
          console.warn(
            "[BG] sendMessage to offscreen lastError:",
            browserAPI.runtime.lastError.message
          );
        } else {
          console.log("[BG] offscreen play request sent:", resp);
        }
      }
    );
    currentAmbientAudio = soundUrl;
    isAmbientPlaying = true;
    return;
  }

  if (typeof Audio !== "undefined") {
    console.log(
      "[BG] Playing ambient in background (direct Audio) - Firefox fallback"
    );
    // stop existing firefoxAudio
    if (firefoxAudio) {
      try {
        firefoxAudio.pause();
      } catch (e) {
        console.error("[BG] firefoxAudio pause error:", e);
      }
      removeFirefoxListeners();
      firefoxAudio = null;
    }

    firefoxAudio = new Audio(soundUrl);
    firefoxAudio.loop = true;
    firefoxAudio.preload = "auto";
    firefoxAudio.volume = 0.7;

    // add listeners similar to offscreen
    firefoxAudio.addEventListener("loadstart", () =>
      broadcastAudioStatus("loading", { progress: 0 })
    );
    firefoxAudio.addEventListener("canplay", () =>
      broadcastAudioStatus("ready", { progress: 100 })
    );
    firefoxAudio.addEventListener("playing", () => {
      isAmbientPlaying = true;
      broadcastAudioStatus("playing");
    });
    firefoxAudio.addEventListener("pause", () => {
      isAmbientPlaying = false;
      broadcastAudioStatus("paused");
    });
    firefoxAudio.addEventListener("waiting", () =>
      broadcastAudioStatus("buffering")
    );
    firefoxAudio.addEventListener("error", (e) => {
      isAmbientPlaying = false;
      broadcastAudioStatus("error", { error: e?.message });
    });
    firefoxAudio.addEventListener("progress", () => {
      if (firefoxAudio.buffered.length > 0 && firefoxAudio.duration) {
        try {
          const bufferedEnd = firefoxAudio.buffered.end(
            firefoxAudio.buffered.length - 1
          );
          const progress = (bufferedEnd / firefoxAudio.duration) * 100;
          broadcastAudioStatus("progress", { progress });
        } catch (e) {
          console.error("[BG] firefoxAudio progress calculation error:", e);
        }
      }
    });

    firefoxAudio.play().catch((err) => {
      console.error("[BG] firefoxAudio play failed:", err);
      broadcastAudioStatus("error", { error: "Playback failed" });
    });

    currentAmbientAudio = soundUrl;
    isAmbientPlaying = true;
    return;
  }

  // otherwise fail
  throw new Error("No offscreen and no Audio fallback available");
}

function removeFirefoxListeners() {
  if (!firefoxAudio) return;
  firefoxAudio.onloadstart = null;
  firefoxAudio.oncanplay = null;
  firefoxAudio.onplaying = null;
  firefoxAudio.onpause = null;
  firefoxAudio.onwaiting = null;
  firefoxAudio.onerror = null;
  firefoxAudio.onprogress = null;
}

async function pauseAmbientSound() {
  console.log("⏸️ Requesting pause");

  if (browserAPI.offscreen) {
    try {
      await ensureOffscreenDocument();
      browserAPI.runtime.sendMessage(
        { type: "PAUSE_AMBIENT_SOUND_OFFSCREEN" },
        (resp) => {
          if (browserAPI.runtime.lastError) {
            console.warn(
              "[BG] pauseOffscreen lastError:",
              browserAPI.runtime.lastError.message
            );
          } else {
            console.log("[BG] pauseOffscreen resp:", resp);
          }
        }
      );
    } catch (e) {
      console.error(e);
    }
    isAmbientPlaying = false;
  } else if (firefoxAudio) {
    try {
      firefoxAudio.pause();
    } catch (e) {
      console.error("[BG] firefoxAudio pause error:", e);
    }
    isAmbientPlaying = false;
    broadcastAudioStatus("paused");
  }
}

async function stopAmbientSound() {
  console.log("⏹️ Requesting stop");
  if (browserAPI.offscreen) {
    try {
      await ensureOffscreenDocument();
      browserAPI.runtime.sendMessage({ type: "STOP_AMBIENT_SOUND_OFFSCREEN" });
      isAmbientPlaying = false;
      currentAmbientAudio = null;
    } catch (error) {
      console.error("Failed to stop:", error);
    }
  } else if (firefoxAudio) {
    try {
      firefoxAudio.pause();
      firefoxAudio.currentTime = 0;
      removeFirefoxListeners();
      firefoxAudio.src = "";
      firefoxAudio = null;
    } catch (e) {
      console.error("[BG] firefoxAudio stop error:", e);
    }
  }
}

async function ensureOffscreenDocument() {
  if (!browserAPI.offscreen) {
    console.log("⚠️ Offscreen API not available (Firefox)");
    return;
  }

  try {
    const existingContexts = await browserAPI.runtime.getContexts({});
    const offscreenDocument = existingContexts.find(
      (context) => context.contextType === "OFFSCREEN_DOCUMENT"
    );

    if (!offscreenDocument) {
      console.log("📄 Creating offscreen document");
      await browserAPI.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["AUDIO_PLAYBACK"],
        justification: "Play ambient and notification sounds",
      });

      const start = Date.now();
      const timeoutMs = 4000;
      while (!offscreenReady && Date.now() - start < timeoutMs) {
        await new Promise((r) => setTimeout(r, 100)); // poll
      }
      if (!offscreenReady) {
        console.warn(
          "[BG] offscreen created but OFFSCREEN_READY not received within timeout"
        );
      } else {
        console.log(
          "[BG] offscreen reported READY at",
          new Date(offscreenReadyTs).toISOString()
        );
      }
    } else {
      console.log("[BG] offscreen already exists");
      // if it exists but we haven't seen ready, try to ping it once
      if (!offscreenReady) {
        try {
          browserAPI.runtime.sendMessage({ type: "PING_OFFSCREEN" }, (resp) => {
            if (!browserAPI.runtime.lastError && resp && resp.ok) {
              offscreenReady = true;
              offscreenReadyTs = Date.now();
              console.log("[BG] ping to offscreen succeeded");
            } else {
              console.log(
                "[BG] ping_offscreen failed:",
                browserAPI.runtime.lastError?.message
              );
            }
          });
        } catch (e) {
          console.warn("[BG] ping_offscreen exception:", e);
        }
      }
    }
  } catch (e) {
    console.error("[BG] ensureOffscreenDocument error:", e);
  }
}

function broadcastAudioStatus(status, data = {}) {
  const message = {
    type: "AUDIO_STATUS_UPDATE",
    status,
    isPlaying: isAmbientPlaying,
    currentSound: currentAmbientAudio,
    ...data,
  };

  try {
    browserAPI.runtime.sendMessage(message, (resp) => {
      if (browserAPI.runtime.lastError) {
        console.warn(
          "[BG] sendMessage lastError:",
          browserAPI.runtime.lastError?.message
        );
      } else {
        // optional debug
        // console.log("[BG] sendMessage resp:", resp);
      }
    });
  } catch (e) {
    console.error("[BG] broadcast send error:", e);
  }
}
