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
      offscreen: chrome.offscreen,           // Add this
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
  return true; // Keep channel open for async response
});

async function playSound(soundName) {
  try {
    // Check if offscreen API exists (Chrome only)
    if (browserAPI.offscreen) {
      const existingContexts = await browserAPI.runtime.getContexts({});
      const offscreenDocument = existingContexts.find(
        context => context.contextType === 'OFFSCREEN_DOCUMENT'
      );

      if (!offscreenDocument) {
        await browserAPI.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: ['AUDIO_PLAYBACK'],
          justification: 'Play timer completion sound'
        });
      }

      browserAPI.runtime.sendMessage({
        type: 'PLAY_SOUND',
        soundUrl: browserAPI.runtime.getURL(`sounds/${soundName}.wav`)
      });
    } else {
      // Firefox fallback
      browserAPI.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-128.png',
        title: 'Timer Phase Complete',
        message: 'Phase switched',
        silent: false
      });
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
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

      playSound('notification');

    } else if (timerData.phaseType === "break" && timerData.workTime > 0) {
      timerData.phaseType = "work";
      timerData.time = timerData.workTime;
      timerData.originalTime = timerData.workTime;
      timerData.lastUpdate = Date.now();
      console.log("Switching to work phase:", timerData.workTime);

      playSound('notification');
      
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
