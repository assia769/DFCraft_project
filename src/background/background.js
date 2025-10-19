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

  if (request.type === "PLAY_AMBIENT_SOUND"){
    playAmbientSound(request.soundUrl);
    sendResponse({success: true});
  }

  if (request.type === "PAUSE_AMBIENT_SOUND"){
    pauseAmbientSound();
    sendResponse({success: true});
  }

  if (request.type === "STOP_AMBIENT_SOUND"){
    stopAmbientSound();
    sendResponse({success: true});
  }

  if (request.type === "GET_AMBIENT_STATUS"){
    sendResponse(({isPlaying: isAmbientPlaying, currentSound: currentAmbientAudio || null}))
  }

  if (request.type === "AUDIO_STATUS_FROM_OFFSCREEN") {
    isAmbientPlaying = request.isPlaying;
    currentAmbientAudio = request.currentSound;
    
    // Broadcast to popup
    broadcastAudioStatus(request.status, request);
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

  try {
    // Ensure offscreen document exists
    await ensureOffscreenDocument();

    // Send play command to offscreen
    browserAPI.runtime.sendMessage({
      type: "PLAY_AMBIENT_SOUND_OFFSCREEN",
      soundUrl: soundUrl,
    });

    currentAmbientAudio = soundUrl;
    isAmbientPlaying = true;

  } catch (error) {
    console.error("Failed to play ambient sound:", error);
    broadcastAudioStatus("error", {
      error: "Failed to start playback",
    });
  }
}

async function pauseAmbientSound() {
  console.log("⏸️ Requesting pause");
  
  try {
    await ensureOffscreenDocument();
    browserAPI.runtime.sendMessage({ type: "PAUSE_AMBIENT_SOUND_OFFSCREEN" });
    isAmbientPlaying = false;
  } catch (error) {
    console.error("Failed to pause:", error);
  }
}

async function stopAmbientSound() {
  console.log("⏹️ Requesting stop");
  
  try {
    await ensureOffscreenDocument();
    browserAPI.runtime.sendMessage({ type: "STOP_AMBIENT_SOUND_OFFSCREEN" });
    isAmbientPlaying = false;
    currentAmbientAudio = null;
  } catch (error) {
    console.error("Failed to stop:", error);
  }
}

async function ensureOffscreenDocument() {
  if (!browserAPI.offscreen) {
    console.log("⚠️ Offscreen API not available (Firefox)");
    return;
  }

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
  }
}

function broadcastAudioStatus(status, data = {}) {
  const message = {
    type: "AUDIO_STATUS_UPDATE",
    status: status,
    isPlaying: isAmbientPlaying,
    currentSound: currentAmbientAudio, 
    ...data,
  }

  browserAPI.runtime.sendMessage(message).catch(() => {
    // Ignore error if popup is closed
  });
}

